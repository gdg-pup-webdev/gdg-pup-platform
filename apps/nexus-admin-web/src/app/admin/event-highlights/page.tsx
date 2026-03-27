import { EventHighlightsList } from "@/features/event-highlights";
 
export default function EventHighlightsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Highlights</h1>
        <p className="mt-1 text-gray-500">
          Curate and showcase the best moments from community events.
        </p>
      </div>

      {/* Main Content */}
      <EventHighlightsList />
    </div>
  );
}
