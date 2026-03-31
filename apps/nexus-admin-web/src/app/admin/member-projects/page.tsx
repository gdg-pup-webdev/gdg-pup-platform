"use client";

import React, { useState } from "react";
import { MemberProjectList } from "@/features/member-projects/components/MemberProjectList";
import { ProjectFormModal, DeleteConfirmModal, ProjectViewModal } from "@/features/member-projects/components/MemberProjectModals";
import { useCreateMemberProject } from "@/features/member-projects/hooks/useCreateMemberProject";
import { useUpdateMemberProject } from "@/features/member-projects/hooks/useUpdateMemberProject";
import { useDeleteMemberProject } from "@/features/member-projects/hooks/useDeleteMemberProject";
import { MemberProject, CreateMemberProjectDTO, UpdateMemberProjectDTO } from "@/features/member-projects/types";
import { toast } from "react-toastify";

export default function MemberProjectsPage() {
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MemberProject | undefined>(undefined);

  // Mutations
  const createMutation = useCreateMemberProject();
  const updateMutation = useUpdateMemberProject();
  const deleteMutation = useDeleteMemberProject();

  const handleCreate = () => {
    setSelectedProject(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (project: MemberProject) => {
    setSelectedProject(project);
    setIsFormModalOpen(true);
  };

  const handleDelete = (project: MemberProject) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleView = (project: MemberProject) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateMemberProjectDTO | UpdateMemberProjectDTO, 
    files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File }
  ) => {
    try {
      if (selectedProject) {
        await updateMutation.mutateAsync({ 
          id: selectedProject.id, 
          data: data as UpdateMemberProjectDTO, 
          files 
        });
        toast.success("Project updated successfully");
      } else {
        await createMutation.mutateAsync({ 
          data: data as CreateMemberProjectDTO, 
          files 
        });
        toast.success("Project created successfully");
      }
      setIsFormModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the project");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProject) {
      try {
        await deleteMutation.mutateAsync(selectedProject.id);
        toast.success("Project deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (error: any) {
        toast.error(error.message || "An error occurred while deleting the project");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MemberProjectList 
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedProject?.title || ""}
        isDeleting={deleteMutation.isPending}
      />

      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        project={selectedProject || null}
      />
    </div>
  );
}
