"use client"

import Link from "next/link"
import { useState } from "react"
import { Movie } from "@/types/tmdb"
import { MovieCard } from "@/components/movies/MovieCard"
import { ArrowRight } from "lucide-react"
import { HorizontalScroll } from "@/components/shared/HorizontalScroll"

interface MovieSectionProps {
  title: string
  movies: Movie[]
  categoryUrl: string
}

export function MovieSection({ title, movies, categoryUrl }: MovieSectionProps) {
  const [expandedMovieId, setExpandedMovieId] = useState<number | null>(null)

  return (
    <HorizontalScroll
      className="mb-8"
      scrollAmount={500}
      title={
        <Link href={categoryUrl} className="group/title flex items-center gap-2">
          <h2 className="text-2xl font-bold group-hover/title:text-red-2 transition-colors">{title}</h2>
          <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-red-2" />
        </Link>
      }
    >
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="flex-none w-40 md:w-50 snap-start"
          style={{
            animation: `slideUp 0.5s ease-out forwards`,
            animationDelay: `${index * 50}ms`,
            opacity: 0,
          }}
        >
          <MovieCard
            movie={movie}
            className="h-full"
            isExpanded={expandedMovieId === movie.id}
            onToggle={() => setExpandedMovieId(expandedMovieId === movie.id ? null : movie.id)}
          />
        </div>
      ))}

      <Link
        href={categoryUrl}
        className="flex-none w-40 md:w-50 snap-start flex flex-col items-center justify-center gap-4 rounded-(--radius-cinema) bg-surface-2/30 hover:bg-surface-2/50 border-2 border-dashed border-border/30 hover:border-red-2/50 transition-all group/card cursor-pointer"
      >
        <div className="rounded-full bg-surface-2 p-4 group-hover/card:bg-red-2 group-hover/card:text-text transition-colors">
          <ArrowRight className="w-6 h-6" />
        </div>
        <span className="font-semibold text-muted group-hover/card:text-text transition-colors">Voir tout</span>
      </Link>
    </HorizontalScroll>
  )
}
