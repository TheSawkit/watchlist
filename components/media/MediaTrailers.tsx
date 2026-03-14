"use client"

import { useTranslation } from "@/lib/i18n/context"
import { SectionHeading } from "@/components/ui/SectionHeading"
import type { MediaTrailersProps } from "@/types/components"

export function MediaTrailers({ trailers }: MediaTrailersProps) {
    const { t } = useTranslation()

    if (trailers.length === 0) return null

    return (
        <section className="space-y-6">
            <SectionHeading>{t.movie.trailers}</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trailers.slice(0, 3).map((trailer) => (
                    <div
                        key={trailer.id}
                        className="relative aspect-video bg-surface/20 backdrop-blur-2xl rounded-xl overflow-hidden border border-border/10 border-t-border/20 shadow-card transition-all duration-(--duration-base) hover:shadow-glow-gold hover:border-gold/30 hover:border-t-gold/50"
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
                            <div className="w-full h-full flex items-center justify-center bg-transparent text-muted">
                                <p className="text-sm font-medium">{t.movie.unsupportedFormat}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
