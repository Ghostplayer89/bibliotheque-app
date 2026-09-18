// ======================================================
// DASHBOARD.JS - Tableau de bord
// ======================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📊 Tableau de bord chargé');
    await chargerStats();
});

// ======================================================
// CHARGER LES STATISTIQUES
// ======================================================
async function chargerStats() {
    try {
        console.log('🔄 Chargement des stats...');
        const stats = await StatsAPI.getStats();
        console.log('✅ Stats reçues:', stats);
        
        // Mettre à jour les cartes
        document.getElementById('stat-livres').textContent = stats.totaux.livres;
        document.getElementById('stat-adherents').textContent = stats.totaux.adherents;
        document.getElementById('stat-emprunts').textContent = stats.totaux.emprunts_en_cours;
        document.getElementById('stat-retards').textContent = stats.totaux.emprunts_en_retard;
        
        // Livre le plus emprunté
        afficherTopLivre(stats.livre_le_plus_emprunte);
        
        // Adhérent le plus actif
        afficherTopAdherent(stats.adherent_le_plus_actif);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        afficherErreur();
    }
}

// ======================================================
// AFFICHER LE LIVRE LE PLUS EMPRUNTÉ
// ======================================================
function afficherTopLivre(livre) {
    const container = document.getElementById('top-livre');
    
    if (!livre || livre.nombre_emprunts == 0) {
        container.innerHTML = '<p class="loading-text">Aucun emprunt enregistré</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="top-item-name">${livre.titre}</div>
        <div class="top-item-detail">Par ${livre.auteur_nom}</div>
        <div class="top-item-count">${livre.nombre_emprunts} emprunt${livre.nombre_emprunts > 1 ? 's' : ''}</div>
    `;
}

// ======================================================
// AFFICHER L'ADHÉRENT LE PLUS ACTIF
// ======================================================
function afficherTopAdherent(adherent) {
    const container = document.getElementById('top-adherent');
    
    if (!adherent || adherent.nombre_emprunts == 0) {
        container.innerHTML = '<p class="loading-text">Aucun emprunt enregistré</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="top-item-name">${adherent.nom}</div>
        <div class="top-item-detail">${adherent.contact}</div>
        <div class="top-item-count">${adherent.nombre_emprunts} emprunt${adherent.nombre_emprunts > 1 ? 's' : ''}</div>
    `;
}

// ======================================================
// AFFICHER UNE ERREUR
// ======================================================
function afficherErreur() {
    const stats = ['stat-livres', 'stat-adherents', 'stat-emprunts', 'stat-retards'];
    stats.forEach(id => {
        document.getElementById(id).textContent = '?';
    });
    
    document.getElementById('top-livre').innerHTML = 
        '<p class="loading-text" style="color: #EF4444;">Erreur de chargement</p>';
    document.getElementById('top-adherent').innerHTML = 
        '<p class="loading-text" style="color: #EF4444;">Erreur de chargement</p>';
}