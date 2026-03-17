# 🎬 ReelMark

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![TMDB](https://img.shields.io/badge/TMDB-API-01D277?style=flat&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/gitsawkit/watchlist?style=social)](https://github.com/gitsawkit/watchlist)

**🇺🇸 A cinema-themed personal watchlist tracker — discover, track, and organize every movie and TV show you watch.**

**🇫🇷 Un tracker de watchlist personnel au design cinéma — découvrez, suivez et organisez chaque film et série que vous regardez.**

**[🇺🇸 English](#english) | [🇫🇷 Français](#français)**

---

<a name="english"></a>

## 🇺🇸 English

### 🎯 What is ReelMark?

ReelMark is a full-stack watchlist application with an immersive cinema-inspired design. It connects to the **TMDB catalog** (700,000+ movies & TV shows) and uses **Supabase** for authentication and real-time data persistence. Built with the latest **Next.js 16 App Router** and **React 19**.

### ✨ Features

- 🔍 **Explore & Discover** — Browse trending, popular, top-rated, and upcoming movies & TV shows. Category-based navigation with regional filtering
- 📋 **Smart Watchlist** — Mark content as "To Watch" or "Watched" with a single click. Optimistic UI for instant feedback
- 📺 **Episode Tracking** — Track individual episodes and seasons for TV shows with per-episode progress
- 🎭 **Actor Pages** — Full filmography, biography, and known-for credits for any actor
- 🎥 **Trailers & Cast** — Embedded YouTube trailers and full cast/crew details on every detail page
- 🌍 **Multi-Region** — Content adapted to your region (US, FR, BE, CA, GB, CH, LU). Belgium merges both BE and FR catalogs automatically
- 🌐 **Bilingual (EN/FR)** — Full interface translation with server-side language detection and client-side switching
- 🎨 **Dark & Light Themes** — Cinema-grade dark theme by default with a clean light alternative. Zero FOUC
- 🔐 **Secure Auth** — Email/password authentication with rate limiting, input validation, and secure redirect handling
- 🏎️ **Performance** — Server Components, ISR caching (3600s), optimistic updates, Turbopack dev server
- 📱 **Fully Responsive** — Mobile-first design with touch-optimized navigation and scroll interactions

### 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.1 (App Router + Turbopack) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Styling** | Tailwind CSS 4 + CSS custom properties |
| **Auth & DB** | Supabase (Auth SSR + PostgreSQL) |
| **Data Source** | TMDB API (movies, TV, actors, images) |
| **UI** | Radix UI primitives + custom cinema design system |
| **Icons** | Lucide React |
| **Fonts** | Inter (body) + Bebas Neue (display) |
| **Package Manager** | pnpm |

### 🎨 Design System

ReelMark uses a fully token-based design system with CSS variables:

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--primary` | `#B9090B` | `#B9090B` | Brand red, CTAs |
| `--gold` | `#F5C518` | `#92400E` | Ratings, accents, cinema highlights |
| `--background` | `#000000` | `#F5F5F7` | Page background |
| `--surface` | `#0A0A0A` | `#FFFFFF` | Cards, containers |
| `--text` | `#FFFFFF` | `#1D1D1F` | Primary text |

Effects include glassmorphism layers, animated cinema spotlight, glow shadows, and Apple-inspired easing curves.

### 🚀 Quick Start

#### Prerequisites

- **Node.js 18+**
- **pnpm** (`npm install -g pnpm`)
- A [Supabase](https://supabase.com/) project (free tier works)
- A [TMDB API key](https://www.themoviedb.org/settings/api) (free)

#### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/gitsawkit/watchlist.git
cd watchlist
pnpm install
```

**2. Set up environment variables:**

Create a `.env.local` file at the root:

```bash
# Supabase (Settings > API in your dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key

# TMDB (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key
```

**3. Set up Supabase database:**

Create the `watchlist` table in your Supabase SQL editor:

```sql
CREATE TABLE watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  media_title TEXT NOT NULL,
  poster_path TEXT,
  status TEXT CHECK (status IN ('to_watch', 'watched')) NOT NULL DEFAULT 'to_watch',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, media_id, media_type)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist"
  ON watchlist FOR ALL
  USING (auth.uid() = user_id);
```

**4. Start the dev server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

#### Available Scripts

```bash
pnpm dev          # Dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm test         # Unit tests (Vitest)
pnpm test:e2e     # E2E tests (Playwright)
```

### 📁 Project Structure

```
app/
├── actions/          # Server actions (watchlist, episodes, media)
├── actor/[id]/       # Actor detail pages
├── dashboard/        # Personalized recommendations
├── explorer/         # Browse movies & TV by category
├── library/          # User's watchlist (To Watch / Watched)
├── movie/[id]/       # Movie detail (trailer, cast, similar)
├── tv/[id]/          # TV detail + season/episode tracking
├── settings/         # Profile, theme, language, region, security
└── auth/             # OAuth callback & email confirmation

components/
├── ui/               # Design system primitives
├── media/            # MediaCard, MediaBanner, MediaGrid, Episodes
├── navigation/       # Navbar, CategoryNav, Search
├── layout/           # Landing page sections
└── shared/           # Reusable utilities

lib/
├── tmdb/             # TMDB API client (movies, tv, search, actors)
├── supabase/         # Server & client Supabase instances
├── i18n/             # Translations & language detection
├── validators.ts     # Input sanitization & validation
└── rate-limit.ts     # Auth rate limiting
```

---

<a name="français"></a>

## 🇫🇷 Français

### 🎯 C'est quoi ReelMark ?

ReelMark est une application full-stack de watchlist au design immersif inspiré du cinéma. Elle se connecte au catalogue **TMDB** (700 000+ films & séries) et utilise **Supabase** pour l'authentification et la persistance des données. Construite avec les dernières versions de **Next.js 16 App Router** et **React 19**.

### ✨ Fonctionnalités

- 🔍 **Explorer & Découvrir** — Parcourez les tendances, populaires, mieux notés et à venir. Navigation par catégories avec filtrage régional
- 📋 **Watchlist Intelligente** — Marquez un contenu "À voir" ou "Vu" en un clic. UI optimiste pour un retour instantané
- 📺 **Suivi par Épisode** — Suivez chaque épisode et saison individuellement avec un suivi de progression
- 🎭 **Pages Acteurs** — Filmographie complète, biographie et rôles marquants pour chaque acteur
- 🎥 **Bandes-annonces & Casting** — Trailers YouTube intégrés et détails complets du casting sur chaque page
- 🌍 **Multi-Région** — Contenu adapté à votre région (US, FR, BE, CA, GB, CH, LU). La Belgique fusionne automatiquement les catalogues BE et FR
- 🌐 **Bilingue (EN/FR)** — Traduction complète de l'interface avec détection côté serveur et bascule côté client
- 🎨 **Thèmes Dark & Light** — Thème sombre cinéma par défaut avec une alternative claire. Zéro FOUC
- 🔐 **Auth Sécurisée** — Authentification email/mot de passe avec rate limiting, validation des entrées et gestion sécurisée des redirections
- 🏎️ **Performance** — Server Components, cache ISR (3600s), mises à jour optimistes, dev server Turbopack
- 📱 **100% Responsive** — Design mobile-first avec navigation tactile et interactions de scroll optimisées

### 🛠 Stack Technique

| Couche | Technologie |
|--------|------------|
| **Framework** | Next.js 16.1 (App Router + Turbopack) |
| **Langage** | TypeScript 5.9 (mode strict) |
| **Styles** | Tailwind CSS 4 + CSS custom properties |
| **Auth & BDD** | Supabase (Auth SSR + PostgreSQL) |
| **Source de données** | API TMDB (films, séries, acteurs, images) |
| **UI** | Radix UI + design system cinéma custom |
| **Icônes** | Lucide React |
| **Polices** | Inter (corps) + Bebas Neue (titres) |
| **Gestionnaire** | pnpm |

### 🚀 Démarrage rapide

#### Prérequis

- **Node.js 18+**
- **pnpm** (`npm install -g pnpm`)
- Un projet [Supabase](https://supabase.com/) (le tier gratuit suffit)
- Une [clé API TMDB](https://www.themoviedb.org/settings/api) (gratuite)

#### Installation

**1. Cloner le dépôt :**

```bash
git clone https://github.com/gitsawkit/watchlist.git
cd watchlist
pnpm install
```

**2. Configurer les variables d'environnement :**

Créez un fichier `.env.local` à la racine :

```bash
# Supabase (Settings > API dans votre dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=votre_cle_anon

# TMDB (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=votre_cle_tmdb
```

**3. Configurer la base de données Supabase :**

Créez la table `watchlist` dans l'éditeur SQL de Supabase :

```sql
CREATE TABLE watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  media_title TEXT NOT NULL,
  poster_path TEXT,
  status TEXT CHECK (status IN ('to_watch', 'watched')) NOT NULL DEFAULT 'to_watch',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, media_id, media_type)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own watchlist"
  ON watchlist FOR ALL
  USING (auth.uid() = user_id);
```

**4. Lancer le serveur de développement :**

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

#### Scripts disponibles

```bash
pnpm dev          # Serveur de dev (Turbopack)
pnpm build        # Build de production
pnpm start        # Serveur de production
pnpm lint         # ESLint
pnpm test         # Tests unitaires (Vitest)
pnpm test:e2e     # Tests E2E (Playwright)
```

### 📁 Structure du Projet

```
app/
├── actions/          # Server actions (watchlist, épisodes, médias)
├── actor/[id]/       # Pages acteurs
├── dashboard/        # Recommandations personnalisées
├── explorer/         # Explorer films & séries par catégorie
├── library/          # Watchlist de l'utilisateur (À voir / Vu)
├── movie/[id]/       # Détail film (trailer, casting, similaires)
├── tv/[id]/          # Détail série + suivi saison/épisode
├── settings/         # Profil, thème, langue, région, sécurité
└── auth/             # Callback OAuth & confirmation email

components/
├── ui/               # Primitives du design system
├── media/            # MediaCard, MediaBanner, MediaGrid, Episodes
├── navigation/       # Navbar, CategoryNav, Search
├── layout/           # Sections landing page
└── shared/           # Utilitaires réutilisables

lib/
├── tmdb/             # Client API TMDB (films, séries, recherche, acteurs)
├── supabase/         # Instances Supabase serveur & client
├── i18n/             # Traductions & détection de langue
├── validators.ts     # Sanitization & validation des entrées
└── rate-limit.ts     # Rate limiting auth
```

---

<p align="center">
  <strong>Built with 🎬 by <a href="https://github.com/TheSawkit">SAWKIT</a></strong>
</p>
