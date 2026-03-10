import type {
  Movie,
  MovieDetails,
  Credits,
  Video,
  VideoResponse,
  ReleaseDatesResponse,
  MediaImagesResponse,
} from "@/types/tmdb"
import { fetchTMDB, getUserRegion } from "./client"
import { findLocalCertification } from "./certifications"

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/popular", { page: page.toString() })
  return results
}

export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/top_rated", { page: page.toString() })
  return results
}

export async function getTrendingMovies(timeWindow: "day" | "week" = "week", page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>(`/trending/movie/${timeWindow}`, { page: page.toString() })
  return results
}

export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  const region = await getUserRegion()
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/upcoming", { page: page.toString(), region })
  return results
}

export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  const region = await getUserRegion()
  const { results } = await fetchTMDB<{ results: Movie[] }>("/movie/now_playing", { page: page.toString(), region })
  return results
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  const { results } = await fetchTMDB<{ results: Movie[] }>("/search/movie", { query, page: page.toString() })
  return results
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const details = await fetchTMDB<MovieDetails>(`/movie/${id}`)

  try {
    const releaseDates = await fetchTMDB<ReleaseDatesResponse>(`/movie/${id}/release_dates`)
    const userRegion = await getUserRegion()
    details.certification = findLocalCertification(releaseDates, userRegion)
  } catch {
    details.certification = undefined
  }

  return details
}

export async function getMovieCredits(id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`/movie/${id}/credits`)
}

export async function getMovieVideos(id: number): Promise<Video[]> {
  const { results } = await fetchTMDB<VideoResponse>(`/movie/${id}/videos`)
  return results
}

export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  try {
    const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`)
    return results
  } catch {
    return []
  }
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  try {
    const { results } = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/similar`)
    return results
  } catch {
    return []
  }
}

export async function getMovieImages(id: number): Promise<MediaImagesResponse> {
  return fetchTMDB<MediaImagesResponse>(`/movie/${id}/images`, {
    include_image_language: "null,fr,en",
  })
}
