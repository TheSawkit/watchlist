'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Lock, Users, Star, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteReview } from '@/app/actions/profile'
import type { Review } from '@/types/profile'
import type { PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'

interface ReviewsSectionProps {
    reviews: Review[]
    visibility: PrivacyVisibility
    canView: boolean
    isOwnProfile: boolean
}

function StarRating({ rating }: { rating: number }) {
    const stars = Math.round(rating / 2)
    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating}/10`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${i < stars ? 'fill-gold text-gold' : 'text-muted opacity-40'}`}
                />
            ))}
            <span className="ml-1 text-xs text-muted">{rating}/10</span>
        </div>
    )
}

export function ReviewsSection({ reviews: initial, visibility, canView, isOwnProfile }: ReviewsSectionProps) {
    const { t } = useTranslation()
    const [reviews, setReviews] = useState(initial)
    const [isPending, startTransition] = useTransition()

    const handleDelete = (reviewId: string) => {
        startTransition(async () => {
            await deleteReview(reviewId)
            setReviews(prev => prev.filter(r => r.id !== reviewId))
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

    if (reviews.length === 0) {
        return <p className="text-muted text-sm py-8 text-center">{t.profile.noReviews}</p>
    }

    return (
        <div className="space-y-3">
            {reviews.map((review) => (
                <article key={review.id} className="flex gap-3 p-3 rounded-lg bg-surface border border-border-subtle">
                    <Link href={`/${review.media_type}/${review.media_id}`} className="shrink-0">
                        <div className="relative w-12 aspect-2/3 rounded-poster overflow-hidden bg-surface-2">
                            {review.poster_path ? (
                                <Image
                                    src={`https://image.tmdb.org/t/p/w92${review.poster_path}`}
                                    alt={review.media_title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface-3" />
                            )}
                        </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                        <Link href={`/${review.media_type}/${review.media_id}`}>
                            <p className="font-medium text-sm text-text hover:text-primary transition-colors truncate">
                                {review.media_title}
                            </p>
                        </Link>
                        {review.rating != null && (
                            <div className="mt-1">
                                <StarRating rating={review.rating} />
                            </div>
                        )}
                        {review.content && (
                            <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-3">{review.content}</p>
                        )}
                    </div>

                    {isOwnProfile && (
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleDelete(review.id)}
                            className="shrink-0 h-8 w-8 p-0 text-muted hover:text-red"
                            aria-label={t.profile.deleteReview}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </article>
            ))}
        </div>
    )
}
