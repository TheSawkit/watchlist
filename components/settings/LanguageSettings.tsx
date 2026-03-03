'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useTranslation } from '@/lib/i18n/context'
import type { Language } from '@/lib/i18n/translations'

export function LanguageSettings() {
    const { lang, setLang, t } = useTranslation()

    const options: Array<{ value: Language; label: string; icon: string }> = [
        { value: 'fr', label: t.settings.language.french, icon: '🇫🇷' },
        { value: 'en', label: t.settings.language.english, icon: '🇬🇧' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.settings.language.title}</CardTitle>
                <CardDescription>{t.settings.language.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel>{t.common.language}</FieldLabel>
                        <div className="space-y-3 mt-4">
                            {options.map(({ value, label, icon }) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 p-3 border border-border rounded-(--radius-cinema) cursor-pointer hover:bg-surface-2 transition-colors"
                                    onClick={() => setLang(value)}
                                >
                                    <input
                                        type="radio"
                                        name="language"
                                        value={value}
                                        checked={lang === value}
                                        onChange={() => setLang(value)}
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
