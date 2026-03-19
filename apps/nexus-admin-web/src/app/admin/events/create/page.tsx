import { CreateEventForm } from "@/features/events";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/events"
          className="mb-4 flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Events
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="mt-1 text-gray-500">
          Fill in the details below to create a new community event.
        </p>
      </div>

      {/* Main Content */}
      <CreateEventForm />
    </div>
  );
}
