"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
}: WatchButtonProps) {
    const [optimisticActive, setOptimisticActive] = useState<boolean | null>(null)
    const active = optimisticActive !== null ? optimisticActive : initialActive

    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const router = useRouter()

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        setLoading(true)
        try {
            if (active) {
                if (fallbackStatus) {
                    await addToWatchlist(mediaId, mediaTitle, posterPath, fallbackStatus, mediaType)
                } else {
                    await removeFromWatchlist(mediaId)
                }
            } else {
                await addToWatchlist(mediaId, mediaTitle, posterPath, status, mediaType)
            }
            setOptimisticActive(!active)
            router.refresh()
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
                    "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                        ? "bg-surface-2 text-muted hover:bg-red/20 hover:text-red"
                        : "bg-red hover:bg-red-2 text-text shadow-cinema"
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
            title={
                status === "watched" ? t.movie.markAsWatched : t.movie.addToList
            }
            className={cn(
                "h-8 w-8 rounded-full bg-surface/40 backdrop-blur-md border border-border/10",
                "flex items-center justify-center transition-colors",
                active ? "bg-red/30 text-red border-red/30" : "text-text hover:bg-surface/60"
            )}
        >
            <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
    )
}
