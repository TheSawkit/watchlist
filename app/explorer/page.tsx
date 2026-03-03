import { requireAuth } from "@/lib/auth"
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb"
import { MovieSection } from "@/components/movies/MovieSection"
import { CategoryNav } from "@/components/navigation/CategoryNav"
import { SearchBar } from "@/components/search/SearchBar"
import { getTranslations } from "@/lib/i18n/server"

export default async function ExplorerPage() {
  await requireAuth()

  const t = await getTranslations()

  const [
    moviesTrending,
    moviesNowPlaying,
    moviesPopular,
    moviesTopRated,
    moviesUpcoming
  ] = await Promise.all([
    getTrendingMovies("week"),
    getNowPlayingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies()
  ])

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
      <CategoryNav />
      <MovieSection title={t.pages.explorer.trending} movies={moviesTrending} categoryUrl="/explorer/trending" />
      <MovieSection title={t.pages.explorer.nowPlaying} movies={moviesNowPlaying} categoryUrl="/explorer/now-playing" />
      <MovieSection title={t.pages.explorer.popular} movies={moviesPopular} categoryUrl="/explorer/popular" />
      <MovieSection title={t.pages.explorer.topRated} movies={moviesTopRated} categoryUrl="/explorer/top-rated" />
      <MovieSection title={t.pages.explorer.upcoming} movies={moviesUpcoming} categoryUrl="/explorer/upcoming" />
    </div>
  )
}
