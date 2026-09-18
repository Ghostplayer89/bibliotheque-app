// ======================================================
// EMPRUNTS.JS - Logique de la page Gestion des emprunts
// ======================================================

let tousLesEmprunts = [];
let ongletActif = 'en-cours';

// ======================================================
// INITIALISATION
// ======================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📅 Page Emprunts chargée');
    await chargerEmprunts();
    initialiserEvenements();
});

// ======================================================
// CHARGER LES EMPRUNTS
// ======================================================
async function chargerEmprunts() {
    try {
        console.log('🔄 Chargement des emprunts...');
        const data = await EmpruntsAPI.getAll();
        tousLesEmprunts = data || [];
        
        console.log(`✅ ${tousLesEmprunts.length} emprunts chargés`);
        afficherEmprunts();
    } catch (error) {
        console.error('❌ Erreur:', error);
        afficherMessageErreur('Impossible de charger les emprunts.');
    }
}

// ======================================================
// AFFICHER LES EMPRUNTS SELON L'ONGLET ACTIF
// ======================================================
function afficherEmprunts() {
    const tbody = document.getElementById('emprunts-tbody');
    
    // Filtrer selon l'onglet
    let empruntsFiltres = [];
    const maintenant = new Date();
    
    if (ongletActif === 'en-cours') {
        empruntsFiltres = tousLesEmprunts.filter(e => e.statut === 'en_cours');
    } else if (ongletActif === 'en-retard') {
        empruntsFiltres = tousLesEmprunts.filter(e => 
            e.statut === 'en_cours' && 
            new Date(e.date_retour_prevue) < maintenant
        );
    } else {
        empruntsFiltres = [...tousLesEmprunts];
    }
    
    tbody.innerHTML = '';
    
    if (empruntsFiltres.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">Aucun emprunt dans cette catégorie</td>
            </tr>
        `;
        mettreAJourPagination(0);
        return;
    }
    
    empruntsFiltres.forEach((emprunt, index) => {
        const tr = document.createElement('tr');
        
        // Vérifier si c'est en retard
        const enRetard = emprunt.statut === 'en_cours' && 
                        new Date(emprunt.date_retour_prevue) < maintenant;
        
        if (enRetard) {
            tr.classList.add('retard');
        }
        
        // Date d'emprunt
        const dateEmprunt = emprunt.date_emprunt 
            ? new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')
            : '-';
        
        // Date de retour prévue
        const dateRetour = emprunt.date_retour_prevue 
            ? new Date(emprunt.date_retour_prevue).toLocaleDateString('fr-FR')
            : '-';
        
        // Statut avec badge
        let statutLabel, statutClass;
        if (emprunt.statut === 'termine') {
            statutLabel = 'Retourné';
            statutClass = 'badge-success';
        } else if (enRetard) {
            statutLabel = 'En retard';
            statutClass = 'badge-danger';
        } else {
            statutLabel = 'En cours';
            statutClass = 'badge-warning';
        }
        
        // Bouton retour (uniquement si en cours)
        const boutonRetour = emprunt.statut === 'en_cours' 
            ? `<button class="action-btn edit" onclick="retournerEmprunt(${emprunt.id})" title="Enregistrer le retour">
                   <i data-lucide="check-circle"></i>
               </button>`
            : '';
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${emprunt.livre_titre || '-'}</strong></td>
            <td>${emprunt.adherent_nom || '-'}</td>
            <td>${dateEmprunt}</td>
            <td>${dateRetour}</td>
            <td><span class="badge ${statutClass}">${statutLabel}</span></td>
            <td>
                <div class="actions">
                    ${boutonRetour}
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    mettreAJourPagination(empruntsFiltres.length);
    lucide.createIcons();
}

// ======================================================
// PAGINATION (simple pour l'instant)
// ======================================================
function mettreAJourPagination(total) {
    const info = document.getElementById('pagination-info');
    info.textContent = `Affichage de ${total} emprunt${total > 1 ? 's' : ''}`;
}

// ======================================================
// ÉVÉNEMENTS
// ======================================================
function initialiserEvenements() {
    // Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer active de tous
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Ajouter active au cliqué
            btn.classList.add('active');
            // Changer l'onglet actif
            ongletActif = btn.dataset.tab;
            // Réafficher
            afficherEmprunts();
        });
    });
    
    // Bouton nouvel emprunt
    document.getElementById('btn-nouvel-emprunt').addEventListener('click', () => {
        alert('Fonctionnalité à venir : Nouvel emprunt');
    });
}

// ======================================================
// MESSAGE D'ERREUR
// ======================================================
function afficherMessageErreur(message) {
    const tbody = document.getElementById('emprunts-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="loading" style="color: #EF4444;">
                ⚠️ ${message}
            </td>
        </tr>
    `;
}

// ======================================================
// RETOURNER UN EMPRUNT
// ======================================================
async function retournerEmprunt(id) {
    if (!confirm('Confirmer le retour de ce livre ?')) return;
    
    try {
        await EmpruntsAPI.retour(id);
        alert('✅ Retour enregistré avec succès !');
        await chargerEmprunts();
    } catch (error) {
        console.error('Erreur retour:', error);
        alert('❌ Erreur : ' + error.message);
    }
}