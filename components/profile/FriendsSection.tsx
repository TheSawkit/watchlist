'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lock, Users } from 'lucide-react'
import type { FriendEntry, PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'

interface FriendsSectionProps {
    friends: FriendEntry[]
    visibility: PrivacyVisibility
    canView: boolean
}

export function FriendsSection({ friends, visibility, canView }: FriendsSectionProps) {
    const { t } = useTranslation()

    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
                {visibility === 'private' ? (
                    <>
                        <Lock className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">{t.profile.private}</p>
                    </>
                ) : (
                    <>
                        <Users className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">{t.profile.friendsOnly}</p>
                    </>
                )}
            </div>
        )
    }

    if (friends.length === 0) {
        return <p className="text-muted text-sm py-8 text-center">{t.profile.noFriends}</p>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {friends.map(({ friendship, username, avatarUrl, fullName }) => {
                const displayName = fullName || username
                const initials = displayName.slice(0, 2).toUpperCase()

                return (
                    <Link
                        key={friendship.id}
                        href={`/profile/${username}`}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-surface border border-border-subtle hover:bg-surface-2 transition-colors"
                    >
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={displayName}
                                width={48}
                                height={48}
                                className="rounded-full object-cover border border-border"
                                unoptimized
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                                <span className="text-sm font-bold text-muted">{initials}</span>
                            </div>
                        )}
                        <div className="text-center min-w-0 w-full">
                            <p className="text-sm font-medium text-text truncate">{displayName}</p>
                            <p className="text-xs text-muted truncate">@{username}</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
