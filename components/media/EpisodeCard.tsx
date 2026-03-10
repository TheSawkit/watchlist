import Image from "next/image"
import { Clock, Calendar, Star } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb/images"
import { formatDate, formatRuntime } from "@/lib/format"
import { EpisodeWatchButton } from "@/components/media/EpisodeWatchButton"
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
    labels = {
        noImage: "Pas d'image",
        noDescription: "Aucune description disponible.",
    }
}: EpisodeCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col overflow-hidden bg-surface-2 rounded-xl transition-all duration-300 hover:shadow-cinema border group",
                isWatched
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border/10 hover:border-border/30"
            )}
        >
            <div className="relative aspect-video w-full bg-surface overflow-hidden">
                {episode.still_path ? (
                    <Image
                        src={getImageUrl(episode.still_path, "w780")}
                        alt={episode.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                        <span className="text-sm">{labels.noImage}</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-bg/80 backdrop-blur text-text font-bold text-sm px-2 py-1 rounded">
                    E{episode.episode_number.toString().padStart(2, '0')}
                </div>
                <div className={cn(
                    "absolute top-2 right-2 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-full border border-border/20",
                    "flex items-center gap-1 text-xs font-bold text-gold"
                )}>
                    <Star className="h-3 w-3 fill-current" />
                    <span>{(episode.vote_average || 0).toFixed(1)}</span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-text mb-2 line-clamp-1">
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
                <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                    {episode.overview || labels.noDescription}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-end">
                    <EpisodeWatchButton
                        tvId={tvId}
                        seasonNumber={seasonNumber}
                        episodeNumber={episode.episode_number}
                        initialWatched={isWatched}
                    />
                </div>
            </div>
        </div>
    )
}
