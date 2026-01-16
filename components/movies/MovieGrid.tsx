"use client"

import { useState } from "react"
import { Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/movies/MovieCard"

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <MovieCard 
            movie={movie}
            isExpanded={expandedMovieId === movie.id}
            onToggle={() => setExpandedMovieId(expandedMovieId === movie.id ? null : movie.id)}
          />
        </div>
      ))}
    </div>
  )
}
