'use client'

import Image from 'next/image'
import { Lock, Users, Trash2, Plus, ListVideo } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createPlaylist, deletePlaylist } from '@/app/actions/profile'
import type { Playlist, PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'

interface PlaylistsSectionProps {
    playlists: Playlist[]
    visibility: PrivacyVisibility
    canView: boolean
    isOwnProfile: boolean
}

function PlaylistCard({ playlist, isOwn, onDelete }: {
    playlist: Playlist
    isOwn: boolean
    onDelete: (id: string) => void
}) {
    const { t } = useTranslation()
    const [isPending, startTransition] = useTransition()
    const items = playlist.items ?? []
    const previewItems = items.slice(0, 4)

    return (
        <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-2">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-medium text-sm text-text truncate">{playlist.name}</p>
                    {playlist.description && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">{playlist.description}</p>
                    )}
                    <p className="text-xs text-muted mt-1">{items.length} {t.profile.items}</p>
                </div>
                {isOwn && (
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => startTransition(() => onDelete(playlist.id))}
                        className="shrink-0 h-8 w-8 p-0 text-muted hover:text-red"
                        aria-label={t.profile.deletePlaylist}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {previewItems.length > 0 && (
                <div className="flex gap-1.5">
                    {previewItems.map((item) => (
                        <div key={item.id} className="relative w-10 aspect-2/3 rounded-sm overflow-hidden bg-surface-2 shrink-0">
                            {item.poster_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                    alt={item.media_title}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface-3 flex items-center justify-center">
                                    <ListVideo className="h-3 w-3 text-muted opacity-40" />
                                </div>
                            )}
                        </div>
                    ))}
                    {items.length > 4 && (
                        <div className="w-10 aspect-2/3 rounded-sm bg-surface-2 flex items-center justify-center shrink-0">
                            <span className="text-xs text-muted">+{items.length - 4}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function CreatePlaylistForm({ onCreate }: { onCreate: (p: Playlist) => void }) {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        startTransition(async () => {
            await createPlaylist(name.trim(), description.trim() || null)
            onCreate({
                id: crypto.randomUUID(),
                user_id: '',
                name: name.trim(),
                description: description.trim() || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                items: [],
            })
            setName('')
            setDescription('')
            setOpen(false)
        })
    }

    if (!open) {
        return (
            <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                {t.profile.newPlaylist}
            </Button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="p-3 rounded-lg bg-surface border border-border-subtle space-y-2">
            <Input
                placeholder={t.profile.playlistName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
            />
            <Input
                placeholder={t.profile.playlistDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
                    {t.profile.createPlaylist}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    {t.common.cancel}
                </Button>
            </div>
        </form>
    )
}

export function PlaylistsSection({ playlists: initial, visibility, canView, isOwnProfile }: PlaylistsSectionProps) {
    const { t } = useTranslation()
    const [playlists, setPlaylists] = useState(initial)
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deletePlaylist(id)
            setPlaylists(prev => prev.filter(p => p.id !== id))
        })
    }

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

    return (
        <div className="space-y-3">
            {isOwnProfile && (
                <CreatePlaylistForm onCreate={(p) => setPlaylists(prev => [p, ...prev])} />
            )}
            {playlists.length === 0 && (
                <p className="text-muted text-sm py-8 text-center">{t.profile.noPlaylists}</p>
            )}
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    isOwn={isOwnProfile}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}
