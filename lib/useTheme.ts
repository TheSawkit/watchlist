"use client"

import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

/**
 * Applique le thème sauvegardé (localStorage) et écoute les changements de préférence système.
 */
export function useTheme() {
    useEffect(() => {
        const html = document.documentElement
        const savedTheme = localStorage.getItem("theme") as Theme | null

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
