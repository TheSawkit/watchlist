"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Calendar, Star } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb/images"
import { formatDate, formatRuntime } from "@/lib/format"
import { EpisodeWatchButton } from "@/components/media/EpisodeWatchButton"
import { useTranslation } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import type { Episode } from "@/types/tmdb"

interface EpisodeCardProps {
    tvId: number
    seasonNumber: number
    episode: Episode
    isWatched: boolean
    locale: string
    labels?: {
        noImage: string
        noDescription: string
    }
}

export function EpisodeCard({
    tvId,
    seasonNumber,
    episode,
    isWatched,
    locale,
    labels,
}: EpisodeCardProps) {
    const { t } = useTranslation()
    const [isExpanded, setIsExpanded] = useState(false)

    const noImage = labels?.noImage ?? t.movie.noImage
    const noDescription = labels?.noDescription ?? t.movie.noDescription

    return (
        <div
            className={cn(
                "relative flex flex-col overflow-hidden bg-surface/20 backdrop-blur-2xl rounded-poster transition-all duration-(--duration-base) hover:shadow-glow-gold shadow-card border border-border/10 border-t-border/20 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                isWatched
                    ? "border-primary/40"
                    : "hover:border-gold/40 hover:border-t-gold/60"
            )}
        >
            <div className="relative aspect-video w-full bg-background overflow-hidden">
                {episode.still_path ? (
                    <Image
                        src={getImageUrl(episode.still_path, "w780")}
                        alt={episode.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-(--duration-slow)"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                        <span className="text-sm">{noImage}</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-surface/20 backdrop-blur-2xl border border-border/10 border-t-border/20 shadow-card-sm text-text font-bold text-sm px-2 py-1 rounded">
                    E{episode.episode_number.toString().padStart(2, "0")}
                </div>
                <div className={cn(
                    "absolute top-2 right-2 bg-surface/20 backdrop-blur-2xl px-2 py-1 rounded border border-border/10 border-t-border/20 shadow-card-sm",
                    "flex items-center gap-1 text-xs font-bold text-gold"
                )}>
                    <Star className="h-3 w-3 fill-current" />
                    <span>{(episode.vote_average || 0).toFixed(1)}</span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-1">
                    {episode.name}
                </h3>
                <div className="flex items-center gap-4 text-xs text-muted mb-3 font-medium">
                    {episode.air_date && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(episode.air_date, locale)}
                        </span>
                    )}
                    {episode.runtime && episode.runtime > 0 ? (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRuntime(episode.runtime)}
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted leading-relaxed line-clamp-3">
                        {episode.overview || noDescription}
                    </p>
                    {episode.overview && episode.overview.length > 120 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setIsExpanded(true)
                            }}
                            className="text-text-main text-xs font-semibold self-start hover:text-primary transition-colors cursor-pointer mt-1"
                        >
                            {t.movie.readMore}
                        </button>
                    )}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-end relative z-10">
                    <EpisodeWatchButton
                        tvId={tvId}
                        seasonNumber={seasonNumber}
                        episodeNumber={episode.episode_number}
                        initialWatched={isWatched}
                    />
                </div>
            </div>

            {isExpanded && (
                <div
                    onClick={() => setIsExpanded(false)}
                    className="absolute inset-0 z-30 bg-surface/40 backdrop-blur-3xl border border-border/10 border-t-border/20 flex flex-col p-6 animate-in fade-in duration-(--duration-base) cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="text-lg font-bold text-text-main leading-tight">{episode.name}</h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsExpanded(false)
                            }}
                            className="h-8 w-8 flex items-center justify-center shrink-0 rounded-full bg-border-subtle hover:bg-border text-muted hover:text-text-main transition-colors cursor-pointer"
                            aria-label="Fermer"
                        >
                            ✕
                        </button>
                    </div>
                    <div
                        className="overflow-y-auto flex-1 pr-2 cursor-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-sm text-text-main leading-relaxed cursor-text selection:bg-primary/30">
                            {episode.overview || noDescription}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
