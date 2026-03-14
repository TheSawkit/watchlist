import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

/**
 * Centered page wrapper with consistent horizontal and vertical padding.
 *
 * @param children - Page content.
 * @param className - Additional classes merged with the base container styles.
 */
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("container mx-auto py-12 px-6 lg:px-12", className)}>
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
}

/**
 * Animated page header with a title and an optional subtitle.
 * Slides up on mount via the `slideUp` keyframe animation.
 *
 * @param title - Primary heading text.
 * @param subtitle - Optional secondary description.
 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div
      className="mb-10"
      style={{ animation: "slideUp var(--duration-slower) ease-out forwards", opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-2 text-text-main">{title}</h1>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  )
}
