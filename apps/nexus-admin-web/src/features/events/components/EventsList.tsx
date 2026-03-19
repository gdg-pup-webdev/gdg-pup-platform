"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Calendar, Search, Plus } from "lucide-react";
import { useListEvents } from "../hooks/useListEvents";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import { Event, EventInsert, EventUpdate } from "../types";
import { Pagination } from "@/components/admin/Pagination";
import { EventFormModal, EventDetailsModal, DeleteConfirmModal } from "./EventModals";
import { EventCard } from "./EventCard";
import { toast } from "react-toastify";

export const EventsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Slightly more for grid
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: eventsResponse, isLoading, isError, error, refetch } = useListEvents(page, pageSize);
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events = eventsResponse?.data || [];
  const totalPages = eventsResponse?.meta?.totalPages || 1;
  const totalRecords = eventsResponse?.meta?.totalRecords || 0;

  // Handlers
  const handleCreate = () => {
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(false); // Close details if open
    setIsFormModalOpen(true);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(false); // Close details if open
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: EventInsert | EventUpdate) => {
    try {
      if (selectedEvent) {
        await updateMutation.mutateAsync({ eventId: selectedEvent.id, data: data as EventUpdate });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(data as EventInsert);
        toast.success("Event created successfully");
      }
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedEvent) {
      try {
        await deleteMutation.mutateAsync(selectedEvent.id);
        toast.success("Event deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  // Filter events client-side for search (simple implementation)
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h3 className="text-lg font-bold text-red-900">Failed to load events</h3>
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

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 md:w-auto"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Grid of Cards */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event: Event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Calendar size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery ? "No matching events found" : "No events found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first community event."}
          </p>
          {!searchQuery && (
            <button 
              onClick={handleCreate}
              className="mt-6 rounded-sm bg-teal-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700"
            >
              Create Event
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modals */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEvent}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedEvent?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
