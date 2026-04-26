"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Loader2, 
  AlertTriangle, 
  File as FileIcon, 
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Archive,
  Music,
  FileCode,
  FileJson,
  Folder as FolderIcon,
  ExternalLink,
  Download,
  Edit2,
  Trash2
} from "lucide-react";
import { FileRecord, FileRecordInsert, FileRecordUpdate, Folder, FolderInsert, FolderUpdate } from "../types";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminFormModal, AdminInputField, AdminTextAreaField } from "@/components/admin/form";
import { ModalActionRow, type ModalActionItem } from "@/components/admin/ModalActionRow";

type ImageResolution = 64 | 128 | 256 | 512 | 1024;

type FileRecordWithImageVariants = FileRecord & {
  previewUrl64?: string | null;
  previewUrl128?: string | null;
  previewUrl256?: string | null;
  previewUrl512?: string | null;
};

const IMAGE_RESOLUTION_OPTIONS: Array<{
  resolution: ImageResolution;
  label: string;
  field: "previewUrl64" | "previewUrl128" | "previewUrl256" | "previewUrl512" | "previewUrl";
}> = [
  { resolution: 64, label: "64", field: "previewUrl64" },
  { resolution: 128, label: "128", field: "previewUrl128" },
  { resolution: 256, label: "256", field: "previewUrl256" },
  { resolution: 512, label: "512", field: "previewUrl512" },
  { resolution: 1024, label: "1024", field: "previewUrl" },
];

const resolveImageUrl = (
  file: FileRecordWithImageVariants,
  resolution: ImageResolution,
): string | null => {
  const found = IMAGE_RESOLUTION_OPTIONS.find((option) => option.resolution === resolution);
  if (!found) return null;
  return file[found.field] || null;
};

// ==========================================
// Folder Form Modal (Create / Update)
// ==========================================
interface FolderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FolderInsert | FolderUpdate) => void;
  initialData?: Folder;
  isSubmitting: boolean;
  currentParentId: string | null;
}

export function FolderFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting, currentParentId }: FolderFormModalProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    parentId: null,
  });

  useEffect(() => {
    if (initialData?.id) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        parentId: initialData.parentId || null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        parentId: currentParentId,
      });
    }
  }, [initialData, isOpen, currentParentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData?.id;

  return (
    <AdminFormModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Update Folder" : "Create New Folder"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEditing ? "Update Folder" : "Create Folder"}
    >
      <div className="space-y-5">
        <AdminInputField
          label="Folder Name"
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Project Documents"
        />

        <AdminTextAreaField
          label="Description (Optional)"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What will be stored in this folder?"
        />
      </div>
    </AdminFormModal>
  );
}

// ==========================================
// File Form Modal (Upload / Update)
// ==========================================
interface FileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FileRecordInsert | FileRecordUpdate, file?: File) => void;
  initialData?: FileRecord;
  isSubmitting: boolean;
  currentPath: string;
}

export function FileFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting, currentPath }: FileFormModalProps) {
  const [formData, setFormData] = useState<any>({
    fileName: "",
    fileDescription: "",
    path: "",
    folderId: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData?.id) {
      setFormData({
        fileName: initialData.fileName || "",
        fileDescription: initialData.fileDescription || "",
        folderId: initialData.folderId || null,
        path: "",
      });
    } else {
      setFormData({
        fileName: "",
        fileDescription: "",
        folderId: initialData?.folderId || null,
        path: "",
      });
    }
    setSelectedFile(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id && !selectedFile) {
        alert("Please select a file to upload");
        return;
    }
    onSubmit(formData, selectedFile || undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!formData.fileName) {
          setFormData((prev: any) => ({ ...prev, fileName: file.name }));
      }
    }
  };

  const isEditing = !!initialData?.id;

  return (
    <AdminFormModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Update File Info" : "Upload New File"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEditing ? "Update File" : "Upload File"}
    >
      <div className="space-y-5">
        {!isEditing && (
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">File</label>
                <div className="group relative flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-colors hover:border-teal-400 hover:bg-teal-50/30">
                    {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full bg-teal-100 p-2 text-teal-600">
                                <FileIcon size={24} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{selectedFile.name}</span>
                            <span className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button 
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="mt-2 text-xs font-bold text-red-600 hover:underline"
                            >
                                Remove & Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="mb-2 text-gray-400 transition-colors group-hover:text-teal-500" size={32} />
                            <p className="mb-1 text-sm font-bold text-gray-900">Click to select a file</p>
                            <p className="text-xs text-gray-500">All file types are supported</p>
                        </>
                    )}
                    <input
                        required={!isEditing}
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                    />
                </div>
            </div>
        )}

        <AdminInputField
          label="File Name"
          required
          type="text"
          value={formData.fileName}
          onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
          placeholder="e.g. project-report.pdf"
        />

        <AdminTextAreaField
          label="Description"
          required
          rows={3}
          value={formData.fileDescription}
          onChange={(e) => setFormData({ ...formData, fileDescription: e.target.value })}
          placeholder="Briefly describe what this file is for..."
        />

        {!isEditing && (
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Add to Subfolder (Optional)</label>
            <div className="mb-2 flex items-center gap-2 rounded-sm bg-gray-50 p-2 text-xs text-gray-500 border border-gray-100">
              <span className="font-bold">Base Folder:</span>
              <span className="truncate">{currentPath || "Root"}</span>
            </div>
            <AdminInputField
              label=""
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="Enter subfolder path to create new folder..."
              helperText="Relative to the current base folder. Leave empty to upload directly to base folder."
            />
          </div>
        )}
      </div>
    </AdminFormModal>
  );
}

