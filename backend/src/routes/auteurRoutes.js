// src/routes/auteurRoutes.js
const express = require('express');
const router = express.Router();
const auteurController = require('../controllers/auteurController');

// ======================================================
// ROUTES POUR LES AUTEURS
// Base URL : /api/auteurs (définie dans app.js)
// ======================================================

// GET /api/auteurs - Liste tous les auteurs
router.get('/', auteurController.getAllAuteurs);

// GET /api/auteurs/:id - Détail d'un auteur
router.get('/:id', auteurController.getAuteurById);

// POST /api/auteurs - Créer un auteur
router.post('/', auteurController.createAuteur);

// PUT /api/auteurs/:id - Modifier un auteur
router.put('/:id', auteurController.updateAuteur);

// DELETE /api/auteurs/:id - Supprimer un auteur
router.delete('/:id', auteurController.deleteAuteur);

module.exports = router;