"use client";

import React, { useState } from "react";
import { MemberShowcaseList } from "@/features/member-showcase/components/MemberShowcaseList";
import { ShowcaseFormModal, ShowcaseViewModal } from "@/features/member-showcase/components/MemberShowcaseModals";
import { MemberShowcase, CreateMemberShowcaseDTO, UpdateMemberShowcaseDTO } from "@/features/member-showcase/types";
import { useCreateMemberShowcase } from "@/features/member-showcase/hooks/useCreateMemberShowcase";
import { useUpdateMemberShowcase } from "@/features/member-showcase/hooks/useUpdateMemberShowcase";
import { useDeleteMemberShowcase } from "@/features/member-showcase/hooks/useDeleteMemberShowcase";
import { toast } from "react-toastify";

export default function MemberShowcasePage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<MemberShowcase | null>(null);

  const createMutation = useCreateMemberShowcase();
  const updateMutation = useUpdateMemberShowcase();
  const deleteMutation = useDeleteMemberShowcase();

  const handleCreate = () => {
    setSelectedShowcase(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (showcase: MemberShowcase) => {
    setSelectedShowcase(showcase);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (showcase: MemberShowcase) => {
    try {
      await deleteMutation.mutateAsync(showcase.id);
      toast.success("Showcase deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete showcase");
    }
  };

  const handleView = (showcase: MemberShowcase) => {
    setSelectedShowcase(showcase);
    setIsViewModalOpen(true);
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
      setIsFormModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Member Showcase</h1>
        <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
          Manage and spotlight GDG members and their achievements.
        </p>
      </div>

      <MemberShowcaseList
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <ShowcaseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedShowcase || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ShowcaseViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        showcase={selectedShowcase}
      />
    </div>
  );
}
