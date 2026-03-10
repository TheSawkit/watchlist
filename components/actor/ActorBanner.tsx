"use client"

import Image from "next/image"
import { getImageUrl } from "@/lib/tmdb/images"
import type { ActorBannerProps } from "@/types/components"
import { MapPin, Calendar, Star } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { getLocale } from "@/lib/i18n/utils"

export function ActorBanner({ actor }: ActorBannerProps) {
    const { t, lang } = useTranslation()
    const locale = getLocale(lang)

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    }

    const getAge = (birthday: string | null, deathday: string | null) => {
        if (!birthday) return null
        const birth = new Date(birthday)
        const end = deathday ? new Date(deathday) : new Date()
        const age = Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        return age
    }

    const age = getAge(actor.birthday, actor.deathday)

    return (
        <div className="relative w-full overflow-hidden">

            <div className="absolute inset-0 bg-linear-to-b from-red/10 via-bg to-bg" />

            <div className="relative z-10 container mx-auto px-6 lg:px-12 py-12 md:py-16">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">

                    <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0 rounded-full overflow-hidden border-4 border-gold/30 shadow-cinema">
                        <Image
                            src={getImageUrl(actor.profile_path)}
                            alt={actor.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                        />
                    </div>


                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4">
                            {actor.name}
                        </h1>

                        <p className="text-lg text-muted mb-6">
                            {actor.known_for_department === "Acting" ? t.movie.actorActress : actor.known_for_department}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4">
                            {actor.birthday && (
                                <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/20">
                                    <Calendar className="h-4 w-4 text-muted" />
                                    <span className="text-sm text-text">
                                        {formatDate(actor.birthday)}
                                        {age !== null && ` (${age} ${t.common.age})`}
                                    </span>
                                </div>
                            )}

                            {actor.deathday && (
                                <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/20">
                                    <Calendar className="h-4 w-4 text-red-2" />
                                    <span className="text-sm text-text">
                                        † {formatDate(actor.deathday)}
                                    </span>
                                </div>
                            )}

                            {actor.place_of_birth && (
                                <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/20">
                                    <MapPin className="h-4 w-4 text-muted" />
                                    <span className="text-sm text-text">{actor.place_of_birth}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/20">
                                <Star className="h-4 w-4 fill-gold text-gold" />
                                <span className="text-sm font-semibold text-text">
                                    {(actor.popularity || 0).toFixed(0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
