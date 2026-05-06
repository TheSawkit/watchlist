# 🎬 ReelMark

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![GitHub stars](https://img.shields.io/github/stars/TheSawkit/watchlist?style=social)](https://github.com/TheSawkit/watchlist)
[![CI](https://github.com/TheSawkit/watchlist/actions/workflows/ci.yml/badge.svg)](https://github.com/TheSawkit/watchlist/actions/workflows/ci.yml)

**Stop wasting hours deciding what to watch. Organize your cinematic life with an interface that actually feels like a theater.**

**[🇺🇸 English](#english) | [🇫🇷 Français](#français)**

---

<a name="english"></a>

## 🇺🇸 English

### 🎯 Why ReelMark?

We've all been there: 50 open tabs and no idea what we've already seen or which episode we stopped at. **ReelMark** isn't just another generic watchlist clone. It's an immersive, high-performance tracker built for movie lovers who value fluidity and a "cinema-grade" design.

### ✨ Key Features

* 🔍 **Smart Exploration**: Access the TMDB catalog (700k+ titles) with relevant regional filtering (e.g., automatic BE/FR catalog merger for Belgian users).
* 📋 **Zero-Friction Watchlist**: Add content instantly thanks to an optimistic UI — no spinners, no waiting for the server.
* 📺 **Episode-Level Tracking**: Track every season and episode. Never ask "Did we watch this one?" again.
* 🎭 **Actor Focus**: Deep dive into full filmographies, biographies, and credits for every actor.
* 👤 **User Profiles**: Public profiles with custom bio, social links (Instagram, TikTok, Letterboxd, X), and per-section privacy controls (public / friends only / private).
* ⭐ **Reviews & Ratings**: Rate titles from 1–10 and write reviews visible on your profile.
* 📁 **Playlists**: Create themed collections and share them publicly.
* 🤝 **Friends System**: Send and accept friend requests; view friends' public watchlists and reviews.
* 🌍 **Native Bilingualism**: Instant EN/FR switching with automatic server-side language detection.
* 🎨 **Immersive UI**: Cinema-inspired dark mode by default, with a clean flash-free light alternative (Zero FOUC).

### 🛠 Tech Stack

| Layer | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 + React 19** | App Router & Turbopack for peak performance and SEO. |
| **Styling** | **Tailwind CSS 4** | Ultra-light, token-based design system. |
| **Backend** | **Supabase** | Secure SSR auth and robust PostgreSQL persistence. |
| **Data** | **TMDB API** | The gold standard for media metadata. |

### 🚀 Quick Start

**1. Prerequisites**

* **Node.js 24+** & **pnpm**
* A free [TMDB Read Access Token](https://developer.themoviedb.org/docs/getting-started)
* A [Supabase](https://supabase.com) project

**2. Clone & Install**

```bash
git clone https://github.com/TheSawkit/watchlist.git
cd watchlist
pnpm install
```

**3. Config (`.env.local`)**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**4. Database Setup**

Run the SQL migration files in order from your Supabase SQL Editor:

1. `supabase/migrations/001_profile_features.sql` — creates `user_profiles`, `privacy_settings`, `reviews`, `playlists`, `playlist_items`, `friendships` tables with RLS policies.

The core `watchlist` and `episode_watches` tables are set up automatically when you apply the migrations.

**5. Launch**

```bash
pnpm dev
```

---

<a name="français"></a>

## 🇫🇷 Français

### 🎯 Pourquoi ReelMark ?

Marre de scroller sans fin sans savoir quoi regarder ? **ReelMark** est un tracker immersif pensé pour ceux qui aiment le cinéma et détestent la friction. On oublie les interfaces froides, place à une expérience fluide.

### ✨ Fonctionnalités clés

* 🔍 **Exploration intelligente** : Accès au catalogue TMDB avec un filtrage par région qui a du sens (fusion BE/FR automatique).
* 📋 **Watchlist instantanée** : Ajout en un clic avec UI optimiste. Pas de chargement, c'est immédiat.
* 📺 **Suivi par épisode** : Suis ta progression réelle, saison par saison, épisode par épisode.
* 🎭 **Focus Acteurs** : Filmographies complètes et biographies détaillées.
* 👤 **Profils publics** : Bio, liens sociaux (Instagram, TikTok, Letterboxd, X), et contrôle de confidentialité par section (public / amis / privé).
* ⭐ **Reviews & Ratings** : Note les titres de 1 à 10 et écris des critiques visibles sur ton profil.
* 📁 **Playlists** : Crée des collections thématiques et partage-les.
* 🤝 **Système d'amis** : Envoie et accepte des demandes d'amis ; consulte les listes et reviews publiques de tes amis.
* 🎨 **Design Cinéma** : Un mode sombre immersif et un mode clair propre, sans flash blanc au chargement.

### 🛠 Stack Technique

| Couche | Techno |
| :--- | :--- |
| **Frontend** | Next.js 16 / React 19 |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Supabase (Auth + PostgreSQL) |
| **Data** | TMDB API |

### 🚀 Installation Rapide

**1. Prérequis** : Node.js 24+ et pnpm.

**2. Clone & Install**

```bash
git clone https://github.com/TheSawkit/watchlist.git
cd watchlist
pnpm install
```

**3. Variables d'environnement** — crée un `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**4. Base de données** : Exécute les fichiers `supabase/migrations/*.sql` dans l'ordre depuis ton dashboard Supabase.

**5. Lancer** : `pnpm dev`.

---

<p align="center">
<strong>Built with 🍿 by <a href="https://github.com/TheSawkit">SAWKIT</a></strong>
</p>
