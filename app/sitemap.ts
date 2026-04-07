import type { MetadataRoute } from "next"
import { headers } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://reelmark.app"

async function getBaseUrl(): Promise<string> {
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    const proto = h.get("x-forwarded-proto") ?? "https"

    if (!host) return BASE_URL

    return `${proto}://${host}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = await getBaseUrl()

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ]
}
