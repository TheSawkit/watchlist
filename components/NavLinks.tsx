"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinksProps {
  className?: string
  onLinkClick?: () => void
}

export function NavLinks({ className, onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/explorer", label: "Explorer" },
    { href: "/library", label: "Ma bibliothèque" },
  ]

  const isRow = className?.includes("flex-row")

  return (
    <nav className={cn(isRow ? "flex flex-row gap-8" : "flex flex-col gap-2", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            "text-muted transition-colors hover:text-text text-nowrap",
            !isRow && "px-4 py-2 rounded-md",
            pathname === link.href && "text-text bg-surface-2"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
