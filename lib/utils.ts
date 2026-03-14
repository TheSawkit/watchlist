import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge.
 * Resolves Tailwind conflicts (e.g. `p-2` + `p-4` → `p-4`).
 *
 * @param inputs - Any number of class values, conditionals, or arrays.
 * @returns A single merged class string.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
