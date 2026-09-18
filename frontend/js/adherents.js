// ======================================================
// AUTEURS.JS - Logique de la page Gestion des auteurs
// ======================================================

let tousLesAdherents = [];
let adherentsFiltres = [];
let pageActuelle = 1;
const adherentsParPage = 5;

// ======================================================
// INITIALISATION
// ======================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('👥 Page Adhérents chargée');
    await chargerAdherents();
    initialiserEvenements();
});

// ======================================================
// CHARGER LES ADHÉRENTS
// ======================================================
async function chargerAdherents() {
    try {
        console.log('🔄 Chargement des adhérents...');
        const data = await AdherentsAPI.getAll();
        tousLesAdherents = data || [];
        adherentsFiltres = [...tousLesAdherents];
        
        console.log(`✅ ${tousLesAdherents.length} adhérents chargés`);
        afficherAdherents();
    } catch (error) {
        console.error('❌ Erreur:', error);
        afficherMessageErreur('Impossible de charger les adhérents.');
    }
}

// ======================================================
// AFFICHER LES ADHÉRENTS
// ======================================================
function afficherAdherents() {
    const tbody = document.getElementById('adherents-tbody');
    
    const total = adherentsFiltres.length;
    const totalPages = Math.ceil(total / adherentsParPage);
    const debut = (pageActuelle - 1) * adherentsParPage;
    const fin = debut + adherentsParPage;
    const adherentsPage = adherentsFiltres.slice(debut, fin);
    
    tbody.innerHTML = '';
    
    if (adherentsPage.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="loading">Aucun adhérent trouvé</td>
            </tr>
        `;
        mettreAJourPagination(0, 0);
        return;
    }
    
    adherentsPage.forEach((adherent, index) => {
        const tr = document.createElement('tr');
        const numero = debut + index + 1;
        
        // Formater la date
        const dateInscription = adherent.date_inscription 
            ? new Date(adherent.date_inscription).toLocaleDateString('fr-FR')
            : '-';
        
        tr.innerHTML = `
            <td>${numero}</td>
            <td><strong>${adherent.nom}</strong></td>
            <td>${adherent.contact}</td>
            <td>${dateInscription}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="voirEmprunts(${adherent.id})" title="Voir les emprunts">
                        <i data-lucide="book-open"></i>
                    </button>
                    <button class="action-btn edit" onclick="modifierAdherent(${adherent.id})" title="Modifier">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button class="action-btn delete" onclick="supprimerAdherent(${adherent.id}, '${adherent.nom}')" title="Supprimer">
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
        info.textContent = 'Aucun adhérent';
    } else {
        const debut = (pageActuelle - 1) * adherentsParPage + 1;
        const fin = Math.min(pageActuelle * adherentsParPage, total);
        info.textContent = `Affichage de ${debut} à ${fin} sur ${total} adhérents`;
    }
    
    const pageNumbers = document.getElementById('page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number' + (i === pageActuelle ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => {
            pageActuelle = i;
            afficherAdherents();
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
            afficherAdherents();
        }
    });
    
    document.getElementById('btn-next').addEventListener('click', () => {
        const totalPages = Math.ceil(adherentsFiltres.length / adherentsParPage);
        if (pageActuelle < totalPages) {
            pageActuelle++;
            afficherAdherents();
        }
    });
    
    document.getElementById('search-input').addEventListener('input', appliquerFiltres);
    
    
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-statut').value = '';
        adherentsFiltres = [...tousLesAdherents];
        pageActuelle = 1;
        afficherAdherents();
    });
    
    document.getElementById('btn-ajouter-adherent').addEventListener('click', () => {
        alert('Fonctionnalité à venir : Ajouter un adhérent');
    });
}

// ======================================================
// FILTRES
// ======================================================
function appliquerFiltres() {
    const recherche = document.getElementById('search-input').value.toLowerCase();
    
    adherentsFiltres = tousLesAdherents.filter(adherent => {
        return !recherche || 
            adherent.nom.toLowerCase().includes(recherche) ||
            adherent.contact.toLowerCase().includes(recherche);
    });
    
    pageActuelle = 1;
    afficherAdherents();
}

// ======================================================
// MESSAGE D'ERREUR
// ======================================================
function afficherMessageErreur(message) {
    const tbody = document.getElementById('adherents-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="loading" style="color: #EF4444;">
                ⚠️ ${message}
            </td>
        </tr>
    `;
}

// ======================================================
// ACTIONS
// ======================================================
function voirEmprunts(id) {
    alert(`Voir les emprunts de l'adhérent ${id} (à venir)`);
}

function modifierAdherent(id) {
    alert(`Modifier l'adhérent ${id} (à venir)`);
}

function supprimerAdherent(id, nom) {
    if (confirm(`Voulez-vous vraiment supprimer "${nom}" ?`)) {
        alert(`Suppression de l'adhérent ${id} (à venir)`);
    }
}