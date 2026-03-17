"use client"

import { useState, useEffect, RefObject } from "react"
import type { InViewOptions } from "@/types/hooks"

/**
 * Observes whether a DOM element is intersecting the viewport.
 * Used by InfiniteScrollMedia to trigger loading the next page.
 */
export function useInView(
    ref: RefObject<Element | null>,
    options: InViewOptions = {}
): boolean {
    const [isIntersecting, setIsIntersecting] = useState(false)

    const { root, rootMargin, threshold } = options

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, { root, rootMargin, threshold })

        observer.observe(element)

        return () => observer.unobserve(element)
    }, [ref, root, rootMargin, threshold])

    return isIntersecting
}
