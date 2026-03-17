import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Creates a Supabase admin client with service_role privileges.
 * FOR SERVER-SIDE USE ONLY — never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 *
 * @returns Supabase client with admin privileges.
 */
export function createAdminClient() {
    return createSupabaseAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

/**
 * Creates a Supabase server client for use in server components and route handlers.
 * Reads and writes cookies via the Next.js `cookies()` API.
 *
 * @returns A configured Supabase server client instance.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Expected in Server Components where cookies are read-only
          }
        },
      },
    }
  )
}
