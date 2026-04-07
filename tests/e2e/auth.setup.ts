import { test as setup } from "@playwright/test"
import path from "path"
import { mkdir, writeFile } from "fs/promises"

const authFile = path.join(process.cwd(), "tests/.auth/user.json")

setup("authenticate", async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD

    if (!email || !password) {
        await mkdir(path.dirname(authFile), { recursive: true })
        await writeFile(authFile, JSON.stringify({ cookies: [], origins: [] }))
        return
    }

    await page.goto("/login")
    await page.getByRole("textbox", { name: /email/i }).fill(email)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole("button", { name: /connexion|login/i }).click()
    await page.waitForURL("/dashboard", { timeout: 15000 })
    await page.context().storageState({ path: authFile })
})
