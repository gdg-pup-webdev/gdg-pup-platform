"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CarouselArrowIcon } from "@/features/community-showcase/components/CarouselArrowIcon";

type GalleryItem = {
  year: number;
  id: string;
};

const CARD_GAP_PX = 16;
const PREVIEW_IMAGE_PATH = "/pages/events/gallery-preview-year.webp";
const BORDER_GRADIENT =
  "linear-gradient(92.56deg, #EA4335 -7.33%, #F9AB00 33.65%, #34A853 72.08%, #4285F4 109.62%)";

function getCardsPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

// Remove unused getCircularWindow

export function EventsGallery() {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    const sync = () => setCardsPerView(getCardsPerView(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const years = useMemo<GalleryItem[]>(() => {
    const startYear = 2026;
    const endYear = 2022;
    const length = startYear - endYear + 1;
    return Array.from({ length }, (_, i) => {
      const year = startYear - i;
      return { year, id: `gallery-${year}` };
    });
  }, []);

  const totalYears = years.length;

  const visibleItems = useMemo(
    () => years.slice(startIndex, startIndex + cardsPerView),
    [years, startIndex, cardsPerView],
  );

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + cardsPerView < totalYears;

  const handlePrevious = () => {
    if (!canGoPrev) return;
    setDirection("prev");
    setStartIndex((prev) => Math.max(0, prev - cardsPerView));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setDirection("next");
    setStartIndex((prev) => prev + cardsPerView);
  };

  return (
    <div className="w-full mt-4 md:mt-8">
      <div className="relative w-full">
        <Button
          variant="colored"
          subVariant="blue"
          onClick={handlePrevious}
          aria-label="Previous gallery years"
          className={`absolute left-[-16px] md:left-[-32px] top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-15 md:w-15 shrink-0 rounded-full transition-all duration-300 ${!canGoPrev ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <CarouselArrowIcon direction="left" />
        </Button>

        <div className="mx-10 md:mx-15 overflow-hidden relative">
          <div
            className="grid invisible pointer-events-none"
            style={{
              gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
              gap: `${CARD_GAP_PX}px`,
            }}
          >
            {visibleItems.map((item) => (
              <div key={`ghost-${item.id}`} className="rounded-2xl p-[1px]">
                <div className="relative aspect-[4/5] rounded-[15px]" />
              </div>
            ))}
          </div>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`${startIndex}-${cardsPerView}`}
              initial={{ x: direction === "next" ? 64 : -64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === "next" ? -64 : 64, opacity: 0 }}
              transition={{
                x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.22, ease: "easeOut" },
              }}
              className="grid absolute inset-0 will-change-transform"
              style={{
                gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
                gap: `${CARD_GAP_PX}px`,
              }}
            >
              {visibleItems.map((item) => (
                <Link prefetch={false}
                  key={`${item.id}-${startIndex}`}
                  href={`/events/gallery/${item.year}`}
                  className="group relative rounded-2xl p-[1px] transition-all duration-300 ease-out hover:shadow-[0_12px_36px_rgba(0,0,0,0.42)] cursor-pointer"
                  style={{ backgroundImage: BORDER_GRADIENT }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[15px] bg-black">
                    <Image
                      src={PREVIEW_IMAGE_PATH}
                      alt={`Events gallery preview ${item.year}`}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.045]"
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 40vw, 84vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/68" />
                    <div
                      className="absolute inset-0 pointer-events-none transition-[background-position] duration-300 ease-out"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.54) 45%, rgba(0,0,0,0.20) 100%)",
                        backgroundSize: "100% 220%",
                        backgroundPosition: "0% 0%",
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 transition-[opacity,background-position] duration-300 ease-out group-hover:opacity-100"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.60) 100%)",
                        backgroundSize: "100% 220%",
                        backgroundPosition: "0% 100%",
                      }}
                    />

                    <div className="absolute right-3 md:right-4 bottom-2 md:bottom-3 flex justify-end transition-opacity duration-300 group-hover:opacity-0">
                      <span className="text-6xl md:text-8xl font-bold tracking-[-0.03em] leading-none text-right bg-[linear-gradient(90deg,#EA4335_0%,#F9AB00_33%,#34A853_66%,#4285F4_100%)] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
                        {item.year}
                      </span>
                    </div>
                    <span className="pointer-events-none absolute left-3 md:left-4 bottom-3 md:bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white text-xl md:text-[1.75rem] font-medium leading-none font-[inherit] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] inline-flex items-center gap-2">
                      <span>View More</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 md:h-6 md:w-6"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          variant="colored"
          subVariant="blue"
          onClick={handleNext}
          aria-label="Next gallery years"
          className={`absolute right-[-16px] md:right-[-32px] top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-15 md:w-15 shrink-0 rounded-full transition-all duration-300 ${!canGoNext ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <CarouselArrowIcon direction="right" />
        </Button>
      </div>
    </div>
  );
}
