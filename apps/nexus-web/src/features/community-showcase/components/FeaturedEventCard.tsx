/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Card, Stack, Text } from "@packages/spark-ui";

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

const ABOUT_TEXT =
  `Join us for an empowering session on February 27, 2026, from 8:00 PM to 9:30 PM, ` +
  `as we delve into the world of intermediate UI/UX design! In the "Interactive UI/UX Design ` +
  `Bootcamp," we'll transform your ideas into reality by guiding you through the creation of ` +
  `both low- and high-fidelity wireframes. Learn how to turn these wireframes into interactive ` +
  `prototypes to showcase real user flows. We'll introduce key Figma features like Auto Layout ` +
  `and Components that boost design efficiency and maintain consistency. To top it all off, engage ` +
  `in our "Hero Maker: Proto-Design Challenge," a mini design task where you can apply what ` +
  `you've learned. Become part of the design revolution and elevate your skills with GDG PUP! ` +
  `Don't miss this opportunity to enhance your design capabilities. Book your seat today and ` +
  `bring your vision to life!`;

const TRUNCATED_ABOUT =
  ABOUT_TEXT.length > 493 ? ABOUT_TEXT.slice(0, 493) + "..." : ABOUT_TEXT;

interface FeaturedEventCardProps {
  onOpenModal: () => void;
}

export function FeaturedEventCard({ onOpenModal }: FeaturedEventCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [is39Hovered, setIs39Hovered] = useState(false);

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
          Love at First Prototype: UI/UX in Motion
        </Text>
        <Text
          variant="body-lg"
          align="center"
          color="on-secondary"
          className="z-10"
        >
          MS Teams &nbsp; • &nbsp; Feb 27, 2026, 8:00 PM - 9:30 PM
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
            src="/community-showcase/community-showcase-event.webp"
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
                  39
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
                UI / UX Designs
              </Text>
            </div>
          </Stack>
        </div>
      </div>
    </Stack>
  );
}
