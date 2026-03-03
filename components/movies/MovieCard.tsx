"use client"

import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb-image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MovieCardProps } from "@/types/components"
import { WatchButton } from "@/components/movies/WatchButton"
import { useTranslation } from "@/lib/i18n/context"

export function MovieCard({ movie, className }: MovieCardProps) {
  const { t } = useTranslation()
  return (
    <Link
      href={`/movie/${movie.id}`}
      className={cn(
        "group relative overflow-hidden rounded-(--radius-cinema) bg-surface transition-all duration-300 hover:shadow-cinema hover:scale-[1.02] transform cursor-pointer block",
        className
      )}
    >
      <div className="relative aspect-2/3 w-full overflow-hidden">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className={cn(
          "absolute inset-0 bg-linear-to-t from-surface/90 via-surface/50 to-transparent transition-opacity duration-300",
          "opacity-0 group-hover:opacity-100",
          "md:group-hover:opacity-100"
        )} />

        <div className={cn(
          "absolute top-3 left-3 z-10 transition-all duration-300",
          "translate-y-0 opacity-0 group-hover:-translate-y-1 group-hover:opacity-100",
          "md:group-hover:-translate-y-1 md:group-hover:opacity-100"
        )}>
          <WatchButton
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
            status="watched"
            variant="icon"
          />
        </div>

        <div className={cn(
          "absolute top-3 right-3 z-10 transition-all duration-300 pointer-events-none",
          "translate-y-0 group-hover:-translate-y-1",
          "md:group-hover:-translate-y-1"
        )}>
          <div className="flex items-center gap-1 rounded-full bg-surface/40 px-2 py-1 text-xs font-bold text-gold backdrop-blur-md border border-(--gold)/20 shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-text">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        <div className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 transition-all duration-300",
          "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
          "md:group-hover:translate-y-0 md:group-hover:opacity-100"
        )}>
          <div>
            <h3 className="text-lg font-bold text-text leading-tight line-clamp-2">
              {movie.title}
            </h3>
            <p className="mt-1 text-xs text-muted line-clamp-2">
              {movie.overview ? movie.overview : t.movie.noDescription}
            </p>
          </div>

          <WatchButton
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
            status="to_watch"
            variant="full"
          />
        </div>
      </div>
    </Link>
  )
}
