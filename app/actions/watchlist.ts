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

export async function getMediaWatchlistEntry(
    mediaId: number,
    mediaType: MediaType = "movie"
): Promise<WatchlistEntry | null> {
    const { supabase, userId } = await getOptionalUser()

    if (!userId) return null

    const { data: entry } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .eq("media_type", mediaType)
        .single()

    return entry as WatchlistEntry ?? null
}

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
