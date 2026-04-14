/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button, Stack, Text } from "@packages/spark-ui";
// import { PAST_EVENTS } from '../data/past-events';
import { PlanetCard } from "./PlanetCard";
import { CarouselArrowIcon } from "./CarouselArrowIcon";
import { Event, useEvents } from "@/features/events";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { normalizeEventDescription } from "@/features/events/utils/description";
import { ASSETS } from "@/lib/constants/assets";
import { useRouter } from "next/navigation";

/**
 * MobileShowcase
 *
 * Full mobile layout (rendered only below the `md` breakpoint).
 * Includes:
 *   - Background decoration (blobs, stardust, Cirby)
 *   - Section heading
 *   - Featured event card with description
 *   - Single-card planet carousel with prev/next navigation
 */
export function MobileShowcase({events } : {events: Event[]}) {
  const router = useRouter();
  const [mobileEventIndex, setMobileEventIndex] = useState(0);
  const [mobileCarouselScale, setMobileCarouselScale] = useState(1);

  const EVENTS = events


  // Responsive scale so the fixed-size carousel doesn't overflow narrow screens
  useEffect(() => {
    const REFERENCE_WIDTH = 422;
    const SECTION_PADDING = 32;
    const update = () => {
      const available = window.innerWidth - SECTION_PADDING;
      setMobileCarouselScale(Math.min(1, available / REFERENCE_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goToPrev = () =>
    setMobileEventIndex((i) => (i === 0 ? EVENTS.length - 1 : i - 1));

  const goToNext = () =>
    setMobileEventIndex((i) => (i === EVENTS.length - 1 ? 0 : i + 1));

  return (
    <div className="md:hidden relative z-10">
      {/* ── Background decorations ── */}
      <div className="pointer-events-none w-113.5 h-114.75 right-0 top-0 absolute bg-pink-400/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none w-113.5 h-114.75 left-0 top-0 absolute bg-sky-400/25 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2" />
      <div className="pointer-events-none w-113.5 h-114.75 left-0 bottom-0 absolute bg-sky-400/25 rounded-full blur-[150px] translate-y-4/5" />
      <img
        className="pointer-events-none w-96 h-auto left-0 top-0 absolute opacity-75 rotate-10 -ml-60 -mt-6"
        src="/community-showcase/community-showcase-space-dust-1.webp"
        alt=""
      />
      <img
        className="pointer-events-none w-[33vw] max-w-123.25 h-auto right-0 top-2 absolute -mr-[11vw] -z-10"
        src="/community-showcase/community-showcase-cirby.webp"
        alt=""
      />
      <img
        className="pointer-events-none w-225 max-w-none h-auto right-12 -bottom-20 absolute opacity-75 translate-x-1/2"
        src="/community-showcase/community-showcase-space-dust-2.webp"
        alt=""
      />

      {/* ── Section heading ── */}
      <Stack gap="md" className="items-center mb-12">
        <Text
          variant="heading-4"
          gradient="white-blue"
          align="center"
          weight="bold"
          className="z-20"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,1)) drop-shadow(0 2px 10px rgba(0,0,0,0.9))' }}
        >
          Community Showcase
        </Text>
        <Text
          as="h2"
          variant="body"
          weight="bold"
          align="center"
          className="text-white"
        >
          Discover what our community has been <br /> building together.
        </Text>
      </Stack>

      {/* ── Featured event ── */}
      <Stack gap="xs" className="mb-10">
        <Text
          variant="heading-5"
          gradient="white-green"
          align="center"
          weight="bold"
          className="z-20"
        >
          {EVENTS[0]?.title}
        </Text>
        <Text
          variant="body"
          align="center"
          color="on-secondary"
          style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 10px rgba(0,0,0,0.9)' }}
        >
          {new Date(EVENTS[0]?.end_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </Text>
        <img
          className="w-120 h-auto max-w-none left-1/2 -translate-x-1/2 top-32 absolute -z-10"
          src="/community-showcase/community-showcase-horizon.webp"
          alt=""
        />
        <Text
          variant="body"
          align="center"
          color="on-secondary"
          className="mt-2"
          weight="semibold"
          style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 10px rgba(0,0,0,0.9)' }}
        >
          Today&apos;s Highlight
        </Text>
        {/* Gradient-bordered event image */}
        <div className="mt-4 w-full rounded-2xl overflow-hidden shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] p-[2px] bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)]">
          <img
            src={EVENTS[0]?.image_url || EVENTS[0]?.images?.[0] || ASSETS.PLACEHOLDERS.DEFAULT}
            alt="Featured event"
            className="w-full h-[clamp(72px,20vw,96px)] object-cover rounded-[14px]"
          />
        </div>
        {/* Category tag + RSVP count */}
        <div className="flex justify-between items-start w-full mt-3">
          <div
            data-property-1="Default"
            className="h-9 px-3 py-1 rounded-lg outline-[1.50px] outline-offset-[-1.50px] outline-white flex items-center"
          >
            <Text variant="body" color="on-secondary" className="z-10">
              {EVENTS[0]?.category}
            </Text>
          </div>
          <div className="flex flex-col items-end mt-0">
            <Text variant="heading-4" className="text-white">
              {EVENTS[0]?.rsvp ?? EVENTS[0]?.attendees_count ?? 0}
            </Text>
            <Text variant="body" className="text-white leading-5">
              RSVP&apos;d
            </Text>
          </div>
        </div>

        {/* Description */}
        <Text
          variant="body"
          className="text-white mt-4 leading-7 self-stretch text-center justify-start"
        >
          {(() => {
            const desc = normalizeEventDescription(EVENTS[0]?.description);
            return desc.length > 300 ? desc.slice(0, 300) + "..." : desc;
          })()}
        </Text>
      </Stack>

      {/* ── Past Events heading ── */}
      <Stack gap="xs" className="mb-6">
        <Text
          variant="heading-3"
          gradient="white-blue"
          align="center"
          weight="bold"
        >
          Past Events
        </Text>
        <Text
          variant="body-lg"
          weight="semibold"
          align="center"
          color="on-secondary"
        >
          Look back on the great things we&apos;ve accomplished.
        </Text>
      </Stack>

      {/* ── Single-card planet carousel ── */}
      <div
        className="flex items-start justify-center gap-4 mt-4 origin-[top_center]"
        style={{
          transform: `scale(${mobileCarouselScale})`,
          marginBottom: `${330 * (mobileCarouselScale - 1)}px`,
        }}
      >
        {/* Prev */}
        <Button
          variant="colored"
          subVariant="blue"
          aria-label="Previous event"
          className="h-15 w-15 shrink-0 rounded-full mt-[270px]"
          onClick={goToPrev}
        >
          <CarouselArrowIcon direction="left" />
        </Button>

        {EVENTS.length > 0 && (
          <>
            {/* Planet */}
            <div className="relative mt-15 mx-auto flex-1 flex justify-center">
              <PlanetCard
                image={
                  EVENTS[mobileEventIndex].image_url ||
                  EVENTS[mobileEventIndex].images?.[0] ||
                  ASSETS.PLACEHOLDERS.DEFAULT
                }
                alt={EVENTS[mobileEventIndex].title}
                size={270}
              />
            </div>
          </>
        )}
        {/* Next */}
        <Button
          variant="colored"
          subVariant="blue"
          aria-label="Next event"
          className="h-15 w-15 shrink-0 rounded-full mt-[270px]"
          onClick={goToNext}
        >
          <CarouselArrowIcon direction="right" />
        </Button>
      </div>

      {/* Text beneath planet */}
      {EVENTS.length > 0 && (
        <div className="flex flex-col items-center w-full mt-10">
          <Text variant="body" align="center" color="muted" className="text-xl">
            {new Date(
              EVENTS[mobileEventIndex].end_date,
            ).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
              day: "numeric",
            })}
          </Text>
          <Text
            variant="heading-6"
            align="center"
            color="on-secondary"
            className="mt-1 w-full"
          >
            {EVENTS[mobileEventIndex].title}
          </Text>
          <Button
            variant="colored"
            subVariant="blue"
            className="mt-10 h-12 w-38 rounded-lg text-xl font-medium"
            disabled={!EVENTS[mobileEventIndex].id && !EVENTS[mobileEventIndex].bevyPreviewUrl}
            onClick={() => {
              const currentEvent = EVENTS[mobileEventIndex];
              if (currentEvent?.bevyPreviewUrl) {
                window.open(currentEvent.bevyPreviewUrl, "_blank", "noopener,noreferrer");
                return;
              }
              if (!currentEvent?.id) return;
              router.push(
                `/events/${currentEvent.id}?title=${encodeURIComponent(currentEvent.title)}`,
              );
            }}
          >
            Learn more
          </Button>
        </div>
      )}
    </div>
  );
}
