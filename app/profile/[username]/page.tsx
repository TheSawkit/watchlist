import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PageLayout } from '@/components/ui/PageLayout'
import { ProfileHero } from '@/components/profile/ProfileHero'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { FriendshipButton } from '@/components/profile/FriendshipButton'
import {
    getProfileByUsername,
    getPrivacySettings,
    getUserReviews,
    getUserPlaylists,
    getFriends,
    getFriendshipStatus,
} from '@/app/actions/profile'
import type { WatchlistEntry } from '@/types/tmdb'
import type { FriendEntry, UserProfile } from '@/types/profile'

interface Props {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
    const { username } = await params
    return {
        title: `@${username}`,
        robots: { index: false, follow: false },
    }
}

export default async function ProfilePage({ params }: Props) {
    const { username } = await params
    const currentUser = await requireAuth()

    const profile = await getProfileByUsername(username)
    if (!profile) notFound()

    const isOwnProfile = currentUser.id === profile.user_id

    const supabase = await createClient()
    const adminClient = createAdminClient()

    const [privacy, reviews, playlists, rawFriends, friendship, watchlistData] = await Promise.all([
        getPrivacySettings(profile.user_id),
        getUserReviews(profile.user_id),
        getUserPlaylists(profile.user_id),
        getFriends(profile.user_id),
        isOwnProfile ? Promise.resolve(null) : getFriendshipStatus(profile.user_id),
        supabase.from('watchlist').select('*').eq('user_id', profile.user_id).order('created_at', { ascending: false }),
    ])

    const watchlist = (watchlistData.data ?? []) as WatchlistEntry[]
    const toWatch = watchlist.filter(e => e.status === 'to_watch')
    const watched = watchlist.filter(e => e.status === 'watched')
    const isFriend = friendship?.status === 'accepted'

    const friendUserIds = rawFriends.map(f =>
        f.requester_id === profile.user_id ? f.addressee_id : f.requester_id
    )

    const friendEntries: FriendEntry[] = []
    if (friendUserIds.length > 0) {
        const { data: friendProfiles } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', friendUserIds)

        const friendAuthUsers = await Promise.all(
            friendUserIds.map(id => adminClient.auth.admin.getUserById(id))
        )

        for (const f of rawFriends) {
            const friendId = f.requester_id === profile.user_id ? f.addressee_id : f.requester_id
            const friendProfile = friendProfiles?.find(p => p.user_id === friendId) as UserProfile | undefined
            const authResult = friendAuthUsers.find(r => r.data.user?.id === friendId)
            const meta = authResult?.data.user?.user_metadata
            if (!friendProfile) continue
            friendEntries.push({
                friendship: f,
                username: friendProfile.username,
                avatarUrl: typeof meta?.avatar_url === 'string' ? meta.avatar_url : undefined,
                fullName: typeof meta?.full_name === 'string' ? meta.full_name : undefined,
            })
        }
    }

    const ownerAuth = await adminClient.auth.admin.getUserById(profile.user_id)
    const ownerMeta = ownerAuth.data.user?.user_metadata
    const avatarUrl = typeof ownerMeta?.avatar_url === 'string' ? ownerMeta.avatar_url : undefined
    const fullName = typeof ownerMeta?.full_name === 'string' ? ownerMeta.full_name : undefined

    return (
        <PageLayout>
            <ProfileHero
                profile={profile}
                avatarUrl={avatarUrl}
                fullName={fullName}
                isOwnProfile={isOwnProfile}
                friendshipButton={!isOwnProfile ? (
                    <FriendshipButton
                        targetUserId={profile.user_id}
                        currentUserId={currentUser.id}
                        friendship={friendship}
                    />
                ) : undefined}
            />
            <ProfileTabs
                toWatch={toWatch}
                watched={watched}
                reviews={reviews}
                playlists={playlists}
                friends={friendEntries}
                privacy={privacy}
                isOwnProfile={isOwnProfile}
                isFriend={isFriend}
            />
        </PageLayout>
    )
}
