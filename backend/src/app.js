// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importer la connexion à la base de données (pour tester au démarrage)
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ======================================================
// MIDDLEWARES GLOBAUX
// ======================================================

// Autoriser les requêtes cross-origin (frontend → backend)
app.use(cors({
    origin: [
        'http://localhost:5000',
        'http://localhost:3000',
        'https://bibliotheque-frontend-ts8d.onrender.com'
    ],
    credentials: true
}));
// Parser le JSON dans les requêtes (POST, PUT, PATCH)
app.use(express.json());

// Parser les données de formulaire (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Logger les requêtes HTTP dans la console
app.use(morgan('dev'));

// ======================================================
// ROUTE DE TEST
// ======================================================
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        message: '✅ API de la bibliothèque en ligne !',
        timestamp: new Date().toISOString()
    });
});

// ======================================================
// ROUTES DE L'API
// ======================================================
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/stats', statsRoutes);

// ======================================================
// GESTION DES ROUTES INCONNUES (404)
// ======================================================
const { errorHandler, notFound } = require('./middlewares/errorHandler');

app.use(notFound);

// ======================================================
// GESTION CENTRALISÉE DES ERREURS
// ======================================================
app.use(errorHandler);

// ======================================================
// DÉMARRAGE DU SERVEUR
// ======================================================
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 API Bibliothèque - Environnement: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;