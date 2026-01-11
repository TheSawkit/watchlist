import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CinemaSpotlight from "@/components/ui/cinema-spotlight"
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb"
import { MovieSection } from "@/components/MovieSection"
import { CategoryNav } from "@/components/CategoryNav"

export default async function ExplorerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // On lance toutes les requêtes en parallèle pour la performance
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
      <CinemaSpotlight />
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Explorer, {user.user_metadata.full_name || "Cinéphile"}</h1>
        <p className="text-muted">Découvrez des films à ajouter à votre collection.</p>
      </div>

      <CategoryNav />

      {/* 1. L'actualité chaude */}
      <MovieSection title="Tendances de la semaine" movies={moviesTrending} categoryUrl="/explorer/trending" />
      <MovieSection title="Actuellement au cinéma" movies={moviesNowPlaying} categoryUrl="/explorer/now-playing" />
      
      {/* 2. Les valeurs sûres */}
      <MovieSection title="Films Populaires" movies={moviesPopular} categoryUrl="/explorer/popular" />
      <MovieSection title="Les Mieux Notés" movies={moviesTopRated} categoryUrl="/explorer/top-rated" />
      
      {/* 3. Le futur */}
      <MovieSection title="Prochainement" movies={moviesUpcoming} categoryUrl="/explorer/upcoming" />
    </div>
  )
}
