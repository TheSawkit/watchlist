"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getImageUrl } from "@/lib/tmdb/images"
import type { MediaBannerProps } from "@/types/components"
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { getLocale } from "@/lib/i18n/utils"
import { formatDate, formatRuntime } from "@/lib/format"
import { cn } from "@/lib/utils"

/**
 * Large hero banner component displaying media details with parallax backdrop effect.
 * Shows title, poster, metadata badges, and action buttons in a sticky header on scroll.
 *
 * @param props - MediaBannerProps configuration
 * @param props.title - Media title
 * @param props.tagline - Optional tagline or motto
 * @param props.backdropUrl - Full backdrop image URL for parallax background
 * @param props.posterPath - Poster image path
 * @param props.voteAverage - IMDb-style rating score
 * @param props.releaseDate - Release/air date
 * @param props.runtime - Duration in minutes for movies or minutes per episode for TV
 * @param props.certification - Content rating (PG, R, etc.)
 * @param props.genres - Array of genre objects with id and name
 * @param props.actions - Optional React nodes for action buttons (WatchButton, etc.)
 * @returns Hero banner with scroll-aware sticky header
 */
export function MediaBanner({
    title,
    tagline,
    backdropUrl,
    posterPath,
    voteAverage,
    releaseDate,
    runtime,
    certification,
    genres,
    actions,
}: MediaBannerProps) {
    const { t, lang } = useTranslation()
    const locale = getLocale(lang)
    const [scrolled, setScrolled] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })

        const observer = new IntersectionObserver(
            ([entry]) => {
                setScrolled(!entry.isIntersecting)
            },
            { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
        )

        const currentRef = bottomRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            window.removeEventListener("scroll", handleScroll)
            if (currentRef) observer.unobserve(currentRef)
        }
    }, [])

    return (
        <>
            <div className={cn(
                "fixed top-16 inset-x-0 z-40 transition-all duration-(--duration-base) ease-in-out",
                scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
            )}>
                <div className="bg-surface/30 backdrop-blur-3xl backdrop-saturate-150 border-b border-border/10 shadow-card">
                    <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <button
                                onClick={() => window.history.back()}
                                aria-label={t.common.goBack}
                                className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-surface/10 hover:bg-surface/20 text-text transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="relative h-12 w-8 sm:h-14 sm:w-10 rounded overflow-hidden shrink-0 border border-border/10 shadow-card-xs hidden xs:block">
                                <Image
                                    src={getImageUrl(posterPath, "w154")}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-text font-bold text-sm sm:text-base truncate">
                                    {title}
                                </h2>
                                <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted mt-0.5 whitespace-nowrap overflow-hidden">
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Star className="h-3 w-3 text-(--color-rating-gold) fill-(--color-rating-gold)" />
                                        <span className="font-medium text-muted">
                                            {voteAverage && voteAverage > 0 ? voteAverage.toFixed(1) : t.movie.notRated}
                                        </span>
                                    </div>
                                    {releaseDate && (
                                        <div className="hidden sm:block shrink-0">{new Date(releaseDate).getFullYear()}</div>
                                    )}
                                    {runtime && runtime > 0 && (
                                        <div className="hidden sm:block shrink-0">{formatRuntime(runtime)}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {actions && (
                            <div className="flex items-center gap-2 shrink-0 scale-75 origin-right sm:scale-90">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative w-full -mt-16 min-h-[70vh] md:min-h-[80vh] flex flex-col justify-end pt-32 pb-12 overflow-hidden">
                <div
                    className="absolute inset-x-0 -top-[10%] h-full -z-10"
                >
                    <Image
                        src={backdropUrl}
                        alt={title}
                        fill
                        className="object-cover object-center opacity-70"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-app-bg via-app-bg/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-app-bg via-app-bg/40 to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-end pb-12">
                    <div className="w-full justify-start mb-6 md:mb-8 z-20 hidden md:flex">
                        <button
                            onClick={() => window.history.back()}
                            aria-label={t.common.goBack}
                            className="h-10 w-10 flex items-center justify-center rounded-full bg-surface/20 backdrop-blur-2xl border border-border/10 border-t-border/20 hover:bg-surface-2/20 shrink-0 text-text transition-colors cursor-pointer shadow-card-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start md:items-end pt-12 md:pt-0">
                        <div className="relative aspect-2/3 w-32 sm:w-40 md:w-48 lg:w-56 shrink-0 rounded-lg overflow-hidden border-2 border-gold/30 shadow-poster">
                            <Image
                                src={getImageUrl(posterPath, "w500")}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 128px, 224px"
                                priority
                            />
                        </div>

                        <div className="flex-1 max-w-4xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4 drop-shadow-text">
                                {title}
                            </h1>

                            {tagline && (
                                <p className="text-xl md:text-2xl text-text-muted mb-6 italic">
                                    {tagline}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4">
                                <HeroBadge icon={<Star className="h-5 w-5 fill-rating-gold text-rating-gold" />}>
                                    <span className="font-semibold text-text">
                                        {voteAverage && voteAverage > 0 ? voteAverage.toFixed(1) : t.movie.notRated}
                                    </span>
                                </HeroBadge>

                                {releaseDate && (
                                    <HeroBadge icon={<Calendar className="h-5 w-5 text-muted" />}>
                                        <span className="text-text">{formatDate(releaseDate, locale)}</span>
                                    </HeroBadge>
                                )}

                                {runtime && runtime > 0 && (
                                    <HeroBadge icon={<Clock className="h-5 w-5 text-muted" />}>
                                        <span className="text-text">{formatRuntime(runtime)}</span>
                                    </HeroBadge>
                                )}

                                {certification && (
                                    <HeroBadge>
                                        <span className="font-semibold text-text">
                                            {certification}
                                        </span>
                                    </HeroBadge>
                                )}
                            </div>

                            {genres && genres.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 mb-6">
                                    {genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="bg-glass-bg-hover text-text px-3.5 py-1.5 rounded-full text-sm font-medium border border-glass-border-hover backdrop-blur-xl"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {actions && (
                                <div ref={bottomRef} className="flex items-center gap-3 mt-2">{actions}</div>
                            )}

                            {!actions && <div ref={bottomRef} className="h-1 w-full" />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function HeroBadge({
    children,
    icon,
}: {
    children: React.ReactNode
    icon?: React.ReactNode
}) {
    return (
        <div className="flex items-center gap-2 bg-glass-bg-hover backdrop-blur-2xl backdrop-saturate-150 px-4 py-2 rounded-full border border-glass-border-hover shadow-card-sm">
            {icon}
            {children}
        </div>
    )
}
