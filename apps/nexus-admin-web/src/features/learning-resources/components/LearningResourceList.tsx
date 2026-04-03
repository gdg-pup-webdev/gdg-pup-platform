"use client";

import React, { useState, useEffect, useRef } from "react";
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

export function LearningResourceList() {
  const [params, setParams] = useState({ 
    pageNumber: 1, 
    pageSize: 12, 
    search: undefined as string | undefined,
    teamId: undefined as string | undefined,
    teamName: undefined as string | undefined,
    eventId: undefined as string | undefined
  });

  // Local input states for the filter fields (to avoid fetching on every keystroke)
  const [localSearch, setLocalSearch] = useState("");
  const [localTeamName, setLocalTeamName] = useState("");
  
  // API Hooks
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetLearningResources(params);
  const createMutation = useCreateLearningResource();
  const updateMutation = useUpdateLearningResource();
  const deleteMutation = useDeleteLearningResource();
  
  // Search state for dropdowns
  const [teamSearch, setTeamSearch] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const teamRef = useRef<HTMLDivElement>(null);

  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const eventRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);
  const { data: eventsResponse } = useListEvents(1, 20);

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);

  // Debouncing for search fields (optional but added per requirement)
  useEffect(() => {
    const timer = setTimeout(() => {
      // We don't automatically trigger fetch here if we want manual button trigger,
      // but the user asked for debouncing too. Let's use it for the dropdown search.
      setDebouncedTeamSearch(teamSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [teamSearch]);

  // Handler for manual search button
  const handleSearchTrigger = () => {
    setParams(prev => ({
      ...prev,
      search: localSearch.trim() || undefined,
      teamName: localTeamName.trim() || undefined,
      pageNumber: 1
    }));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) setShowTeamDropdown(false);
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) setShowEventDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resources = response?.data || [];
  const meta = response?.meta;

  // Handlers
  const handleAdd = () => {
    setSelectedResource(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (resource: LearningResource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleView = (resource: LearningResource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (resource: LearningResource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(true);
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
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedResource) {
      try {
        await deleteMutation.mutateAsync(selectedResource.id);
        toast.success("Resource deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete resource");
      }
    }
  };

  const clearTeamFilter = () => {
    setParams(prev => ({ ...prev, teamId: undefined, teamName: undefined }));
    setLocalTeamName("");
    setSelectedTeamName("");
    setTeamSearch("");
  };

  const clearEventFilter = () => {
    setParams(prev => ({ ...prev, eventId: undefined }));
    setSelectedEventTitle("");
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
                      setParams(prev => ({ ...prev, teamId: team.id, teamName: undefined, pageNumber: 1 }));
                      setLocalTeamName("");
                      setSelectedTeamName(team.name);
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
                      setParams(prev => ({ ...prev, eventId: event.id, pageNumber: 1 }));
                      setSelectedEventTitle(event.title);
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
            setParams({ pageNumber: 1, pageSize: 12, search: "", teamId: undefined, teamName: undefined, eventId: undefined });
            setLocalSearch("");
            setLocalTeamName("");
            setSelectedTeamName("");
            setSelectedEventTitle("");
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
                      onClick={() => setParams({ pageNumber: 1, pageSize: 12, search: undefined, teamId: undefined, teamName: undefined, eventId: undefined })}
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
            currentPage={params.pageNumber}
            totalPages={meta?.totalPages || 1}
            pageSize={params.pageSize}
            totalRecords={meta?.totalRecords || resources.length}
            onPageChange={(nextPage) => setParams((prev) => ({ ...prev, pageNumber: nextPage }))}
            onPageSizeChange={(nextSize) => setParams((prev) => ({ ...prev, pageSize: nextSize, pageNumber: 1 }))}
          />
        }
      />

      {/* Modals */}
      <ResourceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedResource || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ResourceViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        resource={selectedResource}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedResource?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
