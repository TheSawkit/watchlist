import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  baseUrl: string
}

export function Pagination({ currentPage, baseUrl }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage + 1

  return (
    <div className="flex justify-center gap-4 mt-12">
      <Button
        variant="outline"
        disabled={!prevPage}
        asChild={!!prevPage}
        className="gap-2"
      >
        {prevPage ? (
          <Link href={`${baseUrl}?page=${prevPage}`}>
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Link>
        ) : (
          <span>
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </span>
        )}
      </Button>

      <div className="flex items-center px-4 font-mono bg-surface rounded-md border border-border/50">
        Page {currentPage}
      </div>

      <Button
        variant="outline"
        asChild
        className="gap-2"
      >
        <Link href={`${baseUrl}?page=${nextPage}`}>
          Suivant
          <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )
}
