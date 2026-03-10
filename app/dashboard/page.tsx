import Link from "next/link"
import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { getUserWatchlist } from "@/app/actions/watchlist"
import {
    getMovieRecommendations,
    getSimilarMovies,
    getTvShowRecommendations,
    getSimilarTvShows,
    movieToMediaItem,
    tvShowToMediaItem
} from "@/lib/tmdb"
import { MediaSection, LibraryMediaSection } from "@/components/media/MediaSection"
import { getTranslations } from "@/lib/i18n/server"
import { MediaTypeSwitcher } from "@/components/media/MediaTypeSwitcher"
import type { Movie, TvShow } from "@/types/tmdb"

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: Props) {
    await requireAuth()

    const params = await searchParams
    const type = params?.type === "tv" ? "tv" : "movie"

    const t = await getTranslations()
    const watchlist = await getUserWatchlist()

    const toWatch = watchlist.filter(entry => entry.media_type === type && entry.status === "to_watch").slice(0, 10)
    const watched = watchlist.filter(entry => entry.media_type === type && entry.status === "watched")
    const seedMedia = watched.slice(0, 4)

    const seedForRecs = seedMedia.slice(0, 1)
    const seedForSimilars = seedMedia.slice(1, 4)

    let recommendationSections = []
    let similarSections = []

    const isMovie = type === "movie"
    const getRecs = isMovie ? getMovieRecommendations : getTvShowRecommendations
    const getSims = isMovie ? getSimilarMovies : getSimilarTvShows

    const [recommendationsResults, similarResults] = await Promise.all([
        Promise.all(seedForRecs.map(entry => getRecs(entry.media_id))),
        Promise.all(seedForSimilars.map(entry => getSims(entry.media_id)))
    ])

    recommendationSections = seedForRecs.map((entry, index) => ({
        title: t.pages.dashboard.basedOn.replace("${movie.movie_title}", entry.media_title),
        items: isMovie
            ? (recommendationsResults[index] as Movie[]).map(movieToMediaItem)
            : (recommendationsResults[index] as TvShow[]).map(tvShowToMediaItem)
    })).filter(section => section.items.length > 0)

    similarSections = seedForSimilars.map((entry, index) => ({
        title: t.pages.dashboard.similarTo.replace("${movie.movie_title}", entry.media_title),
        items: isMovie
            ? (similarResults[index] as Movie[]).map(movieToMediaItem)
            : (similarResults[index] as TvShow[]).map(tvShowToMediaItem)
    })).filter(section => section.items.length > 0)

    const allSections = [...recommendationSections, ...similarSections]

    return (
        <div className="container mx-auto py-12 px-6">
            <div
                style={{ animation: "slideUp 0.6s ease-out forwards", opacity: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl font-bold mb-2">{t.pages.dashboard.welcome}</h1>
                <p className="text-muted">
                    {t.pages.dashboard.subtitle}
                </p>
            </div>

            <Suspense fallback={<div className="h-[46px] mb-8" />}>
                <MediaTypeSwitcher defaultType="movie" />
            </Suspense>

            {toWatch.length > 0 && (
                <LibraryMediaSection
                    title={t.pages.dashboard.nextWatchings}
                    entries={toWatch}
                    categoryUrl="/library"
                />
            )}

            {allSections.map((section, index) => (
                <MediaSection
                    key={index}
                    title={section.title}
                    items={section.items}
                    categoryUrl="/explorer"
                />
            ))}

            {watchlist.filter(entry => entry.media_type === type).length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted mb-6">{t.pages.dashboard.emptyLibrary}</p>
                    <Link href={`/explorer?type=${type}`} className="px-6 py-3 bg-red hover:bg-red-2 text-text font-medium rounded-md transition-colors shadow-cinema">
                        {t.pages.dashboard.exploreButton}
                    </Link>
                </div>
            )}
        </div>
    )
}
