import { notFound } from "next/navigation"
import { getImageUrl, getTvShowDetails, getTvShowCredits, getTvShowVideos, getTvShowImages, selectHeroImage } from "@/lib/tmdb"
import { MediaBanner } from "@/components/media/MediaBanner"
import { MediaTrailers } from "@/components/media/MediaTrailers"
import { MediaDescription } from "@/components/media/MediaDescription"
import { MediaCast } from "@/components/media/MediaCast"
import { WatchButton } from "@/components/media/WatchButton"
import { SeasonCard } from "@/components/media/SeasonCard"
import { ProgressBar } from "@/components/shared/ProgressBar"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { getMediaWatchlistEntry } from "@/app/actions/watchlist"
import { getTvShowWatchProgress } from "@/app/actions/episodes"
import { getServerLocale, getTranslations } from "@/lib/i18n/server"
import type { TvPageProps } from "@/types/pages"
import type { Season } from "@/types/tmdb"

export default async function TvShowPage(props: TvPageProps) {
    const params = await props.params
    const tvId = parseInt(params.id)

    if (isNaN(tvId)) {
        notFound()
    }

    let tvDetails, credits, videos, images

    try {
        [tvDetails, credits, videos, images] = await Promise.all([
            getTvShowDetails(tvId),
            getTvShowCredits(tvId),
            getTvShowVideos(tvId),
            getTvShowImages(tvId),
        ])
    } catch {
        notFound()
    }

    const trailers = videos.filter(
        (video) => video.type === "Trailer" || video.type === "Teaser"
    )

    const heroImagePath = selectHeroImage(images, tvDetails.backdrop_path)
    const heroImageUrl = getImageUrl(heroImagePath, "original")
    const watchlistEntry = await getMediaWatchlistEntry(tvId)
    const watchProgress = await getTvShowWatchProgress(tvId)
    const t = await getTranslations()
    const locale = await getServerLocale()

    const tvSeasons = tvDetails.seasons ?? []
    const standardSeasons = tvSeasons.filter((s: { season_number: number }) => s.season_number > 0)
    const totalEpisodes = standardSeasons
        .reduce((sum: number, s: { episode_count: number }) => sum + s.episode_count, 0)
    const totalWatched = Array.from(watchProgress.values()).reduce((sum, count) => sum + count, 0)
    const overallPercent = totalEpisodes > 0 ? Math.round((totalWatched / totalEpisodes) * 100) : 0

    return (
        <div className="min-h-screen">
            <MediaBanner
                title={tvDetails.name}
                tagline={tvDetails.tagline}
                backdropUrl={heroImageUrl}
                posterPath={tvDetails.poster_path}
                voteAverage={tvDetails.vote_average}
                releaseDate={tvDetails.first_air_date}
                runtime={tvDetails.episode_run_time?.[0]}
                certification={tvDetails.certification}
                genres={tvDetails.genres}
                actions={
                    <div className="flex flex-row items-center gap-3">
                        <WatchButton
                            mediaId={tvDetails.id}
                            mediaTitle={tvDetails.name}
                            mediaType="tv"
                            posterPath={tvDetails.poster_path}
                            status={watchlistEntry?.status === "watched" ? "watched" : "to_watch"}
                            variant="full"
                            initialActive={!!watchlistEntry}
                            releaseDate={tvDetails.first_air_date}
                        />

                        {totalWatched > 0 && (
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-md bg-surface/30 backdrop-blur-md border border-border/10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-muted">
                                        {totalWatched}/{totalEpisodes} {t.movie.episodes}
                                    </span>
                                    <ProgressBar
                                        watched={totalWatched}
                                        total={totalEpisodes}
                                        className="w-24 sm:w-32 h-1.5 bg-surface-3 rounded-full"
                                        innerClassName="bg-linear-to-r from-primary to-gold rounded-full"
                                    />
                                </div>
                                <span className="text-sm font-bold text-text">{overallPercent}%</span>
                            </div>
                        )}
                    </div>
                }
            />

            <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
                <MediaDescription description={tvDetails.overview} />

                {standardSeasons.length > 0 && (
                    <section className="space-y-6">
                        <SectionHeading>{t.movie.seasons}</SectionHeading>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {standardSeasons.map((season: Season) => {
                                const seasonWatched = watchProgress.get(season.season_number) ?? 0
                                return (
                                    <SeasonCard
                                        key={season.id}
                                        tvId={tvId}
                                        season={season as Season}
                                        seasonWatched={seasonWatched}
                                        locale={locale}
                                        labels={{
                                            episodes: t.movie.episodes,
                                            completed: `✓ ${t.movie.completed}`,
                                            watchedProgress: (w, total) => `${w}/${total} ${t.movie.watchedCount}`
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </section>
                )}

                {trailers.length > 0 && <MediaTrailers trailers={trailers} />}

                <MediaCast cast={credits.cast} />
            </div>
        </div>
    )
}
