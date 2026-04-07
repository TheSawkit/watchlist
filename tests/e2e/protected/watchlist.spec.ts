import { test, expect } from "@playwright/test"

// Fight Club (1999) — entrée TMDB stable pour les tests
const MOVIE_ID = 550
const MOVIE_TITLE = "Fight Club"

test.beforeEach(async () => {
    test.skip(!process.env.TEST_USER_EMAIL, "TEST_USER_EMAIL not set — skipping authenticated tests")
})

test.describe("Watchlist", () => {
    test("add and remove a movie from watchlist", async ({ page }) => {
        await page.goto(`/movie/${MOVIE_ID}`)
        await expect(page.getByRole("heading", { level: 1 })).toContainText(MOVIE_TITLE, { timeout: 10000 })

        // Si déjà dans la liste, on retire d'abord pour partir d'un état propre
        const addedButton = page.getByRole("button", { name: /added|ajouté/i }).first()
        if (await addedButton.isVisible()) {
            await addedButton.click()
            await expect(page.getByRole("button", { name: /add to list|ajouter/i }).first()).toBeVisible({ timeout: 5000 })
        }

        // Ajouter à la liste
        await page.getByRole("button", { name: /add to list|ajouter/i }).first().click()
        await expect(page.getByRole("button", { name: /added|ajouté/i }).first()).toBeVisible({ timeout: 5000 })

        // Vérifier que le film apparaît dans la bibliothèque
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).toBeVisible({ timeout: 10000 })

        // Nettoyer — retirer de la liste
        await page.goto(`/movie/${MOVIE_ID}`)
        await page.getByRole("button", { name: /added|ajouté/i }).first().click()
        await expect(page.getByRole("button", { name: /add to list|ajouter/i }).first()).toBeVisible({ timeout: 5000 })

        // Vérifier qu'il n'est plus dans la bibliothèque
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).not.toBeVisible()
    })

    test("mark a movie as watched and unmark", async ({ page }) => {
        await page.goto(`/movie/${MOVIE_ID}`)
        await expect(page.getByRole("heading", { level: 1 })).toContainText(MOVIE_TITLE, { timeout: 10000 })

        // État propre : s'assurer que le film n'est pas marqué comme vu
        const watchedButton = page.getByRole("button", { name: /^watched$|^vu$/i }).first()
        if (await watchedButton.isVisible()) {
            await watchedButton.click()
            await expect(page.getByRole("button", { name: /mark as watched|marquer comme vu/i }).first()).toBeVisible({ timeout: 5000 })
        }

        // Marquer comme vu
        await page.getByRole("button", { name: /mark as watched|marquer comme vu/i }).first().click()
        await expect(page.getByRole("button", { name: /^watched$|^vu$/i }).first()).toBeVisible({ timeout: 5000 })

        // Vérifier dans la bibliothèque (onglet Watched)
        await page.goto("/library")
        await expect(page.getByText(MOVIE_TITLE)).toBeVisible({ timeout: 10000 })

        // Nettoyer — retirer du vu
        await page.goto(`/movie/${MOVIE_ID}`)
        await page.getByRole("button", { name: /^watched$|^vu$/i }).first().click()
        // Après click sur "Watched", passe à "to_watch" (fallbackStatus)
        await expect(page.getByRole("button", { name: /^watched$|^vu$/i }).first()).not.toBeVisible({ timeout: 5000 })
    })
})
