const express = require('express');
const router = express.Router();
const db = require('../db');


// Exemple POST
router.post('/ajouter', (req, res) => {
  res.send('POST /ajouter');
});

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

module.exports = router;
