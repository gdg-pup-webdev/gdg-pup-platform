/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Card, Stack, Text } from "@packages/spark-ui";
import { Event } from "@/features/events";
import { ASSETS } from "@/lib/constants/assets";

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
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [is39Hovered, setIs39Hovered] = useState(false);



const ABOUT_TEXT = event.description || "No description available for this event.";

const TRUNCATED_ABOUT =
  ABOUT_TEXT.length > 493 ? ABOUT_TEXT.slice(0, 493) + "..." : ABOUT_TEXT;

  return (
    <Stack gap="xs" className="mt-12">
      {/* Heading block — slides up on card hover */}
      <Stack
        gap="xs"
        className={`z-10 transition-transform duration-1000 ease-out ${
          isCardHovered ? "-translate-y-3" : "translate-y-0"
        }`}
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
        >
          Today&apos;s Highlight
        </Text>
      </Stack>

      {/* Event image card with gradient border */}
      <div className="relative left-1/2 mt-15 flex w-[calc(100vw-2rem)] max-w-[1450px] -translate-x-1/2 justify-center z-10">
        <Card
          variant="default"
          className="w-full h-[clamp(200px,25vw,360px)] rounded-[32px] max-w-none p-1 bg-[linear-gradient(135deg,#EA4335,#F9AB00,#34A853,#4285F4)] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.40)] overflow-hidden bg-transparent! border-0! z-10 transform transition-transform duration-1000 ease-out hover:rotate-[-1deg]"
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
        >
          <img
            src={event.image_url || event.images?.[0] || ASSETS.PLACEHOLDERS.DEFAULT}
            alt=""
            className="w-full h-full object-cover rounded-[30px]"
          />
        </Card>
      </div>

      {/* About + Stats row — slides down on card hover */}
      <div
        className={`relative left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[1450px] flex justify-center mt-10 z-10 transition-transform duration-1000 ease-out ${
          isCardHovered ? "translate-y-5" : "translate-y-0"
        }`}
      >
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* About */}
          <Stack gap="sm" className="flex-2">
            <button
              type="button"
              onClick={onOpenModal}
              className="text-left cursor-pointer group"
            >
              <Text
                variant="body-lg"
                className="text-white transition-colors duration-200 group-hover:text-blue-500"
              >
                ABOUT THIS EVENT
              </Text>
              <Text
                variant="body"
                className="text-white leading-8 max-w-[55vw] xl:max-w-220 transition-colors duration-200 group-hover:text-blue-500"
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
              <div
                onMouseEnter={() => setIs39Hovered(true)}
                onMouseLeave={() => setIs39Hovered(false)}
                style={{
                  display: "inline-block",
                  transform: is39Hovered ? "rotate(-15.95deg)" : "rotate(0deg)",
                  transition: "transform 1000ms ease-out",
                }}
              >
                <Text
                  variant="heading-2"
                  className={is39Hovered ? "" : "text-white"}
                  gradient={is39Hovered ? "white-blue" : undefined}
                >
                  {event.rsvp || 0}
                </Text>
              </div>
              <div
                style={{
                  transform: is39Hovered ? "translateY(20px)" : "translateY(0)",
                  transition: "transform 1000ms ease-out",
                }}
              >
                <Text
                  variant="body"
                  className="text-white leading-8 max-w-[600px]"
                >
                  RSVP&apos;d
                </Text>
              </div>
            </div>

            {/* Category tag */}
            <div
              data-property-1="Default"
              className="h-9 max-w-72 px-3 py-1 rounded-2xl outline-[1.50px] outline-offset-[-1.50px] outline-white inline-flex flex-col justify-center items-center gap-2"
            >
              <Text variant="body" color="on-secondary">
                {event.teamName || event.category}
              </Text>
            </div>
          </Stack>
        </div>
      </div>
    </Stack>
  );
}
