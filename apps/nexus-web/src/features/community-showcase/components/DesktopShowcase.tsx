/* eslint-disable @next/next/no-img-element */

import { Container, Stack, Text } from "@packages/spark-ui";
import { FeaturedEventCard } from "./FeaturedEventCard";
import { PastEventsCarousel } from "./PastEventsCarousel";
import { Event } from "@/features/events";

/**
 * DesktopShowcase
 *
 * Full desktop layout (rendered only at the `md` breakpoint and above).
 * Includes:
 *   - Background decoration (blobs, Cirby, stardust, horizon)
 *   - Section heading
 *   - FeaturedEventCard (with modal trigger)
 *   - PastEventsCarousel
 */

interface DesktopShowcaseProps {
  onOpenModal: () => void;
  events: Event[]
}

export function DesktopShowcase({ onOpenModal, events }: DesktopShowcaseProps) {
  return (
    <>
      {/* ── Background decorations (desktop only) ── */}
      <div className="hidden md:block">
        <div className="pointer-events-none w-200.5 h-202.75 right-0 top-0 absolute bg-pink-400/30 rounded-full blur-[400px] translate-x-1/2 -translate-y-1/2" />
        <div className="pointer-events-none w-200.5 h-202.75 left-0 top-0 absolute bg-blue-500/25 rounded-full blur-[400px] -translate-x-1/2 translate-y-1/2" />
        <div className="pointer-events-none w-241.5 h-244.25 left-0 top-0 absolute bg-sky-400/20 rounded-full blur-[400px] -translate-x-1/5 translate-y-3/4" />
        <div className="pointer-events-none w-241.5 h-244.25 left-0 bottom-0 absolute bg-pink-400/30 rounded-full blur-[400px] translate-x-1/2 translate-y-4/20" />
        <img
          className="pointer-events-none z-11 w-[30vw] max-w-123.25 h-auto right-0 top-20 absolute -mr-[6vw]"
          src="/community-showcase/community-showcase-cirby.webp"
          alt=""
        />
        <img
          className="pointer-events-none w-[1354.15px] h-[1656.86px] left-0 top-0 absolute opacity-75 -ml-165 mt-40"
          src="/community-showcase/community-showcase-space-dust-1.webp"
          alt=""
        />
        <img
          className="pointer-events-none w-350 h-auto right-20 bottom-235 absolute opacity-75 translate-x-1/3"
          src="/community-showcase/community-showcase-space-dust-2.webp"
          alt=""
        />
      </div>

      {/* ── Main content ── */}
      <Container>
        <Stack gap="2xl" className="hidden md:flex relative z-10 gap-32">
          {/* Section heading */}
          <Stack gap="md" className="items-center">
            <Text
              variant="heading-1"
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
              align="center"
              className="text-white z-10 text-sm md:text-base"
              style={{ textShadow: '0 0 24px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9)' }}
            >
              Discover what our community has been building together.
            </Text>
          </Stack>

          {/* Horizon illustration */}
          <img
            className="w-[min(1700px,140vw)] h-auto max-w-none left-1/2 -translate-x-1/2 -top-30 absolute -z-10"
            src="/community-showcase/community-showcase-horizon.webp"
            alt=""
          />

          {/* Featured event card — 1st instance */}
          {
            events.length > 0 && (
              <FeaturedEventCard onOpenModal={onOpenModal} event={events[0]} />
            )
          }

          {/* Featured event card — 2nd instance (intentional duplicate) */}
          {
            events.length > 1 && (
              <FeaturedEventCard onOpenModal={onOpenModal} event={events[1]} />
            )
          }

          {/* Past events carousel */}
          <PastEventsCarousel />
        </Stack>
      </Container>
    </>
  );
}
