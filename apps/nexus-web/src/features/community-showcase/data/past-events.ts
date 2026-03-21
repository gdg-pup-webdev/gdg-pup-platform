/**
 * Community Showcase — Past Events Data
 *
 * Centralised data constants for the community showcase section.
 * Keeps component files free of inline data arrays.
 */

import type { PastEvent } from "../types";

export const PAST_EVENTS: PastEvent[] = [
  {
    date: "Feb 27, 2026",
    title: "Love at First Prototype: UI/UX in Motion",
    image: "/community-showcase/community-showcase-carousel-1.webp",
  },
  {
    date: "Feb 27, 2026",
    title: "Blue Team 1 Host & Network Hardening",
    image: "/community-showcase/community-showcase-carousel-2.webp",
  },
  {
    date: "Feb 27, 2026",
    title:
      "Design Smarter, Prototype Faster: Fusion 360 for IoT Innovators",
    image: "/community-showcase/community-showcase-carousel-3.webp",
  },
  {
    date: "Feb 25, 2026",
    title: "Webverse Vol.3: React Basics and Tailwind",
    image: "/community-showcase/community-showcase-carousel-4.webp",
  },
  {
    date: "Feb 22, 2026",
    title: "Cloud Architect 101: Designing a Scalable Ticketing System",
    image: "/community-showcase/community-showcase-carousel-5.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-6.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-7.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-8.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-9.webp",
  },
  {
    date: "Apr 12, 2026",
    title: "From Wireframe to Wow",
    image: "/community-showcase/community-showcase-carousel-10.webp",
  },
];

/**
 * Tripled copy used for the infinite-scroll illusion in the desktop carousel.
 */
export const PAST_EVENTS_CAROUSEL: PastEvent[] = [
  ...PAST_EVENTS,
  ...PAST_EVENTS,
  ...PAST_EVENTS,
];

/** How many cards to skip per prev/next click */
export const PAST_EVENTS_CARDS_PER_STEP = 3;
