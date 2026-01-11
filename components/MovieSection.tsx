"use client"

import Link from "next/link"
import { useRef } from "react"
import { Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/MovieCard"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieSectionProps {
  title: string
  movies: Movie[]
  categoryUrl: string
}

export function MovieSection({ title, movies, categoryUrl }: MovieSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="mb-8 group/section">
      <div className="flex items-center justify-between mb-4 px-1">
        <Link href={categoryUrl} className="group/title flex items-center gap-2">
          <h2 className="text-2xl font-bold group-hover/title:text-red-2 transition-colors">{title}</h2>
          <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-red-2" />
        </Link>
        
        <div className="hidden md:flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-surface/50 backdrop-blur-sm border-border/50 hover:bg-surface hover:text-red-2"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-surface/50 backdrop-blur-sm border-border/50 hover:bg-surface hover:text-red-2"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="flex-none w-[160px] md:w-[200px] snap-start"
          >
            <MovieCard movie={movie} className="h-full" />
          </div>
        ))}

        <Link 
          href={categoryUrl}
          className="flex-none w-[160px] md:w-[200px] snap-start flex flex-col items-center justify-center gap-4 rounded-(--radius-cinema) bg-surface-2/30 hover:bg-surface-2/50 border-2 border-dashed border-border/30 hover:border-red-2/50 transition-all group/card cursor-pointer"
        >
          <div className="rounded-full bg-surface-2 p-4 group-hover/card:bg-red-2 group-hover/card:text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
          </div>
          <span className="font-semibold text-muted group-hover/card:text-text transition-colors">Voir tout</span>
        </Link>
      </div>
    </div>
  )
}
