import { getServerLocale } from "@/lib/i18n/server"

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

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

export async function getUserRegion(): Promise<string> {
  const locale = await getServerLocale()
  return locale.split("-")[1]
}
