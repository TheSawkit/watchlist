"use server"

import { revalidatePath } from "next/cache"
import { getAuthenticatedUser, getOptionalUser } from "@/lib/supabase/auth-helpers"
import type { WatchStatus, WatchlistEntry } from "@/types/components"
import type { MediaType } from "@/types/tmdb"

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

export async function removeFromWatchlist(mediaId: number): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("media_id", mediaId)

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

export async function getMediaWatchlistStatus(mediaId: number): Promise<WatchStatus | null> {
    const { supabase, userId } = await getOptionalUser()

    if (!userId) return null

    const { data: statusResult } = await supabase
        .from("watchlist")
        .select("status")
        .eq("user_id", userId)
        .eq("media_id", mediaId)
        .single()

    return (statusResult?.status as WatchStatus) ?? null
}

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
