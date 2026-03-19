import { EventsList } from "@/features/events";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="mt-1 text-gray-500">
            Create, manage, and track all community events.
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="flex items-center rounded-sm bg-teal-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700"
        >
          <Plus size={18} className="mr-2" />
          Create Event
        </Link>
      </div>

      {/* Main Content */}
      <EventsList />
    </div>
  );
}
