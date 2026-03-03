'use client'

import Image from 'next/image'
import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { updateProfile, updateAvatar } from '@/app/settings/actions'
import { User } from '@supabase/supabase-js'
import { useTranslation } from '@/lib/i18n/context'

const initialState = {
    error: undefined,
    success: false,
    message: '',
}

interface ProfileSettingsProps {
    user: User | null
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const { t } = useTranslation()
    const [state, formAction, isPending] = useActionState(updateProfile, initialState)
    const [avatarState, avatarFormAction, isAvatarPending] = useActionState(
        updateAvatar,
        initialState
    )
    const [avatarPreview, setAvatarPreview] = useState(
        user?.user_metadata?.avatar_url || ''
    )

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.settings.profile.title}</CardTitle>
                    <CardDescription>{t.settings.profile.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>{t.settings.profile.avatar}</FieldLabel>
                                <div className="flex items-start gap-6 mt-4">
                                    <div className="relative">
                                        {avatarPreview ? (
                                            <Image
                                                src={avatarPreview}
                                                alt="Avatar"
                                                width={80}
                                                height={80}
                                                className="rounded-full object-cover border-2 border-border"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center border-2 border-border">
                                                <span className="text-sm font-medium text-muted">
                                                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() || t.common.user[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <Input
                                            id="avatar-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                        <FieldDescription>
                                            {t.settings.profile.formatAvatar}
                                        </FieldDescription>
                                        {avatarPreview && avatarPreview !== user?.user_metadata?.avatar_url && (
                                            <>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => {
                                                        const formData = new FormData()
                                                        formData.set('avatarUrl', avatarPreview)
                                                        avatarFormAction(formData)
                                                    }}
                                                    disabled={isAvatarPending}
                                                >
                                                    {isAvatarPending ? t.common.updating : t.settings.profile.updateAvatar}
                                                </Button>
                                                {avatarState.error && (
                                                    <p className="text-sm text-red">{avatarState.error}</p>
                                                )}
                                                {avatarState.success && (
                                                    <p className="text-sm text-gold">{avatarState.message}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="fullName">{t.settings.profile.fullName}</FieldLabel>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    defaultValue={user?.user_metadata?.full_name || ''}
                                    placeholder={`${t.settings.profile.placeholder}${t.settings.profile.fullName.toLowerCase()}`}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="username">{t.settings.profile.username}</FieldLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    defaultValue={user?.user_metadata?.username || ''}
                                    placeholder={`${t.settings.profile.placeholder}${t.settings.profile.username.toLowerCase()}`}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">{t.settings.profile.email}</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user?.email || ''}
                                    disabled
                                    className="opacity-50"
                                />
                                <FieldDescription>
                                    {t.settings.profile.warningEmail}
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {state.error && <p className="text-sm text-red">{state.error}</p>}
                        {state.success && (
                            <p className="text-sm text-gold">{state.message}</p>
                        )}

                        <Button type="submit" disabled={isPending}>
                            {isPending ? t.common.updating : t.settings.profile.updateProfile}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
