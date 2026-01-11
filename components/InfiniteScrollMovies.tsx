"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "@/lib/hooks"
import { Movie } from "@/lib/tmdb"
import { MovieGrid } from "@/components/MovieGrid"
import { Loader2 } from "lucide-react"
import { fetchMoreMovies } from "@/app/actions/movies"

interface InfiniteScrollMoviesProps {
  initialMovies: Movie[]
  category: string
}

export function InfiniteScrollMovies({ initialMovies, category }: InfiniteScrollMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  // Réinitialiser l'état quand la catégorie ou les films initiaux changent
  useEffect(() => {
    setMovies(initialMovies)
    setPage(2)
    setLoading(false)
    setHasMore(true)
  }, [category, initialMovies])

  useEffect(() => {
    const loadMore = async () => {
      if (loading || !hasMore) return

      setLoading(true)
      try {
        const newMovies = await fetchMoreMovies(category, page)
        
        if (newMovies.length === 0) {
          setHasMore(false)
        } else {
          // Filtrer les doublons potentiels
          setMovies((prev) => {
            const existingIds = new Set(prev.map(m => m.id))
            const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id))
            
            if (uniqueNewMovies.length === 0) {
              setHasMore(false)
              return prev
            }
            return [...prev, ...uniqueNewMovies]
          })
          setPage((prev) => prev + 1)
        }
      } catch (error) {
        console.error("Error loading more movies:", error)
      } finally {
        setLoading(false)
      }
    }

    if (inView) {
      loadMore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]) 


  return (
    <>
      <MovieGrid movies={movies} />
      
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-red-2" />
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-8 text-muted">
          Vous avez tout vu !
        </div>
      )}
    </>
  )
}
