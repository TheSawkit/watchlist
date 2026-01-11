const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_IMAGE_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";

// --- TYPES ---

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
}

export interface Cast {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string; // "YouTube", etc.
  type: string; // "Trailer", "Teaser", etc.
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

// --- HELPER FUNCTION ---

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not defined.");
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "fr-FR",
    ...params,
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache d'une heure par défaut
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// --- API FUNCTIONS ---

/**
 * Récupère les films populaires du moment
 */
export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/popular", { page: page.toString() });
  return data.results;
}

/**
 * Récupère les films les mieux notés
 */
export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/top_rated", { page: page.toString() });
  return data.results;
}

/**
 * Récupère les films en tendance (jour ou semaine)
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>(`/trending/movie/${timeWindow}`, { page: page.toString() });
  return data.results;
}

/**
 * Récupère les films à venir
 */
export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/upcoming", { page: page.toString() });
  return data.results;
}

/**
 * Récupère les films actuellement au cinéma
 */
export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing", { page: page.toString() });
  return data.results;
}

/**
 * Recherche un film par mot-clé
 */
export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/search/movie", {
    query,
    page: page.toString(),
  });
  return data.results;
}

/**
 * Récupère les détails complets d'un film
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`);
}

/**
 * Récupère le casting et l'équipe technique d'un film
 */
export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/movie/${id}/credits`);
}

/**
 * Récupère les vidéos (trailers, teasers) d'un film
 */
export async function getMovieVideos(id: number): Promise<Video[]> {
  const data = await fetchTMDB<VideoResponse>(`/movie/${id}/videos`);
  return data.results;
}

/**
 * Récupère des recommandations basées sur un film
 */
export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`);
  return data.results;
}

/**
 * Récupère des films similaires
 */
export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/similar`);
  return data.results;
}

// --- UTILS ---

/**
 * Génère l'URL complète d'une image TMDB
 */
export function getImageUrl(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  if (size === "original") {
    return `${TMDB_IMAGE_ORIGINAL_URL}${path}`;
  }
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}
