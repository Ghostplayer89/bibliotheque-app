// src/controllers/livreController.js
const pool = require('../config/db');

// ======================================================
// GET /api/livres - Récupérer tous les livres (avec pagination et recherche)
// Query params: ?search=...&page=1&limit=10
// ======================================================
const getAllLivres = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        // Construction de la requête de base avec JOIN
        let query = `
            SELECT 
                l.id,
                l.titre,
                l.annee_publication,
                l.statut,
                l.auteur_id,
                a.nom AS auteur_nom,
                a.nationalite AS auteur_nationalite
            FROM livres l
            JOIN auteurs a ON l.auteur_id = a.id
        `;
        
        const params = [];
        
        // Ajout du filtre de recherche si présent
        if (search) {
            query += ` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
            params.push(`%${search}%`);
        }
        
        // Ajout du tri et de la pagination
        query += ` ORDER BY l.titre ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        
        // Compter le total pour la pagination
        let countQuery = `
            SELECT COUNT(*) 
            FROM livres l
            JOIN auteurs a ON l.auteur_id = a.id
        `;
        const countParams = [];
        
        if (search) {
            countQuery += ` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
            countParams.push(`%${search}%`);
        }
        
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);
        
        res.json({
            livres: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erreur getAllLivres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/livres/:id - Récupérer un livre par son ID
// ======================================================
const getLivreById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                l.id,
                l.titre,
                l.annee_publication,
                l.statut,
                l.auteur_id,
                a.nom AS auteur_nom,
                a.nationalite AS auteur_nationalite
            FROM livres l
            JOIN auteurs a ON l.auteur_id = a.id
            WHERE l.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur getLivreById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// POST /api/livres - Créer un nouveau livre
// ======================================================
const createLivre = async (req, res) => {
    try {
        const { titre, annee_publication, auteur_id } = req.body;
        
        if (!titre || !auteur_id) {
            return res.status(400).json({ 
                error: 'Les champs titre et auteur_id sont obligatoires' 
            });
        }
        
        // Vérifier que l'auteur existe
        const auteurCheck = await pool.query(
            'SELECT id FROM auteurs WHERE id = $1',
            [auteur_id]
        );
        
        if (auteurCheck.rows.length === 0) {
            return res.status(400).json({ 
                error: 'L\'auteur spécifié n\'existe pas' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO livres (titre, annee_publication, auteur_id) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [titre, annee_publication, auteur_id]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur createLivre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// PUT /api/livres/:id - Modifier un livre
// ======================================================
const updateLivre = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, annee_publication, auteur_id } = req.body;
        
        if (!titre || !auteur_id) {
            return res.status(400).json({ 
                error: 'Les champs titre et auteur_id sont obligatoires' 
            });
        }
        
        const result = await pool.query(
            `UPDATE livres 
             SET titre = $1, annee_publication = $2, auteur_id = $3 
             WHERE id = $4 
             RETURNING *`,
            [titre, annee_publication, auteur_id, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur updateLivre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// DELETE /api/livres/:id - Supprimer un livre
// ======================================================
const deleteLivre = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Vérifier si le livre est actuellement emprunté
        const empruntCheck = await pool.query(
            `SELECT id FROM emprunts 
             WHERE livre_id = $1 AND statut = 'en_cours'`,
            [id]
        );
        
        if (empruntCheck.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Impossible de supprimer un livre actuellement emprunté' 
            });
        }
        
        const result = await pool.query(
            'DELETE FROM livres WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        
        res.json({ 
            message: 'Livre supprimé avec succès',
            livre: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur deleteLivre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getAllLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
};