"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HorizontalScrollProps } from "@/types/components"

export function HorizontalScroll({
  children,
  title,
  scrollAmount = 500,
  className = "",
  containerClassName = "",
}: HorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -scrollAmount : scrollAmount
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <div className={`group/section ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4 px-1">
          {title}
          <div className="hidden md:flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-surface/50 backdrop-blur-sm border-border/50 hover:bg-surface hover:text-red-2"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-surface/50 backdrop-blur-sm border-border/50 hover:bg-surface hover:text-red-2"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className={`flex gap-4 overflow-x-scroll overflow-y-visible pb-4 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
