"use client"

import { MediaCard } from "@/components/media/MediaCard"
import { StaggeredItem } from "@/components/ui/StaggeredItem"
import type { MediaGridProps } from "@/types/components"

/**
 * Responsive grid layout for displaying media cards with staggered animations.
 * Automatically adjusts column count based on screen size.
 *
 * @param items - Array of media items to display.
 * @param hideRating - If true, hides rating badges on all cards.
 * @param showWatchlistMeta - If true, passes watchlist entry data to each card.
 * @returns Grid container with animated MediaCard components.
 */
export function MediaGrid({ items, hideRating, showWatchlistMeta }: MediaGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {items.map((media, index) => (
                <StaggeredItem
                    key={`${media.media_type}-${media.id}`}
                    index={index}
                    animation="fadeIn"
                >
                    <MediaCard
                        media={media}
                        watchlistEntry={showWatchlistMeta ? media.watchlistEntry : undefined}
                        hideRating={hideRating}
                        imageSize="grid"
                        priority={index < 6}
                    />
                </StaggeredItem>
            ))}
        </div>
    )
}
