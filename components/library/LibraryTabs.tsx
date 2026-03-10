"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MediaCard } from "@/components/media/MediaCard"
import { BookMarked, Eye } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import type { WatchlistEntry } from "@/types/components"
import { watchlistEntryToMediaItem } from "@/lib/mappers"

interface LibraryTabsProps {
    toWatch: WatchlistEntry[]
    watched: WatchlistEntry[]
    tvProgress?: Record<number, { watched: number; total: number }>
}

type Tab = "to_watch" | "watched"

export function LibraryTabs({ toWatch, watched, tvProgress = {} }: LibraryTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>("to_watch")
    const { t } = useTranslation()

    const tabs = [
        { id: "to_watch" as Tab, label: t.library.toWatch, icon: BookMarked, items: toWatch },
        { id: "watched" as Tab, label: t.library.watched, icon: Eye, items: watched },
    ]

    const current = tabs.find((tab) => tab.id === activeTab)!

    return (
        <div>
            <div className="flex gap-2 mb-8 border-b border-border pb-0" role="tablist" aria-label="Library filters">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200",
                            "border-b-2 -mb-px",
                            activeTab === tab.id
                                ? "border-red text-text"
                                : "border-transparent text-muted hover:text-text hover:border-border"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <span
                            className={cn(
                                "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                                activeTab === tab.id
                                    ? "bg-red/20 text-red"
                                    : "bg-surface-2 text-muted"
                            )}
                        >
                            {tab.items.length}
                        </span>
                    </button>
                ))}
            </div>

            {current.items.length === 0 ? (
                <div
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    className="flex flex-col items-center justify-center py-24 text-muted"
                    style={{ animation: "fadeIn 0.4s ease-out forwards" }}
                >
                    <current.icon className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-lg font-medium">
                        {activeTab === "to_watch" ? t.library.noMovies : t.library.noWatched}
                    </p>
                </div>
            ) : (
                <div
                    key={activeTab}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    style={{ animation: "scaleIn 0.3s ease-out forwards", opacity: 0 }}
                >
                    {current.items.map((entry) => {
                        const mediaItem = watchlistEntryToMediaItem(entry)

                        const progress = entry.media_type === "tv"
                            ? tvProgress[entry.media_id]
                            : undefined

                        return (
                            <MediaCard
                                key={entry.id}
                                media={mediaItem}
                                watchlistEntry={entry}
                                hideRating
                                tvProgress={progress}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
