"use client"

import { useState } from "react"
import { Eye, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { markSeasonWatched } from "@/app/actions/episodes"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/context"

interface SeasonWatchIconProps {
    tvId: number
    seasonNumber: number
    totalEpisodes: number
    watchedCount: number
}

export function SeasonWatchIcon({
    tvId,
    seasonNumber,
    totalEpisodes,
    watchedCount,
}: SeasonWatchIconProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()

    const allWatched = watchedCount === totalEpisodes && totalEpisodes > 0

    async function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)
        try {
            await markSeasonWatched(tvId, seasonNumber, totalEpisodes)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const Icon = loading ? Loader2 : allWatched ? Check : Eye

    return (
        <button
            onClick={handleClick}
            title={allWatched ? t.movie.markUnwatched : t.movie.markSeasonWatched}
            className={cn(
                "h-8 w-8 rounded-full backdrop-blur-md border",
                "flex items-center justify-center transition-all duration-300 cursor-pointer",
                allWatched
                    ? "bg-green-500/30 text-green-400 border-green-500/30 hover:bg-red/30 hover:text-red hover:border-red/30"
                    : "bg-surface/40 text-text border-border/10 hover:bg-red/30 hover:text-red hover:border-red/30"
            )}
        >
            <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
    )
}
