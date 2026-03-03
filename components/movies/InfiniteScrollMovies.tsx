"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInView } from "@/lib/hooks"
import { Movie } from "@/types/tmdb"
import { MovieGrid } from "@/components/movies/MovieGrid"
import { Loader2 } from "lucide-react"
import { fetchMoreMovies } from "@/app/actions/movies"
import { useTranslation } from "@/lib/i18n/context"
import type { InfiniteScrollMoviesProps } from "@/types/components"

export function InfiniteScrollMovies({ initialMovies, category, clientSideData }: InfiniteScrollMoviesProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies)
    const [page, setPage] = useState(2)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { rootMargin: "0px 0px 200px 0px" })
    const { t } = useTranslation()

    useEffect(() => {
        setMovies(initialMovies)
        setPage(2)
        setLoading(false)
        setHasMore(true)
    }, [category, initialMovies])

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            let newMovies: Movie[] = []

            if (clientSideData) {
                const pageSize = 20
                const start = (page - 1) * pageSize
                const end = start + pageSize
                newMovies = clientSideData.slice(start, end)
                await new Promise((resolve) => setTimeout(resolve, 500))
            } else {
                newMovies = await fetchMoreMovies(category, page)
            }

            if (newMovies.length === 0) {
                setHasMore(false)
            } else {
                setMovies((prev) => {
                    const existingIds = new Set(prev.map((movie) => movie.id))
                    const uniqueNewMovies = newMovies.filter((movie) => !existingIds.has(movie.id))
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
    }, [category, hasMore, loading, page, clientSideData])

    useEffect(() => {
        if (inView) loadMore()
    }, [inView, loadMore])

    return (
        <>
            <MovieGrid movies={movies} />

            {hasMore && (
                <div ref={ref} className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-red-2" />
                </div>
            )}

            {!hasMore && (
                <div className="text-center py-8 text-muted">{t.movie.scrollEnd}</div>
            )}
        </>
    )
}
