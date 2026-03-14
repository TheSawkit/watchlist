"use client"

import { AlertTriangle } from "lucide-react"
import { ErrorCard } from "@/components/ui/ErrorCard"

export default function TvShowError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard reset={reset} icon={AlertTriangle} />
}
