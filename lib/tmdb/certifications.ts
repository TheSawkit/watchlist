import type { ReleaseDatesResponse, ContentRatingsResponse } from "@/types/tmdb"

export function findLocalCertification(releaseDates: ReleaseDatesResponse, userRegion: string): string | undefined {
  const fallbackCountries = ["FR", "US", "GB", "DE", "ES", "IT"]
  const allCountries = [userRegion, ...fallbackCountries.filter((c) => c !== userRegion)]

  for (const countryCode of allCountries) {
    const countryRelease = releaseDates.results.find((r) => r.iso_3166_1 === countryCode)
    const validCert = countryRelease?.release_dates.find((rd) => rd.certification?.trim())
    if (validCert) return `+${validCert.certification.trim()}`
  }

  return undefined
}

export function findTvCertification(ratings: ContentRatingsResponse, userRegion: string): string | undefined {
  const fallbackCountries = ["FR", "US", "GB", "DE", "ES", "IT"]
  const allCountries = [userRegion, ...fallbackCountries.filter((c) => c !== userRegion)]

  for (const countryCode of allCountries) {
    const rating = ratings.results.find((r) => r.iso_3166_1 === countryCode)
    if (rating?.rating?.trim()) return `+${rating.rating.trim()}`
  }

  return undefined
}
