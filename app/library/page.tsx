import { requireAuth } from "@/lib/auth"
import { getUserWatchlist } from "@/app/actions/watchlist"
import { LibraryTabs } from "@/components/library/LibraryTabs"
import { getTranslations } from "@/lib/i18n/server"

export async function generateMetadata() {
    const t = await getTranslations()
    return {
        title: `${t.pages.library.title} - Reelmark`,
        description: t.library.inLibrary,
    }
}

export default async function LibraryPage() {
    await requireAuth()

    const t = await getTranslations()
    const watchlist = await getUserWatchlist()

    const toWatch = watchlist.filter(entry => entry.status === "to_watch")
    const watched = watchlist.filter(entry => entry.status === "watched")

    const isPlural = watchlist.length > 1
    const filmsCountText = isPlural ? "films" : "film"
    const inLibraryText = t.library.inLibrary

    return (
        <div className="container mx-auto py-12 px-6">
            <div
                style={{ animation: "slideUp 0.6s ease-out forwards", opacity: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl font-bold mb-2">{t.pages.library.title}</h1>
                <p className="text-muted text-sm md:text-base">
                    {watchlist.length} {filmsCountText} {inLibraryText}
                </p>
            </div>

            <LibraryTabs toWatch={toWatch} watched={watched} />
        </div>
    )
}
