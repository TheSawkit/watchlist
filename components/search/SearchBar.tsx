"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/context"
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions"
import { SearchDropdown } from "./SearchDropdown"

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
        <div className="relative w-full max-w-2xl mx-auto mb-6 md:mb-10" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group flex items-center">
                <Input
                    type="text"
                    placeholder={t.pages.search.placeholder}
                    className="pl-16 pr-10 py-6 h-14 bg-surface/40 backdrop-blur-xl border-border/10 hover:border-primary/30 focus-visible:border-primary/50 text-lg shadow-card transition-all duration-(--duration-base) rounded-(--radius-xl)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />

                <div className="absolute left-0 inset-y-0 pl-4 flex items-center pointer-events-none group-focus-within:text-red transition-colors duration-(--duration-base)">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <Search className="w-5 h-5 text-muted transition-transform duration-(--duration-base) group-focus-within:scale-110" />
                            <div className="w-px h-6 bg-border" />
                        </div>
                    )}
                </div>

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-text transition-colors"
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
