'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { ProfileSettings } from './ProfileSettings'
import { PasswordSettings } from './PasswordSettings'
import { ThemeSettings } from './ThemeSettings'
import { LanguageSettings } from './LanguageSettings'
import { RegionalSettings } from './RegionalSettings'
import { DangerZone } from './DangerZone'
import { SettingsNav, type SettingsTab } from './SettingsNav'

interface SettingsContentProps {
    user: User | null
}

export function SettingsContent({ user }: SettingsContentProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <aside className="lg:w-48 lg:sticky lg:top-20 h-fit">
                <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
            </aside>

            <main className="flex-1 min-w-0">
                {activeTab === 'profile' && <ProfileSettings user={user} />}
                {activeTab === 'security' && <PasswordSettings />}
                {activeTab === 'appearance' && (
                    <div className="space-y-6">
                        <ThemeSettings />
                    </div>
                )}
                {activeTab === 'data' && (
                    <div className="space-y-6">
                        <LanguageSettings />
                        <RegionalSettings user={user} />
                        <DangerZone />
                    </div>
                )}
            </main>
        </div>
    )
}
