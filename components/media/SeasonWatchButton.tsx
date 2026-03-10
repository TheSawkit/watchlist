"use client"

import { useState } from "react"
import { CheckCheck, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { markSeasonWatched } from "@/app/actions/episodes"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/context"

interface SeasonWatchButtonProps {
    tvId: number
    seasonNumber: number
    totalEpisodes: number
    watchedCount: number
}

export function SeasonWatchButton({
    tvId,
    seasonNumber,
    totalEpisodes,
    watchedCount,
}: SeasonWatchButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()

    const allWatched = watchedCount === totalEpisodes && totalEpisodes > 0

    async function handleClick() {
        setLoading(true)
        try {
            await markSeasonWatched(tvId, seasonNumber, totalEpisodes)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const Icon = loading ? Loader2 : CheckCheck

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                "border cursor-pointer",
                allWatched
                    ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-red/20 hover:text-red hover:border-red/30"
                    : "bg-red hover:bg-red-2 text-text border-transparent shadow-cinema"
            )}
        >
            <Icon className={cn("h-4 w-4", loading && "animate-spin")} />
            {allWatched
                ? `${t.movie.seasonComplete} (${watchedCount}/${totalEpisodes})`
                : `${t.movie.markAllWatched} (${watchedCount}/${totalEpisodes})`}
        </button>
    )
}
