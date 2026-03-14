import { notFound } from "next/navigation"
import { getActorDetails, getActorMovieCredits, getActorTvCredits } from "@/lib/tmdb"
import { ActorBanner } from "@/components/actor/ActorBanner"
import { ActorBio } from "@/components/actor/ActorBio"
import { ActorFilmography } from "@/components/actor/ActorFilmography"
import type { ActorPageProps } from "@/types/pages"
import { movieCreditToMediaItem, tvCreditToMediaItem } from "@/lib/mappers"
import { mergeMediaWithWatchlist } from "@/app/actions/media"

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
        <div className="min-h-screen">
            <ActorBanner actor={actor} />

            <div className="container mx-auto px-6 lg:px-12 py-8 space-y-12">
                <ActorBio biography={actor.biography} />

                <ActorFilmography movies={mergedMovies} tvShows={mergedTvShows} />
            </div>
        </div>
    )
}
