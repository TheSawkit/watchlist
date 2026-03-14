import { requireAuth } from '@/lib/auth'
import { SettingsContent } from '@/components/settings/SettingsContent'
import { PageLayout, PageHeader } from '@/components/ui/PageLayout'
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
        <PageLayout>
            <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />
            <SettingsContent user={user} />
        </PageLayout>
    )
}
