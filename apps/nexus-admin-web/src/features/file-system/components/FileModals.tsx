"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, File as FileIcon, Upload } from "lucide-react";
import { FileRecord, FileRecordInsert, FileRecordUpdate } from "../types";

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
// File Form Modal (Upload / Update)
// ==========================================
interface FileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FileRecordInsert | FileRecordUpdate, file?: File) => void;
  initialData?: FileRecord;
  isSubmitting: boolean;
}

export function FileFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: FileFormModalProps) {
  const [formData, setFormData] = useState<FileRecordInsert>({
    fileName: "",
    fileDescription: "",
    filePath: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fileName: initialData.fileName,
        fileDescription: initialData.fileDescription,
        filePath: initialData.filePath,
      });
      setSelectedFile(null);
    } else {
      setFormData({
        fileName: "",
        fileDescription: "",
        filePath: "",
      });
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && !selectedFile) {
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
          setFormData(prev => ({ ...prev, fileName: file.name }));
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update File Info" : "Upload New File"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {!initialData && (
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">File</label>
                <div className="relative">
                    <input
                        required
                        type="file"
                        onChange={handleFileChange}
                        className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
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

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">File Path (Folder)</label>
          <input
            required
            type="text"
            value={formData.filePath}
            onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="e.g. documents/reports"
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
                {initialData ? "Updating..." : "Uploading..."}
              </>
            ) : (
              <>{initialData ? "Update Info" : "Upload File"}</>
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
export function FileDetailsModal({ isOpen, onClose, file }: { isOpen: boolean; onClose: () => void; file: FileRecord | null }) {
  if (!file) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="File Details">
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-sm border border-teal-50 bg-teal-50/30 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-teal-100 text-teal-600">
            <FileIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-gray-900">{file.fileName}</h3>
            <p className="mt-1 text-sm text-gray-500">ID: {file.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Path</h4>
            <p className="mt-1 text-sm font-medium text-gray-900">{file.filePath}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Created At</h4>
            <p className="mt-1 text-sm font-medium text-gray-900">{new Date(file.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</h4>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{file.fileDescription || "No description provided."}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
            {file.previewUrl && (
                <a 
                    href={file.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-200 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                    Preview File
                </a>
            )}
            <a 
                href={file.downloadUrl} 
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-700 shadow-sm"
            >
                Download File
            </a>
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
