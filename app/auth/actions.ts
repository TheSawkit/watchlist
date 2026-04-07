'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n/server'
import { validateEmail, validatePassword, validateUsername, validateRegion, validateLanguage } from '@/lib/validators'

async function getOrigin(): Promise<string> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'reelmark.app'
  return `${proto}://${host}`
}

export async function login(prevState: unknown, formData: FormData) {
  const t = await getTranslations()
  const email = validateEmail(formData.get('email'))
  const password = validatePassword(formData.get('password'))

  if (!email || !password) return { error: t.settings.missingFields }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: unknown, formData: FormData) {
  const t = await getTranslations()

  const email = validateEmail(formData.get('email'))
  const password = validatePassword(formData.get('password'))
  const confirmPassword = formData.get('confirm-password')
  const username = validateUsername(formData.get('username'))
  const region = validateRegion(formData.get('region'))
  const language = validateLanguage(formData.get('language'))

  if (!email || !password || !username || !region) return { error: t.settings.missingFields }
  if (password !== confirmPassword) return { error: t.settings.password.noMatch }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: username,
        username,
        region,
        language,
      },
    },
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(prevState: unknown, formData: FormData) {
  const t = await getTranslations()
  const email = validateEmail(formData.get('email'))
  if (!email) return { error: t.settings.missingFields }

  const supabase = await createClient()
  const origin = await getOrigin()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/auth/update-password`,
  })

  if (error) return { error: error.message }

  return { error: '', success: true }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  const t = await getTranslations()
  const password = validatePassword(formData.get('password'))
  const confirmPassword = formData.get('confirm-password')
  if (!password) return { error: t.settings.missingFields }
  if (password !== confirmPassword) return { error: t.settings.password.noMatch }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
