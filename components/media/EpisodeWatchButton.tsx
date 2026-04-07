"use client"

import { useState } from "react"
import { Eye, Check, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleEpisodeWatch } from "@/app/actions/episodes"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/context"

interface EpisodeWatchButtonProps {
    tvId: number
    seasonNumber: number
    episodeNumber: number
    initialWatched: boolean
}

export function EpisodeWatchButton({
    tvId,
    seasonNumber,
    episodeNumber,
    initialWatched,
}: EpisodeWatchButtonProps) {
    const [watched, setWatched] = useState(initialWatched)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()

    async function handleToggle(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        
        setLoading(true)
        setError(false)
        try {
            const newState = await toggleEpisodeWatch(tvId, seasonNumber, episodeNumber)
            setWatched(newState)
            router.refresh()
        } catch {
            setError(true)
            setTimeout(() => setError(false), 3000)
        } finally {
            setLoading(false)
        }
    }

    const Icon = loading ? Loader2 : error ? XCircle : watched ? Check : Eye

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            aria-label={watched ? t.movie.episodeWatched : t.movie.markEpisodeWatched}
            className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
                watched
                    ? "bg-primary/40 backdrop-blur-2xl text-white border-border/10 border-t-border/20 shadow-glow-red"
                    : "bg-surface/20 backdrop-blur-2xl text-muted border-border/10 border-t-border/20 hover:text-text hover:bg-surface-2/20 hover:border-border shadow-card-sm"
            )}
        >
            <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
            {error ? t.common.actionError : watched ? t.movie.episodeWatched : t.movie.markEpisodeWatched}
        </button>
    )
}
