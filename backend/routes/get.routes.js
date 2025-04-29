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

  
module.exports = router;
