"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  UserPlus,
  Calendar,
  Layout,
  FileText,
  Edit2,
} from "lucide-react";
import {
  MemberProject,
  CreateMemberProjectDTO,
  UpdateMemberProjectDTO,
} from "../types";
import Image from "next/image";
import { toast } from "react-toastify";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  AdminFormModal,
  AdminInputField,
  AdminTextAreaField,
  AdminUserSearchField,
  AdminUserSearchOption,
} from "@/components/admin/form";
import { ModalActionRow } from "@/components/admin/ModalActionRow";

// ==========================================
// Project Form Modal (Create / Update)
// ==========================================
interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemberProjectDTO | UpdateMemberProjectDTO) => void;
  initialData?: MemberProject;
  isSubmitting: boolean;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<
    Omit<CreateMemberProjectDTO, "member">
  >({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: null,
    memberGdgId: "",
    images: [],
  });

  const [imageInputs, setImageInputs] = useState<string[]>(["", "", ""]);
  const [selectedMember, setSelectedMember] = useState<AdminUserSearchOption[]>(
    [],
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : null,
        memberGdgId: initialData.memberGdgId,
        images: initialData.images,
      });
      setImageInputs([
        initialData.images[0] || "",
        initialData.images[1] || "",
        initialData.images[2] || "",
      ]);
      setSelectedMember([
        {
          gdgId: initialData.memberGdgId,
          displayName: initialData.memberGdgId,
        },
      ]);
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        memberGdgId: "",
        images: [],
      });
      setImageInputs(["", "", ""]);
      setSelectedMember([]);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      memberGdgId: selectedMember[0]?.gdgId || "",
    }));
  }, [selectedMember]);

  const handleImageInputChange = (index: number, value: string) => {
    const nextInputs = [...imageInputs];
    nextInputs[index] = value;
    setImageInputs(nextInputs);

    setFormData((prev) => ({
      ...prev,
      images: nextInputs.map((image) => image.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberGdgId) {
      toast.error("Please select a member");
      return;
    }
    onSubmit(formData);
  };

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Update Project" : "Create New Project"}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? "Update Project" : "Create Project"}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminInputField
            label="Project Title"
            required
            type="text"
            placeholder="e.g. GDG Platform Redesign"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="md:col-span-2">
          <AdminUserSearchField
            label="Associated Member"
            required
            placeholder="Search member by name..."
            selectedUsers={selectedMember}
            onChange={setSelectedMember}
            maxSelections={1}
            helperText="Select one member linked to this project."
            emptySelectionText="No member selected yet."
          />
          {formData.memberGdgId && (
            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-teal-600">
              <UserPlus size={12} />
              Selected: {formData.memberGdgId}
            </div>
          )}
        </div>

        <div>
          <AdminInputField
            label="Start Date"
            required
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <AdminInputField
            label="End Date (Optional)"
            type="date"
            value={formData.endDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value || null })
            }
          />
        </div>

        <div className="md:col-span-2">
          <AdminTextAreaField
            label="Description"
            required
            rows={4}
            placeholder="Provide a detailed description of the project, role, and achievements..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Image URLs */}
        <div className="md:col-span-2">
          <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500">
            Project Gallery
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminInputField
              label="Image URL 1"
              type="url"
              placeholder="https://..."
              value={imageInputs[0]}
              onChange={(e) => handleImageInputChange(0, e.target.value)}
            />
            <AdminInputField
              label="Image URL 2"
              type="url"
              placeholder="https://..."
              value={imageInputs[1]}
              onChange={(e) => handleImageInputChange(1, e.target.value)}
            />
            <AdminInputField
              label="Image URL 3"
              type="url"
              placeholder="https://..."
              value={imageInputs[2]}
              onChange={(e) => handleImageInputChange(2, e.target.value)}
            />
          </div>
        </div>
      </div>
    </AdminFormModal>
  );
}

// ==========================================
// Delete Confirmation Modal
// ==========================================
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isConfirming={isDeleting}
      title="Delete Project"
      confirmLabel="Confirm Delete"
      description={
        <>
          <p className="text-sm font-bold text-red-900">
            Warning: Dangerous Action
          </p>
          <p className="mt-1">
            Are you sure you want to delete{" "}
            <span className="font-bold underline">"{itemName}"</span>? This
            action is permanent and cannot be undone.
          </p>
        </>
      }
    />
  );
}

// ==========================================
// Project View Modal
// ==========================================
interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MemberProject | null;
  onEdit: (project: MemberProject) => void;
  onDelete: (project: MemberProject) => void;
}

export function ProjectViewModal({
  isOpen,
  onClose,
  project,
  onEdit,
  onDelete,
}: ProjectViewModalProps) {
  if (!project) return null;
  const projectImages = project.images || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details">
      <div className="space-y-6">
        <ModalActionRow
          actions={[
            {
              key: "edit",
              label: "Edit Project",
              icon: Edit2,
              onClick: () => {
                onClose();
                onEdit(project);
              },
            },
            {
              key: "delete",
              label: "Delete",
              icon: Trash2,
              tone: "danger",
              onClick: () => {
                onClose();
                onDelete(project);
              },
            },
          ]}
        />

        {/* Main Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-sm bg-gray-100 border border-gray-100 shadow-inner">
          {projectImages[0] ? (
            <Image
              src={projectImages[0]}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Layout size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">
            <Calendar size={14} />
            {new Date(project.startDate).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
            {project.endDate
              ? ` — ${new Date(project.endDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
              : " — Present"}
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            {project.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400 uppercase">
            <UserPlus size={14} />
            Member GDG ID: {project.memberGdgId}
          </div>
        </div>

        <div className="rounded-sm border border-gray-50 bg-gray-50/50 p-5 space-y-6">
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <FileText size={14} />
              Description
            </h4>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Gallery */}
          {projectImages.length > 1 && (
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Project Gallery
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {projectImages
                  .slice(1)
                  .map((imageUrl: string, index: number) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="relative aspect-video overflow-hidden rounded-sm border border-gray-100 shadow-sm bg-white"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Project gallery image ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last Updated: {new Date(project.updatedAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-900 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
