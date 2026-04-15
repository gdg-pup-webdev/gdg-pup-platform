/**
 * CarouselArrowIcon
 *
 * Simple arrow glyph rendered inside carousel navigation buttons.
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselArrowIconProps {
  direction: "left" | "right";
}

export function CarouselArrowIcon({ direction }: CarouselArrowIconProps) {
  if (direction === "left") {
    return <ChevronLeft className="h-6 w-6 text-white" aria-hidden="true" />;
  }

  return <ChevronRight className="h-6 w-6 text-white" aria-hidden="true" />;
}
