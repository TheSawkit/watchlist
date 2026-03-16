import { NextRequest, NextResponse } from "next/server"
import { searchMulti } from "@/lib/tmdb"
import { checkRateLimit } from "@/lib/rate-limit"

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed, remaining } = checkRateLimit(`search:${ip}`, 30, 60 * 1000)

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    )
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")?.trim().slice(0, 200)

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchMulti(query)
    return NextResponse.json({ results }, { headers: { 'X-RateLimit-Remaining': String(remaining) } })
  } catch (error) {
    console.error('[api/search] TMDB search failed:', error)
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 })
  }
}
