"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"
import type { LucideIcon } from "lucide-react"

interface ErrorCardProps {
  reset: () => void
  icon: LucideIcon
  backHref?: string
}

/**
 * Displays a centered error state with a retry button and a back navigation link.
 *
 * @param error - The caught error object, optionally including a digest.
 * @param reset - Callback to retry the failed render boundary.
 * @param icon - Lucide icon component rendered inside the error card.
 * @param backHref - Optional href for the back button (defaults to "/explorer").
 *
 * @example
 * <ErrorCard error={error} reset={reset} icon={AlertTriangle} />
 */
export function ErrorCard({ reset, icon: Icon, backHref = "/explorer" }: ErrorCardProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-2 p-8 rounded-(--radius-xl) border border-border/10 shadow-cinema">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-2">
          <Icon className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-text">
          {t.common.errorTitle}
        </h1>

        <p className="text-muted">
          {t.common.errorDescription}
        </p>

        <div className="flex flex-col gap-3 pt-6">
          <Button onClick={() => reset()} className="w-full">
            {t.common.errorRetry}
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href={backHref}>{t.common.backToExplorer}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
