# 🎬 ReelMark

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![GitHub stars](https://img.shields.io/github/stars/gitsawkit/watchlist?style=social)](https://github.com/TheSawkit/watchlist)
[![CI](https://github.com/TheSawkit/watchlist/actions/workflows/ci.yml/badge.svg)](https://github.com/TheSawkit/watchlist/actions/workflows/ci.yml)

**Stop wasting hours deciding what to watch. Organize your cinematic life with an interface that actually feels like a theater.**

**[🇺🇸 English](#english) | [🇫🇷 Français](#français)**

---

<a name="english"></a>

## 🇺🇸 English

### 🎯 Why ReelMark?

We’ve all been there: 50 open tabs and no idea what we've already seen or which episode we stopped at. **ReelMark** isn't just another generic watchlist clone. It’s an immersive, high-performance tracker built for movie lovers who value fluidity and a "cinema-grade" design.

### ✨ Key Features

* 🔍 **Smart Exploration**: Access the TMDB catalog (700k+ titles) with relevant regional filtering (e.g., automatic BE/FR catalog merger).
* 📋 **Zero-Friction Watchlist**: Add content instantly thanks to an optimistic UI—no spinners, no waiting for the server.
* 📺 **Episode-Level Tracking**: Don't just track shows; track every single episode and season so you never ask "Did we watch this one?" again.
* 🎭 **Actor Focus**: Deep dive into full filmographies, biographies, and credits for every actor.
* 🌍 **Native Bilingualism**: Instant EN/FR switching with automatic server-side language detection.
* 🎨 **Immersive UI**: Cinema-inspired dark mode by default, with a clean, flash-free light alternative (Zero FOUC).

### 🛠 Tech Stack (The "No-Bullshit" Choice)

| Layer | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 + React 19** | App Router & Turbopack for peak performance and SEO. |
| **Styling** | **Tailwind CSS 4** | Ultra-light, token-based design system. |
| **Backend** | **Supabase** | Secure SSR Auth and robust PostgreSQL persistence. |
| **Data** | **TMDB API** | The gold standard for media metadata. |

### 🚀 Quick Start

**1. Prerequisites**
* **Node.js 18+** & **pnpm**
* A free **TMDB API Key**
* A **Supabase** project

**2. Setup**
```bash
git clone [https://github.com/gitsawkit/watchlist.git](https://github.com/gitsawkit/watchlist.git)
cd watchlist
pnpm install
````

**3. Config (.env.local)**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
TMDB_API_KEY=your_tmdb_api_key
```

**4. Database Setup**
Run this in your Supabase SQL Editor:

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
CREATE POLICY "Users can manage their own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);
```

**5. Launch**

```bash
pnpm dev
```

-----

<a name="français"></a>

## 🇫🇷 Français

### 🎯 Pourquoi ReelMark ?

Marre de scroller sans fin sans savoir quoi regarder ? **ReelMark** est un tracker immersif pensé pour ceux qui aiment le cinéma et détestent la friction. On oublie les interfaces froides, place à une expérience fluide.

### ✨ Fonctionnalités clés

  * 🔍 **Exploration intelligente** : Accès au catalogue TMDB avec un filtrage par région qui a du sens.
  * 📋 **Watchlist instantanée** : Ajout en un clic avec UI optimiste. Pas de chargement, c'est immédiat.
  * 📺 **Suivi par épisode** : Suis ta progression réelle, saison par saison, épisode par épisode.
  * 🎭 **Focus Acteurs** : Filmographies complètes et biographies détaillées.
  * 🎨 **Design Cinéma** : Un mode sombre immersif et un mode clair propre, sans flash blanc au chargement.

### 🛠 Stack Technique

  * **Next.js 16 / React 19** : Pour la vitesse et le SEO.
  * **Tailwind CSS 4** : Pour un design system moderne et léger.
  * **Supabase** : Authentification sécurisée et base PostgreSQL.
  * **TMDB API** : La source de données la plus complète du marché.

### 🚀 Installation Rapide

1.  **Cloner & Installer** : `git clone`, puis `pnpm install`.
2.  **Variables d'env** : Configure ton `.env.local` avec tes clés Supabase et TMDB.
3.  **Base de données** : Exécute le script SQL fourni dans la section anglaise ci-dessus dans ton dashboard Supabase.
4.  **Lancer** : `pnpm dev`.

-----

<p align="center">
<strong>Built with 🍿 by <a href="https://github.com/TheSawkit">SAWKIT</a></strong>
</p>
