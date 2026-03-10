"use client"

import { MediaCard } from "@/components/media/MediaCard"
import type { MediaGridProps } from "@/types/components"

export function MediaGrid({ items }: MediaGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {items.map((media, index) => (
                <div
                    key={`${media.media_type}-${media.id}`}
                    className="animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <MediaCard media={media} />
                </div>
            ))}
        </div>
    )
}
