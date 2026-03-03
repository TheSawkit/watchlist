import type { Language } from './translations'

/**
 * Pure utility — safe to import in both Server and Client Components.
 * Returns the locale string (e.g. 'fr-FR') from a Language value.
 */
export function getLocale(lang: Language): string {
    return lang === 'fr' ? 'fr-FR' : 'en-US'
}
