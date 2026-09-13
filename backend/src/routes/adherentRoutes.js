// src/routes/adherentRoutes.js
const express = require('express');
const router = express.Router();
const adherentController = require('../controllers/adherentController');

// Routes CRUD
router.get('/', adherentController.getAllAdherents);
router.get('/:id', adherentController.getAdherentById);
router.post('/', adherentController.createAdherent);
router.put('/:id', adherentController.updateAdherent);
router.delete('/:id', adherentController.deleteAdherent);

// Route spéciale : historique des emprunts d'un adhérent
router.get('/:id/emprunts', adherentController.getEmpruntsByAdherent);

module.exports = router;