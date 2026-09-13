// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Créer un pool de connexions vers PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Tester la connexion au démarrage
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erreur de connexion à PostgreSQL :', err.stack);
    } else {
        console.log('✅ Connecté à PostgreSQL avec succès !');
        release();
    }
});

module.exports = pool;