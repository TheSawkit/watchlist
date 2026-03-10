import type { Language } from './translations'

export function getLocale(lang: Language): string {
    return lang === 'fr' ? 'fr-FR' : 'en-US'
}
