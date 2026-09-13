📚 Application de Gestion d'une Bibliothèque de Quartier

Application complète de gestion d'une bibliothèque : livres, adhérents, auteurs et emprunts.

Akieni Academy — Cohorte 2 — Projet Semaines 14 & 15

📖 Description

Cette application permet de :

· Gérer les livres (ajout, modification, suppression, recherche)
· Gérer les adhérents
· Gérer les auteurs
· Enregistrer les emprunts et les retours
· Suivre les emprunts en retard
· Consulter des statistiques

Le projet est divisé en deux parties :

· Backend : API Node.js/Express + PostgreSQL (terminé ✅)
· Frontend : Interface HTML/CSS/JS (à venir — semaine 2)

🎯 Fonctionnalités

· Auteurs : CRUD complet (nom, nationalité)
· Adhérents : CRUD complet + historique des emprunts
· Livres : CRUD + recherche + pagination + statut
· Emprunts : Création, retour, détection des retards
· Statistiques : Tableau de bord

🛠️ Technologies

Backend : Node.js, Express, PostgreSQL, pg, dotenv, cors, morgan, nodemon

Frontend (à venir) : HTML5, CSS3, JavaScript

📋 Prérequis

· Node.js (v18+)
· PostgreSQL (v14+)
· Git

🚀 Installation

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

📚 Routes de l'API

Auteurs

· GET /api/auteurs
· GET /api/auteurs/:id
· POST /api/auteurs
· PUT /api/auteurs/:id
· DELETE /api/auteurs/:id

Adhérents

· GET /api/adherents
· GET /api/adherents/:id
· GET /api/adherents/:id/emprunts
· POST /api/adherents
· PUT /api/adherents/:id
· DELETE /api/adherents/:id

Livres

· GET /api/livres
· GET /api/livres/:id
· POST /api/livres
· PUT /api/livres/:id
· DELETE /api/livres/:id

Emprunts

· GET /api/emprunts
· GET /api/emprunts/en-cours
· GET /api/emprunts/en-retard
· GET /api/emprunts/:id
· POST /api/emprunts
· PUT /api/emprunts/:id/retour
· DELETE /api/emprunts/:id

Statistiques

· GET /api/stats

🗄️ Base de données

Tables

· auteurs : Auteurs des livres
· adherents : Adhérents de la bibliothèque
· livres : Catalogue des livres
· emprunts : Historique des emprunts

Relations

· Un auteur peut écrire plusieurs livres
· Un adhérent peut faire plusieurs emprunts
· Un livre peut être emprunté plusieurs fois

📁 Structure du projet

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
└── README.md

👤 Auteur

Ghostplayer89 — Akieni Academy Cohorte 2

📄 Licence

Projet pédagogique — Akieni Academy