// src/routes/empruntRoutes.js
const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

// Routes spécifiques (AVANT /:id pour éviter les conflits)
router.get('/en-cours', empruntController.getEmpruntsEnCours);
router.get('/en-retard', empruntController.getEmpruntsEnRetard);

// Routes CRUD
router.get('/', empruntController.getAllEmprunts);
router.get('/:id', empruntController.getEmpruntById);
router.post('/', empruntController.createEmprunt);
router.delete('/:id', empruntController.deleteEmprunt);

// Route spéciale : enregistrer un retour
router.put('/:id/retour', empruntController.retournerEmprunt);

module.exports = router;