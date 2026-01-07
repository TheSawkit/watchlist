# SeenIt - Votre Tracker de Watchlist Personnel

**SeenIt** est une application moderne de suivi de contenu qui vous permet de garder une trace précise de tous les films, séries, documentaires et autres contenus que vous avez déjà visionnés. Ne perdez plus jamais le fil de ce que vous avez regardé et découvrez facilement ce qui vous reste à explorer.

## 🎬 Fonctionnalités

- **Authentification complète** : Inscription et connexion sécurisées via Email/Mot de passe (propulsé par Supabase Auth).
- **Design Cinéma** : Interface utilisateur immersive avec une identité visuelle forte (spotlights, typographie, couleurs).
- **Suivi complet** : Enregistrez tous les films et séries que vous avez vus.
- **Organisation intuitive** : Classez et organisez votre bibliothèque de contenu.
- **Historique personnel** : Conservez une trace de votre parcours cinématographique.

## 🚀 Démarrage rapide

### 1. Prérequis

- Node.js 18+ installé
- Un compte [Supabase](https://supabase.com/)

### 2. Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/votre-username/seenit.git
cd seenit
pnpm install
```

### 3. Configuration de l'environnement

Renommez le fichier `.env.example` en `.env.local` (ou créez-le) et ajoutez vos clés Supabase :

```bash
# .env.local

# URL de votre projet Supabase (Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase

# Clé publique "anon" (Project Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

Vous pouvez trouver ces clés dans votre tableau de bord Supabase : `Settings` > `API`.

### 4. Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠 Technologies

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS 4
- **Authentification & Base de données** : Supabase
- **UI** : Composants personnalisés avec un thème cinéma
