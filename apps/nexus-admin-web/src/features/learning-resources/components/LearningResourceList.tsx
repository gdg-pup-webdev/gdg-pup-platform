"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Loader2, Search, AlertCircle, Link2, Users, Calendar, X } from "lucide-react";
import { LearningResourceCard } from "./LearningResourceCard";
import { ResourceFormModal, ResourceViewModal, DeleteConfirmModal } from "./LearningResourceModals";
import { useGetLearningResources, useCreateLearningResource, useUpdateLearningResource, useDeleteLearningResource } from "../hooks";
import { LearningResource, CreateLearningResourceDTO, UpdateLearningResourceDTO } from "../types";
import { useSearchTeams } from "@/features/teams/api/teams";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export function LearningResourceList() {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const pageNumber = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 12);
  const modal = getString("modal", "");
  const selectedResourceId = getString("itemId", "");

  const params = useMemo(
    () => ({
      pageNumber,
      pageSize,
      search: getString("search", "") || undefined,
      teamId: getString("teamId", "") || undefined,
      teamName: getString("teamName", "") || undefined,
      eventId: getString("eventId", "") || undefined,
    }),
    [getString, pageNumber, pageSize],
  );

  const [localSearch, setLocalSearch] = useState(params.search || "");
  const [localTeamName, setLocalTeamName] = useState(params.teamName || "");
  const selectedTeamName = getString("teamLabel", "");
  const selectedEventTitle = getString("eventLabel", "");

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, resource?: LearningResource | null) => {
    setQueryParams({
      modal: nextModal,
      itemId: resource?.id || null,
    });
  };
  
  // API Hooks
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetLearningResources(params);
  const createMutation = useCreateLearningResource();
  const updateMutation = useUpdateLearningResource();
  const deleteMutation = useDeleteLearningResource();
  
  // Search state for dropdowns
  const [teamSearch, setTeamSearch] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const teamRef = useRef<HTMLDivElement>(null);

  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const eventRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);
  const { data: eventsResponse } = useListEvents(1, 20);

  // Debouncing for search fields (optional but added per requirement)
  useEffect(() => {
    const timer = setTimeout(() => {
      // We don't automatically trigger fetch here if we want manual button trigger,
      // but the user asked for debouncing too. Let's use it for the dropdown search.
      setDebouncedTeamSearch(teamSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [teamSearch]);

  useEffect(() => {
    setLocalSearch(params.search || "");
    setLocalTeamName(params.teamName || "");
  }, [params.search, params.teamName]);

  // Handler for manual search button
  const handleSearchTrigger = () => {
    setQueryParams({
      search: localSearch.trim() || null,
      teamName: localTeamName.trim() || null,
      page: 1,
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) setShowTeamDropdown(false);
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) setShowEventDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resources: LearningResource[] = response?.data || [];
  const meta = response?.meta;
  const selectedResource = useMemo(
    () => resources.find((resource: LearningResource) => resource.id === selectedResourceId) || null,
    [resources, selectedResourceId],
  );

  const isFormModalOpen = modal === "create" || (modal === "edit" && Boolean(selectedResource));
  const isViewModalOpen = modal === "view" && Boolean(selectedResource);
  const isDeleteModalOpen = modal === "delete" && Boolean(selectedResource);

  // Handlers
  const handleAdd = () => {
    openModal("create");
  };

  const handleEdit = (resource: LearningResource) => {
    openModal("edit", resource);
  };

  const handleView = (resource: LearningResource) => {
    openModal("view", resource);
  };

  const handleDeleteClick = (resource: LearningResource) => {
    openModal("delete", resource);
  };

  const handleDeleteFromCard = async (resource: LearningResource) => {
    try {
      await deleteMutation.mutateAsync(resource.id);
      toast.success("Resource deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resource");
    }
  };

  const handleFormSubmit = async (data: any, thumbnail?: File) => {
    try {
      if (selectedResource) {
        await updateMutation.mutateAsync({ 
          id: selectedResource.id, 
          data: data as UpdateLearningResourceDTO,
          thumbnail 
        });
        toast.success("Resource updated successfully");
      } else {
        await createMutation.mutateAsync({ 
          data: data as CreateLearningResourceDTO,
          thumbnail 
        });
        toast.success("Resource created successfully");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedResource) {
      try {
        await deleteMutation.mutateAsync(selectedResource.id);
        toast.success("Resource deleted successfully");
        closeModal();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete resource");
      }
    }
  };

  const clearTeamFilter = () => {
    setLocalTeamName("");
    setQueryParams({
      teamId: null,
      teamName: null,
      teamLabel: null,
      page: 1,
    });
    setTeamSearch("");
  };

  const clearEventFilter = () => {
    setQueryParams({ eventId: null, eventLabel: null, page: 1 });
  };

  if (isLoading && !params.search && !params.teamId && !params.eventId && !params.teamName) {
    return <ListLoadingState accent="teal" message="Loading resources..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load resources"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  const filtersSection = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mr-2">
        Quick Filter:
      </div>

      {/* Team Dropdown Filter */}
      <div className="relative" ref={teamRef}>
        <button
          onClick={() => setShowTeamDropdown(!showTeamDropdown)}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
            params.teamId ? "border-teal-200 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <Users size={14} />
          {selectedTeamName || "Select Team"}
          {params.teamId && (
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
                        teamName: null,
                        teamLabel: team.name,
                        page: 1,
                      });
                      setLocalTeamName("");
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

      {/* Event Filter */}
      <div className="relative" ref={eventRef}>
        <button
          onClick={() => setShowEventDropdown(!showEventDropdown)}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
            params.eventId ? "border-teal-200 bg-teal-50 text-teal-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <Calendar size={14} />
          {selectedEventTitle || "All Events"}
          {params.eventId && (
            <X size={14} className="ml-1 hover:text-teal-900" onClick={(e) => { e.stopPropagation(); clearEventFilter(); }} />
          )}
        </button>

        {showEventDropdown && (
          <div className="absolute left-0 z-50 mt-2 w-64 rounded-sm border border-gray-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="max-h-48 overflow-y-auto">
              {eventsResponse?.data?.length ? (
                eventsResponse.data.map((event: any) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setQueryParams({
                        eventId: event.id,
                        eventLabel: event.title,
                        page: 1,
                      });
                      setShowEventDropdown(false);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs hover:bg-teal-50 hover:text-teal-700"
                  >
                    {event.title}
                  </button>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-gray-400 italic">No events found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {(params.teamId || params.eventId || params.search || params.teamName) && (
        <button
          onClick={() => {
            setQueryParams({
              page: 1,
              search: null,
              teamId: null,
              teamName: null,
              teamLabel: null,
              eventId: null,
              eventLabel: null,
            });
            setLocalSearch("");
            setLocalTeamName("");
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
          <AdminActionButton
            onClick={handleAdd}
            variant="brand"
            className="w-full md:w-auto"
          >
            <Plus size={18} />
            Add Resource
          </AdminActionButton>
        }
        search={
          <AdminSearchSection
            value={localSearch}
            onValueChange={setLocalSearch}
            placeholder="Search resources..."
            accent="teal"
            searchContainerClassName="md:max-w-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSearchTrigger()}
            actions={
              <>
                <div className="relative w-full md:w-56">
                  <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Team Name..."
                    className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    value={localTeamName}
                    onChange={(e) => setLocalTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchTrigger()}
                  />
                </div>

                <AdminActionButton
                  onClick={handleSearchTrigger}
                  disabled={isFetching}
                  variant="teal"
                  className="w-full md:w-auto"
                >
                  {isFetching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  Search
                </AdminActionButton>
              </>
            }
          />
        }
        filters={filtersSection}
        content={
          resources.length > 0 ? (
            <AdminCardGrid>
              {resources.map((resource: LearningResource) => (
                <LearningResourceCard
                  key={resource.id}
                  resource={resource}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteFromCard}
                />
              ))}
            </AdminCardGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
              {isLoading ? (
                <Loader2 size={40} className="animate-spin text-teal-600" />
              ) : (
                <>
                  <Link2 size={48} className="mb-4 text-gray-300" />
                  <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {params.teamId || params.eventId || params.search
                      ? "No resources match your active filters."
                      : "Get started by adding your first learning resource."}
                  </p>
                  {(params.teamId || params.eventId || params.search || params.teamName) ? (
                    <AdminActionButton
                      onClick={() =>
                        setQueryParams({
                          page: 1,
                          search: null,
                          teamId: null,
                          teamName: null,
                          teamLabel: null,
                          eventId: null,
                          eventLabel: null,
                        })
                      }
                      variant="dark"
                      size="sm"
                      className="mt-6"
                    >
                      Clear Filters
                    </AdminActionButton>
                  ) : (
                    <AdminActionButton
                      onClick={handleAdd}
                      variant="teal"
                      size="sm"
                      className="mt-6"
                    >
                      Create Resource
                    </AdminActionButton>
                  )}
                </>
              )}
            </div>
          )
        }
        pagination={
          <AdminPaginationSection
            currentPage={pageNumber}
            totalPages={meta?.totalPages || 1}
            pageSize={pageSize}
            totalRecords={meta?.totalRecords || resources.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      />

      {/* Modals */}
      <ResourceFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modal === "edit" ? selectedResource || undefined : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ResourceViewModal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        resource={selectedResource}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={selectedResource?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
