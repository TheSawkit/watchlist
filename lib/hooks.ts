import { useState, useEffect, RefObject } from "react"
import type { InViewOptions } from "@/types/hooks"

export function useInView(
  ref: RefObject<Element | null>,
  options: InViewOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options.root, options.rootMargin, options.threshold, options])

  return isIntersecting
}
