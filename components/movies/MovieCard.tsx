"use client"

import Image from "next/image"
import Link from "next/link"
import { getImageUrl, type Movie } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { Plus, Star, Info, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: Movie
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
}

export function MovieCard({ movie, className, isExpanded = false, onToggle }: MovieCardProps) {
  const handleClick = () => {
    onToggle?.()
  }

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-(--radius-cinema) bg-surface transition-all duration-300 hover:shadow-cinema hover:scale-[1.02] transform cursor-pointer",
        className
      )}
      onClick={handleClick}
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
          "md:group-hover:opacity-100",
          isExpanded && "opacity-100 md:opacity-0"
        )} />

          <div className={cn(
            "absolute top-3 left-3 z-10 transition-all duration-300",
            "translate-y-0 opacity-0 group-hover:-translate-y-1 group-hover:opacity-100",
            "md:group-hover:-translate-y-1 md:group-hover:opacity-100",
            isExpanded && "-translate-y-1 opacity-100 md:translate-y-0 md:opacity-0"
          )}>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-surface/40 text-text backdrop-blur-md border border-border/10 hover:bg-surface/60 hover:text-text transition-colors cursor-pointer"
              title="Marquer comme vu"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className={cn(
            "absolute top-3 right-3 z-10 transition-all duration-300 pointer-events-none",
            "translate-y-0 group-hover:-translate-y-1",
            "md:group-hover:-translate-y-1",
            isExpanded && "-translate-y-1 md:translate-y-0"
          )}>
            <div className="flex items-center gap-1 rounded-full bg-surface/40 px-2 py-1 text-xs font-bold text-gold backdrop-blur-md border border-(--gold)/20 shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-text">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

        <div className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 transition-all duration-300",
          "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
          "md:group-hover:translate-y-0 md:group-hover:opacity-100",
          isExpanded && "translate-y-0 opacity-100 md:translate-y-4 md:opacity-0"
        )}>
          <div>
            <h3 className="text-lg font-bold text-text leading-tight line-clamp-2">
              {movie.title}
            </h3>
            <p className="mt-1 text-xs text-muted line-clamp-2">
              {movie.overview?movie.overview:"Aucune description disponible"}
            </p>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" className="flex-1 gap-2 bg-red hover:bg-red-2 text-text border-none shadow-cinema cursor-pointer">
              <Plus className="h-4 w-4 fill-current" />
              <span className="hidden md:inline">Ajouter</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 gap-2 border-border/20 bg-surface/40 text-text hover:bg-surface-2/60 hover:text-text backdrop-blur-md cursor-pointer" asChild>
              <Link href={`/movie/${movie.id}`}>
                <Info className="h-4 w-4" />
                Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
