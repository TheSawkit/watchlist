"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/context"
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions"
import { SearchDropdown } from "./SearchDropdown"

/**
 * Search input with live suggestions dropdown and navigation to full search page.
 * Handles clearing input and click-outside dismissal of suggestions.
 *
 * @returns Search bar with input field, loading state, and dropdown results
 * @example
 * // Used in navbar or page headers for searching media
 * <SearchBar />
 */
export function SearchBar() {
    const { t } = useTranslation()
    const [query, setQuery] = useState("")
    const { results, isLoading, isOpen, setIsOpen } = useSearchSuggestions(query)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [setIsOpen])

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (query.trim().length < 2) return

        setIsOpen(false)
        router.push(`/explorer/search?q=${encodeURIComponent(query.trim())}`)
    }

    return (
        <div className="relative w-full max-w-3xl mx-auto mb-8 md:mb-12" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group flex items-center">
                <Input
                    type="text"
                    placeholder={t.pages.search.placeholder}
                    className="pl-16 pr-10 py-3 h-16 bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-glass-border-hover focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background text-base shadow-card transition-all duration-[var(--duration-base)] ease-[var(--ease-apple)] rounded-(--radius-xl)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />

                <div className="absolute left-0 inset-y-0 pl-5 flex items-center pointer-events-none group-focus-within:text-red transition-all duration-[var(--duration-fast)] ease-[var(--ease-apple)]">
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Search className="w-6 h-6 text-muted transition-all duration-[var(--duration-fast)] ease-[var(--ease-apple)] group-focus-within:scale-110" />
                            <div className="w-px h-7 bg-border/30" />
                        </div>
                    )}
                </div>

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label={t.common.clearSearch}
                        className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-text transition-all duration-[var(--duration-fast)] ease-[var(--ease-apple)] hover:scale-110"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </form>

            <SearchDropdown
                query={query}
                results={results}
                isOpen={isOpen}
                isLoading={isLoading}
                onClose={() => setIsOpen(false)}
            />
        </div>
    )
}
