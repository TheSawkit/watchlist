import { notFound } from "next/navigation"
import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { fetchMoreMedia } from "@/app/actions/media"
import { InfiniteScrollMedia } from "@/components/media/InfiniteScrollMedia"
import { CategoryNav } from "@/components/navigation/CategoryNav"
import { getTranslations } from "@/lib/i18n/server"
import { SearchBar } from "@/components/search/SearchBar"
import type { CategoryPageProps } from "@/types/pages"

export default async function CategoryPage({ params }: CategoryPageProps) {
  await requireAuth()

  const { category } = await params
  const t = await getTranslations()

  const validCategories = [
    // Movies
    "popular",
    "top-rated",
    "upcoming",
    "now-playing",
    "trending",
    // TV Shows
    "tv-popular",
    "tv-top-rated",
    "tv-trending",
    "tv-airing-today",
    "tv-on-the-air",
  ]

  if (!validCategories.includes(category)) {
    notFound()
  }

  let title = ""
  switch (category) {
    case "popular": title = t.pages.explorer.popular; break;
    case "top-rated": title = t.pages.explorer.topRated; break;
    case "upcoming": title = t.pages.explorer.upcoming; break;
    case "now-playing": title = t.pages.explorer.nowPlaying; break;
    case "trending": title = t.pages.explorer.trending; break;
    case "tv-popular": title = t.pages.explorer.tvPopular; break;
    case "tv-top-rated": title = t.pages.explorer.tvTopRated; break;
    case "tv-trending": title = t.pages.explorer.tvTrending; break;
    case "tv-airing-today": title = t.pages.explorer.tvAiringToday; break;
    case "tv-on-the-air": title = t.pages.explorer.tvOnTheAir; break;
  }

  const initialItems = await fetchMoreMedia(category, 1)

  return (
    <div className="container mx-auto py-12 px-6">
      <div
        className="mb-10"
        style={{
          animation: "slideUp 0.6s ease-out forwards",
          opacity: 0,
        }}
      >
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted">{t.pages.explorer.subtitle}</p>
      </div>

      <SearchBar />

      <Suspense fallback={<div className="h-[40px] mb-8" />}>
        <CategoryNav />
      </Suspense>

      <div className="mt-8">
        <InfiniteScrollMedia
          initialItems={initialItems}
          category={category}
        />
      </div>
    </div>
  )
}
