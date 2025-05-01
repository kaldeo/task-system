const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db');


// Route pour la page d'accueil
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/index.html'));
});


router.get('/config/client', (req, res) => {
    res.json({
      PORT: process.env.DB_PORT,
    });
});

////////////////////////////////////////////////////
////////////////////// Membres /////////////////////
////////////////////////////////////////////////////
// Route pour récupérer tous les membres
router.get('/membres', async (req, res) => {
    const sql = 'SELECT * FROM membres';
    try {
        const connection = await db.client.getConnection();
        const [rows] = await connection.execute(sql);
        return res.status(200).send({ success: true, membres: rows });
    } catch (err) {
        console.error('Erreur lors de la récupération des membres :', err);
        return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});
// Route pour récupérer le nombre de membres par groupe
router.get('/recuperer-nombre-de-membres', async (req, res) => {
    const query = `
        SELECT id_groupe, COUNT(id_membre) AS nombre_de_membres
        FROM groupe_membres
        GROUP BY id_groupe;
    `;

    try {
        const connection = await db.client.getConnection();
        const [rows] = await connection.execute(query);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du nombre de membres:', err);
        res.status(500).send('Erreur lors de la récupération du nombre de membres');
    }
});
////////////////////////////////////////////////////
////////////////////// Groupes /////////////////////
////////////////////////////////////////////////////
// Route pour récupérer tous les groupes
router.get('/groupes', async (req, res) => {
    const sql = 'SELECT * FROM groupes';
    try {
      
      const connection = await db.client.getConnection();
      const [rows] = await connection.execute(sql);

      return res.status(200).send({ success: true, groupes: rows });
    } catch (err) {
      console.error('Erreur lors de la récupération des groupes :', err);
      return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});
router.get('/membres-groupes', async (req, res) => {
    try {
        const connection = await db.client.getConnection();

        const [rows] = await connection.execute(`
            SELECT 
                gm.id_groupe,
                JSON_ARRAYAGG(JSON_OBJECT('id_membre', m.id_membre, 'name', m.name)) AS membres
            FROM 
                groupe_membres gm
            JOIN 
                membres m ON gm.id_membre = m.id_membre
            GROUP BY 
                gm.id_groupe
        `);

        res.json({ success: true, groupes: rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des membres des groupes:', error);
        res.json({ success: false, message: 'Erreur serveur' });
    }
});
router.get('/groupes/:id/membres', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await db.client.getConnection();

        const [rows] = await connection.execute(`
            SELECT m.id_membre, m.name
            FROM groupe_membres gm
            JOIN membres m ON gm.id_membre = m.id_membre
            WHERE gm.id_groupe = ?
        `, [id]);

        res.status(200).json({ success: true, membres: rows });
    } catch (err) {
        console.error('Erreur lors de la récupération des membres :', err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});
////////////////////////////////////////////////////
////////////////////// Tâches //////////////////////
////////////////////////////////////////////////////
router.get('/taches', async (req, res) => {
    const sql = 'SELECT * FROM taches';
    try {
        const connection = await db.client.getConnection();
        const [rows] = await connection.execute(sql);
        return res.status(200).send({ success: true, taches: rows });
    } catch (err) {
        console.error('Erreur lors de la récupération des tâches :', err);
        return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});



  
module.exports = router;
