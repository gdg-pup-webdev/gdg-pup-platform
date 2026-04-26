import { Metadata } from "next";
import { EventsSection } from "@/features/events";

export const metadata: Metadata = {
  title: "Events | GDG PUP Nexus",
  description: "Discover upcoming tech events, workshops, and hackathons hosted by GDG PUP.",
  openGraph: { images: ["/og/events.webp"] },
  twitter: { images: ["/og/events.webp"] },
};

export default function EventsPage() {
  const randomSeed = Math.floor(Math.random() * 1000000);
  return <EventsSection randomSeed={randomSeed} />;
}
