import type { MediaImagesResponse } from "@/types/tmdb"

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/"

export type TMDBImageSize = 
  | "w92" 
  | "w154" 
  | "w185" 
  | "w342" 
  | "w500" 
  | "w780" 
  | "original"

export function getImageUrl(path: string | null, size: TMDBImageSize = "w500") {
  if (!path) return "https://images.unsplash.com/vector-1756365681486-615455939f4e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return `${TMDB_IMAGE_BASE_URL}${size}${path}`
}

export function selectHeroImage(
  images: MediaImagesResponse,
  defaultBackdrop: string | null
): string {
  const sortedBackdrops = [...(images.backdrops || [])]
    .filter((img) => img.file_path !== defaultBackdrop)
    .sort((a, b) => {
      if (b.vote_average !== a.vote_average) return b.vote_average - a.vote_average
      return b.vote_count - a.vote_count
    })

  return sortedBackdrops.length > 0 ? sortedBackdrops[0].file_path : (defaultBackdrop || "")
}
