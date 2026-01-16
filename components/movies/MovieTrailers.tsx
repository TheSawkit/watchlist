"use client"

import { Video } from "@/lib/tmdb"

interface MovieTrailersProps {
  trailers: Video[]
}

export function MovieTrailers({ trailers }: MovieTrailersProps) {
  if (trailers.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-text">Bande annonces</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trailers.map((trailer) => (
          <div
            key={trailer.id}
            className="relative aspect-video bg-surface rounded-lg overflow-hidden border border-border/20"
          >
            {trailer.site === "YouTube" ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface text-muted">
                <p className="text-sm">Format non supporté</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
