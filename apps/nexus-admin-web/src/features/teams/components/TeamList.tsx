"use client";

import React, { useState } from "react";
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

export function TeamList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: teamsResponse, isLoading, isError, error, refetch } = useTeams(page, pageSize);
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const deleteMutation = useDeleteTeam();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [openAddMemberOnDetails, setOpenAddMemberOnDetails] = useState(false);

  const teams = teamsResponse?.body?.data || [];
  const totalPages = teamsResponse?.body?.meta?.totalPages || 1;
  const totalRecords = teamsResponse?.body?.meta?.totalRecords || 0;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTeams = teams.filter((team: Team) => {
    if (!normalizedSearch) return true;

    return (
      team.name?.toLowerCase().includes(normalizedSearch) ||
      team.description?.toLowerCase().includes(normalizedSearch)
    );
  });

  // Handlers
  const handleCreate = () => {
    setSelectedTeam(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(false);
    setOpenAddMemberOnDetails(false);
    setIsFormModalOpen(true);
  };

  const handleView = (team: Team) => {
    setSelectedTeam(team);
    setOpenAddMemberOnDetails(false);
    setIsDetailsModalOpen(true);
  };

  const handleAddMember = (team: Team) => {
    setSelectedTeam(team);
    setOpenAddMemberOnDetails(true);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setOpenAddMemberOnDetails(false);
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
    setIsFormModalOpen(false);
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
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search teams..."
            accent="teal"
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
                  onClick={() => setSearchQuery("")}
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
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTeam || undefined}
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
