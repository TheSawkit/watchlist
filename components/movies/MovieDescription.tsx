"use client"

import { useTranslation } from "@/lib/i18n/context"
import type { MovieDescriptionProps } from "@/types/components"

export function MovieDescription({ description }: MovieDescriptionProps) {
    const { t } = useTranslation()

    if (!description) {
        return (
            <section className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-text">{t.movie.description}</h2>
                <p className="text-lg text-muted italic">{t.movie.noDescription}</p>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-text">{t.movie.description}</h2>
            <p className="text-lg text-muted leading-relaxed max-w-4xl">{description}</p>
        </section>
    )
}
