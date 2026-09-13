// src/controllers/auteurController.js
const pool = require('../config/db');

// ======================================================
// GET /api/auteurs - Récupérer tous les auteurs
// ======================================================
const getAllAuteurs = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM auteurs ORDER BY nom ASC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getAllAuteurs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/auteurs/:id - Récupérer un auteur par son ID
// ======================================================
const getAuteurById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM auteurs WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Auteur non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur getAuteurById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// POST /api/auteurs - Créer un nouvel auteur
// ======================================================
const createAuteur = async (req, res) => {
    try {
        const { nom, nationalite } = req.body;
        
        // Validation basique
        if (!nom || !nationalite) {
            return res.status(400).json({ 
                error: 'Les champs nom et nationalite sont obligatoires' 
            });
        }
        
        const result = await pool.query(
            'INSERT INTO auteurs (nom, nationalite) VALUES ($1, $2) RETURNING *',
            [nom, nationalite]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur createAuteur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// PUT /api/auteurs/:id - Modifier un auteur
// ======================================================
const updateAuteur = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, nationalite } = req.body;
        
        if (!nom || !nationalite) {
            return res.status(400).json({ 
                error: 'Les champs nom et nationalite sont obligatoires' 
            });
        }
        
        const result = await pool.query(
            'UPDATE auteurs SET nom = $1, nationalite = $2 WHERE id = $3 RETURNING *',
            [nom, nationalite, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Auteur non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur updateAuteur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// DELETE /api/auteurs/:id - Supprimer un auteur
// ======================================================
const deleteAuteur = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM auteurs WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Auteur non trouvé' });
        }
        
        res.json({ 
            message: 'Auteur supprimé avec succès',
            auteur: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur deleteAuteur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Export de toutes les fonctions
module.exports = {
    getAllAuteurs,
    getAuteurById,
    createAuteur,
    updateAuteur,
    deleteAuteur
};