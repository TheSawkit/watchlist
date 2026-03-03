import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb"
import type { Movie } from "@/types/tmdb"
import { CategoryNav } from "@/components/navigation/CategoryNav"
import { InfiniteScrollMovies } from "@/components/movies/InfiniteScrollMovies"
import { getTranslations } from "@/lib/i18n/server"
import type { CategoryPageProps } from "@/types/pages"

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params
  await requireAuth()

  const t = await getTranslations()

  const category = params.category
  let title = ""
  let initialMovies: Movie[] = []

  switch (category) {
    case "popular":
      initialMovies = await getPopularMovies(1)
      title = t.pages.categories.popular
      break
    case "top-rated":
      initialMovies = await getTopRatedMovies(1)
      title = t.pages.categories.topRated
      break
    case "upcoming":
      initialMovies = await getUpcomingMovies(1)
      title = t.pages.categories.upcoming
      break
    case "now-playing":
      initialMovies = await getNowPlayingMovies(1)
      title = t.pages.categories.nowPlaying
      break
    case "trending":
      initialMovies = await getTrendingMovies("week", 1)
      title = t.pages.categories.trending
      break
    default:
      notFound()
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
      </div>

      <CategoryNav />

      <InfiniteScrollMovies initialMovies={initialMovies} category={category} />
    </div>
  )
}
