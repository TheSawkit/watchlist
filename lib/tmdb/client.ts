import { getServerLocale } from "@/lib/i18n/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

/**
 * Fetches data from the TMDB API with automatic locale and API key injection.
 * Responses are cached for 1 hour via Next.js `fetch` revalidation.
 *
 * @param endpoint - TMDB API path (e.g. "/movie/popular").
 * @param params - Additional query string parameters to append.
 * @returns Parsed JSON response typed as `T`.
 * @throws Error if `TMDB_API_KEY` is missing or the response is not OK.
 */
export async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not defined.")
  }

  const locale = await getServerLocale()

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: locale,
    ...params,
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`
  const response = await fetch(url, { next: { revalidate: 3600 } })

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

import { createClient } from "@/lib/supabase/server"

/**
 * Resolves the current user's region from their Supabase profile metadata.
 * Falls back to the server locale's country code, then "US" if unavailable.
 *
 * @returns ISO 3166-1 alpha-2 country code in uppercase (e.g. "FR", "US").
 */
export async function getUserRegion(): Promise<string> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.user_metadata?.region) {
      return user.user_metadata.region.toUpperCase()
    }
  } catch {
  }

  const locale = await getServerLocale()
  if (locale.includes("-")) {
    return locale.split("-")[1].toUpperCase()
  }

  return "US"
}
