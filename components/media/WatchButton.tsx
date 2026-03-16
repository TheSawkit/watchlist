"use client"

import { useState, useEffect } from "react"
import { Eye, Plus, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { addToWatchlist, removeFromWatchlist } from "@/app/actions/watchlist"
import { useTranslation } from "@/lib/i18n/context"
import type { WatchButtonProps } from "@/types/components"

export function WatchButton({
    mediaId,
    mediaTitle,
    mediaType,
    posterPath,
    status,
    initialActive = false,
    variant = "icon",
    fallbackStatus,
    releaseDate,
}: WatchButtonProps) {
    const [optimisticActive, setOptimisticActive] = useState<boolean | null>(null)
    const active = optimisticActive !== null ? optimisticActive : initialActive
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        setOptimisticActive(null)
    }, [initialActive])

    const isUnreleased = releaseDate ? new Date(releaseDate) > new Date() : false

    if (status === "watched" && isUnreleased && !active) {
        return null
    }

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        setLoading(true)
        try {
            if (active) {
                if (fallbackStatus) {
                    await addToWatchlist(mediaId, mediaTitle, posterPath, fallbackStatus, mediaType)
                } else {
                    await removeFromWatchlist(mediaId, mediaType)
                }
            } else {
                await addToWatchlist(mediaId, mediaTitle, posterPath, status, mediaType)
            }
            setOptimisticActive(!active)
        } finally {
            setLoading(false)
        }
    }

    const Icon = loading ? Loader2 : active ? Check : status === "watched" ? Eye : Plus

    if (variant === "full") {
        return (
            <button
                onClick={handleClick}
                className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-11 w-full shrink-0",
                    active
                        ? "bg-primary/50 backdrop-blur-2xl text-white border-white/10 shadow-glow-red"
                        : "bg-white/15 backdrop-blur-2xl text-white/90 border-white/10 hover:bg-white/25 hover:text-white shadow-card-sm"
                )}
            >
                <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
                {active
                    ? status === "watched"
                        ? t.movie.watched
                        : t.movie.added
                    : status === "watched"
                        ? t.movie.markAsWatched
                        : t.movie.addToList}
            </button>
        )
    }

    return (
        <button
            onClick={handleClick}
            aria-label={
                status === "watched" ? t.movie.markAsWatched : t.movie.addToList
            }
            title={
                status === "watched" ? t.movie.markAsWatched : t.movie.addToList
            }
            className={cn(
                "h-12 w-12 rounded-full backdrop-blur-2xl border",
                "flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                active
                    ? "bg-primary/40 text-white border-border/10 border-t-border/20 shadow-glow-red"
                    : "bg-surface/20 text-muted border-border/10 border-t-border/20 hover:text-text hover:bg-surface-2/20 shadow-card-sm hover:border-border"
            )}
        >
            <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
    )
}
