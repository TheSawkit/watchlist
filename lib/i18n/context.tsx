'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { translations, type Language } from './translations'

type Translations = (typeof translations)[Language]

interface LanguageContextValue {
    lang: Language
    t: Translations
    setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue>({
    lang: 'en',
    t: translations['en'],
    setLang: () => { },
})

interface LanguageProviderProps {
    children: ReactNode
    initialLang: Language
}

/**
 * Provides the active language and translation object to the component tree.
 * Persists the selected language in both localStorage and a cookie for SSR sync.
 *
 * @param children - React subtree to receive the language context.
 * @param initialLang - Language resolved server-side to hydrate the initial state.
 */
export function LanguageProvider({ children, initialLang }: LanguageProviderProps) {
    const [lang, setLangState] = useState<Language>(initialLang)
    const router = useRouter()

    const setLang = useCallback(
        (newLang: Language) => {
            setLangState(newLang)
            localStorage.setItem('preferred-language', newLang)
            document.cookie = `preferred-language=${newLang}; path=/; max-age=31536000; SameSite=Lax`
            router.refresh()
        },
        [router]
    )

    return (
        <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

/**
 * Returns the current language, translation object, and language setter from context.
 * Must be used inside a `LanguageProvider`.
 *
 * @returns `{ lang, t, setLang }` from the nearest `LanguageProvider`.
 */
export function useTranslation() {
    return useContext(LanguageContext)
}
