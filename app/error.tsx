"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
    }, [error])

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/10 text-red mb-4">
                    <AlertCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-text">
                    Oups! Un problème est survenu
                </h1>

                <p className="text-muted text-lg">
                    Une erreur inattendue empêche l&apos;affichage de cette page. Nous nous en excusons.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button onClick={() => reset()} className="w-full sm:w-auto min-w-35">
                        Réessayer
                    </Button>
                    <Button variant="outline" asChild className="w-full sm:w-auto min-w-35">
                        <Link href="/dashboard">Retour à l&apos;accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
