"use client";

import React, { useState } from "react";
import { Plus, Loader2, Search, AlertCircle, FileStack } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate } from "../types";

export function FileList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // API Hooks
  const { data: filesResponse, isLoading, isError, error, refetch } = useGetFiles(page, pageSize);
  const uploadMutation = useUploadFile();
  const updateMutation = useUpdateFile();
  const deleteMutation = useDeleteFile();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const files = filesResponse?.body?.data || [];
  const meta = filesResponse?.body?.meta;
  const totalPages = meta?.totalPages || 1;

  // Handlers
  const handleUpload = () => {
    setSelectedFile(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (file: FileRecord) => {
    setSelectedFile(file);
    setIsFormModalOpen(true);
  };

  const handleView = (file: FileRecord) => {
    setSelectedFile(file);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (file: FileRecord) => {
    setSelectedFile(file);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: FileRecordInsert | FileRecordUpdate, file?: File) => {
    try {
        if (selectedFile) {
          await updateMutation.mutateAsync({ id: selectedFile.id, data: data as FileRecordUpdate });
        } else if (file) {
          await uploadMutation.mutateAsync({ data: data as FileRecordInsert, file });
        }
        setIsFormModalOpen(false);
    } catch (err) {
        console.error("Form submission failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedFile) {
      try {
        await deleteMutation.mutateAsync(selectedFile.id);
        setIsDeleteModalOpen(false);
      } catch (err) {
          console.error("Delete failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-teal-600" />
        <p className="text-sm font-medium text-gray-500">Loading your files...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center shadow-sm">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-xl font-bold text-red-900">Failed to load files</h3>
        <p className="mt-2 text-sm text-red-700">{(error as any)?.message || "An unexpected error occurred while fetching files."}</p>
        <button 
          onClick={() => refetch()}
          className="mt-8 rounded-sm bg-red-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 hover:shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by file name or path..."
            className="w-full rounded-sm border border-gray-100 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        
        <button 
          onClick={handleUpload}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg md:w-auto"
        >
          <Plus size={18} />
          Upload New File
        </button>
      </div>

      {/* Files Grid */}
      {files.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file: FileRecord) => (
            <FileCard 
              key={file.id} 
              file={file} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/50 py-24 text-center">
          <FileStack size={64} className="mb-4 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading your first file to the system.</p>
          <button 
            onClick={handleUpload}
            className="mt-8 rounded-sm bg-teal-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
            <button 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="rounded-sm bg-white px-4 py-2 text-sm font-bold text-gray-600 border border-gray-100 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm font-medium text-gray-500">
                Page {page} of {totalPages}
            </span>
            <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-sm bg-white px-4 py-2 text-sm font-bold text-gray-600 border border-gray-100 disabled:opacity-50"
            >
                Next
            </button>
        </div>
      )}

      {/* Modals */}
      <FileFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedFile || undefined}
        isSubmitting={uploadMutation.isPending || updateMutation.isPending}
      />

      <FileDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        file={selectedFile}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        fileName={selectedFile?.fileName || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
