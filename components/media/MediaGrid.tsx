"use client"

import { MediaCard } from "@/components/media/MediaCard"
import { StaggeredItem } from "@/components/ui/StaggeredItem"
import type { MediaGridProps } from "@/types/components"

/**
 * Responsive grid layout for displaying media cards with staggered animations.
 * Automatically adjusts column count based on screen size.
 *
 * @param props - MediaGridProps configuration
 * @param props.items - Array of media items to display
 * @param props.hideRating - If true, hides rating badges on all cards
 * @returns Grid container with animated MediaCard components
 */
export function MediaGrid({ items, hideRating }: MediaGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {items.map((media, index) => (
                <StaggeredItem
                    key={`${media.media_type}-${media.id}`}
                    index={index}
                    animation="fadeIn"
                >
                    <MediaCard media={media} hideRating={hideRating} />
                </StaggeredItem>
            ))}
        </div>
    )
}
