'use server'

import { getAuthenticatedUser } from '@/lib/supabase/auth-helpers'
import { getTranslations } from '@/lib/i18n/server'
import { revalidateProfile } from '@/app/actions/_helpers'
import type { MediaType } from '@/types/tmdb'
import type { Review } from '@/types/profile'

/**
 * Returns all reviews for a given user, newest first.
 *
 * @param userId - Supabase user ID.
 * @returns Array of Review objects.
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
 *
 * @param mediaId - TMDB media ID.
 * @param mediaType - 'movie' or 'tv'.
 * @returns Review or null.
 */
export async function getMediaReview(mediaId: number, mediaType: MediaType): Promise<Review | null> {
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
 * Creates or updates a review for a media item.
 *
 * @param mediaId - TMDB media ID.
 * @param mediaType - 'movie' or 'tv'.
 * @param mediaTitle - Display title of the media.
 * @param posterPath - TMDB poster path, or null.
 * @param rating - Integer 1–10, or null.
 * @param content - Review text up to 2000 chars, or null.
 */
export async function upsertReview(
    mediaId: number,
    mediaType: MediaType,
    mediaTitle: string,
    posterPath: string | null,
    rating: number | null,
    content: string | null
): Promise<void> {
    const t = await getTranslations()
    if (rating !== null && (rating < 1 || rating > 10 || !Number.isInteger(rating))) {
        throw new Error(t.profile.errors.ratingInvalid)
    }
    if (content && content.length > 2000) {
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
 *
 * @param reviewId - UUID of the review.
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
