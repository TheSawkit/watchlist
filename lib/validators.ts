const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_\-\s]{1,50}$/
const VALID_REGIONS = new Set(["BE", "FR", "US", "CA", "GB", "CH", "LU"])
const VALID_LANGUAGES = new Set(["fr", "en"])
const ALLOWED_AVATAR_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"])
const ALLOWED_AVATAR_MIMES = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_AVATAR_SIZE = 5 * 1024 * 1024

export function sanitizeRedirectPath(path: string | null, fallback: string): string {
    if (!path) return fallback
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) return fallback
    return path
}

export function validateEmail(email: unknown): string | null {
    if (typeof email !== 'string' || !email.trim()) return null
    if (!EMAIL_REGEX.test(email.trim())) return null
    if (email.length > 254) return null
    return email.trim()
}

export function validatePassword(password: unknown): string | null {
    if (typeof password !== 'string') return null
    if (password.length < 8 || password.length > 128) return null
    return password
}

export function validateUsername(username: unknown): string | null {
    if (typeof username !== 'string' || !username.trim()) return null
    if (!USERNAME_REGEX.test(username.trim())) return null
    return username.trim()
}

export function validateRegion(region: unknown): string | null {
    if (typeof region !== 'string') return null
    const upper = region.toUpperCase()
    if (!VALID_REGIONS.has(upper)) return null
    return upper
}

export function validateLanguage(language: unknown): string {
    if (typeof language !== 'string') return 'en'
    return VALID_LANGUAGES.has(language) ? language : 'en'
}

export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_AVATAR_SIZE) {
        return { valid: false, error: 'File too large (max 5MB)' }
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_AVATAR_EXTENSIONS.has(ext)) {
        return { valid: false, error: 'Invalid file extension (allowed: jpg, jpeg, png, webp)' }
    }

    if (!ALLOWED_AVATAR_MIMES.has(file.type)) {
        return { valid: false, error: 'Invalid file type (allowed: image/jpeg, image/png, image/webp)' }
    }

    return { valid: true }
}
