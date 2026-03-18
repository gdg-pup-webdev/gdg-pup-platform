"use client";

import React from "react";
import { useGetBevyEvents } from "../hooks/useGetBevyEvents";
import { useCreateEventFromBevyEvent } from "../hooks/useCreateEventFromBevyEvent";

export const BevyEventsList: React.FC = () => {
  const { data, isLoading, isError, error } = useGetBevyEvents();
  const createEventMutation = useCreateEventFromBevyEvent();

  if (isLoading) return <div>Loading Bevy events...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const handleCreateEvent = async (bevyEventId: string) => {
    try {
      await createEventMutation.mutateAsync(bevyEventId);
      alert("Event created successfully from Bevy event!");
    } catch (err) {
      alert(`Failed to create event: ${(err as Error).message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bevy Scraped Events</h2>
      <div className="grid gap-4">
        {data?.data.map((event: any) => (
          <div key={event.id} className="border p-4 rounded shadow bg-white flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.location}</p>
              <p className="text-xs text-gray-400">{new Date(event.start_date).toLocaleString()}</p>
            </div>
            <button
              onClick={() => handleCreateEvent(event.id)}
              disabled={createEventMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
