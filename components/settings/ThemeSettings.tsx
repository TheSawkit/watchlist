'use client'

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'

const THEMES = [
    { value: 'light' as const, label: '☀️ Clair', description: 'Thème clair classique' },
    { value: 'dark' as const, label: '🌙 Sombre', description: 'Thème sombre pour les yeux' },
    { value: 'system' as const, label: '💻 Système', description: 'Suivre les paramètres système' },
] as const

export function ThemeSettings() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
        return savedTheme || 'light'
    })

    const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
        const html = document.documentElement

        html.classList.remove('light', 'dark')

        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            html.classList.add(prefersDark ? 'dark' : 'light')
        } else {
            html.classList.add(newTheme)
        }
    }

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                    Personnalisez l&apos;apparence de l&apos;application
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Thème</FieldLabel>
                        <div className="space-y-3 mt-4">
                            {THEMES.map(({ value, label, description }) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={value}
                                        checked={theme === value}
                                        onChange={() => handleThemeChange(value)}
                                        className="w-4 h-4"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{label}</p>
                                        <FieldDescription className="mt-1">
                                            {description}
                                        </FieldDescription>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Field>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