// ==========================================
// File Details Modal
// ==========================================
interface FileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileRecord | Folder | null;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onOpen?: (folder: Folder) => void;
}

export function FileDetailsModal({ isOpen, onClose, item, onEdit, onDelete, onOpen }: FileDetailsModalProps) {
  const isFolder = Boolean((item as any)?.isFolder);
  const fileRecord = !isFolder && item ? (item as FileRecordWithImageVariants) : null;
  const isImageFile = Boolean(
    fileRecord && fileRecord.fileType?.toLowerCase().startsWith("image/"),
  );
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(256);

  useEffect(() => {
    if (!isOpen || isFolder || !fileRecord) {
      return;
    }

    const has256 = Boolean(resolveImageUrl(fileRecord, 256));
    if (has256) {
      setSelectedResolution(256);
      return;
    }

    const firstAvailable = IMAGE_RESOLUTION_OPTIONS.find((option) =>
      Boolean(fileRecord[option.field]),
    );

    setSelectedResolution(firstAvailable?.resolution ?? 1024);
  }, [isOpen, isFolder, fileRecord]);

  if (!item) return null;
  
  const getFileIcon = () => {
    if (isFolder) return FolderIcon;
    const file = item as FileRecord;
    const type = file.fileType?.toLowerCase() || "";
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("video/")) return VideoIcon;
    if (type === "application/pdf") return FileText;
    if (type.startsWith("audio/")) return Music;
    if (type.includes("zip") || type.includes("archive")) return Archive;
    if (type.includes("json")) return FileJson;
    if (type.includes("javascript") || type.includes("typescript") || type.includes("html") || type.includes("css")) return FileCode;
    return FileIcon;
  };

  const IconComponent = getFileIcon();
  const name = isFolder ? (item as Folder).name : (item as FileRecord).fileName;
  const description = isFolder ? (item as Folder).description : (item as FileRecord).fileDescription;
  const createdAt = isFolder ? (item as Folder).createdAt : (item as FileRecord).createdAt;
  const updatedAt = isFolder ? (item as Folder).updatedAt : (item as FileRecord).updatedAt;
  const selectedImageUrl = fileRecord
    ? resolveImageUrl(fileRecord, selectedResolution)
    : null;
  const fallbackImageUrl = fileRecord
    ? IMAGE_RESOLUTION_OPTIONS.map((option) => fileRecord[option.field]).find(
        (url): url is string => Boolean(url),
      ) || null
    : null;
  const displayedImageUrl = selectedImageUrl || fallbackImageUrl;

  const resourceActions: ModalActionItem[] = isFolder
    ? [
        {
          key: "open-folder",
          label: "Open Folder",
          icon: FolderIcon,
          onClick: () => {
            if (!onOpen) return;
            onOpen(item as Folder);
            onClose();
          },
          disabled: !onOpen,
        },
      ]
    : [
        {
          key: "preview",
          label: "Preview",
          icon: ExternalLink,
          onClick: () => {
            window.open((item as FileRecord).previewUrl, "_blank", "noopener,noreferrer");
          },
        },
        {
          key: "download",
          label: "Download",
          icon: Download,
          onClick: () => {
            window.open((item as FileRecord).downloadUrl, "_blank", "noopener,noreferrer");
          },
        },
      ];

  resourceActions.push(
    {
      key: "edit",
      label: "Edit Details",
      icon: Edit2,
      onClick: () => {
        onEdit(item);
        onClose();
      },
      tone: "neutral",
    },
    {
      key: "delete",
      label: `Delete ${isFolder ? "Folder" : "File"}`,
      icon: Trash2,
      tone: "danger",
      onClick: () => {
        onDelete(item);
        onClose();
      },
    },
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isFolder ? "Folder Details" : "File Details"}>
      <div className="space-y-6">
        <ModalActionRow actions={resourceActions} />

        <div className={`flex items-start gap-4 rounded-xl border p-5 ${isFolder ? "border-teal-100 bg-teal-50/30" : "border-gray-100 bg-gray-50/30"}`}>
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl shadow-sm ${isFolder ? "bg-teal-100 text-teal-600" : "bg-white text-gray-400"}`}>
            <IconComponent size={32} strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${isFolder ? "bg-teal-200 text-teal-800" : "bg-gray-200 text-gray-600"}`}>
                    {isFolder ? "Folder" : (item as FileRecord).fileType?.split("/")[1] || "File"}
                </span>
            </div>
            <h3 className="truncate text-xl font-bold text-gray-900">{name}</h3>
            <p className="mt-1 text-xs font-medium text-gray-400">ID: {item.id}</p>
          </div>
        </div>

        {!isFolder && isImageFile && fileRecord && (
          <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image Preview</h4>
              <p className="mt-1 text-xs text-gray-500">
                Selected Resolution: <span className="font-bold text-gray-700">{selectedResolution}px</span>
              </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex shrink-0 gap-2 md:w-24 md:flex-col">
                {IMAGE_RESOLUTION_OPTIONS.map((option) => {
                  const hasResolution = Boolean(fileRecord[option.field]);
                  const isSelected = selectedResolution === option.resolution;

                  return (
                    <button
                      key={option.resolution}
                      type="button"
                      onClick={() => {
                        if (!hasResolution) return;
                        setSelectedResolution(option.resolution);
                      }}
                      disabled={!hasResolution}
                      className={`rounded-lg border px-2 py-2 text-center text-xs font-bold transition ${
                        isSelected
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : hasResolution
                            ? "border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50/40"
                            : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex min-h-[260px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                {displayedImageUrl ? (
                  <img
                    src={displayedImageUrl}
                    alt={`${name} preview`}
                    className="h-auto max-h-[420px] w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon size={28} />
                    <span className="text-xs font-semibold">No preview available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Created</h4>
            <p className="mt-1 text-sm font-bold text-gray-900">{new Date(createdAt).toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Modified</h4>
            <p className="mt-1 text-sm font-bold text-gray-900">{new Date(updatedAt).toLocaleString()}</p>
          </div>
          {isFolder && (item as Folder).parentId && (
             <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Parent Folder ID</h4>
                <p className="mt-1 text-sm font-bold text-gray-900 truncate">{(item as Folder).parentId}</p>
            </div>
          )}
          {!isFolder && (
            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Folder ID</h4>
                <p className="mt-1 text-sm font-bold text-gray-900 truncate">{(item as FileRecord).folderId || "Root"}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{description || "No description provided."}</p>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// Delete Confirm Modal
// ==========================================
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isDeleting: boolean;
  isFolder?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, fileName, isDeleting, isFolder }: DeleteConfirmModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isConfirming={isDeleting}
      title={isFolder ? "Delete Folder" : "Delete File"}
      cancelLabel="No, Keep it"
      confirmLabel={isDeleting ? "Deleting..." : "Yes, Delete it"}
      description={
        <>
          <p className="text-sm font-bold text-red-900">Are you sure?</p>
          <p className="mt-1 text-sm">
            You are about to delete <span className="font-bold text-gray-900">"{fileName}"</span>.
            {isFolder
              ? " This will permanently remove the folder and ALL of its contents (files and subfolders). This action cannot be undone."
              : " This action cannot be undone and will permanently remove the file from storage."}
          </p>
        </>
      }
    />
  );
}
