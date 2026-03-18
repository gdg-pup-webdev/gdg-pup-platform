"use client";

import React, { useState, useMemo } from "react";
import { Plus, Loader2, Search, AlertCircle, FileStack, Folder, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate } from "../types";

export function FileList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100); // Increased for folder grouping
  const [currentPath, setCurrentPath] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: filesResponse, isLoading, isError, error, refetch } = useGetFiles(page, pageSize, currentPath);
  const uploadMutation = useUploadFile();
  const updateMutation = useUpdateFile();
  const deleteMutation = useDeleteFile();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const rawFiles = filesResponse?.body?.data || [];
  const meta = filesResponse?.body?.meta;
  const totalPages = meta?.totalPages || 1;

  // Group files into folders and files for the current level
  const items = useMemo(() => {
    const folders = new Map<string, any>();
    const displayedFiles: FileRecord[] = [];

    rawFiles.forEach((file) => {
      // Remove currentPath from the beginning of filePath
      let relativePath = file.filePath;
      
      // Normalize paths to ensure correct matching
      const normalizedCurrentPath = currentPath.endsWith("/") ? currentPath : (currentPath ? currentPath + "/" : "");
      
      if (normalizedCurrentPath && relativePath.startsWith(normalizedCurrentPath)) {
        relativePath = relativePath.substring(normalizedCurrentPath.length);
      } else if (!normalizedCurrentPath) {
          // At root, relativePath is just filePath
      } else {
          // This file doesn't belong in the current path, skip it
          return;
      }

      // If relativePath starts with /, remove it
      if (relativePath.startsWith("/")) {
        relativePath = relativePath.substring(1);
      }

      const parts = relativePath.split("/");

      if (parts.length > 1) {
        // It's in a subfolder
        const folderName = parts[0];
        if (!folders.has(folderName)) {
          folders.set(folderName, {
            id: `folder-${folderName}`,
            fileName: folderName,
            fileDescription: `Folder containing items in ${folderName}`,
            fileType: "folder",
            filePath: normalizedCurrentPath + folderName,
            isFolder: true,
            // Mocking other fields for FileRecord compatibility
            createdAt: "",
            updatedAt: "",
            deletedAt: "",
            storageReference: "",
            previewUrl: "",
            downloadUrl: ""
          });
        }
      } else if (relativePath !== "") {
        // It's a file in the current folder
        displayedFiles.push(file);
      }
    });

    let combinedItems = [...Array.from(folders.values()), ...displayedFiles];
    
    // Filter by search query if present
    if (searchQuery) {
        combinedItems = combinedItems.filter(item => 
            item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.filePath.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    return combinedItems;
  }, [rawFiles, currentPath, searchQuery]);

  // Breadcrumbs logic
  const breadcrumbs = useMemo(() => {
    const parts = currentPath ? currentPath.split("/").filter(Boolean) : [];
    const crumbs = [{ name: "Root", path: "" }];
    
    let accPath = "";
    parts.forEach((part) => {
      accPath = accPath ? `${accPath}/${part}` : part;
      crumbs.push({ name: part, path: accPath });
    });
    
    return crumbs;
  }, [currentPath]);

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

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
    setPage(1);
  };

  const handleBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length > 0) {
      const newPath = parts.slice(0, -1).join("/");
      setCurrentPath(newPath);
      setPage(1);
    }
  };

  const handleFormSubmit = async (data: FileRecordInsert | FileRecordUpdate, file?: File) => {
    try {
        if (selectedFile) {
          await updateMutation.mutateAsync({ id: selectedFile.id, data: data as FileRecordUpdate });
        } else if (file) {
          // If we are in a folder, prepend it to the file path if not already provided
          const formData = { ...data } as FileRecordInsert;
          if (currentPath && !formData.filePath.startsWith(currentPath)) {
              formData.filePath = `${currentPath}/${formData.filePath}`;
          }
          await uploadMutation.mutateAsync({ data: formData, file });
        }
        setIsFormModalOpen(false);
        refetch();
    } catch (err) {
        console.error("Form submission failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedFile) {
      try {
        await deleteMutation.mutateAsync(selectedFile.id);
        setIsDeleteModalOpen(false);
        refetch();
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
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-wrap items-center gap-2 rounded-sm bg-gray-50 p-3 text-sm text-gray-600 border border-gray-100">
        <button 
            onClick={handleBack}
            disabled={!currentPath}
            className="flex items-center gap-1 rounded-sm bg-white px-2 py-1 text-xs font-bold border border-gray-200 disabled:opacity-30 hover:bg-gray-100"
        >
            <ArrowLeft size={14} />
            Up
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1" />

        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            <button
              onClick={() => handleFolderClick(crumb.path)}
              className={`flex items-center gap-1.5 transition-colors hover:text-teal-600 ${
                index === breadcrumbs.length - 1 ? "font-bold text-teal-700" : ""
              }`}
            >
              {index === 0 && <Home size={14} />}
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Header & Search */}
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search in this folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-gray-100 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        
        <button 
          onClick={handleUpload}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg md:w-auto"
        >
          <Plus size={18} />
          Upload to {currentPath ? "Folder" : "Root"}
        </button>
      </div>

      {/* Files & Folders Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item: any) => (
            <FileCard 
              key={item.id} 
              file={item as FileRecord} 
              onEdit={item.isFolder ? () => {} : handleEdit}
              onDelete={item.isFolder ? () => {} : handleDeleteClick}
              onView={item.isFolder ? () => handleFolderClick(item.filePath) : handleView}
              isFolder={item.isFolder}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/50 py-24 text-center">
          <FileStack size={64} className="mb-4 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-900">Folder is empty</h3>
          <p className="mt-1 text-sm text-gray-500">No files or subfolders found in the current path.</p>
          <button 
            onClick={handleUpload}
            className="mt-8 rounded-sm bg-teal-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* Pagination (Only for flat view if needed, or if many folders) */}
      {totalPages > 1 && !currentPath && (
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
        initialData={selectedFile ? {
            ...selectedFile,
            filePath: selectedFile.filePath
        } : {
            fileName: "",
            fileDescription: "",
            filePath: currentPath ? `${currentPath}/` : "",
            fileType: ""
        } as any}
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
