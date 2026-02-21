import { notFound } from "next/navigation"
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieImages, getImageUrl, selectHeroImage } from "@/lib/tmdb"
import { MovieBanner } from "@/components/movies/MovieBanner"
import { MovieTrailers } from "@/components/movies/MovieTrailers"
import { MovieDescription } from "@/components/movies/MovieDescription"
import { MovieCast } from "@/components/movies/MovieCast"
import type { MoviePageProps } from "@/types/pages"
import { WatchButton } from "@/components/movies/WatchButton"
import { getMovieWatchlistEntry } from "@/app/actions/watchlist"
import { Eye } from "lucide-react"

export default async function MoviePage(props: MoviePageProps) {
  const params = await props.params
  const movieId = parseInt(params.id)

  if (isNaN(movieId)) {
    notFound()
  }

  let movieDetails
  let credits
  let videos
  let images

  try {
    const results = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getMovieImages(movieId),
    ])
    movieDetails = results[0]
    credits = results[1]
    videos = results[2]
    images = results[3]
  } catch (error) {
    console.error("Error fetching movie details:", error)
    notFound()
  }

  const trailers = videos.filter(
    (video) => video.type === "Trailer" || video.type === "Teaser"
  )

  const heroImagePath = selectHeroImage(images, movieDetails.backdrop_path)
  const heroImageUrl = getImageUrl(heroImagePath, "original")
  const watchlistEntry = await getMovieWatchlistEntry(movieId)
  const isWatched = watchlistEntry?.status === "watched"

  return (
    <div className="min-h-screen">
      <MovieBanner
        movie={movieDetails}
        backdropUrl={heroImageUrl}
        actions={
          <div className="flex items-center gap-4 flex-wrap">
            {!isWatched && (
              <WatchButton
                movieId={movieDetails.id}
                movieTitle={movieDetails.title}
                posterPath={movieDetails.poster_path}
                status="to_watch"
                variant="full"
                initialActive={watchlistEntry?.status === "to_watch"}
              />
            )}
            <WatchButton
              movieId={movieDetails.id}
              movieTitle={movieDetails.title}
              posterPath={movieDetails.poster_path}
              status="watched"
              variant="full"
              initialActive={isWatched}
              fallbackStatus="to_watch"
            />
            {isWatched && watchlistEntry?.created_at && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-2/50 border border-border/10 text-muted animate-in fade-in slide-in-from-left-4 duration-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Vu le {new Date(watchlistEntry.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            )}
          </div>
        }
      />

      <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
        <MovieDescription description={movieDetails.overview} tagline={movieDetails.tagline} />

        {trailers.length > 0 && <MovieTrailers trailers={trailers} />}

        <MovieCast cast={credits.cast} />
      </div>
    </div>
  )
}
