import type { MediaItem, ActorMovieCredit, ActorTvCredit } from "@/types/tmdb"
import type { WatchlistEntry } from "@/types/components"

export function watchlistEntryToMediaItem(entry: WatchlistEntry): MediaItem {
    return {
        id: entry.media_id,
        media_type: entry.media_type,
        title: entry.media_title,
        original_title: entry.media_title,
        overview: "",
        poster_path: entry.poster_path,
        backdrop_path: null,
        release_date: "",
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
    }
}

export function movieCreditToMediaItem(credit: ActorMovieCredit): MediaItem {
    return {
        id: credit.id,
        media_type: "movie",
        title: credit.title,
        original_title: credit.title,
        overview: credit.overview,
        poster_path: credit.poster_path,
        backdrop_path: credit.backdrop_path,
        release_date: credit.release_date,
        vote_average: credit.vote_average,
        vote_count: 0,
        popularity: credit.popularity,
    }
}

export function tvCreditToMediaItem(credit: ActorTvCredit): MediaItem {
    return {
        id: credit.id,
        media_type: "tv",
        title: credit.name,
        original_title: credit.name,
        overview: credit.overview,
        poster_path: credit.poster_path,
        backdrop_path: credit.backdrop_path,
        release_date: credit.first_air_date,
        vote_average: credit.vote_average,
        vote_count: 0,
        popularity: credit.popularity,
    }
}
