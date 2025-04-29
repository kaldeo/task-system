const express = require('express');
const router = express.Router();
const db = require('../db');


router.delete('/supprimer-membre/:id_membre', async (req, res) => {
    const idMembre = req.params.id_membre;  
    const sql = 'DELETE FROM membres WHERE id_membre = ?;';
    try {
        const connection = await db.client.getConnection();
        const [membreResult] = await connection.execute('SELECT * FROM membres WHERE id_membre = ?', [idMembre]);
        if (membreResult.length === 0) {
            return res.status(404).send({ success: false, message: 'Membre non trouvé' });
        }
        const [deleteResult] = await connection.execute(sql, [idMembre]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Erreur lors de la suppression du membre' });
        }
        return res.status(200).send({ success: true, message: membreResult[0].name + ' supprimé avec succès', result: membreResult[0] });
    } catch (err) {
        console.error('Erreur lors de la suppression du membre :', err);
        return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});


module.exports = router;
