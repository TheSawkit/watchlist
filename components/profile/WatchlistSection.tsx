'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lock, Users } from 'lucide-react'
import type { WatchlistEntry } from '@/types/tmdb'
import type { PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'

interface WatchlistSectionProps {
    entries: WatchlistEntry[]
    visibility: PrivacyVisibility
    canView: boolean
    status: 'to_watch' | 'watched'
}

export function WatchlistSection({ entries, visibility, canView, status }: WatchlistSectionProps) {
    const { t } = useTranslation()

    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
                {visibility === 'private' ? (
                    <>
                        <Lock className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">{t.profile.private}</p>
                        <p className="text-xs opacity-60">{t.profile.privateDesc}</p>
                    </>
                ) : (
                    <>
                        <Users className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">{t.profile.friendsOnly}</p>
                        <p className="text-xs opacity-60">{t.profile.friendsOnlyDesc}</p>
                    </>
                )}
            </div>
        )
    }

    if (entries.length === 0) {
        return (
            <p className="text-muted text-sm py-8 text-center">{t.profile.noContent}</p>
        )
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {entries.map((entry) => (
                <Link
                    key={entry.id}
                    href={`/${entry.media_type}/${entry.media_id}`}
                    className="group block"
                >
                    <div className="relative aspect-2/3 rounded-poster overflow-hidden bg-surface-2 shadow-card-sm">
                        {entry.poster_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w300${entry.poster_path}`}
                                alt={entry.media_title}
                                fill
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-(--duration-normal)"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-muted text-xs text-center px-1 leading-tight">{entry.media_title}</span>
                            </div>
                        )}
                        {status === 'watched' && (
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                    <p className="mt-1.5 text-xs text-muted truncate leading-tight">{entry.media_title}</p>
                </Link>
            ))}
        </div>
    )
}
