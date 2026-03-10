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
import { fetchTMDB, getUserRegion } from "./client"
import { findTvCertification } from "./certifications"

export async function getPopularTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/popular", { page: page.toString() })
  return results
}

export async function getTopRatedTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/top_rated", { page: page.toString() })
  return results
}

export async function getTrendingTvShows(timeWindow: "day" | "week" = "week", page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>(`/trending/tv/${timeWindow}`, { page: page.toString() })
  return results
}

export async function getAiringTodayTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/airing_today", { page: page.toString() })
  return results
}

export async function getOnTheAirTvShows(page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/tv/on_the_air", { page: page.toString() })
  return results
}

export async function searchTvShows(query: string, page: number = 1): Promise<TvShow[]> {
  const { results } = await fetchTMDB<{ results: TvShow[] }>("/search/tv", { query, page: page.toString() })
  return results
}

export async function getTvShowDetails(id: number): Promise<TvShowDetails> {
  const details = await fetchTMDB<TvShowDetails>(`/tv/${id}`)

  try {
    const ratings = await fetchTMDB<ContentRatingsResponse>(`/tv/${id}/content_ratings`)
    const userRegion = await getUserRegion()
    details.certification = findTvCertification(ratings, userRegion)
  } catch {
    details.certification = undefined
  }

  return details
}

export async function getTvShowTotalEpisodes(id: number): Promise<number> {
  try {
    const details = await getTvShowDetails(id)
    return (details.seasons ?? []).reduce((sum, s) => sum + s.episode_count, 0)
  } catch {
    return 0
  }
}

export async function getTvShowCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/tv/${id}/credits`)
}

export async function getTvShowVideos(id: number): Promise<Video[]> {
  const { results } = await fetchTMDB<VideoResponse>(`/tv/${id}/videos`)
  return results
}

export async function getTvShowImages(id: number): Promise<MediaImagesResponse> {
  return fetchTMDB<MediaImagesResponse>(`/tv/${id}/images`, {
    include_image_language: "null,fr,en",
  })
}

export async function getTvShowRecommendations(id: number): Promise<TvShow[]> {
  try {
    const { results } = await fetchTMDB<{ results: TvShow[] }>(`/tv/${id}/recommendations`)
    return results
  } catch {
    return []
  }
}

export async function getSimilarTvShows(id: number): Promise<TvShow[]> {
  try {
    const { results } = await fetchTMDB<{ results: TvShow[] }>(`/tv/${id}/similar`)
    return results
  } catch {
    return []
  }
}

export async function getSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
  return fetchTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`)
}
