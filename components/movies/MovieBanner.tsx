import { useCallback } from "react"
import Image from "next/image"
import { getImageUrl } from "@/lib/tmdb"
import type { MovieBannerProps } from "@/types/components"
import { Star, Clock, Calendar } from "lucide-react"

export function MovieBanner({ movie, backdropUrl }: MovieBannerProps) {
  const formatRuntime = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }, [])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
  }, [])

  return (
    <div className="relative w-full h-[70vh] min-h-125 max-h-200 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-bg via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex items-end pb-12">
        <div className="flex gap-6 md:gap-8 w-full items-end">
          <div className="hidden md:block relative aspect-2/3 w-48 lg:w-56 shrink-0 rounded-lg overflow-hidden border-2 border-gold/50 shadow-cinema">
            <Image
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              fill
              className="object-fill"
              sizes="(max-width: 768px) 0px, 224px"
            />
          </div>

          <div className="flex-1 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4 drop-shadow-lg">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-xl md:text-2xl text-muted mb-6 italic">
                {movie.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4">
              <HeroBadge icon={<Star className="h-5 w-5 fill-gold text-gold" />}>
                <span className="font-semibold text-text">{movie.vote_average.toFixed(1)}</span>
              </HeroBadge>

              {movie.release_date && (
                <HeroBadge icon={<Calendar className="h-5 w-5 text-muted" />}>
                  <span className="text-text">{formatDate(movie.release_date)}</span>
                </HeroBadge>
              )}

              {movie.runtime > 0 && (
                <HeroBadge icon={<Clock className="h-5 w-5 text-muted" />}>
                  <span className="text-text">{formatRuntime(movie.runtime)}</span>
                </HeroBadge>
              )}

              {movie.certification && (
                <HeroBadge>
                  <span className="font-semibold text-text">{movie.certification}</span>
                </HeroBadge>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-red/20 text-red px-3 py-1.5 rounded-full text-sm font-medium border border-red/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroBadge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/20">
      {icon}
      {children}
    </div>
  )
}
