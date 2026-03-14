import { cookies, headers } from 'next/headers'
import { translations, type Language } from './translations'
import { getLocale } from './utils'

export { getLocale }

/**
 * Resolves the user's preferred language on the server.
 * Priority: cookie > Accept-Language header > default ("en").
 *
 * @returns The resolved language ("fr" or "en").
 */
export async function getServerLanguage(): Promise<Language> {
    const cookieStore = await cookies()
    const savedLang = cookieStore.get('preferred-language')?.value

    if (savedLang === 'fr' || savedLang === 'en') {
        return savedLang
    }

    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') ?? ''
    const primaryLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()

    if (primaryLang === 'fr') return 'fr'

    return 'en'
}

/**
 * Returns the full translation object for the server-resolved language.
 *
 * @returns Translation object for the active language.
 */
export async function getTranslations() {
    const lang = await getServerLanguage()
    return translations[lang]
}

/**
 * Returns the BCP 47 locale string for the server-resolved language.
 *
 * @returns Locale string e.g. "fr-FR" or "en-US".
 */
export async function getServerLocale(): Promise<string> {
    const lang = await getServerLanguage()
    return lang === 'fr' ? 'fr-FR' : 'en-US'
}
