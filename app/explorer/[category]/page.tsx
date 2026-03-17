import { notFound } from "next/navigation"
import { Suspense } from "react"
import type { Metadata } from "next"
import { requireAuth } from "@/lib/auth"
import { fetchMoreMedia } from "@/app/actions/media"
import { InfiniteScrollMedia } from "@/components/media/InfiniteScrollMedia"
import { CategoryNav } from "@/components/navigation/CategoryNav"
import { getTranslations } from "@/lib/i18n/server"
import { SearchBar } from "@/components/search/SearchBar"
import { PageLayout, PageHeader } from "@/components/ui/PageLayout"
import type { CategoryPageProps } from "@/types/pages"

/**
 * Generates metadata for dynamic category pages with category-specific titles and descriptions.
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const t = await getTranslations()

  const categoryMap: Record<string, { title: string; description: string }> = {
    popular: {
      title: t.pages.explorer.popular,
      description: t.metadata.categories.popularMovies,
    },
    "top-rated": {
      title: t.pages.explorer.topRated,
      description: t.metadata.categories.topRatedMovies,
    },
    upcoming: {
      title: t.pages.explorer.upcoming,
      description: t.metadata.categories.upcomingMovies,
    },
    "now-playing": {
      title: t.pages.explorer.nowPlaying,
      description: t.metadata.categories.nowPlayingMovies,
    },
    trending: {
      title: t.pages.explorer.trending,
      description: t.metadata.categories.trendingMovies,
    },
    "tv-popular": {
      title: t.pages.explorer.tvPopular,
      description: t.metadata.categories.tvPopular,
    },
    "tv-top-rated": {
      title: t.pages.explorer.tvTopRated,
      description: t.metadata.categories.tvTopRated,
    },
    "tv-trending": {
      title: t.pages.explorer.tvTrending,
      description: t.metadata.categories.tvTrending,
    },
    "tv-airing-today": {
      title: t.pages.explorer.tvAiringToday,
      description: t.metadata.categories.tvAiringToday,
    },
    "tv-on-the-air": {
      title: t.pages.explorer.tvOnTheAir,
      description: t.metadata.categories.tvOnTheAir,
    },
  }

  const categoryData = categoryMap[category] || {
    title: "ReelMark",
    description: t.metadata.explorerDescription,
  }

  return {
    title: categoryData.title,
    description: categoryData.description,
    openGraph: {
      title: categoryData.title,
      description: categoryData.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: categoryData.title,
      description: categoryData.description,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await requireAuth()

  const { category } = await params
  const t = await getTranslations()

  const categoryTitleMap: Record<string, string> = {
    popular: t.pages.explorer.popular,
    "top-rated": t.pages.explorer.topRated,
    upcoming: t.pages.explorer.upcoming,
    "now-playing": t.pages.explorer.nowPlaying,
    trending: t.pages.explorer.trending,
    "tv-popular": t.pages.explorer.tvPopular,
    "tv-top-rated": t.pages.explorer.tvTopRated,
    "tv-trending": t.pages.explorer.tvTrending,
    "tv-airing-today": t.pages.explorer.tvAiringToday,
    "tv-on-the-air": t.pages.explorer.tvOnTheAir,
  }

  if (!(category in categoryTitleMap)) {
    notFound()
  }

  const title = categoryTitleMap[category]

  const initialItems = await fetchMoreMedia(category, 1)

  return (
    <PageLayout>
      <PageHeader title={title} subtitle={t.pages.explorer.subtitle} />

      <SearchBar />

      <Suspense fallback={<div className="h-10 mb-8" />}>
        <CategoryNav />
      </Suspense>

      <div className="mt-8">
        <InfiniteScrollMedia
          initialItems={initialItems}
          category={category}
        />
      </div>
    </PageLayout>
  )
}
