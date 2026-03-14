'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n/server'

export async function updateEmail(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const t = await getTranslations()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t.auth.notAuthenticated, success: false }
    }

    const newEmail = formData.get('email') as string

    if (!newEmail) {
        return { error: t.settings.profile.newEmail, success: false }
    }

    const { error } = await supabase.auth.updateUser({
        email: newEmail,
    })

    if (error) {
        return { error: error.message, success: false }
    }

    return { error: undefined, success: true, message: t.settings.profile.confirmNewEmail }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const t = await getTranslations()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t.auth.notAuthenticated, success: false }
    }

    const newPassword = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string

    if (!newPassword || !confirmPassword) {
        return { error: t.settings.missingFields, success: false }
    }

    if (newPassword !== confirmPassword) {
        return { error: t.settings.password.noMatch, success: false }
    }

    if (newPassword.length < 8) {
        return { error: t.settings.password.minChars, success: false }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        return { error: error.message, success: false }
    }

    return { error: undefined, success: true, message: `${t.settings.password.title}${t.settings.successUpdate}` }
}

export async function updateProfile(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const t = await getTranslations()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t.auth.notAuthenticated, success: false }
    }

    const fullName = formData.get('fullName') as string
    const username = formData.get('username') as string
    const region = formData.get('region') as string

    if (!username) {
        return { error: t.settings.missingFields, success: false }
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: fullName ? fullName : null,
            name: fullName ? fullName : username,
            username: username,
            region: region ? region.toUpperCase() : undefined,
        },
    })

    if (error) {
        return { error: error.message, success: false }
    }

    revalidatePath('/', 'layout')
    return { error: undefined, success: true, message: `${t.settings.profile.title}${t.settings.successUpdate}` }
}

export async function updateAvatar(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const t = await getTranslations()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t.auth.notAuthenticated, success: false }
    }

    const avatarUrl = formData.get('avatarUrl') as string | null
    const avatarFile = formData.get('avatarFile') as File | null

    if (!avatarUrl && (!avatarFile || avatarFile.size === 0)) {
        return { error: t.settings.profile.invalidAvatarUrl, success: false }
    }

    let finalAvatarUrl = avatarUrl || ''

    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const buffer = await avatarFile.arrayBuffer()

        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, buffer, {
            contentType: avatarFile.type,
            upsert: true
        })

        if (uploadError) {
            return { error: uploadError.message, success: false }
        }

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
        finalAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    }

    const { error } = await supabase.auth.updateUser({
        data: {
            avatar_url: finalAvatarUrl,
            picture: finalAvatarUrl,
        },
    })

    if (error) {
        return { error: error.message, success: false }
    }

    revalidatePath('/', 'layout')
    return { error: undefined, success: true, message: `${t.settings.profile.avatar}${t.settings.successUpdate}` }
}

export async function deleteAccount(prevState: unknown, formData: FormData) {
    const supabase = await createClient()
    const t = await getTranslations()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: t.auth.notAuthenticated, success: false }
    }

    const confirmation = formData.get('confirmation') as string
    const expectedWord = t.danger.confirmPlaceholder

    if (confirmation !== expectedWord) {
        return { error: t.settings.dangerZone.incorrectConfirmation, success: false }
    }

    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login?deleted=true')
}
