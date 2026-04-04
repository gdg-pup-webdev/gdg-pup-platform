import { EventsSection } from "@/features/events";

export default function EventsPage() {
  const randomSeed = Math.floor(Math.random() * 1000000);
  return <EventsSection randomSeed={randomSeed} />;
}