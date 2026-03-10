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

export function formatShortDate(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

export function formatRuntime(minutes: number): string {
    if (minutes <= 0) return ""
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

export function calculateAge(birthday: string | null, deathday: string | null): number | null {
    if (!birthday) return null
    const birth = new Date(birthday)
    const end = deathday ? new Date(deathday) : new Date()
    return Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}
