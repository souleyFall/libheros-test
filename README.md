# LibHeros - Application de Gestion de Tâches

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![NestJS](https://img.shields.io/badge/NestJS-11.x-red)
![pnpm](https://img.shields.io/badge/pnpm-enabled-orange)

Une application web full-stack de gestion de tâches, construite avec une architecture moderne et performante. Le projet est structuré en monorepo, séparant clairement le backend (API REST) et le frontend (SPA).

## 🚀 Fonctionnalités

*   **Authentification sécurisée** : Inscription et connexion des utilisateurs avec des tokens JWT.
*   **Gestion de Listes** : Créez, consultez et organisez vos listes de tâches.
*   **Gestion de Tâches** : Ajoutez, modifiez et supprimez des tâches au sein de vos listes.
*   **Interface Réactive** : Une expérience utilisateur fluide et dynamique grâce à Vue.js 3.
*   **API Robuste** : Un backend solide et évolutif construit avec NestJS.

## 🛠️ Pile Technologique

L'application est divisée en deux parties principales :

| Domaine  | Technologie                               | Description                                      |
| :------- | :---------------------------------------- | :----------------------------------------------- |
| **Backend**  | [NestJS](https://nestjs.com/)             | Un framework Node.js progressif pour des applications efficaces et scalables. |
|          | [Sequelize](https://sequelize.org/)       | Un ORM puissant pour Node.js, compatible avec MySQL. |
|          | [MySQL](https://www.mysql.com/)           | Système de gestion de base de données relationnelle. |
|          | TypeScript                                | Langage principal du backend.                    |
| **Frontend** | [Vue.js 3](https://vuejs.org/)            | Le framework JavaScript progressif.              |
|          | [Vite](https://vitejs.dev/)               | Outil de build nouvelle génération pour le web.      |
|          | [Vue Router](https://router.vuejs.org/)   | Le routeur officiel pour Vue.js.                 |
|          | TypeScript                                | Langage principal du frontend.                   |
| **Global**   | [pnpm](https://pnpm.io/)                  | Gestionnaire de paquets rapide et efficace.      |

## 📂 Structure du Projet

Le projet est organisé en monorepo avec la structure suivante :

```
libheros-test/
├── backend/         # Application NestJS
│   ├── src/
│   ├── test/
│   └── package.json
├── frontend/
│   └── nom-du-projet/ # Application Vue.js (Note: 'nom-du-projet' est un placeholder)
│       ├── src/
│       └── package.json
└── README.md
```

## ⚙️ Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre système :

*   [Node.js](https://nodejs.org/) (v18.x ou plus récent)
*   [pnpm](https://pnpm.io/installation)
*   Un serveur de base de données [MySQL](https://www.mysql.com/)

## ⚡ Guide de Démarrage Rapide

Pour lancer l'application en environnement de développement, suivez ces étapes dans deux terminaux distincts.

### 1. Configuration du Backend

Avant de lancer le serveur, vous devez configurer la connexion à la base de données.

1.  **Créez un fichier `.env`** à la racine du dossier `backend/`.
2.  **Ajoutez les variables d'environnement** nécessaires pour votre base de données MySQL :
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=votre_utilisateur
    DB_PASSWORD=votre_mot_de_passe
    DB_NAME=libheros_db
    JWT_SECRET=votre_cle_secrete_pour_jwt
    ```
3.  **Assurez-vous d'avoir créé la base de données** (`libheros_db` dans cet exemple) sur votre serveur MySQL.

### 2. Lancement du Backend

```bash
# 1. Aller dans le répertoire du backend
cd backend

# 2. Installer les dépendances
pnpm install

# 3. Lancer le serveur en mode développement
pnpm run start:dev
```
Le backend sera disponible sur `http://localhost:3000`.

### 3. Lancement du Frontend

```bash
# 1. Aller dans le répertoire du frontend
cd frontend/nom-du-projet

# 2. Installer les dépendances
pnpm install

# 3. Lancer le serveur de développement
pnpm run dev
```
L'application frontend sera accessible sur `http://localhost:5173` (ou un port similaire).

## 📜 Scripts Disponibles

Des scripts utiles sont configurés dans les fichiers `package.json` de chaque projet pour automatiser les tâches courantes.

### Backend (`backend/`)

| Script        | Description                                            |
| :------------ | :----------------------------------------------------- |
| `pnpm run start:dev` | Démarre le serveur en mode "watch".                |
| `pnpm run build`     | Compile l'application pour la production.            |
| `pnpm run lint`      | Analyse le code avec ESLint pour trouver les erreurs. |
| `pnpm run format`    | Formate le code avec Prettier.                       |


### Frontend (`frontend/nom-du-projet/`)

| Script    | Description                                      |
| :-------- | :----------------------------------------------- |
| `pnpm run dev`    | Démarre le serveur de développement Vite.      |
| `pnpm run build`  | Compile et minifie l'application pour la production. |
| `pnpm run preview`| Sert localement le build de production.    |
