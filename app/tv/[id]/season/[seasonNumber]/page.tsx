import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTvShowDetails, getSeasonDetails, getImageUrl } from "@/lib/tmdb"
import { getServerLocale, getTranslations } from "@/lib/i18n/server"
import { formatDate } from "@/lib/format"
import { getSeasonEpisodeWatches } from "@/app/actions/episodes"
import { SeasonWatchButton } from "@/components/media/SeasonWatchButton"
import { EpisodeCard } from "@/components/media/EpisodeCard"
import type { SeasonPageProps } from "@/types/pages"

export default async function SeasonPage(props: SeasonPageProps) {
    const params = await props.params
    const tvId = parseInt(params.id)
    const seasonNumber = parseInt(params.seasonNumber)

    if (isNaN(tvId) || isNaN(seasonNumber)) {
        notFound()
    }

    let tvDetails, seasonDetails
    try {
        [tvDetails, seasonDetails] = await Promise.all([
            getTvShowDetails(tvId),
            getSeasonDetails(tvId, seasonNumber)
        ])
    } catch {
        notFound()
    }

    const t = await getTranslations()
    const locale = await getServerLocale()
    const watchedEpisodes = await getSeasonEpisodeWatches(tvId, seasonNumber)
    const watchedCount = watchedEpisodes.size

    return (
        <div className="min-h-screen bg-bg">
            <div className="container mx-auto px-6 lg:px-12 py-8 space-y-8">
                <Link
                    href={`/tv/${tvId}`}
                    className="inline-flex items-center gap-2 text-muted hover:text-red transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{t.movie.backTo} {tvDetails.name}</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative aspect-2/3 w-48 shrink-0 rounded-lg overflow-hidden border border-border/20 shadow-cinema hidden md:block">
                        {seasonDetails.poster_path ? (
                            <Image
                                src={getImageUrl(seasonDetails.poster_path, "w500")}
                                alt={seasonDetails.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 0px, 192px"
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-2 flex items-center justify-center text-muted text-center p-4">
                                {seasonDetails.name}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-text">
                            {seasonDetails.name}
                        </h1>
                        {seasonDetails.air_date && (
                            <p className="text-lg text-muted">
                                {formatDate(seasonDetails.air_date, locale)} &bull; {seasonDetails.episodes.length} {t.movie.episodes}
                            </p>
                        )}
                        {seasonDetails.overview ? (
                            <p className="text-muted leading-relaxed max-w-4xl">
                                {seasonDetails.overview}
                            </p>
                        ) : null}

                        <SeasonWatchButton
                            tvId={tvId}
                            seasonNumber={seasonNumber}
                            totalEpisodes={seasonDetails.episodes.length}
                            watchedCount={watchedCount}
                        />
                    </div>
                </div>

                <div className="w-full h-px bg-border/30 my-8" />

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-text">{t.movie.episodesCapitalized}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seasonDetails.episodes.map((episode) => {
                            const isWatched = watchedEpisodes.has(episode.episode_number)
                            return (
                                <EpisodeCard
                                    key={episode.id}
                                    tvId={tvId}
                                    seasonNumber={seasonNumber}
                                    episode={episode}
                                    isWatched={isWatched}
                                    locale={locale}
                                    labels={{
                                        noImage: t.movie.noImage,
                                        noDescription: t.movie.noDescription
                                    }}
                                />
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}
