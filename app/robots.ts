import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://reelmark.app"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/login", "/signup"],
                disallow: ["/dashboard", "/library", "/explorer", "/settings", "/api/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}
