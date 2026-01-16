import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb"
import { MovieSection } from "@/components/movies/MovieSection"
import { CategoryNav } from "@/components/navigation/CategoryNav"

export default async function ExplorerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

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
        <h1 className="text-3xl font-bold mb-2">Explorer</h1>
        <p className="text-muted">Découvrez des films à ajouter à votre collection.</p>
      </div>

      <CategoryNav />
      <MovieSection title="Tendances de la semaine" movies={moviesTrending} categoryUrl="/explorer/trending" />
      <MovieSection title="Actuellement au cinéma" movies={moviesNowPlaying} categoryUrl="/explorer/now-playing" />
      <MovieSection title="Films Populaires" movies={moviesPopular} categoryUrl="/explorer/popular" />
      <MovieSection title="Les Mieux Notés" movies={moviesTopRated} categoryUrl="/explorer/top-rated" />
      <MovieSection title="Prochainement" movies={moviesUpcoming} categoryUrl="/explorer/upcoming" />
    </div>
  )
}
