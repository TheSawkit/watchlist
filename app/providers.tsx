'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const html = document.documentElement

        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
        let themeToApply: 'light' | 'dark'

        if (savedTheme === 'light') {
            themeToApply = 'light'
        } else if (savedTheme === 'dark') {
            themeToApply = 'dark'
        } else if (savedTheme === 'system') {
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        html.classList.remove('light', 'dark')

        html.classList.add(themeToApply)

        if (savedTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
                html.classList.remove('light', 'dark')
                html.classList.add(e.matches ? 'dark' : 'light')
            }
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    return <>{children}</>
}
