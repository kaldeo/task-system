const express = require('express');
const router = express.Router();
const db = require('../db');


// Exemple POST
router.post('/ajouter', (req, res) => {
  res.send('POST /ajouter');
});

////////////////////////////////////////////////////
////////////////////// Membres /////////////////////
////////////////////////////////////////////////////
// Route pour ajouter un nouveau membre
router.post('/ajouter-membre/:name', async (req, res) => {
    const name = req.params.name;  
    if (!name) {
      console.log('Nom manquant');
      return res.status(400).send({ success: false, message: 'Le nom est requis' });
    }
    try {
      const sql = 'INSERT INTO membres (name) VALUES (?)';
      const connection = db.client.getConnection();
      const [result] = await connection.execute(sql, [name]);

      return res.status(200).send({ success: true, message: `${name} ajouté avec succès`, result: result.insertId });
    } catch (err) {
      console.error('Erreur lors de l\'insertion du membre :', err);
      return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});
////////////////////////////////////////////////////
////////////////////// Groupes /////////////////////
////////////////////////////////////////////////////
// Route pour ajouter un nouveau groupe
router.post('/ajouter-groupe', async (req, res) => {
  const { name, couleur, membres } = req.body;

  if (!name || name.trim() === '') {
      return res.status(400).send({ success: false, message: 'Le nom du groupe ne peut pas être vide' });
  }
  if (!couleur) {
      return res.status(400).send({ success: false, message: 'Vous devez choisir une couleur' });
  }

  const sqlGroupe = 'INSERT INTO groupes (name, couleur, nb_membre) VALUES (?, ?, ?)';
  const sqlGroupeMembres = 'INSERT INTO groupe_membres (id_groupe, id_membre) VALUES (?, ?)';

  const nb_membre = membres.length;

  try {
      const connection = await db.client.getConnection();

      // Insérer le groupe
      const [resultGroupe] = await connection.execute(sqlGroupe, [name, couleur, nb_membre]);
      const idGroupe = resultGroupe.insertId; // En MySQL, on récupère l'ID inséré comme ceci

      // Insérer les membres dans la table de jointure
      for (const idMembre of membres) {
          await connection.execute(sqlGroupeMembres, [idGroupe, idMembre]);
      }

      res.status(200).send({
          success: true,
          message: `Groupe ${name} ajouté avec succès`,
          id_groupe: idGroupe,
          nb_membre: nb_membre
      });

  } catch (err) {
      console.error('Erreur lors de l\'ajout du groupe :', err);
      res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
  }
});
router.post('/groupes/:id_groupe/membres', async (req, res) => {
  const { id_groupe } = req.params;
  const { id_membre, name } = req.body;

  try {
      const connection = await db.client.getConnection();

      // Insertion dans la table de jointure
      await connection.execute(`
          INSERT INTO groupe_membres (id_groupe, id_membre)
          VALUES (?, ?)
      `, [id_groupe, id_membre]);

      // Incrémenter nb_membre dans la table groupes
      await connection.execute(`
          UPDATE groupes
          SET nb_membre = nb_membre + 1
          WHERE id_groupe = ?
      `, [id_groupe]);

      res.json({ success: true, message: name + " ajouté" });
  } catch (error) {
      console.error('Erreur lors de l\'ajout du membre au groupe:', error);
      res.json({ success: false, message: 'Erreur serveur' });
  }
});

////////////////////////////////////////////////////
////////////////////// Tâches //////////////////////
////////////////////////////////////////////////////
router.post('/ajouterTache', async (req, res) => {
  const { nom, description, niveau, deadline, membres } = req.body;

  if (!nom || nom.trim() === '') {
      return res.status(400).send({ success: false, message: 'Le nom de la tâche ne peut pas être vide' });
  }
  if (!niveau) {
      return res.status(400).send({ success: false, message: 'Vous devez choisir un niveau' });
  }
  if (!deadline) {
      return res.status(400).send({ success: false, message: 'Vous devez choisir une date limite' });
  }

  const conditionTotal = 0;
  const conditionOK = 0;

  const sqlTache = `
      INSERT INTO taches (nom, description, niveau, deadline, nb_condition_ok, nb_condition_total)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const sqlTacheMembres = `
      INSERT INTO taches_membres (id_tache, id_membre)
      VALUES (?, ?)
  `;
  const sqlLastInsertId = `SELECT LAST_INSERT_ID() AS id_tache`;

  try {
      const connection = await db.client.getConnection();

      // Insérer la tâche
      await connection.execute(sqlTache, [nom, description, niveau, deadline, conditionOK, conditionTotal]);

      // Récupérer l'id de la tâche insérée
      const [idRows] = await connection.execute(sqlLastInsertId);
      const idTache = idRows[0].id_tache;

      // Insérer les membres associés
      for (const idMembre of membres) {
          await connection.execute(sqlTacheMembres, [idTache, idMembre]);
      }
      res.status(200).send({ success: true, message: `Tâche ${nom} ajoutée avec succès`, id_tache: idTache, nom, description, niveau, deadline, conditionOK, conditionTotal });
  } catch (err) {
      console.error('Erreur lors de l\'ajout de la tâche :', err);
      res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
  }
});



module.exports = router;
