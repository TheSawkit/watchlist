'use server'

import { getAuthenticatedUser, getOptionalUser } from '@/lib/supabase/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from '@/lib/i18n/server'
import { revalidateProfile } from '@/app/actions/_helpers'
import { getTvShowDetails, getSeasonDetails } from '@/lib/tmdb/tv'
import type { Review, PublicReview } from '@/types/profile'

type ReviewMediaType = 'movie' | 'tv' | 'episode'

/**
 * Returns all reviews for a given user, newest first.
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) throw new Error(error.message)
    return (data as Review[]) ?? []
}

/**
 * Returns the authenticated user's review for a specific media item, or null if none.
 */
export async function getMediaReview(mediaId: number, mediaType: ReviewMediaType): Promise<Review | null> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)
        .single()

    return (data as Review) ?? null
}

/**
 * Returns the community average rating (1–10 scale) and count for a media item.
 * Returns null if no ratings exist.
 */
export async function getAverageRating(
    mediaId: number,
    mediaType: ReviewMediaType
): Promise<{ avg: number; count: number } | null> {
    const supabase = await createClient()

    const { data } = await supabase.rpc('get_media_rating', { p_media_id: mediaId, p_media_type: mediaType })

    const row = (data as Array<{ avg: string | null; count: string }> | null)?.[0] ?? null
    if (!row || row.avg === null) return null
    return { avg: Number(row.avg), count: Number(row.count) }
}


/**
 * Returns the community average rating for a season, computed from episode ratings.
 * Returns null if no episode ratings exist for this season.
 */
export async function getSeasonAverageRating(
    tvId: number,
    seasonNumber: number
): Promise<{ avg: number; count: number } | null> {
    const supabase = await createClient()

    const season = await getSeasonDetails(tvId, seasonNumber)
    const episodeIds = season.episodes.map((e) => e.id)
    if (episodeIds.length === 0) return null

    const { data } = await supabase.rpc('get_episodes_rating', { p_episode_ids: episodeIds })

    const row = (data as Array<{ avg: string | null; count: string }> | null)?.[0] ?? null
    if (!row || row.avg === null) return null
    return { avg: Number(row.avg), count: Number(row.count) }
}

/**
 * Returns the community average rating for a show, computed from all episode ratings.
 * Returns null if no ratings exist.
 */
export async function getShowAverageRating(
    tvId: number
): Promise<{ avg: number; count: number } | null> {
    const supabase = await createClient()

    const show = await getTvShowDetails(tvId)
    const regularSeasons = show.seasons?.filter((s) => s.season_number !== 0) ?? []
    if (regularSeasons.length === 0) return null

    const seasonDetails = await Promise.all(
        regularSeasons.map((s) => getSeasonDetails(tvId, s.season_number))
    )

    const allEpisodeIds = seasonDetails.flatMap((s) => s.episodes.map((e) => e.id))
    if (allEpisodeIds.length === 0) return null

    const { data } = await supabase.rpc('get_episodes_rating', { p_episode_ids: allEpisodeIds })

    const row = (data as Array<{ avg: string | null; count: string }> | null)?.[0] ?? null
    if (!row || row.avg === null) return null
    return { avg: Number(row.avg), count: Number(row.count) }
}

/**
 * Returns public reviews for a media item, filtered by the viewer's auth/friendship status.
 */
export async function getPublicReviews(
    mediaId: number,
    mediaType: ReviewMediaType
): Promise<PublicReview[]> {
    const { supabase, userId } = await getOptionalUser()

    const { data, error } = await supabase.rpc('get_public_reviews', {
        p_media_id: mediaId,
        p_media_type: mediaType,
        p_viewer_id: userId,
    })

    if (error) {
        console.error('[getPublicReviews]', error.message)
        return []
    }
    return (data as PublicReview[]) ?? []
}

/**
 * Returns public reviews for a set of episode IDs, filtered by viewer's auth/friendship status.
 */
export async function getPublicEpisodeReviews(
    episodeIds: number[]
): Promise<PublicReview[]> {
    if (episodeIds.length === 0) return []
    const { supabase, userId } = await getOptionalUser()

    const { data, error } = await supabase.rpc('get_public_episode_reviews', {
        p_episode_ids: episodeIds,
        p_viewer_id: userId,
    })

    if (error) {
        console.error('[getPublicEpisodeReviews]', error.message)
        return []
    }
    return (data as PublicReview[]) ?? []
}

/**
 * Creates or updates a review. Rating stored as 1–10 integer; display as 0.5–5.0 stars.
 */
export async function upsertReview(
    mediaId: number,
    mediaType: ReviewMediaType,
    mediaTitle: string,
    posterPath: string | null,
    rating: number | null,
    content: string | null
): Promise<void> {
    const t = await getTranslations()
    if (!(['movie', 'tv', 'episode'] as const).includes(mediaType)) {
        throw new Error('Invalid media type')
    }
    if (rating !== null && (rating < 1 || rating > 10 || !Number.isInteger(rating))) {
        throw new Error(t.profile.errors.ratingInvalid)
    }
    if (content && content.length > 65000) {
        throw new Error(t.profile.errors.reviewTooLong)
    }

    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('reviews')
        .upsert(
            { user_id: userId, media_id: mediaId, media_type: mediaType, media_title: mediaTitle, poster_path: posterPath, rating, content, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,media_id,media_type' }
        )

    if (error) throw new Error(error.message)
    await revalidateProfile(supabase)
}

/**
 * Deletes a review owned by the authenticated user.
 */
export async function deleteReview(reviewId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    await revalidateProfile(supabase)
}
