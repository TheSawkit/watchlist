import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface StaggeredItemProps {
  index: number
  staggerMs?: number
  animation?: string
  duration?: string
  className?: string
  children: ReactNode
}

/**
 * Wrapper that applies a staggered enter animation to its children based on their index.
 * Starts invisible (opacity 0) and animates in with a delay of `index × staggerMs`.
 *
 * @param index - Position in the list; drives the animation delay.
 * @param staggerMs - Delay multiplier in milliseconds per item (default: 50).
 * @param animation - CSS animation name to apply (default: "slideUp").
 * @param duration - CSS duration value, supports custom properties (default: "var(--duration-slow)").
 * @param className - Additional classes for the wrapper element.
 * @param children - Content to animate.
 *
 * @example
 * {items.map((item, index) => (
 *   <StaggeredItem key={item.id} index={index} className="flex-none w-40 snap-start">
 *     <MediaCard media={item} />
 *   </StaggeredItem>
 * ))}
 */
export function StaggeredItem({
  index,
  staggerMs = 50,
  animation = "slideUp",
  duration = "var(--duration-slow)",
  className,
  children,
}: StaggeredItemProps) {
  return (
    <div
      className={cn(className)}
      style={{
        animation: `${animation} ${duration} ease-out forwards`,
        animationDelay: `${index * staggerMs}ms`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  )
}
