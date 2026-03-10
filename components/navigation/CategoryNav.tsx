"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/context"

export function CategoryNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const type = searchParams.get("type") || "movie"
    const { t } = useTranslation()

    const isTvPath = pathname.includes('tv-') || type === 'tv'
    const activeDomain = isTvPath ? "tv" : "movie"

    const categories = activeDomain === "movie" ? [
        { name: t.explorer.trending, href: "/explorer/trending" },
        { name: t.explorer.nowPlaying, href: "/explorer/now-playing" },
        { name: t.explorer.popular, href: "/explorer/popular" },
        { name: t.explorer.topRated, href: "/explorer/top-rated" },
        { name: t.explorer.upcoming, href: "/explorer/upcoming" },
    ] : [
        { name: t.explorer.tvTrending, href: "/explorer/tv-trending" },
        { name: t.explorer.tvPopular, href: "/explorer/tv-popular" },
        { name: t.explorer.tvTopRated, href: "/explorer/tv-top-rated" },
        { name: t.explorer.tvAiringToday, href: "/explorer/tv-airing-today" },
        { name: t.explorer.tvOnTheAir, href: "/explorer/tv-on-the-air" },
    ]

    return (
        <div className="flex overflow-x-scroll overflow-y-visible pb-2 mb-8 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <Link
                href={`/explorer?type=${activeDomain}`}
                aria-current={pathname === "/explorer" ? "page" : undefined}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    pathname === "/explorer"
                        ? "bg-red text-text shadow-lg shadow-red/20"
                        : "bg-surface-2 text-muted hover:text-text hover:bg-surface-3"
                )}
            >
                {t.explorer.overview}
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.href}
                    href={category.href}
                    aria-current={pathname === category.href ? "page" : undefined}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        pathname === category.href
                            ? "bg-red text-text shadow-lg shadow-red/20"
                            : "bg-surface-2 text-muted hover:text-text hover:bg-surface-3"
                    )}
                >
                    {category.name}
                </Link>
            ))}
        </div>
    )
}
