import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client for use in client components.
 * Uses the public URL and anon key from environment variables.
 *
 * @returns A configured Supabase browser client instance.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )
}
