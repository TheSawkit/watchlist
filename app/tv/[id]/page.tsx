import { notFound } from "next/navigation"
import type { Metadata } from "next"
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
import { filterAvailableVideos } from "@/lib/youtube"
import { getServerLocale, getTranslations } from "@/lib/i18n/server"
import type { TvPageProps } from "@/types/pages"
import type { Season } from "@/types/tmdb"

/**
 * Generates metadata for TV show detail page for SEO and social sharing.
 * Fetches TV show data and constructs OpenGraph and Twitter card information.
 *
 * @param props - Route parameters
 * @param props.params - Promise resolving to { id: string } TV show ID
 * @returns Metadata object with title, description, OpenGraph, and Twitter card data
 */
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://reelmark.app"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const tvId = parseInt(id)
    const t = await getTranslations()

    if (isNaN(tvId)) {
        return {
            title: "ReelMark",
            description: t.metadata.defaultTvDescription,
        }
    }

    try {
        const tvDetails = await getTvShowDetails(tvId)
        const backdropImage = tvDetails.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${tvDetails.backdrop_path}`
            : undefined

        const images = backdropImage ? [{ url: backdropImage, width: 1280, height: 720 }] : []
        const watchDescription = tvDetails.overview || t.metadata.watchShowOn.replace("${title}", tvDetails.name)

        return {
            title: tvDetails.name,
            description: watchDescription,
            alternates: { canonical: `${BASE_URL}/tv/${tvId}` },
            openGraph: {
                title: tvDetails.name,
                description: watchDescription,
                type: "video.tv_show",
                images: images.length > 0 ? images : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: tvDetails.name,
                description: watchDescription,
                images: images.length > 0 ? [images[0].url] : undefined,
            },
        }
    } catch {
        return {
            title: "ReelMark",
            description: t.metadata.defaultTvDescription,
        }
    }
}

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

    const candidateTrailers = videos
        .filter((video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"))
        .sort((a, b) => (b.official ? 1 : 0) - (a.official ? 1 : 0))

    const trailers = await filterAvailableVideos(candidateTrailers)

    const heroImagePath = selectHeroImage(images, tvDetails.backdrop_path)
    const heroImageUrl = getImageUrl(heroImagePath, "original")
    const watchlistEntry = await getMediaWatchlistEntry(tvId, "tv")
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
        <main className="min-h-screen">
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
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-auto">
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
                        </div>

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
                stickyActions={
                    <WatchButton
                        mediaId={tvDetails.id}
                        mediaTitle={tvDetails.name}
                        mediaType="tv"
                        posterPath={tvDetails.poster_path}
                        status={watchlistEntry?.status === "watched" ? "watched" : "to_watch"}
                        initialActive={!!watchlistEntry}
                        releaseDate={tvDetails.first_air_date}
                    />
                }
            />

            <div className="container mx-auto px-6 lg:px-12 py-12 md:py-16 space-y-14 md:space-y-16">
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
        </main>
    )
}
