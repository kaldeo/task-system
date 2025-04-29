const express = require('express');
const router = express.Router();
const db = require('../db');

////////////////////////////////////////////////////
////////////////////// Membres /////////////////////
////////////////////////////////////////////////////
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
////////////////////////////////////////////////////
////////////////////// Groupes /////////////////////
////////////////////////////////////////////////////
router.delete('/supprimer-groupe/:id_groupe', async (req, res) => {
    const idGroupe = req.params.id_groupe;

    const sqlSelect = 'SELECT * FROM groupes WHERE id_groupe = ?';
    const sqlDelete = 'DELETE FROM groupes WHERE id_groupe = ?';

    try {
        const connection = await db.client.getConnection();

        // Vérifie si le groupe existe
        const [selectRows] = await connection.execute(sqlSelect, [idGroupe]);
        if (selectRows.length === 0) {
            return res.status(404).send({ success: false, message: 'Groupe non trouvé' });
        }

        // Supprime le groupe
        const [deleteResult] = await connection.execute(sqlDelete, [idGroupe]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Erreur lors de la suppression du groupe' });
        }

        return res.status(200).send({
            success: true,
            message: selectRows[0].name + ' supprimé avec succès',
            result: selectRows[0]
        });

    } catch (err) {
        console.error('Erreur lors de la suppression du groupe :', err);
        return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});
router.delete('/groupes/:id_groupe/membres/:id_membre', async (req, res) => {
    const { id_groupe, id_membre } = req.params;

    const sqlDelete = `
        DELETE FROM groupe_membres
        WHERE id_groupe = ? AND id_membre = ?
    `;
    const sqlUpdate = `
        UPDATE groupes
        SET nb_membre = nb_membre - 1
        WHERE id_groupe = ?
    `;

    try {
        const connection = await db.client.getConnection();

        const [deleteResult] = await connection.execute(sqlDelete, [id_groupe, id_membre]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Membre non trouvé dans ce groupe.' });
        }

        await connection.execute(sqlUpdate, [id_groupe]);

        res.status(200).json({ success: true, message: 'Membre supprimé du groupe.' });

    } catch (err) {
        console.error('Erreur lors de la suppression du membre :', err);
        res.status(500).json({ success: false, message: 'Erreur serveur', error: err });
    }
});

////////////////////////////////////////////////////
////////////////////// Tâches //////////////////////
////////////////////////////////////////////////////
router.delete('/supprimer-tache/:id_tache', async (req, res) => {
    const idTache = req.params.id_tache;

    const sqlSelect = 'SELECT * FROM taches WHERE id_tache = ?';
    const sqlDelete = 'DELETE FROM taches WHERE id_tache = ?';

    try {
        const connection = await db.client.getConnection();

        // Vérifie si la tâche existe
        const [rows] = await connection.execute(sqlSelect, [idTache]);
        if (rows.length === 0) {
            return res.status(404).send({ success: false, message: 'Tâche non trouvée' });
        }

        // Supprime la tâche
        const [deleteResult] = await connection.execute(sqlDelete, [idTache]);
        if (deleteResult.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Erreur lors de la suppression' });
        }

        return res.status(200).send({
            success: true,
            message: rows[0].nom + ' supprimé avec succès',
            result: rows[0]
        });

    } catch (err) {
        console.error('Erreur lors de la suppression de la tâche :', err);
        return res.status(500).send({ success: false, message: 'Erreur serveur', error: err });
    }
});



module.exports = router;
