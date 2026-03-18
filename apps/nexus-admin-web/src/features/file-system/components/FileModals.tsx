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

// ==========================================
// Modal Wrapper
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl min-w-[320px] sm:min-w-[450px] overflow-hidden rounded-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Update Folder" : "Create New Folder"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Folder Name</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FolderIcon size={18} />
            </div>
            <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-sm border border-gray-200 pl-10 pr-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="e.g. Project Documents"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description (Optional)</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="What will be stored in this folder?"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-6 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-8 py-2 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Folder" : "Create Folder"}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Update File Info" : "Upload New File"}>
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">File Name</label>
          <input
            required
            type="text"
            value={formData.fileName}
            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="e.g. project-report.pdf"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            value={formData.fileDescription}
            onChange={(e) => setFormData({ ...formData, fileDescription: e.target.value })}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Briefly describe what this file is for..."
          />
        </div>

        {!isEditing && (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Add to Subfolder (Optional)</label>
            <div className="mb-2 flex items-center gap-2 rounded-sm bg-gray-50 p-2 text-xs text-gray-500 border border-gray-100">
              <span className="font-bold">Base Folder:</span>
              <span className="truncate">{currentPath || "Root"}</span>
            </div>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Enter subfolder path to create new folder..."
            />
            <p className="mt-1 text-[10px] font-medium text-gray-400 italic">
              Relative to the current base folder. Leave empty to upload directly to base folder.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-6 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-8 py-2 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEditing ? "Updating..." : "Uploading..."}
              </>
            ) : (
              <>{isEditing ? "Update Info" : "Upload File"}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
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
  if (!item) return null;

  const isFolder = !("fileType" in item);
  
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isFolder ? "Folder Details" : "File Details"}>
      <div className="space-y-6">
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

        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
            <div className="flex gap-3">
                {isFolder ? (
                    <button 
                        onClick={() => { onOpen?.(item as Folder); onClose(); }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-teal-600 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 shadow-md"
                    >
                        <FolderIcon size={18} />
                        Open Folder
                    </button>
                ) : (
                    <>
                        <a 
                            href={(item as FileRecord).previewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <ExternalLink size={18} />
                            Preview
                        </a>
                        <a 
                            href={(item as FileRecord).downloadUrl} 
                            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-teal-600 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 shadow-md"
                        >
                            <Download size={18} />
                            Download
                        </a>
                    </>
                )}
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => { onEdit(item); onClose(); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 py-2.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                >
                    <Edit2 size={14} />
                    Edit Details
                </button>
                <button 
                    onClick={() => { onDelete(item); onClose(); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-red-100 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                >
                    <Trash2 size={14} />
                    Delete {isFolder ? "Folder" : "File"}
                </button>
            </div>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// Delete Confirm Modal
// ==========================================
export function DeleteConfirmModal({ isOpen, onClose, onConfirm, fileName, isDeleting }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; fileName: string; isDeleting: boolean }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete File">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
        <p className="mt-2 text-gray-600">
          You are about to delete <span className="font-bold text-gray-900">"{fileName}"</span>.
          This action cannot be undone and will permanently remove the file from storage.
        </p>

        <div className="mt-8 flex w-full items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-sm bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
          >
            No, Keep it
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-red-600 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete it"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
