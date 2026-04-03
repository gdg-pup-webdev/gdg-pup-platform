"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Calendar, Search, Plus, Users, X, Filter } from "lucide-react";
import { useListEvents } from "../hooks/useListEvents";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import { Event, EventInsert, EventUpdate } from "../types";
import { Pagination } from "@/components/admin/Pagination";
import { EventFormModal, EventDetailsModal, DeleteConfirmModal, BevyEventSearchModal } from "./EventModals";
import { EventCard } from "./EventCard";
import { useCreateEventFromBevyEvent } from "../hooks/useCreateEventFromBevyEvent";
import { useSearchTeams } from "@/features/teams/api/teams";
import { toast } from "react-toastify";
import { useSyncAllEventToBevy } from "../hooks/useSyncAllEventToBevy";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { SearchInput } from "@/components/ui/SearchInput";
import { AdminActionButton } from "@/components/admin/AdminActionButton";

export const EventsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter state (actual filters applied to the query)
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    teamId: undefined as string | undefined,
    teamName: undefined as string | undefined,
    year: undefined as number | undefined,
  });

  // Local input state (values in the text fields before clicking Search)
  const [localType, setLocalType] = useState("");
  const [localTeamName, setLocalTeamName] = useState("");
  const [localYear, setLocalYear] = useState("");

  // Team search state for filter
  const [teamSearch, setTeamSearch] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const teamRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTeamSearch(teamSearch), 300);
    return () => clearTimeout(timer);
  }, [teamSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) setShowTeamDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API Hooks
  const { data: eventsResponse, isLoading, isFetching, isError, error, refetch } = useListEvents(page, pageSize, filters);
  const createMutation = useCreateEvent();
  const createFromBevyMutation = useCreateEventFromBevyEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBevySearchModalOpen, setIsBevySearchModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events = eventsResponse?.data || [];
  const totalPages = eventsResponse?.meta?.totalPages || 1;
  const totalRecords = eventsResponse?.meta?.totalRecords || 0;

  const syncAllMutation = useSyncAllEventToBevy();


  // Handlers
  const handleCreate = () => {
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleSyncAllToBevy = () => {
    // Implementation for syncing all events to Bevy
    try {
      syncAllMutation.mutateAsync();
      toast.success("All events are being synced to Bevy!");
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    }
  };

  const handleCreateFromBevy = () => {
    setIsBevySearchModalOpen(true);
  };

  const handleSelectBevyEvent = async (bevyEventId: string) => {
    try {
      await createFromBevyMutation.mutateAsync(bevyEventId);
      toast.success("Event imported from Bevy successfully");
      setIsBevySearchModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
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

  const handleDeleteFromCard = async (event: Event) => {
    try {
      await deleteMutation.mutateAsync(event.id);
      toast.success("Event deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
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

  const clearTeamFilter = () => {
    setFilters(prev => ({ ...prev, teamId: undefined }));
    setSelectedTeamName("");
    setTeamSearch("");
    setPage(1);
  };

  const clearTypeFilter = () => {
    setLocalType("");
    setFilters(prev => ({ ...prev, type: undefined }));
    setPage(1);
  };

  const handleApplyFilters = () => {
    setFilters(prev => ({
      ...prev,
      type: localType.trim() || undefined,
      teamName: localTeamName.trim() || undefined,
      year: localYear.trim() ? parseInt(localYear) : undefined
    }));
    setPage(1);
    // Explicitly refetch to handle cases where the filter value might be the same
    // but the user wants to refresh the list manually
    refetch();
  };

  // Filter events client-side for search (simple implementation for title/venue)
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !searchQuery && !filters.teamId && !filters.type && !filters.teamName) {
    return <ListLoadingState accent="teal" message="Loading events..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load events"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-col">
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search events..."
            accent="teal"
            containerClassName="w-full max-w-sm"
          />
          <div className="flex w-full items-center gap-2 md:w-auto">
            <AdminActionButton
              onClick={handleSyncAllToBevy}
              disabled={syncAllMutation.isPending}
              variant="brandOutline"
              className="flex-1 md:flex-none"
            >
              {syncAllMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span className="ml-1">Syncing...</span>
                </>
              ) : (
                <span>Sync All to Bevy</span>
              )}
            </AdminActionButton>
            <AdminActionButton
              onClick={handleCreateFromBevy}
              variant="brandOutline"
              className="flex-1 md:flex-none"
            >
              Import from Bevy
            </AdminActionButton>
            <AdminActionButton
              onClick={handleCreate}
              variant="brand"
              className="flex-1 md:flex-none"
            >
              <Plus size={18} />
              Create Event
            </AdminActionButton>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2">
            <Filter size={12} />
            Filter by:
          </div>
          
          {/* Team Filter */}
          <div className="relative" ref={teamRef}>
            <button
              onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                filters.teamId ? "border-teal-200 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <Users size={14} />
              {selectedTeamName || "All Teams"}
              {filters.teamId && (
                <X size={14} className="ml-1 hover:text-teal-900" onClick={(e) => { e.stopPropagation(); clearTeamFilter(); }} />
              )}
            </button>

            {showTeamDropdown && (
              <div className="absolute left-0 z-50 mt-2 w-64 rounded-sm border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2">
                <div className="relative mb-2">
                  <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search teams..."
                    className="w-full rounded-sm border border-gray-100 bg-gray-50 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-teal-500"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {isSearchingTeams ? (
                    <div className="flex justify-center py-4"><Loader2 size={16} className="animate-spin text-teal-600" /></div>
                  ) : teamsResponse?.body?.data?.length ? (
                    teamsResponse.body.data.map((team: any) => (
                      <button
                        key={team.id}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, teamId: team.id }));
                          setSelectedTeamName(team.name);
                          setShowTeamDropdown(false);
                          setPage(1);
                        }}
                        className="w-full rounded px-3 py-2 text-left text-xs hover:bg-teal-50 hover:text-teal-700"
                      >
                        {team.name}
                      </button>
                    ))
                  ) : (
                    <div className="py-4 text-center text-xs text-gray-400 italic">No teams found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 focus-within:border-teal-500 transition-all">
            <input
              type="text"
              placeholder="Filter by type..."
              className="w-24 outline-none bg-transparent"
              value={localType}
              onChange={(e) => setLocalType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
            />
            {localType && (
              <X 
                size={14} 
                className="cursor-pointer hover:text-red-500" 
                onClick={clearTypeFilter} 
              />
            )}
          </div>

          {/* Team Name Filter */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 focus-within:border-teal-500 transition-all">
            <Users size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Filter by team name..."
              className="w-32 outline-none bg-transparent"
              value={localTeamName}
              onChange={(e) => setLocalTeamName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
            />
            {localTeamName && (
              <X 
                size={14} 
                className="cursor-pointer hover:text-red-500" 
                onClick={() => {
                  setLocalTeamName("");
                  setFilters(prev => ({ ...prev, teamName: undefined }));
                  setPage(1);
                }} 
              />
            )}
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 focus-within:border-teal-500 transition-all">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="number"
              placeholder="Year (e.g. 2025)"
              className="w-24 outline-none bg-transparent"
              value={localYear}
              onChange={(e) => setLocalYear(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyFilters();
              }}
            />
            {localYear && (
              <X 
                size={14} 
                className="cursor-pointer hover:text-red-500" 
                onClick={() => {
                  setLocalYear("");
                  setFilters(prev => ({ ...prev, year: undefined }));
                  setPage(1);
                }} 
              />
            )}
          </div>

          <AdminActionButton
            onClick={handleApplyFilters}
            disabled={isFetching}
            variant="teal"
            size="sm"
            className="px-4 text-[10px] uppercase tracking-widest shadow-sm"
          >
            {isFetching ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
            {isFetching ? "Searching..." : "Search"}
          </AdminActionButton>

          {(filters.teamId || filters.type || filters.teamName || filters.year || searchQuery || localType || localTeamName || localYear) && (
            <button
              onClick={() => {
                setFilters({ type: undefined, teamId: undefined, teamName: undefined, year: undefined });
                setLocalType("");
                setLocalTeamName("");
                setLocalYear("");
                setSelectedTeamName("");
                setTeamSearch("");
                setSearchQuery("");
                setPage(1);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors ml-2"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Grid of Cards */}
      {filteredEvents.length > 0 ? (
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}>
          {filteredEvents.map((event: Event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteFromCard}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Calendar size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery || filters.teamId || filters.type || filters.teamName ? "No matching events found" : "No events found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filters.teamId || filters.type || filters.teamName ? "Try adjusting your filters." : "Get started by creating your first community event."}
          </p>
          {(searchQuery || filters.teamId || filters.type || filters.teamName || filters.year) ? (
            <AdminActionButton
              onClick={() => {
                setFilters({ type: undefined, teamId: undefined, teamName: undefined, year: undefined });
                setLocalType("");
                setLocalTeamName("");
                setLocalYear("");
                setSelectedTeamName("");
                setSearchQuery("");
              }}
              variant="dark"
              size="sm"
              className="mt-6"
            >
              Clear Filters
            </AdminActionButton>
          ) : (
            <AdminActionButton
              onClick={handleCreate}
              variant="teal"
              size="sm"
              className="mt-6"
            >
              Create Event
            </AdminActionButton>
          )}
        </div>
      )}

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

      <BevyEventSearchModal
        isOpen={isBevySearchModalOpen}
        onClose={() => setIsBevySearchModalOpen(false)}
        onSelect={handleSelectBevyEvent}
        isSubmitting={createFromBevyMutation.isPending}
      />
    </div>
  );
};
