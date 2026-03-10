"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function MovieError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
    }, [error])

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6 bg-surface-2 p-8 rounded-2xl border border-border/10 shadow-cinema">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-2">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-text">
                    Impossible de charger le film
                </h1>

                <p className="text-muted">
                    Une erreur est survenue lors de la récupération des détails de ce film. Le lien est peut-être invalide ou le service est temporairement indisponible.
                </p>

                <div className="flex flex-col gap-3 pt-6">
                    <Button onClick={() => reset()} className="w-full">
                        Réessayer de charger
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/explorer">Retour à l&apos;explorateur</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
