'use client'

import { type ReactNode } from 'react'
import { LanguageProvider } from '@/lib/i18n/context'
import type { Language } from '@/lib/i18n/translations'
import { useTheme } from '@/lib/useTheme'

interface ProvidersProps {
    children: ReactNode
    initialLang: Language
}

export function Providers({ children, initialLang }: ProvidersProps) {
    useTheme()

    return (
        <LanguageProvider initialLang={initialLang}>
            {children}
        </LanguageProvider>
    )
}
