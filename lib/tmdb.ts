import type {
  Movie,
  MovieDetails,
  Credits,
  Video,
  VideoResponse,
  ReleaseDatesResponse,
  MovieImagesResponse,
  ActorDetails,
  ActorMovieCredit,
  ActorTvCredit,
} from "@/types/tmdb"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"


import { getServerLocale } from "@/lib/i18n/server"

// --- HELPER FUNCTION ---

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not defined.")
  }

  const locale = await getServerLocale()

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: locale, // "fr-FR" or "en-US"
    ...params,
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// --- API FUNCTIONS ---

/**
 * Récupère les films populaires du moment
 */
export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/popular", { page: page.toString() });
  return results;
}

/**
 * Récupère les films les mieux notés
 */
export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/top_rated", { page: page.toString() });
  return results;
}

/**
 * Récupère les films en tendance (jour ou semaine)
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>(`/trending/movie/${timeWindow}`, { page: page.toString() });
  return results;
}

/**
 * Récupère les films à venir
 */
export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  const locale = await getServerLocale()
  const region = locale.split('-')[1] // 'FR' or 'US'
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/upcoming", { page: page.toString(), region });
  return results;
}

/**
 * Récupère les films actuellement au cinéma
 */
export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const locale = await getServerLocale()
  const region = locale.split('-')[1]
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing", { page: page.toString(), region });
  return results;
}

/**
 * Recherche un film par mot-clé
 */
export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/search/movie", {
    query,
    page: page.toString(),
  });
  return results;
}

/**
 * Récupère les détails complets d'un film
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const details = await fetchTMDB<MovieDetails>(`/movie/${id}`);

  try {
    const releaseDates = await fetchTMDB<ReleaseDatesResponse>(`/movie/${id}/release_dates`);
    const locale = await getServerLocale()
    const userRegion = locale.split('-')[1]
    details.certification = findLocalCertification(releaseDates, userRegion);
  } catch (error) {
    console.warn("Could not fetch certification:", error);
  }

  return details;
}

/**
 * Cherche la première certification valide parmi les pays européens et US.
 * Privilégie la région de l'utilisateur. Retourne la certification formatée.
 */
function findLocalCertification(releaseDates: ReleaseDatesResponse, userRegion: string): string | undefined {
  // 1. Essayer la région de l'utilisateur
  let countryRelease = releaseDates.results.find((release) => release.iso_3166_1 === userRegion);
  let validCert = countryRelease?.release_dates.find((rd) => rd.certification?.trim());
  
  if (validCert) return `+${validCert.certification.trim()}`;

  // 2. Essayer les pays de fallback internationaux
  const fallbackCountries = ["FR", "US", "GB", "DE", "ES", "IT"];
  for (const countryCode of fallbackCountries) {
    if (countryCode === userRegion) continue;
    
    countryRelease = releaseDates.results.find((release) => release.iso_3166_1 === countryCode);
    if (!countryRelease || countryRelease.release_dates.length === 0) continue;

    validCert = countryRelease.release_dates.find((rd) => rd.certification?.trim());
    if (validCert) return `+${validCert.certification.trim()}`;
  }

  return undefined;
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
  const { results } = await fetchTMDB<VideoResponse>(`/movie/${id}/videos`);
  return results;
}

/**
 * Récupère des recommandations basées sur un film
 */
export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`);
  return results;
}

/**
 * Récupère des films similaires
 */
export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/similar`);
  return results;
}

/**
 * Récupère toutes les images disponibles d'un film (backdrops, posters, logos)
 */
export async function getMovieImages(id: number): Promise<MovieImagesResponse> {
  return fetchTMDB<MovieImagesResponse>(`/movie/${id}/images`, {
    include_image_language: "null,fr,en",
  });
}

/**
 * Sélectionne la meilleure image alternative pour la bannière
 * Préfère les backdrops avec un bon score, sinon utilise le backdrop principal
 */
export function selectHeroImage(
  images: MovieImagesResponse,
  defaultBackdrop: string | null
): string {
  const sortedBackdrops = [...(images.backdrops || [])]
    .filter((img) => img.file_path !== defaultBackdrop)
    .sort((a, b) => {
      if (b.vote_average !== a.vote_average) {
        return b.vote_average - a.vote_average;
      }
      return b.vote_count - a.vote_count;
    });

  if (sortedBackdrops.length > 0) {
    return sortedBackdrops[0].file_path;
  }

  return defaultBackdrop || "";
}

// --- UTILS ---



// --- ACTOR API ---

/**
 * Récupère les détails d'un acteur
 */
export async function getActorDetails(id: number): Promise<ActorDetails> {
  return fetchTMDB<ActorDetails>(`/person/${id}`);
}

/**
 * Récupère la filmographie cinéma d'un acteur
 */
export async function getActorMovieCredits(id: number): Promise<ActorMovieCredit[]> {
  const { cast } = await fetchTMDB<{ cast: ActorMovieCredit[] }>(`/person/${id}/movie_credits`);
  return cast;
}

/**
 * Récupère la filmographie séries TV d'un acteur
 */
export async function getActorTvCredits(id: number): Promise<ActorTvCredit[]> {
  const { cast } = await fetchTMDB<{ cast: ActorTvCredit[] }>(`/person/${id}/tv_credits`);
  return cast;
}
