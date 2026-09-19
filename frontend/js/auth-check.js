// ======================================================
// AUTH-CHECK.JS - Protection des pages
// ======================================================
// À inclure sur CHAQUE page protégée (sauf login.html)

(function() {
    const token = localStorage.getItem('admin_token');
    
    // Si pas de token → rediriger vers login
    if (!token) {
        window.location.href = 'login.html';
    }
})();

// ======================================================
// FONCTION DE DÉCONNEXION (appelée par le bouton)
// ======================================================
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = 'login.html';
    }
}