"use server"

import { revalidatePath } from "next/cache"
import { getAuthenticatedUser, getOptionalUser } from "@/lib/supabase/auth-helpers"
import type { WatchStatus, WatchlistEntry, MediaType } from "@/types/tmdb"

function revalidateWatchlistPaths() {
    revalidatePath("/library")
    revalidatePath("/dashboard")
    revalidatePath("/")
    revalidatePath("/movie/[id]", "layout")
    revalidatePath("/tv/[id]", "layout")
}

/**
 * Adds or updates a media item in the authenticated user's watchlist.
 * Uses upsert to handle both insert and update in a single operation.
 *
 * @param mediaId - TMDB media ID.
 * @param mediaTitle - Display title of the media.
 * @param posterPath - TMDB relative poster path, or null.
 * @param status - Watchlist status ("to_watch" or "watched").
 * @param mediaType - Type of media (default: "movie").
 * @throws Error if the database operation fails.
 */
export async function addToWatchlist(
    mediaId: number,
    mediaTitle: string,
    posterPath: string | null,
    status: WatchStatus,
    mediaType: MediaType = "movie"
): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from("watchlist")
        .upsert(
            {
                user_id: userId,
                media_id: mediaId,
                media_title: mediaTitle,
                poster_path: posterPath,
                status,
                media_type: mediaType,
            },
            { onConflict: "user_id,media_id,media_type" }
        )

    if (error) throw new Error(error.message)

    revalidateWatchlistPaths()
}

/**
 * Removes a media item from the authenticated user's watchlist.
 * Requires both `mediaId` and `mediaType` to avoid cross-type deletion.
 *
 * @param mediaId - TMDB media ID.
 * @param mediaType - Type of media (default: "movie").
 * @throws Error if the database operation fails.
 */
export async function removeFromWatchlist(mediaId: number, mediaType: MediaType = "movie"): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType)

    if (error) throw new Error(error.message)

    revalidateWatchlistPaths()
}

/**
 * Returns all watchlist entries for the authenticated user, sorted by creation date descending.
 * Returns an empty array for unauthenticated users.
 *
 * @returns Array of watchlist entries.
 */
export async function getUserWatchlist(): Promise<WatchlistEntry[]> {
    const { supabase, userId } = await getOptionalUser()

    if (!userId) return []

    const { data: entries, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)

    return entries ?? []
}

/**
 * Returns the full watchlist entry for a specific media item, or null if not in the watchlist.
 * Returns null for unauthenticated users.
 *
 * @param mediaId - TMDB media ID.
 * @returns Watchlist entry or null.
 */
export async function getMediaWatchlistEntry(mediaId: number): Promise<WatchlistEntry | null> {
    const { supabase, userId } = await getOptionalUser()

    if (!userId) return null

    const { data: entry } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .single()

    return entry as WatchlistEntry ?? null
}

/**
 * Returns watchlist entries for a list of media IDs.
 * Returns an empty array for unauthenticated users or empty input.
 *
 * @param mediaIds - Array of TMDB media IDs to look up.
 * @returns Array of matching watchlist entries.
 */
export async function getMediaWatchlistEntries(mediaIds: number[]): Promise<WatchlistEntry[]> {
    const { supabase, userId } = await getOptionalUser()

    if (!userId || mediaIds.length === 0) return []

    const { data: entries, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .in("media_id", mediaIds)

    if (error) throw new Error(error.message)

    return (entries as WatchlistEntry[]) ?? []
}
