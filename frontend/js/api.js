// ======================================================
// API.JS - Fonctions pour communiquer avec le backend
// ======================================================

const API_BASE_URL = 'https://bibliotheque-app-8hci.onrender.com/api';

// ======================================================
// Fonction générique pour faire des requêtes API
// ======================================================
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Erreur ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// ======================================================
// API LIVRES
// ======================================================
const LivresAPI = {
    // Récupérer tous les livres (avec recherche et pagination)
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/livres${query ? '?' + query : ''}`);
    },
    
    // Récupérer un livre par ID
    getById: (id) => fetchAPI(`/livres/${id}`),
    
    // Créer un livre
    create: (data) => fetchAPI('/livres', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // Modifier un livre
    update: (id, data) => fetchAPI(`/livres/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    // Supprimer un livre
    delete: (id) => fetchAPI(`/livres/${id}`, {
        method: 'DELETE'
    })
};

// ======================================================
// API AUTEURS
// ======================================================
const AuteursAPI = {
    getAll: () => fetchAPI('/auteurs'),
    getById: (id) => fetchAPI(`/auteurs/${id}`),
    create: (data) => fetchAPI('/auteurs', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchAPI(`/auteurs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchAPI(`/auteurs/${id}`, { method: 'DELETE' })
};

// ======================================================
// API ADHERENTS
// ======================================================
const AdherentsAPI = {
    getAll: () => fetchAPI('/adherents'),
    getById: (id) => fetchAPI(`/adherents/${id}`),
    getEmprunts: (id) => fetchAPI(`/adherents/${id}/emprunts`),
    create: (data) => fetchAPI('/adherents', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchAPI(`/adherents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchAPI(`/adherents/${id}`, { method: 'DELETE' })
};

// ======================================================
// API EMPRUNTS
// ======================================================
const EmpruntsAPI = {
    getAll: () => fetchAPI('/emprunts'),
    getEnCours: () => fetchAPI('/emprunts/en-cours'),
    getEnRetard: () => fetchAPI('/emprunts/en-retard'),
    getById: (id) => fetchAPI(`/emprunts/${id}`),
    create: (data) => fetchAPI('/emprunts', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    retour: (id) => fetchAPI(`/emprunts/${id}/retour`, { method: 'PUT' }),
    delete: (id) => fetchAPI(`/emprunts/${id}`, { method: 'DELETE' })
};

// ======================================================
// API STATS
// ======================================================
const StatsAPI = {
    getStats: () => fetchAPI('/stats')
};