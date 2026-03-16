import type {
  TvShow,
  TvShowDetails,
  SeasonDetails,
  Credits,
  Video,
  VideoResponse,
  ContentRatingsResponse,
  MediaImagesResponse,
} from "@/types/tmdb"
import { fetchTMDB, getUserRegion, clampPage, getImageLanguageFilter } from "./client"
import { findTvCertification } from "./certifications"

/** @returns Paginated list of popular TV shows. */
export async function getPopularTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/popular", { page: clampPage(page).toString() })
  return results
}

/** @returns Paginated list of top-rated TV shows. */
export async function getTopRatedTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/top_rated", { page: clampPage(page).toString() })
  return results
}

/**
 * @param timeWindow - Trending window: "day" or "week" (default: "week").
 * @returns Paginated list of trending TV shows.
 */
export async function getTrendingTvShows(timeWindow: "day" | "week" = "week", page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>(`/trending/tv/${timeWindow}`, { page: clampPage(page).toString() })
  return results
}

/** @returns Paginated list of TV shows airing today. */
export async function getAiringTodayTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/airing_today", { page: clampPage(page).toString() })
  return results
}

/** @returns Paginated list of TV shows currently on the air. */
export async function getOnTheAirTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/on_the_air", { page: clampPage(page).toString() })
  return results
}

/** @returns Paginated list of TV shows matching the search query. */
export async function searchTvShows(query: string, page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/search/tv", { query, page: clampPage(page).toString() })
  return results
}

/**
 * Fetches full TV show details including certification for the user's region.
 *
 * @param id - TMDB TV show ID.
 * @returns Full TV show details with optional certification field.
 */
export async function getTvShowDetails(id: number): Promise<TvShowDetails> {
  const details = await fetchTMDB<TvShowDetails>(`/tv/${id}`)

  try {
    const ratings = await fetchTMDB<ContentRatingsResponse>(`/tv/${id}/content_ratings`)
    const userRegion = await getUserRegion()
    details.certification = findTvCertification(ratings, userRegion)
  } catch (error) {
    console.warn(`[tmdb/tv] Certification fetch failed for TV ${id}:`, error)
    details.certification = undefined
  }

  return details
}

/**
 * Returns the total episode count across all seasons of a TV show.
 * Returns 0 on failure.
 *
 * @param id - TMDB TV show ID.
 * @returns Total number of episodes.
 */
export async function getTvShowTotalEpisodes(id: number): Promise<number> {
  try {
    const details = await getTvShowDetails(id)
    return (details.seasons ?? []).reduce((sum, s) => sum + s.episode_count, 0)
  } catch {
    return 0
  }
}

/** @returns Cast and crew credits for the given TV show. */
export async function getTvShowCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/tv/${id}/credits`)
}

/** @returns Official video trailers and clips for the given TV show. */
export async function getTvShowVideos(id: number): Promise<Video[]> {
  const { results } = await fetchTMDB<VideoResponse>(`/tv/${id}/videos`)
  return results
}

/** @returns Available backdrop and poster images for the given TV show. */
export async function getTvShowImages(id: number): Promise<MediaImagesResponse> {
  const imageLanguage = await getImageLanguageFilter()
  return fetchTMDB<MediaImagesResponse>(`/tv/${id}/images`, {
    include_image_language: imageLanguage,
  })
}

/**
 * Returns recommended TV shows based on a given show.
 * Returns an empty array on failure.
 */
export async function getTvShowRecommendations(id: number): Promise<TvShow[]> {
  try {
    const { results } = await fetchTMDB<{ results: TvShow[] }>(`/tv/${id}/recommendations`)
    return results
  } catch {
    return []
  }
}

/**
 * Returns TV shows similar to the given show.
 * Returns an empty array on failure.
 */
export async function getSimilarTvShows(id: number): Promise<TvShow[]> {
  try {
    const { results } = await fetchTMDB<{ results: TvShow[] }>(`/tv/${id}/similar`)
    return results
  } catch {
    return []
  }
}

/**
 * @param tvId - TMDB TV show ID.
 * @param seasonNumber - Season number (1-based).
 * @returns Full season details including episodes.
 */
export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
  return fetchTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`)
}
