"use client"

import Image from "next/image"
import { Cast, getImageUrl } from "@/lib/tmdb"
import { HorizontalScroll } from "@/components/shared/HorizontalScroll"

interface MovieCastProps {
  cast: Cast[]
}

export function MovieCast({ cast }: MovieCastProps) {
  if (cast.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <HorizontalScroll
        title={<h2 className="text-2xl md:text-3xl font-bold text-text">Casting</h2>}
        scrollAmount={300}
      >
        {cast.map((actor, index) => (
          <div
            key={actor.id}
            className="flex-none w-32 md:w-36 snap-start flex flex-col items-center text-center space-y-2 group"
            style={{
              animation: `slideUp 0.5s ease-out forwards`,
              animationDelay: `${index * 30}ms`,
              opacity: 0,
            }}
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-surface border-2 border-border/20 group-hover:scale-105 group-hover:border-red-2/50 transition-all duration-300">
              <Image
                src={getImageUrl(actor.profile_path)}
                alt={actor.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 128px"
              />
            </div>
            <div className="space-y-1 w-full">
              <p className="font-semibold text-text text-sm md:text-base line-clamp-2">
                {actor.name}
              </p>
              <p className="text-xs md:text-sm text-muted line-clamp-2">
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </section>
  )
}
