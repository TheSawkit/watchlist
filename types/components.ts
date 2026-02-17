import type { ReactNode } from "react"
import type { Movie, MovieDetails, Cast, Video } from "@/types/tmdb"

// ─── Layout ──────────────────────────────────────────────

export interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

// ─── Movies ──────────────────────────────────────────────

export interface MovieGridProps {
  movies: Movie[]
}

export interface MovieCardProps {
  movie: Movie
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
}

export interface MovieSectionProps {
  title: string
  movies: Movie[]
  categoryUrl: string
}

export interface InfiniteScrollMoviesProps {
  initialMovies: Movie[]
  category: string
}

export interface MovieBannerProps {
  movie: MovieDetails
  backdropUrl: string
}

export interface MovieDescriptionProps {
  description: string
  tagline?: string
}

export interface MovieTrailersProps {
  trailers: Video[]
}

export interface MovieCastProps {
  cast: Cast[]
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

export interface PaginationProps {
  currentPage: number
  baseUrl: string
}

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
