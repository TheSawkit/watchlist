"use client"

import { useState, useEffect } from "react"
import { Movie } from "@/types/tmdb"

export function useSearchSuggestions(query: string) {
    const [results, setResults] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
                const data = await response.json()
                setResults(data.results?.slice(0, 6) || [])
                setIsOpen(true)
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const timer = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timer)
    }, [query])

    return { results, isLoading, isOpen, setIsOpen, setResults }
}
