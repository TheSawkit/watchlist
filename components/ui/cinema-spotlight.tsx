import type { CinemaSpotlightProps } from "@/types/components"

export default function CinemaSpotlight({
  height = 600,
  maxWidth,
  intensity = 0.35,
  position = "top-0",
}: CinemaSpotlightProps) {
  const maxWidthValue = maxWidth
    ? typeof maxWidth === "number"
      ? `${maxWidth}px`
      : maxWidth
    : "100%";

  return (
    <div
      className={`fixed ${position} left-1/2 -translate-x-1/2 w-full pointer-events-none -z-10`}
      style={{
        height: `${height}px`,
        maxWidth: maxWidthValue,
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgb(var(--color-red-rgb) / ${intensity}) 0%, rgb(var(--color-red-rgb) / ${intensity * 0.5}) 30%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}
