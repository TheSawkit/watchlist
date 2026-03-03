"use client"

import { useTranslation } from "@/lib/i18n/context"
import type { MovieTrailersProps } from "@/types/components"

export function MovieTrailers({ trailers }: MovieTrailersProps) {
    const { t } = useTranslation()

    if (trailers.length === 0) return null

    return (
        <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-text">{t.movie.trailers}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trailers.map((trailer) => (
                    <div
                        key={trailer.id}
                        className="relative aspect-video bg-surface rounded-lg overflow-hidden border border-border/20"
                    >
                        {trailer.site === "YouTube" ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                                title={trailer.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface text-muted">
                                <p className="text-sm">{t.movie.unsupportedFormat}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
