"use client"

import { useState, useEffect } from "react"
import { FastAverageColor } from "fast-average-color"

export function useDominantColor(imageUrl: string | null) {
    const [color, setColor] = useState<string | null>(null)

    useEffect(() => {
        if (!imageUrl) return

        const extractColor = async () => {
            try {
                const fac = new FastAverageColor()
                const result = await fac.getColorAsync(imageUrl, {
                    ignoredColor: [
                        // Ignore pure white
                        [255, 255, 255, 255, 10],
                        // Ignore all dark colors by sampling multiple dark tones
                        [10, 10, 10, 255, 20],
                        [20, 20, 20, 255, 20],
                        [30, 30, 30, 255, 20],
                        [40, 40, 40, 255, 20],
                        [50, 50, 50, 255, 20],
                        [60, 60, 60, 255, 20],
                        [70, 70, 70, 255, 20],
                        [80, 80, 80, 255, 20],
                        [90, 90, 90, 255, 20],
                        [100, 100, 100, 255, 20]
                    ],
                    algorithm: 'dominant'
                })
                setColor(result.hex)
            } catch (error) {
                console.error("Failed to extract dominant color:", error)
                setColor(null)
            }
        }

        extractColor()
    }, [imageUrl])

    return color
}
