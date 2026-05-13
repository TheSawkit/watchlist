"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/context"
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions"
import { SearchDropdown } from "./SearchDropdown"

export function SearchBarCompact() {
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
        <div className="relative w-full" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group flex items-center" role="search">
                <label htmlFor="search-input-compact" className="sr-only">{t.pages.search.placeholder}</label>
                <Input
                    id="search-input-compact"
                    type="text"
                    placeholder={t.pages.search.placeholder}
                    autoComplete="off"
                    className="pl-10 pr-8 py-2 h-10 bg-surface-2/50 backdrop-blur border border-border/30 hover:border-border/50 focus-visible:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background text-sm shadow-sm transition-all duration-(--duration-fast) ease-apple rounded-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />

                <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none group-focus-within:text-primary transition-all duration-(--duration-fast) ease-apple">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted" />
                    ) : (
                        <Search className="w-4 h-4 text-muted transition-all duration-(--duration-fast) ease-apple group-focus-within:scale-110" />
                    )}
                </div>

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label={t.common.clearSearch}
                        className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-text transition-all duration-(--duration-fast) ease-apple"
                    >
                        <X className="w-4 h-4" />
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
