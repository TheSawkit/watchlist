"use server"

import {
  getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies,
  getPopularTvShows, getTopRatedTvShows, getTrendingTvShows, getAiringTodayTvShows, getOnTheAirTvShows,
  movieToMediaItem, tvShowToMediaItem,
} from "@/lib/tmdb"
import type { MediaItem } from "@/types/tmdb"

export async function fetchMoreMedia(category: string, page: number): Promise<MediaItem[]> {
  switch (category) {
    case "popular":
      return (await getPopularMovies(page)).map(movieToMediaItem)
    case "top-rated":
      return (await getTopRatedMovies(page)).map(movieToMediaItem)
    case "upcoming":
      return (await getUpcomingMovies(page)).map(movieToMediaItem)
    case "now-playing":
      return (await getNowPlayingMovies(page)).map(movieToMediaItem)
    case "trending":
      return (await getTrendingMovies("week", page)).map(movieToMediaItem)
    case "tv-popular":
      return (await getPopularTvShows(page)).map(tvShowToMediaItem)
    case "tv-top-rated":
      return (await getTopRatedTvShows(page)).map(tvShowToMediaItem)
    case "tv-trending":
      return (await getTrendingTvShows("week", page)).map(tvShowToMediaItem)
    case "tv-airing-today":
      return (await getAiringTodayTvShows(page)).map(tvShowToMediaItem)
    case "tv-on-the-air":
      return (await getOnTheAirTvShows(page)).map(tvShowToMediaItem)
    default:
      return []
  }
}
