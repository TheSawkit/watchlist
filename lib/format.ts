/**
 * Formats a date string into a localized long-form date.
 *
 * @param dateString - ISO date string or null.
 * @param locale - BCP 47 locale string (e.g. "fr-FR", "en-US").
 * @param options - Optional `Intl.DateTimeFormatOptions` to override defaults.
 * @returns Formatted date string, or null if input is null.
 *
 * @example
 * formatDate("2023-07-15", "fr-FR") // "15 juillet 2023"
 */
export function formatDate(
    dateString: string | null,
    locale: string,
    options?: Intl.DateTimeFormatOptions
): string | null {
    if (!dateString) return null

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    }

    return new Date(dateString).toLocaleDateString(locale, options ?? defaultOptions)
}

/**
 * Formats a date string into a short localized date (e.g. "15 Jul 2023").
 *
 * @param dateString - ISO date string.
 * @param locale - BCP 47 locale string.
 * @returns Short formatted date string.
 */
export function formatShortDate(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

/**
 * Converts a duration in minutes to a human-readable string (e.g. "2h 15min").
 *
 * @param minutes - Total duration in minutes. Returns empty string if ≤ 0.
 * @returns Formatted runtime string.
 *
 * @example
 * formatRuntime(135) // "2h 15min"
 * formatRuntime(45)  // "45min"
 */
export function formatRuntime(minutes: number): string {
    if (minutes <= 0) return ""
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

/**
 * Calculates a person's age from their birthday to today or their death date.
 *
 * @param birthday - ISO date string of birth, or null.
 * @param deathday - ISO date string of death, or null for living persons.
 * @returns Age in full years, or null if birthday is not provided.
 *
 * @example
 * calculateAge("1990-01-01", null) // current age
 * calculateAge("1950-06-01", "2010-06-01") // 60
 */
export function calculateAge(birthday: string | null, deathday: string | null): number | null {
    if (!birthday) return null
    const birth = new Date(birthday)
    const end = deathday ? new Date(deathday) : new Date()
    return Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}
