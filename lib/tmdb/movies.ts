import type {
  Movie,
  MovieDetails,
  Credits,
  Video,
  VideoResponse,
  ReleaseDatesResponse,
  MediaImagesResponse,
} from "@/types/tmdb"
import { fetchTMDB, getUserRegion, clampPage, getMergeRegions, getImageLanguageFilter } from "./client"
import { findLocalCertification } from "./certifications"

/** @returns Paginated list of popular movies. */
export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/popular", { page: clampPage(page).toString() })
  return results
}

/** @returns Paginated list of top-rated movies. */
export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/top_rated", { page: clampPage(page).toString() })
  return results
}

/**
 * @param timeWindow - Trending window: "day" or "week" (default: "week").
 * @returns Paginated list of trending movies.
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>(`/trending/movie/${timeWindow}`, { page: clampPage(page).toString() })
  return results
}

/**
 * Returns movies with upcoming release dates, filtered by the user's region.
 * @returns Paginated list of upcoming movies.
 */
export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  const region = await getUserRegion()
  const today = new Date().toISOString().split("T")[0]

  const { results } = await fetchTMDB<{ results: Movie[] }>("/discover/movie", {
    page: clampPage(page).toString(),
    region,
    "release_date.gte": today,
    "sort_by": "popularity.desc",
    "with_release_type": "2|3",
  })

  return results
}

/**
 * Returns movies currently in theaters, filtered by the user's region.
 * For Belgium, merges BE and FR results to maximize coverage.
 * @returns Paginated list of now-playing movies.
 */
export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const region = await getUserRegion()
  const mergeRegions = getMergeRegions(region)

  if (mergeRegions) {
    const responses = await Promise.all(
      mergeRegions.map((r) =>
        fetchTMDB<{ results: Movie[] }>("/movie/now_playing", { page: clampPage(page).toString(), region: r })
      )
    )

    const movieMap = new Map<number, Movie>()
    for (const response of responses) {
      for (const movie of response.results) {
        movieMap.set(movie.id, movie)
      }
    }

    return Array.from(movieMap.values()).sort((a, b) => b.popularity - a.popularity)
  }

  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing", {
    page: clampPage(page).toString(),
    region,
  })

  return results
}

/** @returns Paginated list of movies matching the search query. */
export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/search/movie", { query, page: clampPage(page).toString() })
  return results
}

/**
 * Fetches full movie details including certification for the user's region.
 * Certification is fetched separately and injected into the returned object.
 *
 * @param id - TMDB movie ID.
 * @returns Full movie details with optional certification field.
 */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const details = await fetchTMDB<MovieDetails>(`/movie/${id}`)

  try {
    const releaseDates = await fetchTMDB<ReleaseDatesResponse>(`/movie/${id}/release_dates`)
    const userRegion = await getUserRegion()
    details.certification = findLocalCertification(releaseDates, userRegion)
  } catch (error) {
    console.warn(`[tmdb/movies] Certification fetch failed for movie ${id}:`, error)
    details.certification = undefined
  }

  return details
}

/** @returns Cast and crew credits for the given movie. */
export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/movie/${id}/credits`)
}

/** @returns Official video trailers and clips for the given movie. */
export async function getMovieVideos(id: number): Promise<Video[]> {
  const { results } = await fetchTMDB<VideoResponse>(`/movie/${id}/videos`)
  return results
}

/**
 * Returns recommended movies based on a given movie.
 * Returns an empty array on failure.
 */
export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  try {
    const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`)
    return results
  } catch {
    return []
  }
}

/**
 * Returns movies similar to the given movie.
 * Returns an empty array on failure.
 */
export async function getSimilarMovies(id: number): Promise<Movie[]> {
  try {
    const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/similar`)
    return results
  } catch {
    return []
  }
}

/** @returns Available backdrop and poster images for the given movie. */
export async function getMovieImages(id: number): Promise<MediaImagesResponse> {
  const imageLanguage = await getImageLanguageFilter()
  return fetchTMDB<MediaImagesResponse>(`/movie/${id}/images`, {
    include_image_language: imageLanguage,
  })
}
