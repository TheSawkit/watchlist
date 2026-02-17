import type { Movie, ActorMovieCredit, ActorTvCredit } from "@/types/tmdb"

export function creditToMovie(credit: ActorMovieCredit): Movie {
    return {
        id: credit.id,
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

export function tvCreditToMovie(credit: ActorTvCredit): Movie {
    return {
        id: credit.id,
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
