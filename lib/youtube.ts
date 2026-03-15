const OEMBED_BASE = "https://www.youtube.com/oembed"

export async function isYouTubeVideoAvailable(videoKey: string): Promise<boolean> {
  try {
    const url = `${OEMBED_BASE}?url=https://www.youtube.com/watch?v=${videoKey}&format=json`
    const response = await fetch(url, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function filterAvailableVideos<T extends { key: string; site: string }>(
  videos: T[]
): Promise<T[]> {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube")
  const otherVideos = videos.filter((v) => v.site !== "YouTube")

  const availabilityChecks = await Promise.allSettled(
    youtubeVideos.map(async (video) => ({
      video,
      available: await isYouTubeVideoAvailable(video.key),
    }))
  )

  const availableYouTube = availabilityChecks
    .filter((result): result is PromiseFulfilledResult<{ video: T; available: boolean }> =>
      result.status === "fulfilled" && result.value.available
    )
    .map((result) => result.value.video)

  return [...availableYouTube, ...otherVideos]
}
