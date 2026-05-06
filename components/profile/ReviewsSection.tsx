'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { deleteReview } from '@/app/actions/profile'
import { getImageUrl } from '@/lib/tmdb/images'
import type { Review, PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'
import { PrivacyBlock } from '@/components/ui/PrivacyBlock'
import { EmptyState } from '@/components/ui/EmptyState'
import { StarRating } from '@/components/ui/StarRating'
import { DeleteIconButton } from '@/components/ui/DeleteIconButton'

interface ReviewsSectionProps {
    reviews: Review[]
    visibility: PrivacyVisibility
    canView: boolean
    isOwnProfile: boolean
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

    if (!canView) return <PrivacyBlock visibility={visibility} />
    if (reviews.length === 0) return <EmptyState message={t.profile.noReviews} />

    return (
        <div className="space-y-3">
            {reviews.map((review) => (
                <article key={review.id} className="flex gap-3 p-3 rounded-lg bg-surface border border-border-subtle shadow-card-sm">
                    <Link href={`/${review.media_type}/${review.media_id}`} className="shrink-0">
                        <div className="relative w-12 aspect-2/3 rounded-poster overflow-hidden bg-surface-2">
                            {review.poster_path ? (
                                <Image
                                    src={getImageUrl(review.poster_path, 'w92')}
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
                        <DeleteIconButton
                            onClick={() => handleDelete(review.id)}
                            disabled={isPending}
                            ariaLabel={t.profile.deleteReview}
                        />
                    )}
                </article>
            ))}
        </div>
    )
}
