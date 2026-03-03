import type { ReactNode } from "react"
import type { Movie, MovieDetails, Cast, Video, ActorDetails, ActorMovieCredit, ActorTvCredit } from "@/types/tmdb"

// ─── Layout ──────────────────────────────────────────────

export interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

// ─── Movies ──────────────────────────────────────────────

export type Tab = "movies" | "tv"
export type WatchStatus = "to_watch" | "watched"

export interface MovieGridProps {
  movies: Movie[]
}

export interface MovieCardProps {
  movie: Movie
  className?: string
}

export interface MovieSectionProps {
  title: string
  movies: Movie[]
  categoryUrl: string
}

export interface InfiniteScrollMoviesProps {
  initialMovies: Movie[]
  category: string
  clientSideData?: Movie[]
}

export interface MovieBannerProps {
  movie: MovieDetails
  backdropUrl: string
  actions?: React.ReactNode
}

export interface MovieDescriptionProps {
  description: string
}

export interface MovieTrailersProps {
  trailers: Video[]
}

export interface MovieCastProps {
  cast: Cast[]
}

export interface WatchlistEntry {
  id: string
  user_id: string
  movie_id: number
  movie_title: string
  poster_path: string | null
  status: WatchStatus
  created_at: string
  }

export interface WatchButtonProps {
    movieId: number
    movieTitle: string
    posterPath: string | null
    status: WatchStatus
    initialActive?: boolean
    fallbackStatus?: WatchStatus
    variant?: "icon" | "full"
}

// ─── Navigation ──────────────────────────────────────────

export interface NavbarMobileProps {
  user: {
    user_metadata: {
      full_name?: string
      picture?: string
      email?: string
    }
  }
}

export interface NavLinksProps {
  className?: string
  onLinkClick?: () => void
}

// ─── Shared ──────────────────────────────────────────────

export interface HorizontalScrollProps {
  children: ReactNode
  title?: ReactNode
  scrollAmount?: number
  className?: string
  containerClassName?: string
}

// ─── UI ──────────────────────────────────────────────────

export interface CinemaSpotlightProps {
  /**
   * Hauteur du projecteur en pixels
   * @default 500
   */
  height?: number
  /**
   * Largeur maximale du projecteur en pixels ou pourcentage
   * Si non spécifié, prend 100% de la largeur du device
   */
  maxWidth?: number | string
  /**
   * Intensité de l'opacité (0-1)
   * @default 0.35
   */
  intensity?: number
  /**
   * Position verticale (top offset)
   * @default "top-0"
   */
  position?: string
}

// ─── Actor ───────────────────────────────────────────────

export interface ActorBannerProps {
  actor: ActorDetails
}

export interface ActorBioProps {
  biography: string
}

export interface ActorFilmographyProps {
  movies: ActorMovieCredit[]
  tvShows: ActorTvCredit[]
}
