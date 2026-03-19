"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Zap, ChevronRight } from "lucide-react";
import { useGetBevyEvents } from "../hooks/useGetBevyEvents";
import { useCreateEventFromBevyEvent } from "../hooks/useCreateEventFromBevyEvent";
import { BevyEventDetails } from "./BevyEventDetails";
import { Pagination } from "@/components/admin/Pagination";

export const BevyEventsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: bevyResponse, isLoading, isError, error, refetch } = useGetBevyEvents(page, pageSize);
  const createEventMutation = useCreateEventFromBevyEvent();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const events = bevyResponse?.data || [];
  const totalPages = bevyResponse?.meta?.totalPages || 1;
  const totalRecords = bevyResponse?.meta?.totalRecords || 0;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-red-900">Failed to load Bevy events</h3>
        <p className="mt-1 text-sm text-red-700">{(error as any)?.message || "An unexpected error occurred."}</p>
        <button 
          onClick={() => refetch()}
          className="mt-6 rounded-sm bg-red-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleCreateEvent = async (bevyEventId: string) => {
    try {
      await createEventMutation.mutateAsync(bevyEventId);
      alert("Event created successfully from Bevy event!");
    } catch (err) {
      alert(`Failed to create event: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pagination at Top */}
      {events.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event: any) => (
            <div 
              key={event.id}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedEventId(event.id);
                setIsDetailsModalOpen(true);
              }}
            >
              {/* Banner Image */}
              {event.cover_image_url ? (
                <div className="relative h-32 bg-gradient-to-b from-gray-200 to-gray-100 overflow-hidden">
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
                  <Zap size={32} className="text-teal-400" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Header with Icon */}
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-teal-50 text-teal-600">
                    <Zap size={16} />
                  </div>
                  <ChevronRight size={16} className="text-gray-300 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Title and Description */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{event.title}</h3>
                {event.location && (
                  <p className="mt-1 text-xs text-gray-600 line-clamp-1">{event.location}</p>
                )}
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(event.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                {/* Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateEvent(event.id);
                  }}
                  disabled={createEventMutation.isPending}
                  className="mt-3 w-full rounded-sm bg-teal-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-700 disabled:bg-teal-300"
                >
                  {createEventMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Zap size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No Bevy events found</h3>
          <p className="mt-1 text-sm text-gray-500">Check again later for new events from Bevy.</p>
        </div>
      )}

      {/* Modal */}
      <BevyEventDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        eventId={selectedEventId}
      />
    </div>
  );
};
