"use client"

import { useEffect, useState } from "react"
import type { CinemaSpotlightProps } from "@/types/components"

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
    : null;
}

export default function CinemaSpotlight({
  height = 500,
  maxWidth,
  intensity = 0.35,
  position = "top-16",
}: CinemaSpotlightProps) {
  const [red2Rgb, setRed2Rgb] = useState<string>("225, 29, 46")
  const [redRgb, setRedRgb] = useState<string>("177, 15, 30")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const red2Hex = getComputedStyle(document.documentElement)
        .getPropertyValue("--red-2")
        .trim()
      const redHex = getComputedStyle(document.documentElement)
        .getPropertyValue("--red")
        .trim()

      const red2RgbValues = hexToRgb(red2Hex)
      const redRgbValues = hexToRgb(redHex)

      if (red2RgbValues) {
        setRed2Rgb(red2RgbValues.join(", "))
      }
      if (redRgbValues) {
        setRedRgb(redRgbValues.join(", "))
      }
    }
  }, [])

  const maxWidthValue = maxWidth
    ? typeof maxWidth === "number"
      ? `${maxWidth}px`
      : maxWidth
    : "100%";

  return (
    <div
      className={`absolute ${position} left-1/2 -translate-x-1/2 w-full pointer-events-none`}
      style={{
        height: `${height}px`,
        maxWidth: maxWidthValue,
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(${red2Rgb}, ${intensity}) 0%, rgba(${redRgb}, ${intensity * 0.57}) 30%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

