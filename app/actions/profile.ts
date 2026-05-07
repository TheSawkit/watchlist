'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth-helpers'
import { formStr } from '@/lib/validators'
import { getTranslations } from '@/lib/i18n/server'
import type { MediaType } from '@/types/tmdb'
import type { PrivacySettings, PrivacyDefaults, PrivacyVisibility, Review, Playlist, UserProfile, Friendship } from '@/types/profile'

const VALID_VISIBILITY = new Set<PrivacyVisibility>(['public', 'friends', 'private'])

function toVisibility(value: FormDataEntryValue | null): PrivacyVisibility {
    if (typeof value === 'string' && VALID_VISIBILITY.has(value as PrivacyVisibility)) {
        return value as PrivacyVisibility
    }
    return 'public'
}

async function revalidateProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: { user } } = await supabase.auth.getUser()
    const username = user?.user_metadata?.username as string | undefined
    if (username) revalidatePath(`/profile/${username}`)
}

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
    const { supabase } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('username', username)
        .single()

    return (data as UserProfile) ?? null
}

export async function updateSocialLinks(prevState: unknown, formData: FormData) {
    const { supabase, userId } = await getAuthenticatedUser()
    const t = await getTranslations()

    const { data: { user } } = await supabase.auth.getUser()
    const username = user?.user_metadata?.username as string | undefined

    if (!username) return { error: t.settings.social.errors.usernameRequired, success: false }

    const bio = formStr(formData, 'bio')
    const instagram = formStr(formData, 'instagram')
    const tiktok = formStr(formData, 'tiktok')
    const letterboxd = formStr(formData, 'letterboxd')
    const twitter = formStr(formData, 'twitter')
    const website = formStr(formData, 'website')

    if (bio && bio.length > 500) return { error: t.settings.social.errors.bioTooLong, success: false }
    if (instagram && instagram.length > 50) return { error: t.settings.social.errors.instagramTooLong, success: false }
    if (tiktok && tiktok.length > 50) return { error: t.settings.social.errors.tiktokTooLong, success: false }
    if (letterboxd && letterboxd.length > 50) return { error: t.settings.social.errors.letterboxdTooLong, success: false }
    if (twitter && twitter.length > 50) return { error: t.settings.social.errors.twitterTooLong, success: false }
    if (website) {
        if (!/^https?:\/\//.test(website)) return { error: t.settings.social.errors.websiteInvalid, success: false }
        if (website.length > 2000) return { error: t.settings.social.errors.websiteTooLong, success: false }
    }

    const { error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: userId, username, bio, instagram, tiktok, letterboxd, twitter, website, updated_at: new Date().toISOString() })

    if (error) return { error: error.message, success: false }

    revalidatePath(`/profile/${username}`)
    return { error: undefined, success: true, message: 'Profile updated' }
}

export async function getPrivacySettings(userId: string): Promise<PrivacySettings> {
    const { supabase } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

    const fallback: PrivacyDefaults = {
        watchlist_visibility: 'public',
        watched_visibility: 'public',
        reviews_visibility: 'public',
        playlists_visibility: 'public',
        friends_visibility: 'public',
    }
    return (data as PrivacySettings) ?? { user_id: userId, ...fallback }
}

export async function updatePrivacySettings(prevState: unknown, formData: FormData) {
    const { supabase, userId } = await getAuthenticatedUser()

    const settings = {
        user_id: userId,
        watchlist_visibility: toVisibility(formData.get('watchlist_visibility')),
        watched_visibility: toVisibility(formData.get('watched_visibility')),
        reviews_visibility: toVisibility(formData.get('reviews_visibility')),
        playlists_visibility: toVisibility(formData.get('playlists_visibility')),
        friends_visibility: toVisibility(formData.get('friends_visibility')),
    }

    const { error } = await supabase.from('privacy_settings').upsert(settings)

    if (error) return { error: error.message, success: false }

    await revalidateProfile(supabase)
    return { error: undefined, success: true, message: 'Privacy settings updated' }
}

