// src/controllers/authController.js

// ======================================================
// POST /api/auth/login - Connexion administrateur
// ======================================================
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation basique
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Nom d\'utilisateur et mot de passe requis' 
            });
        }
        
        // Vérification des identifiants
        const validUsername = process.env.ADMIN_USERNAME || 'admin';
        const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (username !== validUsername || password !== validPassword) {
            return res.status(401).json({ 
                error: 'Nom d\'utilisateur ou mot de passe incorrect' 
            });
        }
        
        // Générer un token simple (base64)
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        
        res.json({
            message: 'Connexion réussie',
            token: token,
            user: {
                username: username,
                role: 'admin'
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { login };