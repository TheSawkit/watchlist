"use client"

import { useTranslation } from "@/lib/i18n/context"
import { SectionHeading } from "@/components/ui/SectionHeading"
import type { MediaDescriptionProps } from "@/types/components"

/**
 * Displays media overview or description text with section heading.
 * Shows placeholder message if description is unavailable.
 *
 * @param props - MediaDescriptionProps configuration
 * @param props.description - Overview text, or empty string if unavailable
 * @returns Section with heading and description text or placeholder
 */
export function MediaDescription({ description }: MediaDescriptionProps) {
    const { t } = useTranslation()

    return (
        <section className="space-y-6">
            <SectionHeading>{t.movie.description}</SectionHeading>
            {description ? (
                <p className="text-lg text-muted leading-relaxed max-w-4xl">{description}</p>
            ) : (
                <p className="text-lg text-muted italic">{t.movie.noDescription}</p>
            )}
        </section>
    )
}
