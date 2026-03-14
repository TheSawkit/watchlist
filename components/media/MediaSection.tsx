"use client"

import Link from "next/link"
import { MediaCard } from "@/components/media/MediaCard"
import { ArrowRight } from "lucide-react"
import { HorizontalScroll } from "@/components/shared/HorizontalScroll"
import { useTranslation } from "@/lib/i18n/context"
import { watchlistEntryToMediaItem } from "@/lib/mappers"
import type { MediaSectionProps } from "@/types/components"
import type { WatchlistEntry } from "@/types/tmdb"
import { StaggeredItem } from "@/components/ui/StaggeredItem"

interface LibrarySectionProps {
    title: string
    entries: WatchlistEntry[]
    categoryUrl: string
}

const CARD_ANIMATION_DELAY_MS = 50

export function MediaSection({ title, items, categoryUrl, hideRating }: MediaSectionProps) {
    const { t } = useTranslation()

    return (
        <HorizontalScroll
            className="mb-8"
            scrollAmount={500}
            title={<SectionTitle title={title} href={categoryUrl} />}
        >
            {items.map((media, index) => (
                <StaggeredItem
                    key={`${media.media_type}-${media.id}`}
                    index={index}
                    staggerMs={CARD_ANIMATION_DELAY_MS}
                    className="flex-none w-40 md:w-50 snap-start"
                >
                    <MediaCard media={media} hideRating={hideRating} className="h-full" />
                </StaggeredItem>
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
                <StaggeredItem
                    key={entry.id}
                    index={index}
                    staggerMs={CARD_ANIMATION_DELAY_MS}
                    className="flex-none w-40 md:w-50 snap-start"
                >
                    <MediaCard
                        media={mediaItems[index]}
                        watchlistEntry={entry}
                        hideRating
                        className="h-full"
                    />
                </StaggeredItem>
            ))}
            <ViewAllCard href={categoryUrl} label={t.common.viewAll} />
        </HorizontalScroll>
    )
}

function SectionTitle({ title, href }: { title: string; href: string }) {
    return (
        <Link
            href={href}
            className="group/title flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm"
        >
            <h2 className="text-2xl font-bold group-hover/title:text-gold transition-colors">
                {title}
            </h2>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all duration-(--duration-base) text-gold" />
        </Link>
    )
}

function ViewAllCard({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex-none w-40 md:w-50 snap-start flex flex-col items-center justify-center gap-4 rounded-poster bg-surface hover:bg-surface-2 border-2 border-dashed border-border hover:border-primary/50 transition-all group/card cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            <div className="rounded-full bg-surface-2 p-4 group-hover/card:bg-primary group-hover/card:text-text-main transition-colors">
                <ArrowRight className="w-6 h-6" />
            </div>
            <span className="font-semibold text-muted group-hover/card:text-text-main transition-colors">
                {label}
            </span>
        </Link>
    )
}
