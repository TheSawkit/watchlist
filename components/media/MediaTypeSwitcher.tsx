"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Film, Tv } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"
import { startTransition } from "react"

interface MediaTypeSwitcherProps {
    defaultType?: "movie" | "tv"
}

export function MediaTypeSwitcher({ defaultType = "movie" }: MediaTypeSwitcherProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentType = searchParams.get("type") || defaultType

    const setType = (type: "movie" | "tv") => {
        if (currentType === type) return

        const params = new URLSearchParams(searchParams.toString())
        params.set("type", type)

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-surface-2 rounded-xl border border-border/40 shadow-sm">
                <button
                    onClick={() => setType("movie")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                        currentType === "movie"
                            ? "bg-red text-text shadow-cinema"
                            : "text-muted hover:text-text hover:bg-surface/50"
                    )}
                >
                    <Film className="w-4 h-4" />
                    {t.movie.films}
                </button>
                <button
                    onClick={() => setType("tv")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                        currentType === "tv"
                            ? "bg-red text-text shadow-cinema"
                            : "text-muted hover:text-text hover:bg-surface/50"
                    )}
                >
                    <Tv className="w-4 h-4" />
                    {t.movie.series}
                </button>
            </div>
        </div>
    )
}
