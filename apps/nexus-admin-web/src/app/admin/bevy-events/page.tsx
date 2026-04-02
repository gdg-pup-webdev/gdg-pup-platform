import { BevyEventsList } from "@/features/bevy-events";

export default function BevyEventsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bevy Events</h1>
        <p className="mt-1 text-gray-500">
          A list of all the events from Bevy.
        </p>
      </div>

      {/* Main Content */}
      <BevyEventsList />
    </div>
  );
}

