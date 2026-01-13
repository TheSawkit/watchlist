"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const categories = [
  { name: "Tendances", href: "/explorer/trending" },
  { name: "Au cinéma", href: "/explorer/now-playing" },
  { name: "Populaires", href: "/explorer/popular" },
  { name: "Mieux notés", href: "/explorer/top-rated" },
  { name: "À venir", href: "/explorer/upcoming" },
]

export function CategoryNav() {
  const pathname = usePathname()

  return (
    /* TODO: Fix overflow-y-visible for the scroll container. */
    <div className="flex overflow-x-scroll overflow-y-visible pb-2 mb-8 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <Link
        href="/explorer"
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
          pathname === "/explorer"
            ? "bg-red text-text shadow-lg shadow-red/20"
            : "bg-surface-2 text-muted hover:text-text hover:bg-surface-3"
        )}
      >
        Vue d&apos;ensemble
      </Link>
      {categories.map((category) => (
        <Link
          key={category.href}
          href={category.href}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            pathname === category.href
              ? "bg-red text-text shadow-lg shadow-red/20"
              : "bg-surface-2 text-muted hover:text-text hover:bg-surface-3"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
