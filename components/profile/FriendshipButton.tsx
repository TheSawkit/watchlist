'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react'
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
} from '@/app/actions/friends'
import type { Friendship } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'

interface FriendshipButtonProps {
    targetUserId: string
    currentUserId: string
    friendship: Friendship | null
}

export function FriendshipButton({ targetUserId, currentUserId, friendship }: FriendshipButtonProps) {
    const { t } = useTranslation()
    const [isPending, startTransition] = useTransition()
    const [localFriendship, setLocalFriendship] = useState<Friendship | null>(friendship)

    const handleSendRequest = () => {
        startTransition(async () => {
            await sendFriendRequest(targetUserId)
            setLocalFriendship({
                id: crypto.randomUUID(),
                requester_id: currentUserId,
                addressee_id: targetUserId,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
        })
    }

    const handleAccept = () => {
        if (!localFriendship) return
        startTransition(async () => {
            await acceptFriendRequest(localFriendship.id)
            setLocalFriendship({ ...localFriendship, status: 'accepted' })
        })
    }

    const handleReject = () => {
        if (!localFriendship) return
        startTransition(async () => {
            await rejectFriendRequest(localFriendship.id)
            setLocalFriendship(null)
        })
    }

    const handleRemove = () => {
        if (!localFriendship) return
        startTransition(async () => {
            await removeFriend(localFriendship.id)
            setLocalFriendship(null)
        })
    }

    if (!localFriendship) {
        return (
            <Button size="sm" onClick={handleSendRequest} disabled={isPending} className="gap-2">
                <UserPlus className="h-4 w-4" />
                {t.profile.addFriend}
            </Button>
        )
    }

    if (localFriendship.status === 'accepted') {
        return (
            <Button size="sm" variant="outline" onClick={handleRemove} disabled={isPending} className="gap-2">
                <UserMinus className="h-4 w-4" />
                {t.profile.removeFriend}
            </Button>
        )
    }

    if (localFriendship.status === 'pending' && localFriendship.requester_id === currentUserId) {
        return (
            <Button size="sm" variant="outline" disabled className="gap-2 opacity-70">
                <Clock className="h-4 w-4" />
                {t.profile.requestSent}
            </Button>
        )
    }

    if (localFriendship.status === 'pending' && localFriendship.addressee_id === currentUserId) {
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={handleAccept} disabled={isPending} className="gap-2">
                    <UserCheck className="h-4 w-4" />
                    {t.profile.acceptRequest}
                </Button>
                <Button size="sm" variant="outline" onClick={handleReject} disabled={isPending}>
                    {t.profile.rejectRequest}
                </Button>
            </div>
        )
    }

    return null
}
