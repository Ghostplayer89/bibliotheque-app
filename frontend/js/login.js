// ======================================================
// LOGIN.JS - Page de connexion
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Page de connexion chargée');
    
    // Si déjà connecté, rediriger
    if (localStorage.getItem('admin_token')) {
        window.location.href = 'index.html';
        return;
    }
    
    const form = document.getElementById('login-form');
    form.addEventListener('submit', handleLogin);
});

// ======================================================
// GÉRER LA CONNEXION
// ======================================================
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const btn = document.querySelector('.login-btn');
    
    errorDiv.textContent = '';
    btn.disabled = true;
    btn.innerHTML = 'Connexion...';
    
    try {
        const response = await fetch('https://bibliotheque-app-8hci.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Erreur de connexion');
        }
        
        // Stocker le token
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', data.user.username);
        
        console.log('✅ Connexion réussie');
        
        // Rediriger vers le tableau de bord
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        errorDiv.textContent = error.message;
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="log-in"></i> Se connecter';
        lucide.createIcons();
    }
}