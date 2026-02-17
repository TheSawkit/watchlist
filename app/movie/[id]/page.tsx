import { notFound } from "next/navigation"
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieImages, getImageUrl, selectHeroImage } from "@/lib/tmdb"
import { MovieBanner } from "@/components/movies/MovieBanner"
import { MovieTrailers } from "@/components/movies/MovieTrailers"
import { MovieDescription } from "@/components/movies/MovieDescription"
import { MovieCast } from "@/components/movies/MovieCast"
import type { MoviePageProps } from "@/types/pages"

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

  return (
    <div className="min-h-screen">
      <MovieBanner movie={movieDetails} backdropUrl={heroImageUrl} />

      <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
        <MovieDescription description={movieDetails.overview} tagline={movieDetails.tagline} />

        {trailers.length > 0 && <MovieTrailers trailers={trailers} />}

        <MovieCast cast={credits.cast} />
      </div>
    </div>
  )
}
