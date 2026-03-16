const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
    const now = Date.now()
    if (now - lastCleanup < CLEANUP_INTERVAL) return
    lastCleanup = now

    for (const [key, value] of rateLimitStore) {
        if (now > value.resetAt) rateLimitStore.delete(key)
    }
}

export function checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
    cleanup()

    const now = Date.now()
    const key = identifier
    const existing = rateLimitStore.get(key)

    if (!existing || now > existing.resetAt) {
        const resetAt = now + windowMs
        rateLimitStore.set(key, { count: 1, resetAt })
        return { allowed: true, remaining: maxRequests - 1, resetAt }
    }

    existing.count++
    const allowed = existing.count <= maxRequests
    return {
        allowed,
        remaining: Math.max(0, maxRequests - existing.count),
        resetAt: existing.resetAt,
    }
}
