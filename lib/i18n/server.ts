import { cookies, headers } from 'next/headers'
import { translations, type Language } from './translations'
import { getLocale } from './utils'

export { getLocale }

/**
 * Reads the user's preferred language from:
 * 1. The `preferred-language` cookie (set when user changes language in settings)
 * 2. The `Accept-Language` HTTP header (browser system language)
 * 3. Falls back to 'en'
 */
export async function getServerLanguage(): Promise<Language> {
    const cookieStore = await cookies()
    const savedLang = cookieStore.get('preferred-language')?.value

    if (savedLang === 'fr' || savedLang === 'en') {
        return savedLang
    }

    // Fall back to the browser's Accept-Language header
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') ?? ''
    const primaryLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()

    if (primaryLang === 'fr') return 'fr'

    return 'en'
}

/**
 * Returns the translation object for the current request's language.
 * Use this in Server Components and Server Actions.
 *
 * @example
 * const t = await getTranslations()
 * return <h1>{t.pages.dashboard.title}</h1>
 */
export async function getTranslations() {
    const lang = await getServerLanguage()
    return translations[lang]
}

/**
 * Returns the locale string (e.g. 'fr-FR') for use with
 * `Date.toLocaleDateString()` in Server Components.
 */
export async function getServerLocale(): Promise<string> {
    const lang = await getServerLanguage()
    return lang === 'fr' ? 'fr-FR' : 'en-US'
}


