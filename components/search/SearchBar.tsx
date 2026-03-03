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
        <div className="relative w-full max-w-2xl mx-auto mb-12" ref={dropdownRef}>
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted transition-colors group-focus-within:text-red">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
                <Input
                    type="text"
                    placeholder={t.pages.search.placeholder}
                    className="pl-10 pr-10 py-6 h-14 bg-surface/50 backdrop-blur-md border-border hover:border-red/50 focus:border-red text-lg shadow-xl transition-all duration-300 rounded-2xl"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                />
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
