import type { ReactNode } from "react"
import type { MediaItem, MediaType, Cast, Video, ActorDetails, ActorMovieCredit, ActorTvCredit } from "@/types/tmdb"

export interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export type WatchStatus = "to_watch" | "watched"

export interface MediaGridProps {
  items: MediaItem[]
}

export interface MediaCardProps {
  media: MediaItem
  className?: string
}

export interface MediaSectionProps {
  title: string
  items: MediaItem[]
  categoryUrl: string
}

export interface InfiniteScrollMediaProps {
  initialItems: MediaItem[]
  category: string
  mediaType?: MediaType
  clientSideData?: MediaItem[]
}

export interface MediaBannerProps {
  title: string
  tagline?: string
  backdropUrl: string
  posterPath: string | null
  voteAverage: number
  releaseDate?: string
  runtime?: number
  certification?: string
  genres?: { id: number; name: string }[]
  actions?: ReactNode
}

export interface MediaDescriptionProps {
  description: string
}

export interface MediaTrailersProps {
  trailers: Video[]
}

export interface MediaCastProps {
  cast: Cast[]
}

export interface WatchlistEntry {
  id: string
  user_id: string
  media_id: number
  media_title: string
  media_type: MediaType
  poster_path: string | null
  status: WatchStatus
  created_at: string
}

export interface WatchButtonProps {
  mediaId: number
  mediaTitle: string
  mediaType: MediaType
  posterPath: string | null
  status: WatchStatus
  initialActive?: boolean
  fallbackStatus?: WatchStatus
  variant?: "icon" | "full"
}

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

export interface HorizontalScrollProps {
  children: ReactNode
  title?: ReactNode
  scrollAmount?: number
  className?: string
  containerClassName?: string
}

export interface CinemaSpotlightProps {
  height?: number
  maxWidth?: number | string
  intensity?: number
  position?: string
}

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
