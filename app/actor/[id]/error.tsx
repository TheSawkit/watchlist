"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"

export default function ActorError({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { t } = useTranslation()

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/10 text-red mb-4">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-text">
                    {t.common.errorTitle}
                </h1>

                <p className="text-muted text-lg">
                    {t.common.errorDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button onClick={() => reset()} className="w-full sm:w-auto min-w-35">
                        {t.common.errorRetry}
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto min-w-35">
                        <Link href="/explorer">{t.common.backToExplorer}</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
