import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number
}

export function StarRating({ rating }: StarRatingProps) {
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
