import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTvShowDetails, getSeasonDetails } from "@/lib/tmdb"
import { getServerLocale, getTranslations } from "@/lib/i18n/server"
import { getSeasonEpisodeWatches } from "@/app/actions/episodes"
import { SeasonWatchButton } from "@/components/media/SeasonWatchButton"
import { EpisodeCard } from "@/components/media/EpisodeCard"
import { ProgressBar } from "@/components/shared/ProgressBar"
import { SectionHeading } from "@/components/ui/SectionHeading"
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
        <div className="min-h-screen bg-app-bg pb-20">
            <div className="sticky top-16 z-30 w-full bg-surface/40 backdrop-blur-2xl border-b border-border/10 shadow-navbar animate-in fade-in slide-in-from-top-4 duration-(--duration-slowest)">
                <div className="container mx-auto px-4 md:px-6 lg:px-12 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <div className="space-y-1 md:space-y-2">
                            <Link
                                href={`/tv/${tvId}`}
                                className="inline-flex items-center gap-2 text-muted hover:text-text transition-colors text-sm font-medium group"
                            >
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                <span>{t.movie.backTo} {tvDetails.name}</span>
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">
                                {seasonDetails.name}
                            </h1>
                        </div>

                        <div className="flex flex-row flex-wrap items-center gap-4">
                            <SeasonWatchButton
                                tvId={tvId}
                                seasonNumber={seasonNumber}
                                totalEpisodes={seasonDetails.episodes.length}
                                watchedCount={watchedCount}
                            />
                            {watchedCount > 0 && (
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-2/10 border border-border shadow-inner">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wider font-bold text-muted">
                                            {watchedCount}/{seasonDetails.episodes.length} {t.movie.episodes}
                                        </span>
                                        <ProgressBar
                                            watched={watchedCount}
                                            total={seasonDetails.episodes.length}
                                            className="w-24 sm:w-32 h-1 bg-border-subtle rounded-full"
                                            innerClassName="bg-linear-to-r from-primary to-gold rounded-full"
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-text">
                                        {Math.round((watchedCount / seasonDetails.episodes.length) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 py-10 space-y-12">
                {seasonDetails.overview && (
                    <div className="max-w-4xl space-y-4">
                        <SectionHeading>{t.explorer.overview}</SectionHeading>
                        <p className="text-lg text-muted leading-relaxed font-light">
                            {seasonDetails.overview}
                        </p>
                    </div>
                )}

                <div className="w-full h-px bg-border/10 my-8" />

                <section className="space-y-6">
                    <div className="flex items-end justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold text-text">
                            {t.movie.episodesCapitalized} <span className="text-muted text-xl font-normal ml-2">({seasonDetails.episodes.length})</span>
                        </h2>
                    </div>
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
