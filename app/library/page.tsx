import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { getUserWatchlist } from "@/app/actions/watchlist"
import { getTvShowWatchProgress } from "@/app/actions/episodes"
import { LibraryTabs } from "@/components/library/LibraryTabs"
import { PageLayout, PageHeader } from "@/components/ui/PageLayout"
import { getTranslations } from "@/lib/i18n/server"
import { MediaTypeSwitcher } from "@/components/media/MediaTypeSwitcher"
import { getTvShowTotalEpisodes } from "@/lib/tmdb"

export async function generateMetadata() {
    const t = await getTranslations()
    return {
        title: `${t.pages.library.title} - Reelmark`,
        description: t.library.inLibrary,
    }
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LibraryPage({ searchParams }: Props) {
    await requireAuth()

    const params = await searchParams
    const type = params?.type === "tv" ? "tv" : "movie"

    const t = await getTranslations()
    const fullWatchlist = await getUserWatchlist()
    const watchlist = fullWatchlist.filter(entry => entry.media_type === type)

    const toWatch = watchlist.filter(entry => entry.status === "to_watch")
    const watched = watchlist.filter(entry => entry.status === "watched")

    const tvProgressMap: Record<number, { watched: number; total: number }> = {}
    if (type === "tv") {
        const tvIds = watchlist.map(entry => entry.media_id)
        const results = await Promise.all(
            tvIds.map(async (tvId) => {
                const [progress, total] = await Promise.all([
                    getTvShowWatchProgress(tvId),
                    getTvShowTotalEpisodes(tvId),
                ])
                const watched = Array.from(progress.values()).reduce((sum, count) => sum + count, 0)
                return { tvId, watched, total }
            })
        )
        for (const { tvId, watched, total } of results) {
            tvProgressMap[tvId] = { watched, total }
        }
    }

    const isPlural = watchlist.length > 1
    const filmsCountText = isPlural
        ? (type === 'tv' ? t.library.tvCountPlural : t.library.filmsCountPlural)
        : (type === 'tv' ? t.library.tvCount : t.library.filmsCount)
    const inLibraryText = t.library.inLibrary

    return (
        <PageLayout>
            <PageHeader
                title={t.pages.library.title}
                subtitle={`${watchlist.length} ${filmsCountText} ${inLibraryText}`}
            />

            <Suspense fallback={<div className="h-11.5 mb-8" />}>
                <MediaTypeSwitcher defaultType="movie" />
            </Suspense>

            <LibraryTabs toWatch={toWatch} watched={watched} tvProgress={tvProgressMap} />
        </PageLayout>
    )
}
