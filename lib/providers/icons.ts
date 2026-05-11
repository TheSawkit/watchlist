import {
    siNetflix,
    siAppletv,
    siItunes,
    siHbo,
    siHbomax,
    siMax,
    siCrunchyroll,
    siMubi,
    siDazn,
    siGoogleplay,
    siGoogletv,
    siYoutube,
    siPlex,
    siTubi,
    siShowtime,
    siStarz,
    siRakuten,
    siFandango,
    siSky,
    siNow,
    siFubo,
    siParamountplus,
} from 'simple-icons'

export interface ProviderIcon {
    path: string
    hex: string
}

const MAP: Record<string, ProviderIcon> = {
    'netflix': siNetflix,
    'apple tv+': siAppletv,
    'apple tv': siAppletv,
    'apple itunes': siItunes,
    'itunes': siItunes,
    'hbo max': siHbomax,
    'hbo': siHbo,
    'max': siMax,
    'crunchyroll': siCrunchyroll,
    'mubi': siMubi,
    'dazn': siDazn,
    'google play movies': siGoogleplay,
    'google play': siGoogleplay,
    'google tv': siGoogletv,
    'youtube': siYoutube,
    'youtube premium': siYoutube,
    'plex': siPlex,
    'tubi': siTubi,
    'showtime': siShowtime,
    'starz': siStarz,
    'rakuten tv': siRakuten,
    'rakuten': siRakuten,
    'fandango at home': siFandango,
    'fandango': siFandango,
    'sky': siSky,
    'sky go': siSky,
    'now tv': siNow,
    'now': siNow,
    'fubo': siFubo,
    'fubotv': siFubo,
    'paramount+': siParamountplus,
    'paramount plus': siParamountplus,
}

/** Returns a simple-icons icon for a VOD provider name, or null if not mapped.
 *  Normalizes input: lowercase + collapse spaces so "AppleTV+" matches "apple tv+". */
export function getProviderIcon(name: string): ProviderIcon | null {
    const normalized = name.toLowerCase().replace(/\s+/g, ' ').trim()
    if (MAP[normalized]) return MAP[normalized]
    // Also try with spaces inserted before uppercase runs (e.g. "AppleTV" → "appletv" → try without spaces)
    const noSpace = normalized.replace(/ /g, '')
    for (const key of Object.keys(MAP)) {
        if (key.replace(/ /g, '') === noSpace) return MAP[key]
    }
    return null
}
