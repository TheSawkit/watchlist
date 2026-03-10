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

export function useTranslation() {
    return useContext(LanguageContext)
}
