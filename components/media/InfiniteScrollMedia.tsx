"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useInView } from "@/lib/hooks"
import type { MediaItem } from "@/types/tmdb"
import { MediaGrid } from "@/components/media/MediaGrid"
import { Loader2 } from "lucide-react"
import { fetchMoreMedia } from "@/app/actions/media"
import { useTranslation } from "@/lib/i18n/context"
import type { InfiniteScrollMediaProps } from "@/types/components"

export function InfiniteScrollMedia({ initialItems, category, clientSideData }: InfiniteScrollMediaProps) {
    const [items, setItems] = useState<MediaItem[]>(initialItems)
    const [page, setPage] = useState(2)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const loaderRef = useRef<HTMLDivElement>(null)
    const isLoaderVisible = useInView(loaderRef, { rootMargin: "0px 0px 200px 0px" })
    const { t } = useTranslation()

    const prevCategoryRef = useRef(category)

    useEffect(() => {
        if (prevCategoryRef.current !== category) {
            setItems(initialItems)
            setPage(2)
            setLoading(false)
            setHasMore(true)
            prevCategoryRef.current = category
        } else {
            setItems(prev => prev.map(item => {
                const refreshed = initialItems.find(i => i.id === item.id && i.media_type === item.media_type)
                if (refreshed && refreshed.watchlistEntry?.status !== item.watchlistEntry?.status) {
                    return { ...item, watchlistEntry: refreshed.watchlistEntry }
                }
                return item
            }))
        }
    }, [category, initialItems])

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            let newItems: MediaItem[]

            if (clientSideData) {
                const pageSize = 20
                const start = (page - 1) * pageSize
                newItems = clientSideData.slice(start, start + pageSize)
            } else {
                newItems = await fetchMoreMedia(category, page)
            }

            if (newItems.length === 0) {
                setHasMore(false)
                return
            }

            setItems((prev) => {
                const existingIds = new Set(prev.map((m) => `${m.media_type}-${m.id}`))
                const uniqueItems = newItems.filter((m) => !existingIds.has(`${m.media_type}-${m.id}`))
                if (uniqueItems.length === 0) {
                    setHasMore(false)
                    return prev
                }
                return [...prev, ...uniqueItems]
            })
            setPage((prev) => prev + 1)
        } catch (error) {
            console.warn('[InfiniteScroll] Load failed:', error)
            return
        } finally {
            setLoading(false)
        }
    }, [category, hasMore, loading, page, clientSideData])

    useEffect(() => {
        if (isLoaderVisible) loadMore()
    }, [isLoaderVisible, loadMore])

    return (
        <>
            <MediaGrid items={items} hideRating={category === "upcoming"} />

            {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8" role="status" aria-live="polite">
                    <Loader2 className="w-8 h-8 animate-spin text-red-2" aria-hidden="true" />
                    <span className="sr-only">{t.common.loading}</span>
                </div>
            )}

            {!hasMore && (
                <div className="text-center py-8 text-muted">{t.movie.scrollEnd}</div>
            )}
        </>
    )
}
