// ======================================================
// LIVRES.JS - Logique de la page Gestion des livres
// ======================================================

// Variables globales
let tousLesLivres = [];
let livresFiltres = [];
let pageActuelle = 1;
const livresParPage = 5;

// ======================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ======================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📚 Page Livres chargée');
    
    // Charger les livres
    await chargerLivres();
    
    // Charger les auteurs pour le filtre
    await chargerAuteursFiltre();
    
    // Initialiser les événements
    initialiserEvenements();
});

// ======================================================
// CHARGER LES LIVRES DEPUIS L'API
// ======================================================
async function chargerLivres() {
    try {
        console.log('🔄 Chargement des livres...');
        const data = await LivresAPI.getAll({ limit: 100 });
        tousLesLivres = data.livres || [];
        livresFiltres = [...tousLesLivres];
        
        console.log(`✅ ${tousLesLivres.length} livres chargés`);
        
        afficherLivres();
    } catch (error) {
        console.error('❌ Erreur chargement livres:', error);
        afficherMessageErreur('Impossible de charger les livres. Vérifiez que le serveur est démarré.');
    }
}

// ======================================================
// CHARGER LES AUTEURS POUR LE FILTRE
// ======================================================
async function chargerAuteursFiltre() {
    try {
        const auteurs = await AuteursAPI.getAll();
        const select = document.getElementById('filter-auteur');
        
        auteurs.forEach(auteur => {
            const option = document.createElement('option');
            option.value = auteur.id;
            option.textContent = auteur.nom;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur chargement auteurs:', error);
    }
}

// ======================================================
// AFFICHER LES LIVRES DANS LE TABLEAU
// ======================================================
function afficherLivres() {
    const tbody = document.getElementById('livres-tbody');
    
    // Pagination
    const total = livresFiltres.length;
    const totalPages = Math.ceil(total / livresParPage);
    const debut = (pageActuelle - 1) * livresParPage;
    const fin = debut + livresParPage;
    const livresPage = livresFiltres.slice(debut, fin);
    
    // Vider le tableau
    tbody.innerHTML = '';
    
    // Cas : aucun livre
    if (livresPage.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">Aucun livre trouvé</td>
            </tr>
        `;
        mettreAJourPagination(0, 0);
        return;
    }
    
    // Afficher chaque livre
    livresPage.forEach((livre, index) => {
        const tr = document.createElement('tr');
        const numero = debut + index + 1;
        
        const statutClass = livre.statut === 'disponible' ? 'badge-success' : 'badge-danger';
        const statutLabel = livre.statut === 'disponible' ? 'Disponible' : 'Emprunté';
        
        tr.innerHTML = `
            <td>${numero}</td>
            <td><strong>${livre.titre}</strong></td>
            <td>${livre.auteur_nom || '-'}</td>
            <td>${livre.annee_publication || '-'}</td>
            <td><span class="badge ${statutClass}">${statutLabel}</span></td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="modifierLivre(${livre.id})" title="Modifier">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button class="action-btn delete" onclick="supprimerLivre(${livre.id}, '${livre.titre}')" title="Supprimer">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Mettre à jour la pagination
    mettreAJourPagination(total, totalPages);
    
    // Réinitialiser les icônes Lucide
    lucide.createIcons();
}

// ======================================================
// METTRE À JOUR LA PAGINATION
// ======================================================
function mettreAJourPagination(total, totalPages) {
    // Info texte
    const info = document.getElementById('pagination-info');
    if (total === 0) {
        info.textContent = 'Aucun livre';
    } else {
        const debut = (pageActuelle - 1) * livresParPage + 1;
        const fin = Math.min(pageActuelle * livresParPage, total);
        info.textContent = `Affichage de ${debut} à ${fin} sur ${total} livres`;
    }
    
    // Boutons de page
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (i === pageActuelle ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => {
            pageActuelle = i;
            afficherLivres();
        };
        pageNumbers.appendChild(btn);
    }
    
    // Boutons précédent/suivant
    document.getElementById('btn-prev').disabled = pageActuelle === 1;
    document.getElementById('btn-next').disabled = pageActuelle >= totalPages;
}

// ======================================================
// ÉVÉNEMENTS
// ======================================================
function initialiserEvenements() {
    // Bouton précédent
    document.getElementById('btn-prev').addEventListener('click', () => {
        if (pageActuelle > 1) {
            pageActuelle--;
            afficherLivres();
        }
    });
    
    // Bouton suivant
    document.getElementById('btn-next').addEventListener('click', () => {
        const totalPages = Math.ceil(livresFiltres.length / livresParPage);
        if (pageActuelle < totalPages) {
            pageActuelle++;
            afficherLivres();
        }
    });
    
    // Recherche
    document.getElementById('search-input').addEventListener('input', (e) => {
        appliquerFiltres();
    });
    
    // Filtre auteur
    document.getElementById('filter-auteur').addEventListener('change', () => {
        appliquerFiltres();
    });
    
    // Filtre statut
    document.getElementById('filter-statut').addEventListener('change', () => {
        appliquerFiltres();
    });
    
    // Bouton réinitialiser
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-auteur').value = '';
        document.getElementById('filter-statut').value = '';
        livresFiltres = [...tousLesLivres];
        pageActuelle = 1;
        afficherLivres();
    });
    
    // Bouton ajouter
    document.getElementById('btn-ajouter-livre').addEventListener('click', () => {
        alert('Fonctionnalité à venir : Ajouter un livre');
    });
}

// ======================================================
// APPLIQUER LES FILTRES
// ======================================================
function appliquerFiltres() {
    const recherche = document.getElementById('search-input').value.toLowerCase();
    const auteurId = document.getElementById('filter-auteur').value;
    const statut = document.getElementById('filter-statut').value;
    
    livresFiltres = tousLesLivres.filter(livre => {
        const matchRecherche = !recherche || 
            livre.titre.toLowerCase().includes(recherche) ||
            (livre.auteur_nom && livre.auteur_nom.toLowerCase().includes(recherche));
        
        const matchAuteur = !auteurId || livre.auteur_id == auteurId;
        const matchStatut = !statut || livre.statut === statut;
        
        return matchRecherche && matchAuteur && matchStatut;
    });
    
    pageActuelle = 1;
    afficherLivres();
}

// ======================================================
// AFFICHER UN MESSAGE D'ERREUR
// ======================================================
function afficherMessageErreur(message) {
    const tbody = document.getElementById('livres-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading" style="color: #EF4444;">
                ⚠️ ${message}
            </td>
        </tr>
    `;
}

// ======================================================
// ACTIONS (placeholder pour l'instant)
// ======================================================
function modifierLivre(id) {
    alert(`Modifier le livre ${id} (à venir)`);
}

function supprimerLivre(id, titre) {
    if (confirm(`Voulez-vous vraiment supprimer "${titre}" ?`)) {
        alert(`Suppression du livre ${id} (à venir)`);
    }
}