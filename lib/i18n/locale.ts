import type { Language } from "@/lib/i18n/translations"

/**
 * Return a locale string for Date.toLocaleDateString, fallback to en-US.
 *
 * Ensure all TMDB API calls receive the user's chosen language when fetching data.
 */
export function getLanguageLocale(language?: Language): string {
	const localeMap: Record<Language, string> = {
		'fr': 'fr-FR',
		'en': 'en-US'
	}
	return (language && localeMap[language]) ?? 'en-US'
}
