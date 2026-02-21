import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"
import { WatchButton } from "@/components/movies/WatchButton"
import { cn } from "@/lib/utils"
import { Eye, Clock } from "lucide-react"
import type { WatchlistEntry } from "@/types/components"

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

interface LibraryCardProps {
    entry: WatchlistEntry
    className?: string
}

export function LibraryCard({ entry, className }: LibraryCardProps) {
    const isWatched = entry.status === "watched"

    return (
        <Link
            href={`/movie/${entry.movie_id}`}
            className={cn(
                "group relative overflow-hidden rounded-(--radius-cinema) bg-surface transition-all duration-300 hover:shadow-cinema hover:scale-[1.02] transform cursor-pointer block",
                className
            )}
        >
            <div className="relative aspect-2/3 w-full overflow-hidden">
                <Image
                    src={getImageUrl(entry.poster_path)}
                    alt={entry.movie_title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />

                <div className={cn(
                    "absolute inset-0 bg-linear-to-t from-surface/90 via-surface/50 to-transparent transition-opacity duration-300",
                    "opacity-0 group-hover:opacity-100",
                    "md:group-hover:opacity-100"
                )} />

                <div className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 transition-all duration-300 z-10",
                    "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                    "md:group-hover:translate-y-0 md:group-hover:opacity-100"
                )}>
                    <div>
                        <h3 className="text-lg font-bold text-text leading-tight line-clamp-2">
                            {entry.movie_title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            {isWatched
                                ? <Eye className="h-3 w-3 text-muted shrink-0" />
                                : <Clock className="h-3 w-3 text-muted shrink-0" />
                            }
                            <span className="text-xs text-muted leading-tight">
                                {isWatched ? "Vu le" : "Ajouté le"} {formatDate(entry.created_at)}
                            </span>
                        </div>
                    </div>

                    <WatchButton
                        movieId={entry.movie_id}
                        movieTitle={entry.movie_title}
                        posterPath={entry.poster_path}
                        status={entry.status}
                        initialActive={true}
                        fallbackStatus={isWatched ? "to_watch" : undefined}
                        variant="full"
                    />
                </div>

                {!isWatched && (
                    <div className={cn(
                        "absolute top-3 left-3 z-10 transition-all duration-300",
                        "translate-y-0 opacity-0 group-hover:-translate-y-1 group-hover:opacity-100",
                        "md:group-hover:-translate-y-1 md:group-hover:opacity-100"
                    )}>
                        <WatchButton
                            movieId={entry.movie_id}
                            movieTitle={entry.movie_title}
                            posterPath={entry.poster_path}
                            status="watched"
                            initialActive={false}
                            fallbackStatus="to_watch"
                            variant="icon"
                        />
                    </div>
                )}
            </div>
        </Link>
    )
}