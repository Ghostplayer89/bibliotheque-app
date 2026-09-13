// src/controllers/empruntController.js
const pool = require('../config/db');

// ======================================================
// GET /api/emprunts - Tous les emprunts (avec infos livre + adhérent)
// ======================================================
const getAllEmprunts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective,
                e.statut,
                l.titre AS livre_titre,
                l.id AS livre_id,
                a.nom AS adherent_nom,
                a.id AS adherent_id
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            JOIN adherents a ON e.adherent_id = a.id
            ORDER BY e.date_emprunt DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getAllEmprunts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/emprunts/en-cours - Emprunts non retournés
// ======================================================
const getEmpruntsEnCours = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective,
                e.statut,
                l.titre AS livre_titre,
                a.nom AS adherent_nom,
                a.contact AS adherent_contact,
                CASE 
                    WHEN e.date_retour_prevue < NOW() THEN true 
                    ELSE false 
                END AS en_retard
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            JOIN adherents a ON e.adherent_id = a.id
            WHERE e.statut = 'en_cours'
            ORDER BY e.date_retour_prevue ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getEmpruntsEnCours:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// GET /api/emprunts/en-retard - Emprunts en retard
// ======================================================
const getEmpruntsEnRetard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective,
                e.statut,
                l.titre AS livre_titre,
                a.nom AS adherent_nom,
                a.contact AS adherent_contact,
                (NOW()::date - e.date_retour_prevue) AS jours_de_retard
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            JOIN adherents a ON e.adherent_id = a.id
            WHERE e.statut = 'en_cours' 
              AND e.date_retour_prevue < NOW()
            ORDER BY e.date_retour_prevue ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getEmpruntsEnRetard:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// POST /api/emprunts - Créer un emprunt
// Logique métier : vérifier que le livre est disponible
// ======================================================
const createEmprunt = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { adherent_id, livre_id, date_retour_prevue } = req.body;
        
        // Validation basique
        if (!adherent_id || !livre_id || !date_retour_prevue) {
            return res.status(400).json({ 
                error: 'Les champs adherent_id, livre_id et date_retour_prevue sont obligatoires' 
            });
        }
        
        // Démarrer une TRANSACTION
        await client.query('BEGIN');
        
        // Vérifier que le livre existe et est disponible
        const livreCheck = await client.query(
            'SELECT id, statut, titre FROM livres WHERE id = $1',
            [livre_id]
        );
        
        if (livreCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        
        if (livreCheck.rows[0].statut === 'emprunte') {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'Ce livre est déjà emprunté et n\'est pas disponible' 
            });
        }
        
        // Vérifier que l'adhérent existe
        const adherentCheck = await client.query(
            'SELECT id, nom FROM adherents WHERE id = $1',
            [adherent_id]
        );
        
        if (adherentCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }
        
        // Créer l'emprunt
        const empruntResult = await client.query(
            `INSERT INTO emprunts (adherent_id, livre_id, date_retour_prevue)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [adherent_id, livre_id, date_retour_prevue]
        );
        
        // Mettre à jour le statut du livre
        await client.query(
            'UPDATE livres SET statut = $1 WHERE id = $2',
            ['emprunte', livre_id]
        );
        
        // Valider la transaction
        await client.query('COMMIT');
        
        res.status(201).json({
            message: 'Emprunt créé avec succès',
            emprunt: empruntResult.rows[0],
            livre: {
                id: livre_id,
                titre: livreCheck.rows[0].titre,
                nouveau_statut: 'emprunte'
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur createEmprunt:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        client.release();
    }
};

// ======================================================
// PUT /api/emprunts/:id/retour - Enregistrer le retour d'un livre
// ======================================================
const retournerEmprunt = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { id } = req.params;
        
        await client.query('BEGIN');
        
        // Vérifier que l'emprunt existe et est en cours
        const empruntCheck = await client.query(
            'SELECT id, livre_id, statut FROM emprunts WHERE id = $1',
            [id]
        );
        
        if (empruntCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Emprunt non trouvé' });
        }
        
        if (empruntCheck.rows[0].statut === 'termine') {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: 'Cet emprunt a déjà été retourné' 
            });
        }
        
        const livre_id = empruntCheck.rows[0].livre_id;
        
        // Marquer l'emprunt comme terminé
        const empruntResult = await client.query(
            `UPDATE emprunts 
             SET statut = 'termine', date_retour_effective = NOW()
             WHERE id = $1 
             RETURNING *`,
            [id]
        );
        
        // Remettre le livre comme disponible
        await client.query(
            'UPDATE livres SET statut = $1 WHERE id = $2',
            ['disponible', livre_id]
        );
        
        await client.query('COMMIT');
        
        res.json({
            message: 'Retour enregistré avec succès',
            emprunt: empruntResult.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur retournerEmprunt:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        client.release();
    }
};

// ======================================================
// GET /api/emprunts/:id - Détail d'un emprunt
// ======================================================
const getEmpruntById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT 
                e.*,
                l.titre AS livre_titre,
                a.nom AS adherent_nom
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            JOIN adherents a ON e.adherent_id = a.id
            WHERE e.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Emprunt non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur getEmpruntById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// ======================================================
// DELETE /api/emprunts/:id - Supprimer un emprunt
// ======================================================
const deleteEmprunt = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'DELETE FROM emprunts WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Emprunt non trouvé' });
        }
        
        res.json({ 
            message: 'Emprunt supprimé avec succès',
            emprunt: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur deleteEmprunt:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getAllEmprunts,
    getEmpruntsEnCours,
    getEmpruntsEnRetard,
    getEmpruntById,
    createEmprunt,
    retournerEmprunt,
    deleteEmprunt
};