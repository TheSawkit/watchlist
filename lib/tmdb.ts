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
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const TMDB_IMAGE_ORIGINAL_URL = "https://image.tmdb.org/t/p/original"

// --- HELPER FUNCTION ---

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not defined.")
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "fr-FR",
    ...params,
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`

  const res = await fetch(url, {

  })

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
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
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/upcoming", { page: page.toString(), region: "FR" }); // TODO: Add region variable with user parameter
  return data.results;
}

/**
 * Récupère les films actuellement au cinéma
 */
export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const data = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing", { page: page.toString(), region: "FR" }); // TODO: Add region variable with user parameter
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
  const details = await fetchTMDB<MovieDetails>(`/movie/${id}`);

  try {
    const releaseDates = await fetchTMDB<ReleaseDatesResponse>(`/movie/${id}/release_dates`);

    const europeanCountries = ["DE", "GB", "ES", "IT", "NL", "BE", "AT", "CH", "PT", "SE", "NO", "DK", "FI", "PL", "CZ", "HU", "RO", "GR"];

    for (const countryCode of europeanCountries) {
      const countryRelease = releaseDates.results.find((r) => r.iso_3166_1 === countryCode);
      if (countryRelease && countryRelease.release_dates.length > 0) {
        const certification = countryRelease.release_dates.find((rd) => rd.certification && rd.certification.trim() !== "");
        if (certification) {
          const certValue = certification.certification.trim();
          if (/^\d+$/.test(certValue)) {
            details.certification = `+${certValue}`;
          } else {
            details.certification = `+${certValue}`;
          }
          break;
        }
      }
    }
  } catch (error) {

    console.warn("Could not fetch certification:", error);
  }

  return details;
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

/**
 * Génère l'URL complète d'une image TMDB
 */
export function getImageUrl(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return "https://images.unsplash.com/vector-1756365681486-615455939f4e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (size === "original") {
    return `${TMDB_IMAGE_ORIGINAL_URL}${path}`;
  }
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

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
  const data = await fetchTMDB<{ cast: ActorMovieCredit[] }>(`/person/${id}/movie_credits`);
  return data.cast;
}

/**
 * Récupère la filmographie séries TV d'un acteur
 */
export async function getActorTvCredits(id: number): Promise<ActorTvCredit[]> {
  const data = await fetchTMDB<{ cast: ActorTvCredit[] }>(`/person/${id}/tv_credits`);
  return data.cast;
}
