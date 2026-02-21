"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { NavLinksProps } from "@/types/components"

export function NavLinks({ className, onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Accueil" },
    { href: "/explorer", label: "Explorer" },
    { href: "/library", label: "Ma bibliothèque" },
  ]

  const isRow = className?.includes("flex-row")

  return (
    <nav className={cn(isRow ? "flex flex-row gap-8" : "flex flex-col gap-2", className)}>
      {links.map((link, index) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className={cn(
            "text-muted transition-all duration-300 hover:text-text text-nowrap relative group",
            !isRow && "px-4 py-2 rounded-md hover:bg-surface-2/50",
            pathname === link.href && "text-text",
            isRow && "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-2 after:w-0 after:transition-all after:duration-300 hover:after:w-full",
            isRow && pathname === link.href && "after:w-full"
          )}
          style={{
            animation: `slideUp 0.4s ease-out forwards`,
            animationDelay: `${index * 100}ms`,
            opacity: 0,
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
