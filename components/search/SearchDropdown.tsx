"use client"

import Link from "next/link"
import Image from "next/image"
import { PlayCircle } from "lucide-react"
import { Movie } from "@/types/tmdb"
import { getImageUrl } from "@/lib/tmdb-image"
import { useTranslation } from "@/lib/i18n/context"

interface SearchDropdownProps {
    query: string
    results: Movie[]
    isOpen: boolean
    isLoading: boolean
    onClose: () => void
}

export function SearchDropdown({ query, results, isOpen, isLoading, onClose }: SearchDropdownProps) {
    const { t } = useTranslation()

    if (!isOpen) return null

    if (query.length >= 2 && !isLoading && results.length === 0) {
        return (
            <div className="absolute top-full mt-2 w-full bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 text-center shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-muted italic text-lg">{t.pages.search.noResults} &quot;{query}&quot;</p>
            </div>
        )
    }

    if (results.length === 0) return null

    return (
        <div
            className="absolute top-full mt-2 w-full bg-surface/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(220, 38, 38, 0.1)" }}
        >
            <div className="p-2">
                {results.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-all group relative overflow-hidden"
                        onClick={onClose}
                    >
                        <div className="relative w-12 h-18 shrink-0 rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={getImageUrl(movie.poster_path, "w500")}
                                alt={movie.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-red/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-white text-shadow" />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-text truncate group-hover:text-red transition-colors duration-200">
                                {movie.title}
                            </span>
                            <span className="text-sm text-muted">
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                            </span>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            <span className="text-xs font-bold px-2 py-1 bg-red/10 text-red rounded-full border border-red/20">
                                {t.common.view}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="bg-white/5 px-4 py-3 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted">{t.explorer.searchResults}</span>
                <Link
                    href={`/explorer/search?q=${encodeURIComponent(query)}`}
                    className="text-xs font-bold text-red hover:underline"
                    onClick={onClose}
                >
                    {t.common.viewAll}
                </Link>
            </div>
        </div>
    )
}
