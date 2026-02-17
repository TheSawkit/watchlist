"use client"


import { MovieCard } from "@/components/movies/MovieCard"
import type { MovieGridProps } from "@/types/components"

export function MovieGrid({ movies }: MovieGridProps) {
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
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}
