// src/middlewares/errorHandler.js

// ======================================================
// Middleware de gestion centralisée des erreurs
// S'exécute quand une erreur est passée via next(error)
// ======================================================
const errorHandler = (err, req, res, next) => {
    console.error('❌ Erreur interceptée :', err.message);
    
    // Déterminer le code de statut
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        error: err.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// ======================================================
// Middleware pour les routes non trouvées (404)
// ======================================================
const notFound = (req, res, next) => {
    const error = new Error(`Route non trouvée : ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = { errorHandler, notFound };