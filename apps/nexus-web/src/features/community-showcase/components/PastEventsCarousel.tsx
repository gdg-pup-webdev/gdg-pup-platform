/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Stack, Text } from "@packages/spark-ui";
import { useCarousel } from "../hooks/useCarousel";
// import { PAST_EVENTS_CAROUSEL } from "../data/past-events";
import { CarouselArrowIcon } from "./CarouselArrowIcon";
import { PlanetCard } from "./PlanetCard";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { ASSETS } from "@/lib/constants/assets";

/**
 * PastEventsCarousel
 *
 * Desktop infinite-scroll carousel of past events.
 * Auto-scrolls continuously; pauses on hover; supports click-to-step and drag.
 */
export function PastEventsCarousel() {
  const {
    trackRef,
    isPastEventsDragging,
    setIsPastEventsHovered,
    handlePrev,
    handleNext,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCarousel();

  const { data, error, isLoading } = useListEvents(1, 20, {});

  const PAST_EVENTS_CAROUSEL = data
    ? [...data.data ]
    : [];

  return (
    <Stack gap="xs" className="mt-22">
      <Stack gap="xs" className="z-10">
        {/* Section heading */}
        <Text
          variant="heading-2"
          gradient="white-blue"
          align="center"
          weight="bold"
          className="z-10"
        >
          Past Events
        </Text>
        <Text
          variant="body-lg"
          align="center"
          color="on-secondary"
          className="z-10"
        >
          Look back on the great things we&apos;ve accomplished.
        </Text>

        {/* Carousel viewport */}
        <div
          className="relative mt-10 flex items-center justify-center gap-4 lg:gap-10 xl:gap-20"
          onMouseEnter={() => setIsPastEventsHovered(true)}
          onMouseLeave={() => setIsPastEventsHovered(false)}
        >
          <Button
            variant="colored"
            subVariant="blue"
            aria-label="Scroll past events left by three cards"
            className="h-15 w-15 shrink-0 rounded-full"
            onClick={handlePrev}
          >
            <CarouselArrowIcon direction="left" />
          </Button>

          <div className="relative flex w-[calc(100vw-12rem)] max-w-[1300px] justify-center z-10">
            <div className="relative w-full overflow-hidden">
              {/* Draggable track */}
              <div
                className={`flex gap-8 md:gap-12 lg:gap-28 xl:gap-40 2xl:gap-35 pb-6 pt-4 w-max ${
                  isPastEventsDragging
                    ? "cursor-grabbing select-none"
                    : "cursor-grab"
                }`}
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {PAST_EVENTS_CAROUSEL.map((event, index) => (
                  <Stack
                    key={`${event.title}-${index}`}
                    data-past-event-card
                    gap="none"
                    justify="between"
                    className="h-full shrink-0 self-stretch items-center w-[clamp(180px,16vw,320px)]"
                  >
                    <div className="flex w-full flex-col items-center">
                      <PlanetCard
                        image={event.image_url || ASSETS.PLACEHOLDERS.DEFAULT}
                        alt={event.title}
                        style={{
                          width: "clamp(140px,14vw,260px)",
                          height: "clamp(140px,14vw,260px)",
                        }}
                        draggable={false}
                      />
                      <Text
                        variant="body"
                        align="center"
                        color="muted"
                        className="mt-5 xl:mt-7"
                      >
                        {new Date(event.end_date).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            year: "numeric",
                            day: "numeric",
                          },
                        )}
                      </Text>
                      <Text
                        variant="body"
                        align="center"
                        color="on-secondary"
                        className="mt-2 max-w-[280px] xl:max-w-[320px]"
                      >
                        {event.title}
                      </Text>
                    </div>
                    <Button
                      variant="colored"
                      subVariant="blue"
                      className="mt-5 xl:mt-7 h-10 xl:h-13 min-w-34 shrink-0 whitespace-nowrap rounded-lg px-4 xl:min-w-36"
                    >
                      Learn more
                    </Button>
                  </Stack>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="colored"
            subVariant="blue"
            aria-label="Scroll past events right by three cards"
            className="h-15 w-15 shrink-0 rounded-full"
            onClick={handleNext}
          >
            <CarouselArrowIcon direction="right" />
          </Button>
        </div>
      </Stack>
    </Stack>
  );
}
