"use client"

import Link from "next/link"
import { MediaCard } from "@/components/media/MediaCard"
import { ArrowRight } from "lucide-react"
import { HorizontalScroll } from "@/components/shared/HorizontalScroll"
import { useTranslation } from "@/lib/i18n/context"
import { watchlistEntryToMediaItem } from "@/lib/mappers"
import type { MediaSectionProps, WatchlistEntry } from "@/types/components"

interface LibrarySectionProps {
    title: string
    entries: WatchlistEntry[]
    categoryUrl: string
}

export function MediaSection({ title, items, categoryUrl }: MediaSectionProps) {
    const { t } = useTranslation()

    return (
        <HorizontalScroll
            className="mb-8"
            scrollAmount={500}
            title={<SectionTitle title={title} href={categoryUrl} />}
        >
            {items.map((media, index) => (
                <div
                    key={`${media.media_type}-${media.id}`}
                    className="flex-none w-40 md:w-50 snap-start"
                    style={{
                        animation: `slideUp 0.5s ease-out forwards`,
                        animationDelay: `${index * 50}ms`,
                        opacity: 0,
                    }}
                >
                    <MediaCard media={media} className="h-full" />
                </div>
            ))}
            <ViewAllCard href={categoryUrl} label={t.common.viewAll} />
        </HorizontalScroll>
    )
}

export function LibraryMediaSection({ title, entries, categoryUrl }: LibrarySectionProps) {
    const { t } = useTranslation()

    const mediaItems = entries.map(watchlistEntryToMediaItem)

    return (
        <HorizontalScroll
            className="mb-8"
            scrollAmount={500}
            title={<SectionTitle title={title} href={categoryUrl} />}
        >
            {entries.map((entry, index) => (
                <div
                    key={entry.id}
                    className="flex-none w-40 md:w-50 snap-start"
                    style={{
                        animation: `slideUp 0.5s ease-out forwards`,
                        animationDelay: `${index * 50}ms`,
                        opacity: 0,
                    }}
                >
                    <MediaCard
                        media={mediaItems[index]}
                        watchlistEntry={entry}
                        hideRating
                        className="h-full"
                    />
                </div>
            ))}
            <ViewAllCard href={categoryUrl} label={t.common.viewAll} />
        </HorizontalScroll>
    )
}


function SectionTitle({ title, href }: { title: string; href: string }) {
    return (
        <Link href={href} className="group/title flex items-center gap-2">
            <h2 className="text-2xl font-bold group-hover/title:text-red-2 transition-colors">
                {title}
            </h2>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-300 text-red-2" />
        </Link>
    )
}

function ViewAllCard({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex-none w-40 md:w-50 snap-start flex flex-col items-center justify-center gap-4 rounded-(--radius-cinema) bg-surface-2/30 hover:bg-surface-2/50 border-2 border-dashed border-border/30 hover:border-red-2/50 transition-all group/card cursor-pointer"
        >
            <div className="rounded-full bg-surface-2 p-4 group-hover/card:bg-red-2 group-hover/card:text-text transition-colors">
                <ArrowRight className="w-6 h-6" />
            </div>
            <span className="font-semibold text-muted group-hover/card:text-text transition-colors">
                {label}
            </span>
        </Link>
    )
}
