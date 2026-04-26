"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Loader2, AlertCircle, Calendar, Search, Plus, Users, X, Filter } from "lucide-react";
import { useListEvents } from "../hooks/useListEvents";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import { Event, EventInsert, EventUpdate } from "../types";
import { EventFormModal, EventDetailsModal, DeleteConfirmModal, BevyEventSearchModal } from "./EventModals";
import { EventCard } from "./EventCard";
import { useCreateEventFromBevyEvent } from "../hooks/useCreateEventFromBevyEvent";
import { useSearchTeams } from "@/features/teams/api/teams";
import { toast } from "react-toastify";
import { useSyncAllEventToBevy } from "../hooks/useSyncAllEventToBevy";
import { useSyncOneEventToBevy } from "../hooks/useSyncOneEventToBevy";
import { useAddEventImage, useDeleteEventImage, useReorderEventImages } from "../hooks/useEventImageMutations";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

const MAX_EVENT_HIGHLIGHT_IMAGES = 20;

const getFileSignature = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${file.type}`;

const dedupeFiles = (files: File[]): File[] => {
  const seen = new Set<string>();
  const unique: File[] = [];

  for (const file of files) {
    const signature = getFileSignature(file);
    if (seen.has(signature)) {
      continue;
    }

    seen.add(signature);
    unique.push(file);
  }

  return unique;
};

const getRemovedImageIndices = (original: string[], desired: string[]): number[] => {
  const desiredCounts = new Map<string, number>();
  for (const imageUrl of desired) {
    desiredCounts.set(imageUrl, (desiredCounts.get(imageUrl) || 0) + 1);
  }

  const runningCounts = new Map<string, number>();
  const removedIndices: number[] = [];

  for (let index = 0; index < original.length; index += 1) {
    const imageUrl = original[index];
    const seenCount = (runningCounts.get(imageUrl) || 0) + 1;
    runningCounts.set(imageUrl, seenCount);

    if (seenCount > (desiredCounts.get(imageUrl) || 0)) {
      removedIndices.push(index);
    }
  }

  return removedIndices;
};

const arrayMoveLocal = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (moved === undefined) {
    return items;
  }

  next.splice(toIndex, 0, moved);
  return next;
};

export const EventsList: React.FC = () => {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 12);
  const searchQuery = getString("q", "");
  const modal = getString("modal", "");
  const selectedEventId = getString("itemId", "");

  const filters = useMemo(
    () => ({
      type: getString("type", "") || undefined,
      teamId: getString("teamId", "") || undefined,
      teamName: getString("teamName", "") || undefined,
      year: (() => {
        const rawYear = getNumber("year", 0);
        return rawYear > 0 ? rawYear : undefined;
      })(),
    }),
    [getNumber, getString],
  );

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [localType, setLocalType] = useState(filters.type || "");
  const [localTeamName, setLocalTeamName] = useState(filters.teamName || "");
  const [localYear, setLocalYear] = useState(filters.year ? String(filters.year) : "");

  const selectedTeamName = getString("teamLabel", "");

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const applySearch = () => {
    setQueryParams({ q: searchInput.trim() || null, page: 1 });
  };

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, event?: Event | null) => {
    setQueryParams({
      modal: nextModal,
      itemId: event?.id || null,
    });
  };

  // Team search state for filter
  const [teamSearch, setTeamSearch] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const teamRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTeamSearch(teamSearch), 300);
    return () => clearTimeout(timer);
  }, [teamSearch]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalType(filters.type || "");
    setLocalTeamName(filters.teamName || "");
    setLocalYear(filters.year ? String(filters.year) : "");
  }, [filters.type, filters.teamName, filters.year]);

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
  const addEventImageMutation = useAddEventImage();
  const deleteEventImageMutation = useDeleteEventImage();
  const reorderEventImagesMutation = useReorderEventImages();
  const syncOneMutation = useSyncOneEventToBevy();
  const [syncingEventId, setSyncingEventId] = useState<string | null>(null);

  const events: Event[] = eventsResponse?.data || [];
  const selectedEvent = useMemo(
    () => events.find((event: Event) => event.id === selectedEventId) || null,
    [events, selectedEventId],
  );

  const isFormModalOpen = modal === "create" || (modal === "edit" && Boolean(selectedEvent));
  const isDetailsModalOpen = modal === "view" && Boolean(selectedEvent);
  const isDeleteModalOpen = modal === "delete" && Boolean(selectedEvent);
  const isBevySearchModalOpen = modal === "importBevy";

  const totalPages = eventsResponse?.meta?.totalPages || 1;
  const totalRecords = eventsResponse?.meta?.totalRecords || 0;

  const syncAllMutation = useSyncAllEventToBevy();


  // Handlers
  const handleCreate = () => {
    openModal("create");
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
    setQueryParams({ modal: "importBevy", itemId: null });
  };

  const handleSyncOneEvent = async (event: Event) => {
    try {
      setSyncingEventId(event.id);
      await syncOneMutation.mutateAsync({ eventId: event.id });
      toast.success("Event synced successfully");
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncingEventId((current) => (current === event.id ? null : current));
    }
  };

  const handleSelectBevyEvent = async (bevyEventId: string) => {
    try {
      await createFromBevyMutation.mutateAsync(bevyEventId);
      toast.success("Event imported from Bevy successfully");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
  };

  const handleEdit = (event: Event) => {
    openModal("edit", event);
  };

  const handleView = (event: Event) => {
    openModal("view", event);
  };

  const handleDeleteClick = (event: Event) => {
    openModal("delete", event);
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
    const {
      highlightImageFiles = [],
      originalHighlightImages = [],
      images = [],
      ...eventPayload
    } = data as EventInsert;

    const normalizedExistingImages = (images || [])
      .map((imageUrl) => imageUrl.trim())
      .filter((imageUrl) => imageUrl.length > 0)
      .slice(0, MAX_EVENT_HIGHLIGHT_IMAGES);
    const pendingHighlightFiles = dedupeFiles(highlightImageFiles || []);

    if (
      normalizedExistingImages.length + pendingHighlightFiles.length >
      MAX_EVENT_HIGHLIGHT_IMAGES
    ) {
      toast.error("You can only add up to 20 highlight images.");
      return;
    }

    try {
      if (selectedEvent) {
        const originalImages = originalHighlightImages.length > 0
          ? originalHighlightImages
          : selectedEvent.images || [];

        const removedIndices = getRemovedImageIndices(
          originalImages,
          normalizedExistingImages,
        ).sort((a, b) => b - a);

        for (const imageIndex of removedIndices) {
          await deleteEventImageMutation.mutateAsync({
            eventId: selectedEvent.id,
            imageIndex,
          });
        }

        const removedIndexSet = new Set<number>(removedIndices);
        let currentExistingOrder = originalImages.filter(
          (_, index) => !removedIndexSet.has(index),
        );

        for (let toIndex = 0; toIndex < normalizedExistingImages.length; toIndex += 1) {
          const targetImage = normalizedExistingImages[toIndex];

          if (currentExistingOrder[toIndex] === targetImage) {
            continue;
          }

          const fromIndex = currentExistingOrder.findIndex(
            (imageUrl, currentIndex) =>
              currentIndex >= toIndex && imageUrl === targetImage,
          );

          if (fromIndex < 0) {
            continue;
          }

          await reorderEventImagesMutation.mutateAsync({
            eventId: selectedEvent.id,
            fromIndex,
            toIndex,
          });

          currentExistingOrder = arrayMoveLocal(
            currentExistingOrder,
            fromIndex,
            toIndex,
          );
        }

        await updateMutation.mutateAsync({
          eventId: selectedEvent.id,
          data: {
            ...(eventPayload as EventUpdate),
            images: normalizedExistingImages,
          },
        });

        for (const image of pendingHighlightFiles) {
          await addEventImageMutation.mutateAsync({
            eventId: selectedEvent.id,
            image,
          });
        }

        toast.success("Event updated successfully");
      } else {
        const createdEventResponse = await createMutation.mutateAsync({
          ...(eventPayload as EventInsert),
          images: [],
        });

        const createdEventId = (createdEventResponse as any)?.data?.id as
          | string
          | undefined;

        if (!createdEventId && pendingHighlightFiles.length > 0) {
          throw new Error("Failed to resolve the created event ID for image upload.");
        }

        if (createdEventId) {
          for (const image of pendingHighlightFiles) {
            await addEventImageMutation.mutateAsync({
              eventId: createdEventId,
              image,
            });
          }
        }

        toast.success("Event created successfully");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedEvent) {
      try {
        await deleteMutation.mutateAsync(selectedEvent.id);
        toast.success("Event deleted successfully");
        closeModal();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  const clearTeamFilter = () => {
    setQueryParams({ teamId: null, teamLabel: null, page: 1 });
    setTeamSearch("");
  };

  const clearTypeFilter = () => {
    setLocalType("");
    setQueryParams({ type: null, page: 1 });
  };

  const handleApplyFilters = () => {
    const parsedYear = localYear.trim() ? Number.parseInt(localYear, 10) : null;
    setQueryParams({
      type: localType.trim() || null,
      teamName: localTeamName.trim() || null,
      year: parsedYear && Number.isFinite(parsedYear) ? parsedYear : null,
      page: 1,
    });
    // Explicitly refetch to handle cases where the filter value might be the same
    // but the user wants to refresh the list manually
    refetch();
  };

  // Filter events client-side for search (simple implementation for title/venue)
  const filteredEvents = events.filter((e: Event) => 
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

  const filtersSection = (
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
                          setQueryParams({
                            teamId: team.id,
                            teamLabel: team.name,
                            page: 1,
                          });
                          setShowTeamDropdown(false);
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
                  setQueryParams({
                    teamName: null,
                    page: 1,
                  });
                  setLocalTeamName("");
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
                  setQueryParams({
                    year: null,
                    page: 1,
                  });
                  setLocalYear("");
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
                setQueryParams({
                  type: null,
                  teamId: null,
                  teamName: null,
                  year: null,
                  teamLabel: null,
                  q: null,
                  page: 1,
                });
                setSearchInput("");
                setLocalType("");
                setLocalTeamName("");
                setLocalYear("");
                setTeamSearch("");
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors ml-2"
            >
              Clear All
            </button>
          )}
        </div>
  );

  return (
    <>
      <AdminListScaffold
        actions={
          <>
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
          </>
        }
        search={
          <AdminSearchSection
            value={searchInput}
            onValueChange={setSearchInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            placeholder="Search events..."
            accent="teal"
            actions={
              <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        filters={filtersSection}
        content={
          filteredEvents.length > 0 ? (
            <AdminCardGrid className={`transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}>
              {filteredEvents.map((event: Event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteFromCard}
                  onSync={handleSyncOneEvent}
                />
              ))}
            </AdminCardGrid>
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
                    setQueryParams({
                      type: null,
                      teamId: null,
                      teamName: null,
                      year: null,
                      teamLabel: null,
                      q: null,
                      page: 1,
                    });
                    setSearchInput("");
                    setLocalType("");
                    setLocalTeamName("");
                    setLocalYear("");
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
          )
        }
        pagination={
          <AdminPaginationSection
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      />

      {/* Modals */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modal === "edit" ? selectedEvent : undefined}
        isSubmitting={
          createMutation.isPending ||
          updateMutation.isPending ||
          addEventImageMutation.isPending ||
          deleteEventImageMutation.isPending ||
          reorderEventImagesMutation.isPending
        }
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        event={selectedEvent}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onSync={handleSyncOneEvent}
        isSyncing={Boolean(selectedEvent && syncingEventId === selectedEvent.id && syncOneMutation.isPending)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={selectedEvent?.title || ""}
        isDeleting={deleteMutation.isPending}
      />

      <BevyEventSearchModal
        isOpen={isBevySearchModalOpen}
        onClose={closeModal}
        onSelect={handleSelectBevyEvent}
        isSubmitting={createFromBevyMutation.isPending}
      />
    </>
  );
};
