'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Pencil } from 'lucide-react'
import { deleteReview } from '@/app/actions/reviews'
import { getImageUrl } from '@/lib/tmdb/images'
import type { Review, PrivacyVisibility } from '@/types/profile'
import { useTranslation } from '@/lib/i18n/context'
import { PrivacyBlock } from '@/components/ui/PrivacyBlock'
import { EmptyState } from '@/components/ui/EmptyState'
import { StarRating } from '@/components/ui/StarRating'
import { DeleteIconButton } from '@/components/ui/DeleteIconButton'
import { Button } from '@/components/ui/button'
import { ReviewDialog } from '@/components/media/ReviewDialog'

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
    const [editingReview, setEditingReview] = useState<Review | null>(null)

    const handleDelete = (reviewId: string) => {
        startTransition(async () => {
            await deleteReview(reviewId)
            setReviews(prev => prev.filter(r => r.id !== reviewId))
        })
    }

    if (!canView) return <PrivacyBlock visibility={visibility} />
    if (reviews.length === 0) return <EmptyState message={t.profile.noReviews} />

    return (
        <>
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
                                    <StarRating value={review.rating} size="sm" />
                                </div>
                            )}
                            {review.content && (
                                <p className="mt-1.5 text-sm text-muted leading-relaxed line-clamp-3">{review.content}</p>
                            )}
                        </div>

                        {isOwnProfile && (
                            <div className="flex items-start gap-0.5 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingReview(review)}
                                    className="h-8 w-8 p-0 text-muted hover:text-text"
                                    aria-label={t.movie.editReview}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <DeleteIconButton
                                    onClick={() => handleDelete(review.id)}
                                    disabled={isPending}
                                    ariaLabel={t.profile.deleteReview}
                                />
                            </div>
                        )}
                    </article>
                ))}
            </div>

            {editingReview && (
                <ReviewDialog
                    key={editingReview.id}
                    open={true}
                    onClose={() => setEditingReview(null)}
                    mediaId={editingReview.media_id}
                    mediaType={editingReview.media_type}
                    mediaTitle={editingReview.media_title}
                    posterPath={editingReview.poster_path}
                    existingReview={editingReview}
                    onSave={(rating, content) =>
                        setReviews(prev => prev.map(r =>
                            r.id === editingReview.id ? { ...r, rating, content } : r
                        ))
                    }
                    onDelete={() => setReviews(prev => prev.filter(r => r.id !== editingReview.id))}
                />
            )}
        </>
    )
}
