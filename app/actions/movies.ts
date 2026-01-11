"use server"

import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb"

export async function fetchMoreMovies(category: string, page: number) {
  switch (category) {
    case "popular": return getPopularMovies(page)
    case "top-rated": return getTopRatedMovies(page)
    case "upcoming": return getUpcomingMovies(page)
    case "now-playing": return getNowPlayingMovies(page)
    case "trending": return getTrendingMovies("week", page)
    default: return []
  }
}
