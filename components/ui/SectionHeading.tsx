import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

/**
 * A section heading with a decorative red accent bar on the left.
 *
 * @param children - Heading text or elements.
 * @param className - Additional classes merged with the base styles.
 *
 * @example
 * <SectionHeading>Cast & Crew</SectionHeading>
 */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2 className={cn("text-xl font-bold text-text-main flex items-center gap-2", className)}>
      <div className="w-1 h-6 bg-primary rounded-full shrink-0" aria-hidden="true" />
      {children}
    </h2>
  )
}
