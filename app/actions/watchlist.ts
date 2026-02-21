"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WatchStatus, WatchlistEntry } from "@/types/components"

export async function addToWatchlist(
    movieId: number,
    movieTitle: string,
    posterPath: string | null,
    status: WatchStatus
): Promise<void> {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

    if (!user) throw new Error("Non authentifié")

    const { error } = await supabase
        .from("watchlist")
        .upsert(
            { user_id: user.id, movie_id: movieId, movie_title: movieTitle, poster_path: posterPath, status },
            { onConflict: "user_id,movie_id" }
        )

    if (error) throw new Error(error.message)

    revalidatePath("/library")
    revalidatePath("/dashboard")
    revalidatePath("/")
    revalidatePath("/movie/[id]", "layout")
}

export async function removeFromWatchlist(movieId: number): Promise<void> {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

if (!user) throw new Error("Non authentifié")

const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)

if (error) throw new Error(error.message)

revalidatePath("/library")
revalidatePath("/dashboard")
revalidatePath("/")
revalidatePath("/movie/[id]", "layout")
}

export async function getUserWatchlist(): Promise<WatchlistEntry[]> {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

if (!user) return []

const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

if (error) throw new Error(error.message)

return data ?? []
}

export async function getMovieWatchlistStatus(movieId: number): Promise<WatchStatus | null> {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

if (!user) return null

const { data } = await supabase
    .from("watchlist")
    .select("status")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .single()

return (data?.status as WatchStatus) ?? null
}

export async function getMovieWatchlistEntry(movieId: number): Promise<WatchlistEntry | null> {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .single()

    return data as WatchlistEntry ?? null
}
