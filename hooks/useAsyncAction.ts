"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface UseAsyncActionResult {
    loading: boolean
    error: boolean
    execute: <T>(action: () => Promise<T>) => Promise<T | undefined>
}

/** Handles loading/error state and router refresh for async server action calls. */
export function useAsyncAction(): UseAsyncActionResult {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!error) return
        const id = setTimeout(() => setError(false), 3000)
        return () => clearTimeout(id)
    }, [error])

    async function execute<T>(action: () => Promise<T>): Promise<T | undefined> {
        setLoading(true)
        setError(false)
        try {
            const result = await action()
            router.refresh()
            return result
        } catch {
            setError(true)
            return undefined
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, execute }
}
