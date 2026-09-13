// src/controllers/adherentController.js
const pool = require('../config/db');

// ======================================================
// GET /api/adherents - Récupérer tous les adhérents
// ======================================================
const getAllAdherents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM adherents ORDER BY nom ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getAllAdherents:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/adherents/:id - Récupérer un adhérent par son ID
// ======================================================
const getAdherentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM adherents WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur getAdherentById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// POST /api/adherents - Créer un nouvel adhérent
// ======================================================
const createAdherent = async (req, res) => {
    try {
        const { nom, contact } = req.body;
        
        if (!nom || !contact) {
            return res.status(400).json({ 
                error: 'Les champs nom et contact sont obligatoires' 
            });
        }
        
        const result = await pool.query(
            'INSERT INTO adherents (nom, contact) VALUES ($1, $2) RETURNING *',
            [nom, contact]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur createAdherent:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// PUT /api/adherents/:id - Modifier un adhérent
// ======================================================
const updateAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, contact } = req.body;
        
        if (!nom || !contact) {
            return res.status(400).json({ 
                error: 'Les champs nom et contact sont obligatoires' 
            });
        }
        
        const result = await pool.query(
            'UPDATE adherents SET nom = $1, contact = $2 WHERE id = $3 RETURNING *',
            [nom, contact, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur updateAdherent:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// DELETE /api/adherents/:id - Supprimer un adhérent
// ======================================================
const deleteAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM adherents WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }
        
        res.json({ 
            message: 'Adhérent supprimé avec succès',
            adherent: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur deleteAdherent:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/adherents/:id/emprunts - Historique des emprunts
// ======================================================
const getEmpruntsByAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `SELECT 
                e.id,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective,
                e.statut,
                l.titre AS livre_titre,
                l.id AS livre_id
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            WHERE e.adherent_id = $1
            ORDER BY e.date_emprunt DESC`,
            [id]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getEmpruntsByAdherent:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getAllAdherents,
    getAdherentById,
    createAdherent,
    updateAdherent,
    deleteAdherent,
    getEmpruntsByAdherent
};