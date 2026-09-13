-- ======================================================
-- SCHEMA DE LA BASE DE DONNÉES - BIBLIOTHÈQUE DE QUARTIER
-- ======================================================

-- Supprimer les tables si elles existent (pour réinitialiser)
DROP TABLE IF EXISTS emprunts CASCADE;
DROP TABLE IF EXISTS livres CASCADE;
DROP TABLE IF EXISTS adherents CASCADE;
DROP TABLE IF EXISTS auteurs CASCADE;

-- ======================================================
-- TABLE : auteurs
-- ======================================================
CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    nationalite VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- TABLE : adherents
-- ======================================================
CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    date_inscription TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- TABLE : livres
-- ======================================================
CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    annee_publication INTEGER,
    statut VARCHAR(20) DEFAULT 'disponible' CHECK (statut IN ('disponible', 'emprunte')),
    auteur_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Clé étrangère vers la table auteurs
    CONSTRAINT fk_livre_auteur FOREIGN KEY (auteur_id) 
        REFERENCES auteurs(id) ON DELETE CASCADE
);

-- ======================================================
-- TABLE : emprunts
-- ======================================================
CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,
    date_emprunt TIMESTAMP DEFAULT NOW(),
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    statut VARCHAR(20) DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine')),
    adherent_id INTEGER NOT NULL,
    livre_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Clés étrangères
    CONSTRAINT fk_emprunt_adherent FOREIGN KEY (adherent_id) 
        REFERENCES adherents(id) ON DELETE CASCADE,
    CONSTRAINT fk_emprunt_livre FOREIGN KEY (livre_id) 
        REFERENCES livres(id) ON DELETE CASCADE
);

-- ======================================================
-- INDEX pour améliorer les performances des recherches
-- ======================================================
CREATE INDEX idx_livres_titre ON livres(titre);
CREATE INDEX idx_livres_auteur_id ON livres(auteur_id);
CREATE INDEX idx_emprunts_adherent_id ON emprunts(adherent_id);
CREATE INDEX idx_emprunts_livre_id ON emprunts(livre_id);
CREATE INDEX idx_emprunts_statut ON emprunts(statut);
CREATE INDEX idx_emprunts_date_retour_prevue ON emprunts(date_retour_prevue);

-- ======================================================
-- COMMENTAIRES sur les tables (pour documentation)
-- ======================================================
COMMENT ON TABLE auteurs IS 'Liste des auteurs avec leur nationalité';
COMMENT ON TABLE adherents IS 'Adhérents inscrits à la bibliothèque';
COMMENT ON TABLE livres IS 'Catalogue des livres avec leur statut de disponibilité';
COMMENT ON TABLE emprunts IS 'Historique des emprunts (en cours et passés)';
COMMENT ON COLUMN livres.statut IS 'disponible ou emprunte';
COMMENT ON COLUMN emprunts.statut IS 'en_cours ou termine';
COMMENT ON COLUMN emprunts.date_retour_effective IS 'NULL si le livre n''a pas encore été rendu';