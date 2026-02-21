'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useRouter } from 'next/navigation'

type Language = 'fr' | 'en'

export function LanguageSettings() {
    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language') as Language | null
        return savedLanguage || 'fr'
    })
    const router = useRouter()

    if (typeof window === 'undefined') return null

    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage)
        localStorage.setItem('language', newLanguage)
        router.refresh()
    }

    const options: Array<{ value: Language; label: string; icon: string }> = [
        { value: 'fr', label: 'Français', icon: '🇫🇷' },
        { value: 'en', label: 'Anglais', icon: '🇬🇧' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Langue</CardTitle>
                <CardDescription>Choisissez votre langue préférée</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Interface</FieldLabel>
                        <div className="space-y-3 mt-4">
                            {options.map(({ value, label, icon }) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 p-3 border border-border rounded-(--radius-cinema) cursor-pointer hover:bg-surface-2 transition-colors"
                                    onClick={() => handleLanguageChange(value)}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={value}
                                        checked={language === value}
                                        onChange={() => handleLanguageChange(value)}
                                        className="w-4 h-4 accent-red"
                                    />
                                    <span className="text-lg">{icon}</span>
                                    <p className="font-medium text-sm">{label}</p>
                                </label>
                            ))}
                        </div>
                    </Field>
                </FieldGroup>
            </CardContent>
        </Card>
    )
}
