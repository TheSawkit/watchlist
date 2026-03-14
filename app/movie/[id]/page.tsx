import { notFound } from "next/navigation"
import { getImageUrl, getMovieDetails, getMovieCredits, getMovieVideos, getMovieImages, selectHeroImage } from "@/lib/tmdb"
import { MediaBanner } from "@/components/media/MediaBanner"
import { MediaTrailers } from "@/components/media/MediaTrailers"
import { MediaDescription } from "@/components/media/MediaDescription"
import { MediaCast } from "@/components/media/MediaCast"
import { WatchButton } from "@/components/media/WatchButton"
import { getMediaWatchlistEntry } from "@/app/actions/watchlist"
import { Eye } from "lucide-react"
import { getTranslations, getServerLocale } from "@/lib/i18n/server"
import { formatDate } from "@/lib/format"
import type { MoviePageProps } from "@/types/pages"

export default async function MoviePage(props: MoviePageProps) {
  const params = await props.params
  const movieId = parseInt(params.id)

  if (isNaN(movieId)) {
    notFound()
  }

  let movieDetails, credits, videos, images

  try {
    [movieDetails, credits, videos, images] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getMovieImages(movieId),
    ])
  } catch {
    notFound()
  }

  const trailers = videos.filter(
    (video) => video.type === "Trailer" || video.type === "Teaser"
  )

  const heroImagePath = selectHeroImage(images, movieDetails.backdrop_path)
  const heroImageUrl = getImageUrl(heroImagePath, "original")
  const watchlistEntry = await getMediaWatchlistEntry(movieId)
  const isWatched = watchlistEntry?.status === "watched"
  const t = await getTranslations()
  const locale = await getServerLocale()

  return (
    <div className="min-h-screen">
      <MediaBanner
        title={movieDetails.title}
        tagline={movieDetails.tagline}
        backdropUrl={heroImageUrl}
        posterPath={movieDetails.poster_path}
        voteAverage={movieDetails.vote_average}
        releaseDate={movieDetails.release_date}
        runtime={movieDetails.runtime}
        certification={movieDetails.certification}
        genres={movieDetails.genres}
        actions={
          <div className="flex flex-row items-center gap-3">
            {!isWatched && (
              <WatchButton
                mediaId={movieDetails.id}
                mediaTitle={movieDetails.title}
                mediaType="movie"
                posterPath={movieDetails.poster_path}
                status="to_watch"
                variant="full"
                initialActive={watchlistEntry?.status === "to_watch"}
              />
            )}
            <WatchButton
              mediaId={movieDetails.id}
              mediaTitle={movieDetails.title}
              mediaType="movie"
              posterPath={movieDetails.poster_path}
              status="watched"
              variant="full"
              initialActive={isWatched}
              fallbackStatus="to_watch"
              releaseDate={movieDetails.release_date}
            />
            {isWatched && watchlistEntry?.created_at && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-2 border border-border text-muted animate-in fade-in slide-in-from-left-4 duration-(--duration-slow)">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t.movie.watchedOn} {formatDate(watchlistEntry.created_at, locale)}
                </span>
              </div>
            )}
          </div>
        }
      />

      <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
        <MediaDescription description={movieDetails.overview} />

        {trailers.length > 0 && <MediaTrailers trailers={trailers} />}

        <MediaCast cast={credits.cast} />
      </div>
    </div>
  )
}
