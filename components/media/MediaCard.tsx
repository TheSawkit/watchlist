"use client"

import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb/images"
import { Star, Eye, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { WatchButton } from "@/components/media/WatchButton"
import { useTranslation } from "@/lib/i18n/context"
import { getLocale } from "@/lib/i18n/utils"
import { formatShortDate } from "@/lib/format"
import type { MediaCardProps, WatchlistEntry } from "@/types/components"

interface Props extends MediaCardProps {
    watchlistEntry?: WatchlistEntry
    hideRating?: boolean
    tvProgress?: { watched: number; total: number }
}

export function MediaCard({ media, className, watchlistEntry, hideRating, tvProgress }: Props) {
    const { t, lang } = useTranslation()
    const locale = getLocale(lang)

    const href = media.media_type === "tv" ? `/tv/${media.id}` : `/movie/${media.id}`
    const isWatched = watchlistEntry?.status === "watched"

    return (
        <Link
            href={href}
            className={cn(
                "group relative overflow-hidden rounded-(--radius-cinema) bg-surface transition-all duration-300 hover:shadow-cinema hover:scale-[1.02] transform cursor-pointer block",
                className
            )}
        >
            <div className="relative aspect-2/3 w-full overflow-hidden">
                <Image
                    src={getImageUrl(media.poster_path)}
                    alt={media.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />

                <div className={cn(
                    "absolute inset-0 bg-linear-to-t from-surface/90 via-surface/50 to-transparent transition-opacity duration-300",
                    "opacity-0 group-hover:opacity-100",
                )} />

                {tvProgress && tvProgress.total > 0 && (
                    <div className="absolute bottom-0 inset-x-0 z-20">
                        <div className="w-full h-1 bg-white/10">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    tvProgress.watched === tvProgress.total
                                        ? "bg-green-400"
                                        : "bg-linear-to-r from-red to-gold"
                                )}
                                style={{ width: `${Math.min(100, Math.round((tvProgress.watched / tvProgress.total) * 100))}%` }}
                            />
                        </div>
                    </div>
                )}

                {media.media_type === "movie" && (!watchlistEntry || !isWatched) && (
                    <div className={cn(
                        "absolute top-3 left-3 z-10 transition-all duration-300",
                        "translate-y-0 opacity-0 group-hover:-translate-y-1 group-hover:opacity-100",
                    )}>
                        <WatchButton
                            mediaId={media.id}
                            mediaTitle={media.title}
                            mediaType={media.media_type}
                            posterPath={media.poster_path}
                            status="watched"
                            variant="icon"
                            initialActive={false}
                            fallbackStatus={watchlistEntry ? "to_watch" : undefined}
                        />
                    </div>
                )}

                {!hideRating && (
                    <div className={cn(
                        "absolute top-3 right-3 z-10 transition-all duration-300 pointer-events-none",
                        "translate-y-0 group-hover:-translate-y-1",
                    )}>
                        <div className="flex items-center gap-1 rounded-full bg-surface/40 px-2 py-1 text-xs font-bold text-gold backdrop-blur-md border border-(--gold)/20 shadow-sm">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-text">{(media.vote_average || 0).toFixed(1)}</span>
                        </div>
                    </div>
                )}

                <div className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 transition-all duration-300 z-10",
                    "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                )}>
                    <div>
                        <h3 className="text-lg font-bold text-text leading-tight line-clamp-2">
                            {media.title}
                        </h3>

                        {watchlistEntry ? (
                            <div className="flex items-center gap-1.5 mt-1">
                                {media.media_type === "tv" ? (
                                    <Clock className="h-3 w-3 text-muted shrink-0" />
                                ) : isWatched ? (
                                    <Eye className="h-3 w-3 text-muted shrink-0" />
                                ) : (
                                    <Clock className="h-3 w-3 text-muted shrink-0" />
                                )}
                                <span className="text-xs text-muted leading-tight">
                                    {media.media_type === "tv"
                                        ? t.movie.startedOn
                                        : (isWatched ? t.movie.watchedOn : t.movie.addedOn)}{" "}
                                    {formatShortDate(watchlistEntry.created_at, locale)}
                                </span>
                            </div>
                        ) : (
                            <p className="mt-1 text-xs text-muted line-clamp-2">
                                {media.overview || t.movie.noDescription}
                            </p>
                        )}
                    </div>

                    <WatchButton
                        mediaId={watchlistEntry?.media_id ?? media.id}
                        mediaTitle={watchlistEntry?.media_title ?? media.title}
                        mediaType={watchlistEntry?.media_type ?? media.media_type}
                        posterPath={watchlistEntry?.poster_path ?? media.poster_path}
                        status={media.media_type === "tv"
                            ? "to_watch"
                            : (watchlistEntry ? watchlistEntry.status : "to_watch")}
                        initialActive={!!watchlistEntry}
                        fallbackStatus={media.media_type === "movie" && isWatched ? "to_watch" : undefined}
                        variant="full"
                    />
                </div>
            </div>
        </Link>
    )
}
