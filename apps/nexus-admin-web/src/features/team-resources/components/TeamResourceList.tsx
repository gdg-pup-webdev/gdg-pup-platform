"use client";

import React, { useState } from "react";
import { Plus, Loader2, Search, AlertCircle, Link2 } from "lucide-react";
import { TeamResourceCard } from "./TeamResourceCard";
import { ResourceFormModal, ResourceViewModal, DeleteConfirmModal } from "./TeamResourceModals";
import { useTeamResources, useCreateTeamResource, useUpdateTeamResource, useDeleteTeamResource } from "../hooks";
import { TeamResource, CreateTeamResourceDTO, UpdateTeamResourceDTO } from "../types";
import { toast } from "react-toastify";

export function TeamResourceList() {
  const [params, setParams] = useState({ pageNumber: 1, pageSize: 12 });
  
  // API Hooks
  const { data: response, isLoading, isError, error, refetch } = useTeamResources(params);
  const createMutation = useCreateTeamResource();
  const updateMutation = useUpdateTeamResource();
  const deleteMutation = useDeleteTeamResource();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<TeamResource | null>(null);

  const resources = response?.data || [];
  const meta = response?.meta;

  // Handlers
  const handleAdd = () => {
    setSelectedResource(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (resource: TeamResource) => {
    setSelectedResource(resource);
    setIsFormModalOpen(true);
  };

  const handleView = (resource: TeamResource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (resource: TeamResource) => {
    setSelectedResource(resource);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: any, thumbnail?: File) => {
    try {
      if (selectedResource) {
        await updateMutation.mutateAsync({ 
          id: selectedResource.id, 
          data: data as UpdateTeamResourceDTO,
          thumbnail 
        });
        toast.success("Resource updated successfully");
      } else {
        await createMutation.mutateAsync({ 
          data: data as CreateTeamResourceDTO,
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
        <h3 className="text-lg font-bold text-red-900">Failed to load resources</h3>
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
            placeholder="Search resources..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 md:w-auto"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Grid of Cards */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((resource: TeamResource) => (
            <TeamResourceCard
              key={resource.id}
              resource={resource}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Link2 size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first team resource.</p>
          <button 
            onClick={handleAdd}
            className="mt-6 rounded-sm bg-teal-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700"
          >
            Create Resource
          </button>
        </div>
      )}

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
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedResource?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
