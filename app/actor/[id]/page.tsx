import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getActorDetails, getActorMovieCredits, getActorTvCredits } from "@/lib/tmdb"
import { ActorBanner } from "@/components/actor/ActorBanner"
import { ActorBio } from "@/components/actor/ActorBio"
import { ActorFilmography } from "@/components/actor/ActorFilmography"
import type { ActorPageProps } from "@/types/pages"
import { movieCreditToMediaItem, tvCreditToMediaItem } from "@/lib/mappers"
import { mergeMediaWithWatchlist } from "@/app/actions/media"
import { getTranslations } from "@/lib/i18n/server"

/**
 * Generates metadata for actor detail page for SEO and social sharing.
 * Fetches actor data and constructs OpenGraph and Twitter card information.
 *
 * @param props - Route parameters
 * @param props.params - Promise resolving to { id: string } actor ID
 * @returns Metadata object with title, description, OpenGraph, and Twitter card data
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const actorId = parseInt(id)
  const t = await getTranslations()

  if (isNaN(actorId)) {
    return {
      title: "ReelMark",
      description: t.metadata.defaultActorDescription,
    }
  }

  try {
    const actor = await getActorDetails(actorId)
    const profileImage = actor.profile_path
      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
      : undefined

    const images = profileImage ? [{ url: profileImage, width: 500, height: 750 }] : []
    const bioDescription = actor.biography?.substring(0, 160) || t.metadata.exploreActorOn.replace("${name}", actor.name)

    return {
      title: `${actor.name} - ReelMark`,
      description: bioDescription,
      openGraph: {
        title: `${actor.name} - ReelMark`,
        description: bioDescription,
        type: "profile",
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${actor.name} - ReelMark`,
        description: bioDescription,
        images: images.length > 0 ? [images[0].url] : undefined,
      },
    }
  } catch {
    return {
      title: "ReelMark",
      description: t.metadata.defaultActorDescription,
    }
  }
}

export default async function ActorPage(props: ActorPageProps) {
    const params = await props.params
    const actorId = parseInt(params.id)

    if (isNaN(actorId)) {
        notFound()
    }

    let actor, movieCredits, tvCredits

    try {
        [actor, movieCredits, tvCredits] = await Promise.all([
            getActorDetails(actorId),
            getActorMovieCredits(actorId),
            getActorTvCredits(actorId),
        ])
    } catch {
        notFound()
    }

    const mergedMovies = await mergeMediaWithWatchlist(movieCredits.map(movieCreditToMediaItem))
    const mergedTvShows = await mergeMediaWithWatchlist(tvCredits.map(tvCreditToMediaItem))

    return (
        <main className="min-h-screen">
            <ActorBanner actor={actor} />

            <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
                <ActorBio biography={actor.biography} />

                <ActorFilmography movies={mergedMovies} tvShows={mergedTvShows} />
            </div>
        </main>
    )
}
