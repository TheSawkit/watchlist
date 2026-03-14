"use client"

import { MediaCard } from "@/components/media/MediaCard"
import { StaggeredItem } from "@/components/ui/StaggeredItem"
import type { MediaGridProps } from "@/types/components"

export function MediaGrid({ items, hideRating }: MediaGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
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
