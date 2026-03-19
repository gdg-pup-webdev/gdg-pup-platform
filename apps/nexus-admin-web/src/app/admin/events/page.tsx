import { EventsList } from "@/features/events";

export default function EventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <p className="mt-1 text-gray-500">
          Create, manage, and track all community events.
        </p>
      </div>

      {/* Main Content */}
      <EventsList />
    </div>
  );
}
