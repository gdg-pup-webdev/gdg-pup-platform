/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, Stack, Text } from "@packages/spark-ui";
import { Event } from "@/features/events";
import { ASSETS } from "@/lib/constants/assets";
import { normalizeEventDescription } from "@/features/events/utils/description";

/**
 * FeaturedEventCard
 *
 * Displays a single featured event with:
 *   - Title + date/time heading block (slides up on card hover)
 *   - Google-colour gradient bordered image card (tilts on hover)
 *   - "About this event" text + RSVP stat row (slides down on card hover)
 *
 * All hover states are internal — they are purely presentational.
 * `onOpenModal` is called when the user clicks the "ABOUT THIS EVENT" text.
 */


interface FeaturedEventCardProps {
  onOpenModal: () => void;
  event: Event
}

export function FeaturedEventCard({ onOpenModal, event }: FeaturedEventCardProps) {
const ABOUT_TEXT = normalizeEventDescription(event.description) || "No description available for this event.";

const TRUNCATED_ABOUT =
  ABOUT_TEXT.length > 493 ? ABOUT_TEXT.slice(0, 493) + "..." : ABOUT_TEXT;

  return (
    <Stack gap="xs" className="mt-12">
      {/* Heading block — slides up on card hover */}
      <Stack
        gap="xs"
        className="z-10"
      >
        <Text
          variant="heading-2"
          gradient="white-green"
          align="center"
          weight="bold"
          className="z-10"
        >
          {event.title}
        </Text>
        <Text
          variant="body-lg"
          align="center"
          color="on-secondary"
          className="z-10"
          style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 10px rgba(0,0,0,0.9)' }}
        >
          {new Date(event.end_date).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </Text>
        <Text
          variant="body"
          align="center"
          color="on-secondary"
          className="mt-4 z-10"
          style={{ textShadow: '0 0 20px rgba(0,0,0,1), 0 2px 10px rgba(0,0,0,0.9)' }}
        >
          Today&apos;s Highlight
        </Text>
      </Stack>

      {/* Event image card with gradient border */}
      <div className="relative mt-15 flex w-full justify-center z-10">
        <div className="relative w-full max-w-none rounded-[32px] p-[2px] bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] z-10">
          <Card
            variant="default"
            className="w-full max-w-none aspect-[16/9] rounded-[30px] bg-[#0B0B0B] overflow-hidden border-0! p-3"
          >
            <img
              src={event.image_url || event.images?.[0] || ASSETS.PLACEHOLDERS.DEFAULT}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover blur-[18px] opacity-55"
            />
            <img
              src={event.image_url || event.images?.[0] || ASSETS.PLACEHOLDERS.DEFAULT}
              alt=""
              className="relative w-full h-full object-contain rounded-[20px]"
            />
          </Card>
        </div>
      </div>

      {/* About + Stats row — slides down on card hover */}
      <div
        className="relative w-full flex justify-center mt-10 z-10"
      >
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* About */}
          <Stack gap="sm" className="flex-2">
            <button
              type="button"
              // Modal disabled for now; restore onClick={onOpenModal} when needed.
              className="text-left"
            >
              <Text
                variant="body-lg"
                className="text-white"
              >
                ABOUT THIS EVENT
              </Text>
              <Text
                variant="body"
                className="text-white leading-8 max-w-[55vw] xl:max-w-220"
              >
                {TRUNCATED_ABOUT}
              </Text>
            </button>
          </Stack>

          {/* Vertical divider */}
          <div className="hidden md:block w-[2px] bg-white" />

          {/* Stats */}
          <Stack
            gap="none"
            className="flex-1 items-end text-right h-full justify-between"
          >
            {/* RSVP count */}
            <div>
              <Text variant="heading-2" className="text-white">
                {event.rsvp ?? event.attendees_count}
              </Text>
              <Text variant="body" className="text-white leading-8 max-w-[600px]">
                RSVP&apos;d
              </Text>
            </div>

            {/* Category tag */}
            <div
              data-property-1="Default"
              className="h-9 max-w-72 px-3 py-1 rounded-2xl outline-[1.50px] outline-offset-[-1.50px] outline-white inline-flex flex-col justify-center items-center gap-2"
            >
              <Text variant="body" color="on-secondary">
                {event.category}
              </Text>
            </div>
          </Stack>
        </div>
      </div>
    </Stack>
  );
}
