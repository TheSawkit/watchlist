import { getServerLocale, getServerLanguage } from "@/lib/i18n/server"
import { createClient } from "@/lib/supabase/server"

const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_MAX_PAGE = 500

const REGION_MERGE_CONFIG: Record<string, string[]> = {
  BE: ["BE", "FR"],
}

export function clampPage(page: number): number {
  return Math.max(1, Math.min(page, TMDB_MAX_PAGE))
}

export function getMergeRegions(region: string): string[] | null {
  return REGION_MERGE_CONFIG[region] ?? null
}

export async function getImageLanguageFilter(): Promise<string> {
  const lang = await getServerLanguage()
  const languages = new Set(["null", lang, "en"])
  return Array.from(languages).join(",")
}

/**
 * Fetches data from the TMDB API with Bearer auth and automatic locale injection.
 * Responses are cached via Next.js `fetch` revalidation.
 *
 * @param endpoint - TMDB API path (e.g. "/movie/popular").
 * @param params - Additional query string parameters to append.
 * @param revalidate - Cache revalidation interval in seconds (default: 3600).
 * @returns Parsed JSON response typed as `T`.
 * @throws Error if `TMDB_READ_ACCESS_TOKEN` is missing or the response is not OK.
 */
export async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}, revalidate = 3600): Promise<T> {
  if (!TMDB_READ_ACCESS_TOKEN) {
    throw new Error("TMDB_READ_ACCESS_TOKEN is not defined.")
  }

  const locale = await getServerLocale()

  const queryParams = new URLSearchParams({ language: locale, ...params })

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}` },
    next: { revalidate },
  })

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

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
  } catch { /* unauthenticated */ }

  const locale = await getServerLocale()
  if (locale.includes("-")) {
    return locale.split("-")[1].toUpperCase()
  }

  return "US"
}
