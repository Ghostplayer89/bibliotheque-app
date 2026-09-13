// src/controllers/statsController.js
const pool = require('../config/db');

// ======================================================
// GET /api/stats - Tableau de bord / Statistiques
// ======================================================
const getStats = async (req, res) => {
    try {
        // 1. Nombre total de livres
        const totalLivres = await pool.query('SELECT COUNT(*) FROM livres');
        
        // 2. Nombre total d'adhérents
        const totalAdherents = await pool.query('SELECT COUNT(*) FROM adherents');
        
        // 3. Nombre d'emprunts en cours
        const empruntsEnCours = await pool.query(
            "SELECT COUNT(*) FROM emprunts WHERE statut = 'en_cours'"
        );
        
        // 4. Nombre d'emprunts en retard
        const empruntsEnRetard = await pool.query(
            `SELECT COUNT(*) FROM emprunts 
             WHERE statut = 'en_cours' AND date_retour_prevue < NOW()`
        );
        
        // 5. Le livre le plus emprunté
        const livrePlusEmprunte = await pool.query(
            `SELECT 
                l.id,
                l.titre,
                a.nom AS auteur_nom,
                COUNT(e.id) AS nombre_emprunts
             FROM livres l
             JOIN auteurs a ON l.auteur_id = a.id
             LEFT JOIN emprunts e ON e.livre_id = l.id
             GROUP BY l.id, l.titre, a.nom
             ORDER BY nombre_emprunts DESC
             LIMIT 1`
        );
        
        // 6. L'adhérent le plus actif
        const adherentPlusActif = await pool.query(
            `SELECT 
                a.id,
                a.nom,
                a.contact,
                COUNT(e.id) AS nombre_emprunts
             FROM adherents a
             LEFT JOIN emprunts e ON e.adherent_id = a.id
             GROUP BY a.id, a.nom, a.contact
             ORDER BY nombre_emprunts DESC
             LIMIT 1`
        );
        
        res.json({
            totaux: {
                livres: parseInt(totalLivres.rows[0].count),
                adherents: parseInt(totalAdherents.rows[0].count),
                emprunts_en_cours: parseInt(empruntsEnCours.rows[0].count),
                emprunts_en_retard: parseInt(empruntsEnRetard.rows[0].count)
            },
            livre_le_plus_emprunte: livrePlusEmprunte.rows[0] || null,
            adherent_le_plus_actif: adherentPlusActif.rows[0] || null
        });
    } catch (error) {
        console.error('Erreur getStats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { getStats };