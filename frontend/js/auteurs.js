// ======================================================
// AUTEURS.JS - Logique de la page Gestion des auteurs
// ======================================================

let tousLesAuteurs = [];
let auteursFiltres = [];
let pageActuelle = 1;
const auteursParPage = 5;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('✍️ Page Auteurs chargée');
    await chargerAuteurs();
    initialiserEvenements();
});

// ======================================================
// CHARGER LES AUTEURS
// ======================================================
async function chargerAuteurs() {
    try {
        console.log('🔄 Chargement des auteurs...');
        const data = await AuteursAPI.getAll();
        tousLesAuteurs = data || [];
        auteursFiltres = [...tousLesAuteurs];
        
        console.log(`✅ ${tousLesAuteurs.length} auteurs chargés`);
        afficherAuteurs();
    } catch (error) {
        console.error('❌ Erreur:', error);
        afficherMessageErreur('Impossible de charger les auteurs.');
    }
}

// ======================================================
// AFFICHER LES AUTEURS
// ======================================================
function afficherAuteurs() {
    const tbody = document.getElementById('auteurs-tbody');
    
    const total = auteursFiltres.length;
    const totalPages = Math.ceil(total / auteursParPage);
    const debut = (pageActuelle - 1) * auteursParPage;
    const fin = debut + auteursParPage;
    const auteursPage = auteursFiltres.slice(debut, fin);
    
    tbody.innerHTML = '';
    
    if (auteursPage.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="loading">Aucun auteur trouvé</td>
            </tr>
        `;
        mettreAJourPagination(0, 0);
        return;
    }
    
    auteursPage.forEach((auteur, index) => {
        const tr = document.createElement('tr');
        const numero = debut + index + 1;
        
        tr.innerHTML = `
            <td>${numero}</td>
            <td><strong>${auteur.nom}</strong></td>
            <td>${auteur.nationalite}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="modifierAuteur(${auteur.id})" title="Modifier">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button class="action-btn delete" onclick="supprimerAuteur(${auteur.id}, '${auteur.nom}')" title="Supprimer">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    mettreAJourPagination(total, totalPages);
    lucide.createIcons();
}

// ======================================================
// PAGINATION
// ======================================================
function mettreAJourPagination(total, totalPages) {
    const info = document.getElementById('pagination-info');
    if (total === 0) {
        info.textContent = 'Aucun auteur';
    } else {
        const debut = (pageActuelle - 1) * auteursParPage + 1;
        const fin = Math.min(pageActuelle * auteursParPage, total);
        info.textContent = `Affichage de ${debut} à ${fin} sur ${total} auteurs`;
    }
    
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (i === pageActuelle ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => {
            pageActuelle = i;
            afficherAuteurs();
        };
        pageNumbers.appendChild(btn);
    }
    
    document.getElementById('btn-prev').disabled = pageActuelle === 1;
    document.getElementById('btn-next').disabled = pageActuelle >= totalPages;
}

// ======================================================
// ÉVÉNEMENTS
// ======================================================
function initialiserEvenements() {
    document.getElementById('btn-prev').addEventListener('click', () => {
        if (pageActuelle > 1) {
            pageActuelle--;
            afficherAuteurs();
        }
    });
    
    document.getElementById('btn-next').addEventListener('click', () => {
        const totalPages = Math.ceil(auteursFiltres.length / auteursParPage);
        if (pageActuelle < totalPages) {
            pageActuelle++;
            afficherAuteurs();
        }
    });
    
    document.getElementById('search-input').addEventListener('input', appliquerFiltres);
    
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        auteursFiltres = [...tousLesAuteurs];
        pageActuelle = 1;
        afficherAuteurs();
    });
    
    document.getElementById('btn-ajouter-auteur').addEventListener('click', () => {
        alert('Fonctionnalité à venir : Ajouter un auteur');
    });
}

// ======================================================
// FILTRES
// ======================================================
function appliquerFiltres() {
    const recherche = document.getElementById('search-input').value.toLowerCase();
    
    auteursFiltres = tousLesAuteurs.filter(auteur => {
        return !recherche || 
            auteur.nom.toLowerCase().includes(recherche) ||
            auteur.nationalite.toLowerCase().includes(recherche);
    });
    
    pageActuelle = 1;
    afficherAuteurs();
}

// ======================================================
// MESSAGE D'ERREUR
// ======================================================
function afficherMessageErreur(message) {
    const tbody = document.getElementById('auteurs-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="4" class="loading" style="color: #EF4444;">
                ⚠️ ${message}
            </td>
        </tr>
    `;
}

// ======================================================
// ACTIONS
// ======================================================
function modifierAuteur(id) {
    alert(`Modifier l'auteur ${id} (à venir)`);
}

function supprimerAuteur(id, nom) {
    if (confirm(`Voulez-vous vraiment supprimer "${nom}" ?`)) {
        alert(`Suppression de l'auteur ${id} (à venir)`);
    }
}