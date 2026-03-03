const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const TMDB_IMAGE_ORIGINAL_URL = "https://image.tmdb.org/t/p/original"

/**
 * Génère l'URL complète d'une image TMDB
 */
export function getImageUrl(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return "https://images.unsplash.com/vector-1756365681486-615455939f4e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (size === "original") {
    return `${TMDB_IMAGE_ORIGINAL_URL}${path}`;
  }
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}
