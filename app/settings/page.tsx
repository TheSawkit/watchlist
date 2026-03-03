import { requireAuth } from '@/lib/auth'
import { SettingsContent } from '@/components/settings/SettingsContent'
import { getTranslations } from '@/lib/i18n/server'

export async function generateMetadata() {
    const t = await getTranslations()
    return {
        title: `${t.settings.title} - Reelmark`,
        description: t.settings.subtitle,
    }
}

export default async function SettingsPage() {
    const user = await requireAuth()

    const t = await getTranslations()

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto py-12 px-6">
                <div
                    style={{ animation: 'slideUp 0.6s ease-out forwards', opacity: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-bold mb-2">{t.settings.title}</h1>
                    <p className="text-muted">
                        {t.settings.subtitle}
                    </p>
                </div>

                <SettingsContent user={user} />
            </div>
        </main>
    )
}
