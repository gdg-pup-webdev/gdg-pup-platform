"use client";

import React, { useMemo, useState } from "react";
import { MemberShowcaseList } from "@/features/member-showcase/components/MemberShowcaseList";
import { ShowcaseFormModal, ShowcaseViewModal } from "@/features/member-showcase/components/MemberShowcaseModals";
import { MemberShowcase, CreateMemberShowcaseDTO, UpdateMemberShowcaseDTO } from "@/features/member-showcase/types";
import { useCreateMemberShowcase } from "@/features/member-showcase/hooks/useCreateMemberShowcase";
import { useUpdateMemberShowcase } from "@/features/member-showcase/hooks/useUpdateMemberShowcase";
import { useDeleteMemberShowcase } from "@/features/member-showcase/hooks/useDeleteMemberShowcase";
import { useMemberShowcase } from "@/features/member-showcase/hooks/useMemberShowcase";
import { toast } from "react-toastify";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export default function MemberShowcasePage() {
  const { getString, setQueryParams } = useAdminQueryParams();
  const modal = getString("modal", "");
  const selectedShowcaseId = getString("itemId", "");

  const [selectedShowcaseSnapshot, setSelectedShowcaseSnapshot] = useState<MemberShowcase | null>(null);
  const { data: selectedShowcaseResponse } = useMemberShowcase(selectedShowcaseId);

  const selectedShowcase = useMemo(() => {
    const hydrated = ((selectedShowcaseResponse as any)?.data || selectedShowcaseResponse) as
      | MemberShowcase
      | null
      | undefined;

    if (hydrated?.id) {
      return hydrated;
    }

    if (selectedShowcaseSnapshot?.id === selectedShowcaseId) {
      return selectedShowcaseSnapshot;
    }

    return selectedShowcaseSnapshot;
  }, [selectedShowcaseId, selectedShowcaseResponse, selectedShowcaseSnapshot]);

  const isFormModalOpen = modal === "create" || modal === "edit";
  const isViewModalOpen = modal === "view";

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, showcase?: MemberShowcase | null) => {
    setSelectedShowcaseSnapshot(showcase || null);
    setQueryParams({
      modal: nextModal,
      itemId: showcase?.id || null,
    });
  };

  const createMutation = useCreateMemberShowcase();
  const updateMutation = useUpdateMemberShowcase();
  const deleteMutation = useDeleteMemberShowcase();

  const handleCreate = () => {
    setSelectedShowcaseSnapshot(null);
    openModal("create");
  };

  const handleEdit = (showcase: MemberShowcase) => {
    openModal("edit", showcase);
  };

  const handleDelete = async (showcase: MemberShowcase) => {
    try {
      setSelectedShowcaseSnapshot(showcase);
      setQueryParams({ modal: "delete", itemId: showcase.id });
      await deleteMutation.mutateAsync(showcase.id);
      toast.success("Showcase deleted successfully");
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete showcase");
    }
  };

  const handleView = (showcase: MemberShowcase) => {
    openModal("view", showcase);
  };

  const handleSubmit = async (data: CreateMemberShowcaseDTO | UpdateMemberShowcaseDTO, thumbnail?: File) => {
    try {
      if (selectedShowcase) {
        await updateMutation.mutateAsync({ 
          id: selectedShowcase.id, 
          data: data as UpdateMemberShowcaseDTO, 
          thumbnailFile: thumbnail 
        });
        toast.success("Showcase updated successfully");
      } else {
        if (!thumbnail) {
          toast.error("Thumbnail image is required");
          return;
        }
        await createMutation.mutateAsync({ 
          data: data as CreateMemberShowcaseDTO, 
          thumbnailFile: thumbnail 
        });
        toast.success("Showcase created successfully");
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <AdminPageScaffold pageKey="memberShowcase">
      <MemberShowcaseList
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <ShowcaseFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={modal === "edit" ? selectedShowcase || undefined : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ShowcaseViewModal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        showcase={selectedShowcase}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </AdminPageScaffold>
  );
}