export async function getUserReviews(userId: string): Promise<Review[]> {
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as Review[]) ?? []
}

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

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('playlists')
        .select('*, items:playlist_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as Playlist[]) ?? []
}

export async function createPlaylist(name: string, description: string | null): Promise<void> {
    const t = await getTranslations()
    if (!name.trim() || name.length > 100) throw new Error(t.profile.errors.playlistNameInvalid)
    if (description && description.length > 500) throw new Error(t.profile.errors.descriptionTooLong)

    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase.from('playlists').insert({ user_id: userId, name, description })

    if (error) throw new Error(error.message)
    await revalidateProfile(supabase)
}

export async function updatePlaylist(playlistId: string, name: string, description: string | null): Promise<void> {
    const t = await getTranslations()
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length > 100) throw new Error(t.profile.errors.playlistNameInvalid)
    if (description && description.length > 500) throw new Error(t.profile.errors.descriptionTooLong)

    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('playlists')
        .update({ name: trimmedName, description: description?.trim() || null, updated_at: new Date().toISOString() })
        .eq('id', playlistId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    await revalidateProfile(supabase)
}

export async function deletePlaylist(playlistId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', userId)

    if (error) throw new Error(error.message)
    await revalidateProfile(supabase)
}

export async function addToPlaylist(
    playlistId: string,
    mediaId: number,
    mediaType: MediaType,
    mediaTitle: string,
    posterPath: string | null
): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { data: playlist } = await supabase
        .from('playlists')
        .select('user_id')
        .eq('id', playlistId)
        .single()

    if (!playlist || playlist.user_id !== userId) throw new Error('Playlist not found')

    const { error } = await supabase
        .from('playlist_items')
        .upsert(
            { playlist_id: playlistId, media_id: mediaId, media_type: mediaType, media_title: mediaTitle, poster_path: posterPath },
            { onConflict: 'playlist_id,media_id,media_type' }
        )

    if (error) throw new Error(error.message)
}

export async function removeFromPlaylist(playlistId: string, mediaId: number, mediaType: MediaType): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { data: playlist } = await supabase
        .from('playlists')
        .select('user_id')
        .eq('id', playlistId)
        .single()

    if (!playlist || playlist.user_id !== userId) throw new Error('Playlist not found')

    const { error } = await supabase
        .from('playlist_items')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType)

    if (error) throw new Error(error.message)
}

export async function getFriends(userId: string): Promise<Friendship[]> {
    const { supabase } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted')

    if (error) throw new Error(error.message)
    return (data as Friendship[]) ?? []
}

export async function getPendingRequests(): Promise<Friendship[]> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('addressee_id', userId)
        .eq('status', 'pending')

    if (error) throw new Error(error.message)
    return (data as Friendship[]) ?? []
}

export async function getFriendshipStatus(targetUserId: string): Promise<Friendship | null> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { data } = await supabase
        .from('friendships')
        .select('*')
        .or(
            `and(requester_id.eq.${userId},addressee_id.eq.${targetUserId}),` +
            `and(requester_id.eq.${targetUserId},addressee_id.eq.${userId})`
        )
        .single()

    return (data as Friendship) ?? null
}

export async function sendFriendRequest(addresseeId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('friendships')
        .insert({ requester_id: userId, addressee_id: addresseeId })

    if (error) throw new Error(error.message)
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', friendshipId)
        .eq('addressee_id', userId)

    if (error) throw new Error(error.message)
}

export async function rejectFriendRequest(friendshipId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', friendshipId)
        .eq('addressee_id', userId)

    if (error) throw new Error(error.message)
}

export async function removeFriend(friendshipId: string): Promise<void> {
    const { supabase, userId } = await getAuthenticatedUser()

    const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

    if (error) throw new Error(error.message)
}
