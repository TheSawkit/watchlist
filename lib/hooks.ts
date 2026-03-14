import { useState, useEffect, RefObject } from "react"
import type { InViewOptions } from "@/types/hooks"

/**
 * Observes whether a DOM element is intersecting the viewport.
 *
 * @param ref - React ref pointing to the element to observe.
 * @param options - Optional `IntersectionObserver` options (root, rootMargin, threshold).
 * @returns `true` while the element is intersecting the viewport.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const isVisible = useInView(ref, { rootMargin: "0px 0px -100px 0px" })
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
