"use client";

import React, { useMemo, useState } from "react";
import { MemberProjectList } from "@/features/member-projects/components/MemberProjectList";
import { ProjectFormModal, ProjectViewModal, DeleteConfirmModal } from "@/features/member-projects/components/MemberProjectModals";
import { useCreateMemberProject } from "@/features/member-projects/hooks/useCreateMemberProject";
import { useDeleteMemberProject } from "@/features/member-projects/hooks/useDeleteMemberProject";
import { useUpdateMemberProject } from "@/features/member-projects/hooks/useUpdateMemberProject";
import { useMemberProject } from "@/features/member-projects/hooks/useMemberProject";
import { CreateMemberProjectDTO, MemberProject, UpdateMemberProjectDTO } from "@/features/member-projects/types";
import { toast } from "react-toastify";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export default function MemberProjectsPage() {
  const { getString, setQueryParams } = useAdminQueryParams();
  const modal = getString("modal", "");
  const selectedProjectId = getString("itemId", "");

  const [selectedProjectSnapshot, setSelectedProjectSnapshot] = useState<MemberProject | undefined>(undefined);
  const { data: selectedProjectResponse } = useMemberProject(selectedProjectId);

  const selectedProject = useMemo(() => {
    const hydrated = ((selectedProjectResponse as any)?.data || selectedProjectResponse) as MemberProject | undefined;

    if (hydrated?.id) {
      return hydrated;
    }

    if (selectedProjectSnapshot?.id === selectedProjectId) {
      return selectedProjectSnapshot;
    }

    return selectedProjectSnapshot;
  }, [selectedProjectId, selectedProjectResponse, selectedProjectSnapshot]);

  const isFormModalOpen = modal === "create" || modal === "edit";
  const isDeleteModalOpen = modal === "delete";
  const isViewModalOpen = modal === "view";

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, project?: MemberProject) => {
    setSelectedProjectSnapshot(project);
    setQueryParams({
      modal: nextModal,
      itemId: project?.id || null,
    });
  };

  // Mutations
  const createMutation = useCreateMemberProject();
  const updateMutation = useUpdateMemberProject();
  const deleteMutation = useDeleteMemberProject();

  const handleCreate = () => {
    setSelectedProjectSnapshot(undefined);
    openModal("create");
  };

  const handleEdit = (project: MemberProject) => {
    openModal("edit", project);
  };

  const handleDelete = (project: MemberProject) => {
    openModal("delete", project);
  };

  const handleView = (project: MemberProject) => {
    openModal("view", project);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await deleteMutation.mutateAsync(selectedProject.id);
      toast.success("Project deleted successfully");
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the project");
    }
  };

  const handleFormSubmit = async (data: CreateMemberProjectDTO | UpdateMemberProjectDTO) => {
    try {
      if (selectedProject) {
        await updateMutation.mutateAsync({ 
          id: selectedProject.id, 
          data: data as UpdateMemberProjectDTO,
        });
        toast.success("Project updated successfully");
      } else {
        await createMutation.mutateAsync({ 
          data: data as CreateMemberProjectDTO,
        });
        toast.success("Project created successfully");
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the project");
    }
  };

  return (
    <AdminPageScaffold pageKey="memberProjects">
      <MemberProjectList
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modal === "edit" ? selectedProject : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        itemName={selectedProject?.title || "this project"}
      />

      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        project={selectedProject || null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminPageScaffold>
  );
}
