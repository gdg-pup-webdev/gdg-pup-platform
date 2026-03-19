"use client";

import React, { useState } from "react";
import { Plus, Loader2, Search, AlertCircle, Users } from "lucide-react";
import { TeamCard } from "./TeamCard";
import { TeamFormModal, TeamDetailsModal, DeleteConfirmModal } from "./TeamModals";
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from "../api/teams";
import { Team, TeamInsert, TeamUpdate } from "../types";
import { Pagination } from "@/components/admin/Pagination";

export function TeamList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // API Hooks
  const { data: teamsResponse, isLoading, isError, error, refetch } = useTeams(page, pageSize);
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const deleteMutation = useDeleteTeam();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teams = teamsResponse?.body?.data || [];
  const totalPages = teamsResponse?.body?.meta?.totalPages || 1;
  const totalRecords = teamsResponse?.body?.meta?.totalRecords || 0;

  // Handlers
  const handleCreate = () => {
    setSelectedTeam(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsFormModalOpen(true);
  };

  const handleView = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: TeamInsert | TeamUpdate) => {
    if (selectedTeam) {
      await updateMutation.mutateAsync({ id: selectedTeam.id, data: data as TeamUpdate });
    } else {
      await createMutation.mutateAsync(data as TeamInsert);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTeam) {
      await deleteMutation.mutateAsync(selectedTeam.id);
      setIsDeleteModalOpen(false);
    }
  };

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
        <h3 className="text-lg font-bold text-red-900">Failed to load teams</h3>
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
            placeholder="Search teams..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 md:w-auto"
        >
          <Plus size={18} />
          Create Team
        </button>
      </div>

      {/* Grid of Cards */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team: Team) => (
            <TeamCard
              key={team.id}
              team={team}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Users size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No teams found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first GDG team.</p>
          <button 
            onClick={handleCreate}
            className="mt-6 rounded-sm bg-teal-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700"
          >
            Create Team
          </button>
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
      <TeamFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTeam || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <TeamDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        team={selectedTeam}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedTeam?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
