'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n/server'
import { validateEmail, validatePassword, validateUsername, validateRegion, validateLanguage } from '@/lib/validators'
import { checkRateLimit } from '@/lib/rate-limit'

async function getClientIp(): Promise<string> {
    const h = await headers()
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}

export async function login(prevState: unknown, formData: FormData) {
  const ip = await getClientIp()
  const { allowed } = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)
  if (!allowed) return { error: 'Too many login attempts. Please try again later.' }

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
  const ip = await getClientIp()
  const { allowed } = checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000)
  if (!allowed) return { error: 'Too many signup attempts. Please try again later.' }

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
