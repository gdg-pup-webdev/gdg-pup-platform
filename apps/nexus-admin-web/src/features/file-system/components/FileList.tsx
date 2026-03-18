"use client";

import React, { useState, useMemo } from "react";
import { Plus, Loader2, Search, AlertCircle, FileStack, Folder as FolderIcon, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile, useGetFolders } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate, Folder } from "../types";

// Type for both files and folders to avoid 'any'
type FileOrFolder = (FileRecord | Folder) & { isFolder: boolean };

export function FileList() {
  const [page, setPage] = useState(1);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderHistory, setFolderHistory] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentFolderId = currentFolder?.id || null;

  // API Hooks
  const { data: filesResponse, isLoading: isFilesLoading, isError: isFilesError, error: filesError, refetch: refetchFiles } = useGetFiles(page, 100, currentFolderId);
  const { data: foldersResponse, isLoading: isFoldersLoading, isError: isFoldersError, error: foldersError, refetch: refetchFolders } = useGetFolders(1, 100, currentFolderId);
  
  const uploadMutation = useUploadFile();
  const updateMutation = useUpdateFile();
  const deleteMutation = useDeleteFile();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  const refetch = () => {
    refetchFiles();
    refetchFolders();
  };

  const rawFiles = filesResponse?.body?.data || [];
  const rawFolders = foldersResponse?.body?.data || [];
  
  const meta = filesResponse?.body?.meta;
  const totalPages = meta?.totalPages || 1;

  // Combine folders and files
  const items = useMemo(() => {
    const combinedFolders: FileOrFolder[] = rawFolders.map(f => ({
      ...f,
      isFolder: true,
      // For compatibility with FileCard which expects FileRecord
      fileName: f.name,
      fileDescription: f.description || "Folder",
      fileType: "folder",
    } as unknown as FileOrFolder));

    const combinedFiles: FileOrFolder[] = rawFiles.map(f => ({
      ...f,
      isFolder: false,
    } as unknown as FileOrFolder));

    let combinedItems = [...combinedFolders, ...combinedFiles];
    
    // Filter by search query if present
    if (searchQuery) {
        combinedItems = combinedItems.filter(item => 
            (item as any).fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    return combinedItems;
  }, [rawFiles, rawFolders, searchQuery]);

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

  const handleFolderClick = (folder: Folder) => {
    setFolderHistory(prev => [...prev, folder]);
    setCurrentFolder(folder);
    setPage(1);
  };

  const handleBreadcrumbClick = (folder: Folder | null) => {
    if (folder === null) {
      setFolderHistory([]);
      setCurrentFolder(null);
    } else {
      const index = folderHistory.findIndex(f => f.id === folder.id);
      if (index !== -1) {
        setFolderHistory(folderHistory.slice(0, index + 1));
        setCurrentFolder(folder);
      }
    }
    setPage(1);
  };

  const handleBack = () => {
    if (folderHistory.length > 0) {
      const newHistory = folderHistory.slice(0, -1);
      setFolderHistory(newHistory);
      setCurrentFolder(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null);
      setPage(1);
    }
  };

  const handleFormSubmit = async (data: any, file?: File) => {
    try {
        if (selectedFile) {
          await updateMutation.mutateAsync({ id: selectedFile.id, data: data as FileRecordUpdate });
        } else if (file) {
          const formData = { 
            ...data,
            folderId: currentFolderId,
          } as FileRecordInsert;
          
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

  const isLoading = isFilesLoading || isFoldersLoading;
  const isError = isFilesError || isFoldersError;
  const error = filesError || foldersError;

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
            disabled={folderHistory.length === 0}
            className="flex items-center gap-1 rounded-sm bg-white px-2 py-1 text-xs font-bold border border-gray-200 disabled:opacity-30 hover:bg-gray-100"
        >
            <ArrowLeft size={14} />
            Up
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1" />

        <button
          onClick={() => handleBreadcrumbClick(null)}
          className={`flex items-center gap-1.5 transition-colors hover:text-teal-600 ${
            currentFolder === null ? "font-bold text-teal-700" : ""
          }`}
        >
          <Home size={14} />
          Root
        </button>

        {folderHistory.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <ChevronRight size={14} className="text-gray-400" />
            <button
              onClick={() => handleBreadcrumbClick(folder)}
              className={`flex items-center gap-1.5 transition-colors hover:text-teal-600 ${
                index === folderHistory.length - 1 ? "font-bold text-teal-700" : ""
              }`}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Header & Search */}
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="relative w-full max-md:max-w-none max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search in this folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-gray-100 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        
        <div className="flex w-full gap-2 md:w-auto">
            <button 
                onClick={handleUpload}
                className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-teal-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg md:w-auto"
            >
                <Plus size={18} />
                Upload
            </button>
        </div>
      </div>

      {/* Files & Folders Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <FileCard 
              key={item.id} 
              file={item as FileRecord} 
              onEdit={item.isFolder ? () => {} : handleEdit}
              onDelete={item.isFolder ? () => {} : handleDeleteClick}
              onView={item.isFolder ? () => handleFolderClick(item as Folder) : handleView}
              isFolder={item.isFolder}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/50 py-24 text-center">
          <FileStack size={64} className="mb-4 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-900">Folder is empty</h3>
          <p className="mt-1 text-sm text-gray-500">No files or subfolders found in the current folder.</p>
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
        currentPath={currentFolder?.name || "Root"}
        initialData={selectedFile ? {
            ...selectedFile,
        } : {
            fileName: "",
            fileDescription: "",
            folderId: currentFolderId,
            path: "",
            fileType: "",
            createdAt: "",
            updatedAt: "",
            deletedAt: null,
            storageReference: "",
            previewUrl: "",
            downloadUrl: "",
            id: ""
        } as FileRecord}
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
