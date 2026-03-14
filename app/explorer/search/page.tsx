import { searchMulti } from "@/lib/tmdb"
import { MediaGrid } from "@/components/media/MediaGrid"
import { SearchBar } from "@/components/search/SearchBar"
import { getTranslations } from "@/lib/i18n/server"

interface SearchPageProps {
    searchParams: Promise<{ q?: string; query?: string }>
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
    const params = await searchParams
    const query = params.q || params.query || ""

    const results = query ? await searchMulti(query) : []

    const t = await getTranslations()

    const foundMessage = `${t.pages.search.found} ${t.pages.search.foundCount.replace("${count}", String(results.length))}`

    return (
        <div className="container mx-auto py-12 px-6">
            <div
                className="mb-10"
                style={{
                    animation: "slideUp var(--duration-slower) ease-out forwards",
                    opacity: 0,
                }}
            >
                <h1 className="text-3xl font-bold mb-2">{t.pages.search.title} &quot;{query}&quot;</h1>
                <p className="text-muted">
                    {results.length > 0 ? foundMessage : t.pages.search.noResults}
                </p>
            </div>

            <SearchBar />

            {results.length > 0 ? (
                <div className="mt-8">
                    <MediaGrid items={results} />
                </div>
            ) : (
                <div className="mt-20 text-center">
                    <p className="text-xl text-muted italic">{t.pages.search.noResultsMessage}</p>
                </div>
            )}
        </div>
    )
}
