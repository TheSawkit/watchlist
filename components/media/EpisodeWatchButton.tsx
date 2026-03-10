"use client"

import { useState } from "react"
import { Eye, Check, Loader2 } from "lucide-react"
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
    const router = useRouter()
    const { t } = useTranslation()

    async function handleToggle() {
        setLoading(true)
        try {
            const newState = await toggleEpisodeWatch(tvId, seasonNumber, episodeNumber)
            setWatched(newState)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const Icon = loading ? Loader2 : watched ? Check : Eye

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-300",
                "border cursor-pointer",
                watched
                    ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red/20 hover:text-red hover:border-red/30"
                    : "bg-surface/50 border-border/30 text-muted hover:bg-red/20 hover:text-red hover:border-red/30"
            )}
        >
            <Icon className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            {watched ? t.movie.episodeWatched : t.movie.markEpisodeWatched}
        </button>
    )
}
