"use client"

import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

/**
 * Applies the persisted theme on mount and listens for system preference changes.
 * Reads the theme from localStorage and syncs it to the `<html>` element's class.
 * When set to "system", subscribes to `prefers-color-scheme` media query changes.
 */
export function useTheme() {
    useEffect(() => {
        const html = document.documentElement
        const raw = localStorage.getItem("theme")
        const savedTheme: Theme | null = raw === "light" || raw === "dark" || raw === "system" ? raw : null

        const resolvedTheme = resolveTheme(savedTheme)
        applyTheme(html, resolvedTheme)

        if (!savedTheme || savedTheme === "system") {
            return listenToSystemThemeChanges(html)
        }
    }, [])
}

function resolveTheme(savedTheme: Theme | null): "light" | "dark" {
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(html: HTMLElement, theme: "light" | "dark") {
    html.classList.remove("light", "dark")
    html.classList.add(theme)
}

function listenToSystemThemeChanges(html: HTMLElement): () => void {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(html, e.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
}
