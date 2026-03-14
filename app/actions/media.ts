"use server"

import {
  getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies,
  getPopularTvShows, getTopRatedTvShows, getTrendingTvShows, getAiringTodayTvShows, getOnTheAirTvShows,
  movieToMediaItem, tvShowToMediaItem,
} from "@/lib/tmdb"
import type { MediaItem, WatchlistEntry } from "@/types/tmdb"
import { getMediaWatchlistEntries } from "./watchlist"

/**
 * Enriches a list of media items with their corresponding watchlist entries for the current user.
 * Items without a watchlist entry are returned unchanged.
 *
 * @param items - Media items to enrich.
 * @returns The same items with `watchlistEntry` injected where a match exists.
 */
export async function mergeMediaWithWatchlist(items: MediaItem[]): Promise<MediaItem[]> {
  if (items.length === 0) return []

  const mediaIds = items.map(item => item.id)
  const watchlistEntries = await getMediaWatchlistEntries(mediaIds)

  return items.map(item => ({
    ...item,
    watchlistEntry: watchlistEntries.find((entry: WatchlistEntry) =>
      entry.media_id === item.id && entry.media_type === item.media_type
    )
  }))
}

/**
 * Fetches a paginated list of media items for a given category and merges watchlist data.
 *
 * @param category - Category slug (e.g. "popular", "tv-trending").
 * @param page - Page number for pagination.
 * @returns Enriched media items for the requested category and page.
 */
export async function fetchMoreMedia(category: string, page: number): Promise<MediaItem[]> {
  let items: MediaItem[] = []

  switch (category) {
    case "popular":
      items = (await getPopularMovies(page)).map(movieToMediaItem)
      break
    case "top-rated":
      items = (await getTopRatedMovies(page)).map(movieToMediaItem)
      break
    case "upcoming":
      items = (await getUpcomingMovies(page)).map(movieToMediaItem)
      break
    case "now-playing":
      items = (await getNowPlayingMovies(page)).map(movieToMediaItem)
      break
    case "trending":
      items = (await getTrendingMovies("week", page)).map(movieToMediaItem)
      break
    case "tv-popular":
      items = (await getPopularTvShows(page)).map(tvShowToMediaItem)
      break
    case "tv-top-rated":
      items = (await getTopRatedTvShows(page)).map(tvShowToMediaItem)
      break
    case "tv-trending":
      items = (await getTrendingTvShows("week", page)).map(tvShowToMediaItem)
      break
    case "tv-airing-today":
      items = (await getAiringTodayTvShows(page)).map(tvShowToMediaItem)
      break
    case "tv-on-the-air":
      items = (await getOnTheAirTvShows(page)).map(tvShowToMediaItem)
      break
  }

  return mergeMediaWithWatchlist(items)
}
