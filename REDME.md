📚 Application de Gestion d'une Bibliothèque du Quartier M'pila

Application complète de gestion d'une bibliothèque : livres, adhérents, auteurs et emprunts.

Akieni Academy — Cohorte 2 — Projet Semaines 14 & 15

📖 Description

Cette application permet de gérer une bibliothèque du quartier M'pila:

· Gérer les livres (ajout, modification, suppression, recherche)
· Gérer les adhérents
· Gérer les auteurs
· Enregistrer les emprunts et les retours
· Suivre les emprunts en retard
· Consulter un tableau de bord avec les statistiques

Le projet est divisé en deux parties :

· Backend : API REST en Node.js/Express connectée à PostgreSQL
· Frontend : Interface utilisateur en HTML/CSS/JavaScript

🎯 Fonctionnalités

· Auteurs : CRUD complet (nom, nationalité)
· Adhérents : CRUD complet + historique des emprunts
· Livres : CRUD + recherche + pagination + statut (disponible/emprunté)
· Emprunts : Création, retour, détection des retards
· Tableau de bord : Statistiques et vue d'ensemble

🏗️ Architecture

bibliotheque-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── app.js
│   ├── schema.sql
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── livres.html
│   ├── adherents.html
│   ├── emprunts.html
│   └── auteurs.html
├── docs/
│   └── diagramme-er.png
└── README.md

🛠️ Technologies utilisées

Backend : Node.js, Express, PostgreSQL, pg, dotenv, cors, morgan, nodemon

Frontend : HTML5, CSS3, JavaScript (ES6+), Lucide (icônes SVG), Google Fonts (Montserrat + Inter)

📋 Prérequis

· Node.js (v18+)
· PostgreSQL (v14+)
· Git

🚀 Installation - Backend

1. Cloner le projet

git clone https://github.com/Ghostplayer89/bibliotheque-app.git

cd bibliotheque-app/backend

2. Installer les dépendances

npm install

3. Créer la base de données

Créez une base PostgreSQL nommée bibliotheque_db, puis exécutez le fichier schema.sql dessus.

4. Configurer les variables d'environnement

Copiez .env.example vers .env et remplissez vos identifiants PostgreSQL.

5. Démarrer le serveur

npm run dev

Le serveur démarre sur http://localhost:5000

🚀 Installation - Frontend

Le frontend est en HTML/CSS/JavaScript pur. Aucune installation nécessaire.

Ouvrez frontend/index.html dans un navigateur (double-clic ou avec Live Server de VS Code).

⚠️ Le serveur backend doit être démarré pour que le frontend fonctionne.

📚 Documentation de l'API

Base URL

http://localhost:5000/api

Auteurs

Méthode URL Description
GET /auteurs Liste tous les auteurs
GET /auteurs/:id Détail d'un auteur
POST /auteurs Créer un auteur
PUT /auteurs/:id Modifier un auteur
DELETE /auteurs/:id Supprimer un auteur

Adhérents

Méthode URL Description
GET /adherents Liste tous les adhérents
GET /adherents/:id Détail d'un adhérent
GET /adherents/:id/emprunts Historique des emprunts
POST /adherents Créer un adhérent
PUT /adherents/:id Modifier un adhérent
DELETE /adherents/:id Supprimer un adhérent

Livres

Méthode URL Description
GET /livres?search=&page=&limit= Liste paginée avec recherche
GET /livres/:id Détail d'un livre
POST /livres Créer un livre
PUT /livres/:id Modifier un livre
DELETE /livres/:id Supprimer un livre

Emprunts

Méthode URL Description
GET /emprunts Liste tous les emprunts
GET /emprunts/en-cours Emprunts non retournés
GET /emprunts/en-retard Emprunts en retard
GET /emprunts/:id Détail d'un emprunt
POST /emprunts Créer un emprunt
PUT /emprunts/:id/retour Enregistrer le retour
DELETE /emprunts/:id Supprimer un emprunt

Statistiques

Méthode URL Description
GET /stats Tableau de bord complet

🗄️ Diagramme ER

./docs/diagramme-er.png

Tables

· auteurs : Auteurs des livres
· adherents : Adhérents de la bibliothèque
· livres : Catalogue des livres
· emprunts : Historique des emprunts

Relations

· Un auteur peut écrire plusieurs livres
· Un adhérent peut faire plusieurs emprunts
· Un livre peut être emprunté plusieurs fois

🎨 Aperçu du frontend

· Tableau de bord : Statistiques et vue d'ensemble
· Livres : Liste, recherche, filtres, pagination
· Adhérents : Liste et recherche
· Emprunts : Vue "En cours" et "En retard"
· Auteurs : Liste et recherche

👤 Auteur

Ghostplayer89 — Akieni Academy Cohorte 2

📄 Licence

Projet pédagogique — Akieni Academy