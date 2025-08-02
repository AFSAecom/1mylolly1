# 🌸 Lolly Web App – Gestion de vente de parfums et réseau de conseillères

Application web pour la vente de parfums inspirés. Les utilisateurs peuvent consulter le catalogue, passer commande et gérer leurs favoris. Les conseillères disposent d'un espace dédié et les administrateurs ont accès à des outils de gestion.

## ⚙️ Stack technique

- **Frontend** : React (Vite)
- **Backend** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Vercel
- **Langage** : TypeScript

---

## 🚀 Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd <nom-du-dossier>
```

### 2. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env` et renseignez vos clés Supabase.

```bash
cp .env.example .env
# éditer .env et ajouter vos clés
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

### 5. Construire pour la production

```bash
npm run build
```

## 📁 Principaux dossiers

- `src/` : code source React
- `supabase/` : scripts SQL pour la base
- `lo/` : application mobile Expo indépendante

## 🤝 Contribuer

Les contributions sont bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.


Pour des conseils sur la montée en charge de l'application, consultez [SCALING.md](SCALING.md).
