/**
 * CarouselArrowIcon
 *
 * Simple arrow glyph rendered inside carousel navigation buttons.
 */

interface CarouselArrowIconProps {
  direction: "left" | "right";
}

export function CarouselArrowIcon({ direction }: CarouselArrowIconProps) {
  return (
    <span className="text-xl font-extrabold leading-none">
      {direction === "left" ? "←" : "→"}
    </span>
  );
}
