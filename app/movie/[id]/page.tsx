import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getImageUrl, getMovieDetails, getMovieCredits, getMovieVideos, getMovieImages, selectHeroImage } from "@/lib/tmdb"
import { MediaBanner } from "@/components/media/MediaBanner"
import { MediaTrailers } from "@/components/media/MediaTrailers"
import { MediaDescription } from "@/components/media/MediaDescription"
import { MediaCast } from "@/components/media/MediaCast"
import { WatchButton } from "@/components/media/WatchButton"
import { getMediaWatchlistEntry } from "@/app/actions/watchlist"
import { filterAvailableVideos } from "@/lib/youtube"
import { Eye } from "lucide-react"
import { getTranslations, getServerLocale } from "@/lib/i18n/server"
import { formatDate } from "@/lib/format"
import type { MoviePageProps } from "@/types/pages"

/**
 * Generates metadata for movie detail page for SEO and social sharing.
 * Fetches movie data and constructs OpenGraph and Twitter card information.
 *
 * @param props - Route parameters
 * @param props.params - Promise resolving to { id: string } movie ID
 * @returns Metadata object with title, description, OpenGraph, and Twitter card data
 */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://reelmark.app"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const movieId = parseInt(id)
  const t = await getTranslations()

  if (isNaN(movieId)) {
    return {
      title: "ReelMark",
      description: t.metadata.defaultMovieDescription,
    }
  }

  try {
    const movieDetails = await getMovieDetails(movieId)
    const backdropImage = movieDetails.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`
      : undefined

    const images = backdropImage ? [{ url: backdropImage, width: 1280, height: 720 }] : []
    const watchDescription = movieDetails.overview || t.metadata.watchMovieOn.replace("${title}", movieDetails.title)

    return {
      title: movieDetails.title,
      description: watchDescription,
      alternates: { canonical: `${BASE_URL}/movie/${movieId}` },
      openGraph: {
        title: movieDetails.title,
        description: watchDescription,
        type: "video.movie",
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: movieDetails.title,
        description: watchDescription,
        images: images.length > 0 ? [images[0].url] : undefined,
      },
    }
  } catch {
    return {
      title: "ReelMark",
      description: t.metadata.defaultMovieDescription,
    }
  }
}

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

  const candidateTrailers = videos
    .filter((video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"))
    .sort((a, b) => (b.official ? 1 : 0) - (a.official ? 1 : 0))

  const trailers = await filterAvailableVideos(candidateTrailers)

  const heroImagePath = selectHeroImage(images, movieDetails.backdrop_path)
  const heroImageUrl = getImageUrl(heroImagePath, "original")
  const watchlistEntry = await getMediaWatchlistEntry(movieId, "movie")
  const isWatched = watchlistEntry?.status === "watched"
  const t = await getTranslations()
  const locale = await getServerLocale()

  return (
    <main className="min-h-screen">
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
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {!isWatched && (
              <div className="w-full sm:w-auto">
                <WatchButton
                  mediaId={movieDetails.id}
                  mediaTitle={movieDetails.title}
                  mediaType="movie"
                  posterPath={movieDetails.poster_path}
                  status="to_watch"
                  variant="full"
                  initialActive={watchlistEntry?.status === "to_watch"}
                />
              </div>
            )}
            <div className="w-full sm:w-auto">
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
            </div>
            {isWatched && watchlistEntry?.created_at && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface-2 border border-border text-muted animate-in fade-in slide-in-from-left-4 duration-(--duration-slow)">
                <Eye className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">
                  {t.movie.watchedOn} {formatDate(watchlistEntry.created_at, locale)}
                </span>
              </div>
            )}
          </div>
        }
        stickyActions={
          <div className="flex items-center gap-2">
            {!isWatched && (
              <WatchButton
                mediaId={movieDetails.id}
                mediaTitle={movieDetails.title}
                mediaType="movie"
                posterPath={movieDetails.poster_path}
                status="to_watch"
                initialActive={watchlistEntry?.status === "to_watch"}
              />
            )}
            <WatchButton
              mediaId={movieDetails.id}
              mediaTitle={movieDetails.title}
              mediaType="movie"
              posterPath={movieDetails.poster_path}
              status="watched"
              initialActive={isWatched}
              fallbackStatus="to_watch"
              releaseDate={movieDetails.release_date}
            />
          </div>
        }
      />

      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-16 space-y-14 md:space-y-16">
        <MediaDescription description={movieDetails.overview} />

        {trailers.length > 0 && <MediaTrailers trailers={trailers} />}

        <MediaCast cast={credits.cast} />
      </div>
    </main>
  )
}
