Test PR – ne rien fusionnner
# 🌸 Lolly Web App – Gestion de vente de parfums et réseau de conseillères

Application web pour la gestion des ventes de parfums inspirés, avec accès client, conseillère, et administrateur. Inclut un système de catalogue, panier, commandes, parrainage et réseau.

---

## ⚙️ Stack technique

- **Frontend** : React (généré initialement via TempoAI)
- **Backend** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Vercel
- **Versioning** : GitHub
- **Langage** : JavaScript / TypeScript
- **Authentification** : Supabase Auth (JWT)
- **Base de données** : Supabase SQL (relations, contraintes)

---

## 🚀 Déploiement local

### 1. Cloner le projet

```bash
git clone https://github.com/ton-utilisateur/ton-repo.git
cd ton-repo
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

### 🔐 Configuration des identifiants administrateur

Pour définir les identifiants de l'administrateur initial, ajoutez les variables suivantes dans votre fichier `.env` :

```
VITE_ADMIN_DEFAULT_EMAIL=admin@example.com
VITE_ADMIN_DEFAULT_PASSWORD=motdepasseSécurisé
```

Ces valeurs ne doivent pas être partagées ni commitées avec des identifiants réels. Elles permettent d'initialiser un compte administrateur lors de la première connexion. Pensez à utiliser un mot de passe robuste et à gérer ces informations de manière sécurisée.
