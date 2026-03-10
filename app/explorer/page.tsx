import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import {
  getPopularMovies, getTopRatedMovies, getTrendingMovies, getUpcomingMovies,
  getPopularTvShows, getTrendingTvShows, getAiringTodayTvShows, getTopRatedTvShows,
  movieToMediaItem, tvShowToMediaItem
} from "@/lib/tmdb"
import { MediaSection } from "@/components/media/MediaSection"
import { CategoryNav } from "@/components/navigation/CategoryNav"
import { SearchBar } from "@/components/search/SearchBar"
import { getTranslations } from "@/lib/i18n/server"
import { MediaTypeSwitcher } from "@/components/media/MediaTypeSwitcher"
import type { Movie, TvShow } from "@/types/tmdb"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ExplorerPage({ searchParams }: Props) {
  await requireAuth()

  const params = await searchParams
  const type = params?.type === "tv" ? "tv" : "movie"
  const t = await getTranslations()

  const isMovie = type === "movie"

  const [trending, popular, extra1, extra2] = await Promise.all(
    isMovie
      ? [
        getTrendingMovies("week"),
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies()
      ]
      : [
        getTrendingTvShows("week"),
        getPopularTvShows(),
        getTopRatedTvShows(),
        getAiringTodayTvShows()
      ]
  )

  const trendingItems = isMovie ? (trending as Movie[]).map(movieToMediaItem) : (trending as TvShow[]).map(tvShowToMediaItem)
  const popularItems = isMovie ? (popular as Movie[]).map(movieToMediaItem) : (popular as TvShow[]).map(tvShowToMediaItem)

  const extraItems1 = {
    title: isMovie ? t.pages.explorer.topRated : t.pages.explorer.tvTopRated,
    items: isMovie ? (extra1 as Movie[]).map(movieToMediaItem) : (extra1 as TvShow[]).map(tvShowToMediaItem),
    categoryUrl: isMovie ? "/explorer/top-rated" : "/explorer/tv-top-rated"
  }

  const extraItems2 = {
    title: isMovie ? t.pages.explorer.upcoming : t.pages.explorer.tvAiringToday,
    items: isMovie ? (extra2 as Movie[]).map(movieToMediaItem) : (extra2 as TvShow[]).map(tvShowToMediaItem),
    categoryUrl: isMovie ? "/explorer/upcoming" : "/explorer/tv-airing-today"
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div
        className="mb-10"
        style={{
          animation: "slideUp 0.6s ease-out forwards",
          opacity: 0,
        }}
      >
        <h1 className="text-3xl font-bold mb-2">{t.pages.explorer.title}</h1>
        <p className="text-muted">{t.pages.explorer.subtitle}</p>
      </div>

      <SearchBar />

      <Suspense fallback={<div className="h-[46px] mb-8" />}>
        <MediaTypeSwitcher defaultType="movie" />
      </Suspense>

      <Suspense fallback={<div className="h-[40px] mb-8" />}>
        <CategoryNav />
      </Suspense>

      <MediaSection
        title={type === "movie" ? t.pages.explorer.trending : t.pages.explorer.tvTrending}
        items={trendingItems}
        categoryUrl={`/explorer/${type === "movie" ? "trending" : "tv-trending"}`}
      />
      <MediaSection
        title={type === "movie" ? t.pages.explorer.popular : t.pages.explorer.tvPopular}
        items={popularItems}
        categoryUrl={`/explorer/${type === "movie" ? "popular" : "tv-popular"}`}
      />

      <MediaSection title={extraItems1.title} items={extraItems1.items} categoryUrl={extraItems1.categoryUrl} />
      <MediaSection title={extraItems2.title} items={extraItems2.items} categoryUrl={extraItems2.categoryUrl} />
    </div>
  )
}
