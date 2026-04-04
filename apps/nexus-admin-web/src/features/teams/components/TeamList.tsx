"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { TeamFormModal, TeamDetailsModal } from "./TeamModals";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from "../api/teams";
import { Team, TeamInsert, TeamUpdate } from "../types";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { toast } from "react-toastify";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export function TeamList() {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 10);
  const searchQuery = getString("q", "");
  const modal = getString("modal", "");
  const selectedTeamId = getString("itemId", "");
  
  // API Hooks
  const { data: teamsResponse, isLoading, isError, error, refetch } = useTeams(page, pageSize);
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const deleteMutation = useDeleteTeam();

  const teams = teamsResponse?.body?.data || [];
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) || null,
    [teams, selectedTeamId],
  );

  const isFormModalOpen = modal === "create" || (modal === "edit" && Boolean(selectedTeam));
  const isDetailsModalOpen = (modal === "view" || modal === "addMember") && Boolean(selectedTeam);
  const openAddMemberOnDetails = modal === "addMember";

  const totalPages = teamsResponse?.body?.meta?.totalPages || 1;
  const totalRecords = teamsResponse?.body?.meta?.totalRecords || 0;

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTeams = teams.filter((team: Team) => {
    if (!normalizedSearch) return true;

    return (
      team.name?.toLowerCase().includes(normalizedSearch) ||
      team.description?.toLowerCase().includes(normalizedSearch)
    );
  });

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const applySearch = () => {
    setQueryParams({ q: searchInput.trim() || null, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput("");
    setQueryParams({ q: null, page: 1 });
  };

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, team?: Team | null) => {
    setQueryParams({
      modal: nextModal,
      itemId: team?.id || null,
    });
  };

  // Handlers
  const handleCreate = () => {
    openModal("create");
  };

  const handleEdit = (team: Team) => {
    openModal("edit", team);
  };

  const handleView = (team: Team) => {
    openModal("view", team);
  };

  const handleAddMember = (team: Team) => {
    openModal("addMember", team);
  };

  const handleCloseDetails = () => {
    closeModal();
  };

  const handleDelete = async (team: Team) => {
    try {
      await deleteMutation.mutateAsync(team.id);
      toast.success("Team deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete team");
    }
  };

  const handleDeleteFromDetails = async (team: Team) => {
    if (!window.confirm(`Are you sure you want to delete team \"${team.name}\"?`)) {
      return;
    }

    await handleDelete(team);
    handleCloseDetails();
  };

  const handleFormSubmit = async (data: TeamInsert | TeamUpdate) => {
    if (selectedTeam) {
      await updateMutation.mutateAsync({ id: selectedTeam.id, data: data as TeamUpdate });
    } else {
      await createMutation.mutateAsync(data as TeamInsert);
    }
    closeModal();
  };

  if (isLoading) {
    return <ListLoadingState accent="teal" message="Loading teams..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load teams"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <AdminListScaffold
        actions={
          <AdminActionButton
            onClick={handleCreate}
            variant="brand"
            className="w-full md:w-auto"
          >
            <Plus size={18} />
            Create Team
          </AdminActionButton>
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
            placeholder="Search teams..."
            accent="teal"
            actions={
              <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        content={
          filteredTeams.length > 0 ? (
            <AdminCardGrid>
              {filteredTeams.map((team: Team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddMember={handleAddMember}
                />
              ))}
            </AdminCardGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
              <Users size={48} className="mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">
                {searchQuery ? "No matching teams found" : "No teams found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first GDG team."}
              </p>
              {searchQuery ? (
                <AdminActionButton
                    onClick={clearSearch}
                  variant="dark"
                  size="sm"
                  className="mt-6"
                >
                  Clear Search
                </AdminActionButton>
              ) : (
                <AdminActionButton
                  onClick={handleCreate}
                  variant="teal"
                  size="sm"
                  className="mt-6"
                >
                  Create Team
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
      <TeamFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modal === "edit" ? selectedTeam || undefined : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <TeamDetailsModal
        key={`${selectedTeam?.id ?? "none"}-${openAddMemberOnDetails ? "add" : "view"}`}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        team={selectedTeam}
        onEdit={handleEdit}
        onDelete={handleDeleteFromDetails}
        openAddMemberOnOpen={openAddMemberOnDetails}
      />
    </>
  );
}
