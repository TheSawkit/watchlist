import { test, expect } from "@playwright/test"
import { hasValidAuth } from "../../helpers/auth"

// Fight Club (1999) — stable TMDB entry for tests
const MOVIE_ID = 550
const MOVIE_TITLE = "Fight Club"

test.beforeEach(() => {
    test.skip(!hasValidAuth(), "No valid auth session — skipping authenticated tests")
})

test.describe("Watchlist", () => {
    test("add and remove a movie from watchlist", async ({ page }) => {
        await page.goto(`/movie/${MOVIE_ID}`)
        await expect(page.getByRole("heading", { level: 1 })).toContainText(MOVIE_TITLE, { timeout: 10000 })

        // Clean state: remove if already in list
        // Use hasText to target only the full-variant WatchButton (has text content)
        // The icon variant (stickyActions) is opacity-0 before scroll and has aria-label only
        const addedBtn = page.locator("button").filter({ hasText: /^ajouté$|^added$/i }).first()
        if (await addedBtn.isVisible()) {
            await addedBtn.click()
            await expect(page.locator("button").filter({ hasText: /ajouter à la liste|add to list/i }).first()).toBeVisible({ timeout: 5000 })
        }

        // Add to list — optimistic update makes button text change immediately
        await page.locator("button").filter({ hasText: /ajouter à la liste|add to list/i }).first().click()
        await expect(page.locator("button").filter({ hasText: /^ajouté$|^added$/i }).first()).toBeVisible({ timeout: 5000 })

        // Verify the movie appears in library
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).toBeVisible({ timeout: 10000 })

        // Remove from list
        await page.goto(`/movie/${MOVIE_ID}`)
        await page.locator("button").filter({ hasText: /^ajouté$|^added$/i }).first().click()
        await expect(page.locator("button").filter({ hasText: /ajouter à la liste|add to list/i }).first()).toBeVisible({ timeout: 5000 })

        // Verify removed from library
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).not.toBeVisible()
    })

    test("mark a movie as watched and unmark", async ({ page }) => {
        await page.goto(`/movie/${MOVIE_ID}`)
        await expect(page.getByRole("heading", { level: 1 })).toContainText(MOVIE_TITLE, { timeout: 10000 })

        // Clean state: unmark if already watched
        const watchedBtn = page.locator("button").filter({ hasText: /^vu$|^watched$/i }).first()
        if (await watchedBtn.isVisible()) {
            await watchedBtn.click()
            await expect(page.locator("button").filter({ hasText: /marquer comme vu|mark as watched/i }).first()).toBeVisible({ timeout: 5000 })
        }

        // Mark as watched — optimistic update changes button text immediately
        await page.locator("button").filter({ hasText: /marquer comme vu|mark as watched/i }).first().click()
        await expect(page.locator("button").filter({ hasText: /^vu$|^watched$/i }).first()).toBeVisible({ timeout: 5000 })

        // Verify in library (Watched tab)
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).toBeVisible({ timeout: 10000 })

        // Clean up: navigate back and unmark (fallbackStatus="to_watch" moves it back, no ReviewDialog)
        await page.goto(`/movie/${MOVIE_ID}`)
        await expect(page.locator("button").filter({ hasText: /^vu$|^watched$/i }).first()).toBeVisible({ timeout: 5000 })
        await page.locator("button").filter({ hasText: /^vu$|^watched$/i }).first().click()
        await expect(page.locator("button").filter({ hasText: /^vu$|^watched$/i }).first()).not.toBeVisible({ timeout: 5000 })
    })
})
