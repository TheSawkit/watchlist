interface CinemaSpotlightProps {
  /**
   * Hauteur du projecteur en pixels
   * @default 500
   */
  height?: number;
  /**
   * Largeur maximale du projecteur en pixels ou pourcentage
   * Si non spécifié, prend 100% de la largeur du device
   */
  maxWidth?: number | string;
  /**
   * Intensité de l'opacité (0-1)
   * @default 0.35
   */
  intensity?: number;
  /**
   * Position verticale (top offset)
   * @default "top-0"
   */
  position?: string;
}

export default function CinemaSpotlight({
  height = 500,
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
      className={`absolute ${position} left-1/2 -translate-x-1/2 w-full pointer-events-none`}
      style={{
        height: `${height}px`,
        maxWidth: maxWidthValue,
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225, 29, 46, ${intensity}) 0%, rgba(177, 15, 30, ${intensity * 0.57}) 30%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

