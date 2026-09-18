// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuration du pool
// - En production (Render) : utilise DATABASE_URL
// - En développement (local) : utilise les variables séparées
let poolConfig;

if (process.env.DATABASE_URL) {
    // Production (Render + Supabase)
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
} else {
    // Développement local (PostgreSQL sur ta machine)
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
}

const pool = new Pool(poolConfig);

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