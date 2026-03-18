"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Loader2, Search, AlertCircle, FileStack, Folder as FolderIcon, ChevronRight, Home, ArrowLeft, FolderPlus } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal, FolderFormModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile, useGetFolders, useCreateFolder, useGetFolder, useDeleteFolder } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate, Folder, FolderInsert, FolderUpdate } from "../types";

// Type for both files and folders to avoid 'any'
type FileOrFolder = (FileRecord | Folder) & { isFolder: boolean };

export function FileList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL State
  const folderIdFromUrl = searchParams.get("folderId") || null;
  const pageNumberFromUrl = parseInt(searchParams.get("pageNumber") || "1");
  const pageSizeFromUrl = parseInt(searchParams.get("pageSize") || "10");

  const [searchQuery, setSearchQuery] = useState("");
  const [folderHistory, setFolderHistory] = useState<Folder[]>([]);
  
  // API Hooks
  const { data: currentFolder, isLoading: isCurrentFolderLoading } = useGetFolder(folderIdFromUrl);
  const { data: filesResponse, isLoading: isFilesLoading, isError: isFilesError, error: filesError, refetch: refetchFiles } = useGetFiles(pageNumberFromUrl, pageSizeFromUrl, folderIdFromUrl);
  const { data: foldersResponse, isLoading: isFoldersLoading, isError: isFoldersError, error: foldersError, refetch: refetchFolders } = useGetFolders(1, 100, folderIdFromUrl);
  
  const uploadMutation = useUploadFile();
  const updateMutation = useUpdateFile();
  const deleteMutation = useDeleteFile();
  const deleteFolderMutation = useDeleteFolder();
  const createFolderMutation = useCreateFolder();
  
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileRecord | Folder | null>(null);

  // Sync breadcrumbs when currentFolder changes (especially on direct link load)
  useEffect(() => {
    if (currentFolder) {
        // If we have a current folder but it's not the last in history, we might need to reconstruct history
        // For now, let's at least make sure it's in history if it's the current one
        setFolderHistory(prev => {
            const exists = prev.some(f => f.id === currentFolder.id);
            if (exists) return prev;
            return [...prev, currentFolder];
        });
    } else if (folderIdFromUrl === null) {
        setFolderHistory([]);
    }
  }, [currentFolder, folderIdFromUrl]);

  const updateQueryParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

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
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleCreateFolderClick = () => {
    setSelectedItem(null);
    setIsFolderModalOpen(true);
  };

  const handleEdit = (item: FileRecord | Folder) => {
    setSelectedItem(item);
    if (!(item as any).isFolder) {
      setIsFormModalOpen(true);
    } else {
      setIsFolderModalOpen(true);
    }
  };

  const handleView = (item: FileRecord | Folder) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: FileRecord | Folder) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleFolderClick = (folder: Folder) => {
    updateQueryParams({ folderId: folder.id, pageNumber: "1" });
  };

  const handleBreadcrumbClick = (folder: Folder | null) => {
    updateQueryParams({ folderId: folder ? folder.id : null, pageNumber: "1" });
  };

  const handleBack = () => {
    if (currentFolder?.parentId !== undefined) {
        updateQueryParams({ folderId: currentFolder.parentId, pageNumber: "1" });
    } else if (folderIdFromUrl) {
        updateQueryParams({ folderId: null, pageNumber: "1" });
    }
  };

  const handleFormSubmit = async (data: any, file?: File) => {
    try {
        if (selectedItem && !(selectedItem as any).isFolder) {
          await updateMutation.mutateAsync({ id: selectedItem.id, data: data as FileRecordUpdate });
        } else if (file) {
          const formData = { 
            ...data,
            folderId: folderIdFromUrl,
          } as FileRecordInsert;
          
          await uploadMutation.mutateAsync({ data: formData, file });
        }
        setIsFormModalOpen(false);
        refetch();
    } catch (err) {
        console.error("Form submission failed:", err);
    }
  };

  const handleFolderSubmit = async (data: FolderInsert | FolderUpdate) => {
    try {
        if (selectedItem && (selectedItem as any).isFolder) {
            // This is an update, which is not implemented.
            throw new Error("Update folder functionality is not implemented yet.");
        } else {
            // This is a create.
            await createFolderMutation.mutateAsync(data as FolderInsert);
        }
        setIsFolderModalOpen(false);
        refetch();
    } catch (err) {
        console.error("Folder creation/update failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        if ((selectedItem as any).isFolder) {
          await deleteFolderMutation.mutateAsync(selectedItem.id);
        } else {
          await deleteMutation.mutateAsync(selectedItem.id);
        }
        setIsDeleteModalOpen(false);
        refetch();
    } catch (err) {
        console.error("Delete failed:", err);
    }
  }
};

  const isLoading = isFilesLoading || isFoldersLoading || isCurrentFolderLoading;
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
            disabled={!folderIdFromUrl}
            className="flex items-center gap-1 rounded-sm bg-white px-2 py-1 text-xs font-bold border border-gray-200 disabled:opacity-30 hover:bg-gray-100"
        >
            <ArrowLeft size={14} />
            Up
        </button>
        
        <div className="h-4 w-px bg-gray-300 mx-1" />

        <button
          onClick={() => handleBreadcrumbClick(null)}
          className={`flex items-center gap-1.5 transition-colors hover:text-teal-600 ${
            !folderIdFromUrl ? "font-bold text-teal-700" : ""
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
                folder.id === folderIdFromUrl ? "font-bold text-teal-700" : ""
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
                onClick={handleCreateFolderClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-teal-600 text-teal-600 px-6 py-3 text-sm font-bold transition-all hover:bg-teal-50 md:w-auto"
            >
                <FolderPlus size={18} />
                New Folder
            </button>
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
              file={item} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
              onOpen={item.isFolder ? (f) => handleFolderClick(f as Folder) : undefined}
              isFolder={item.isFolder}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/50 py-24 text-center">
          <FileStack size={64} className="mb-4 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-900">Folder is empty</h3>
          <p className="mt-1 text-sm text-gray-500">No files or subfolders found in the current folder.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button 
                onClick={handleCreateFolderClick}
                className="rounded-sm border border-teal-600 text-teal-600 px-6 py-2.5 text-sm font-bold transition-all hover:bg-teal-50"
            >
                Create Folder
            </button>
            <button 
                onClick={handleUpload}
                className="rounded-sm bg-teal-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-md"
            >
                Upload Now
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Items per page</label>
          <select
            value={pageSizeFromUrl}
            onChange={(e) => updateQueryParams({ pageSize: e.target.value, pageNumber: "1" })}
            className="rounded-sm border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium focus:border-teal-500 focus:outline-none"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={pageNumberFromUrl === 1}
              onClick={() => updateQueryParams({ pageNumber: Math.max(1, pageNumberFromUrl - 1).toString() })}
              className="rounded-sm bg-white px-4 py-2 text-sm font-bold text-gray-600 border border-gray-100 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (pageNumberFromUrl <= 3) pageNum = i + 1;
                else if (pageNumberFromUrl >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = pageNumberFromUrl - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => updateQueryParams({ pageNumber: pageNum.toString() })}
                    className={`h-9 w-9 rounded-sm text-sm font-bold transition-all ${
                        pageNumberFromUrl === pageNum
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={pageNumberFromUrl === totalPages}
              onClick={() => updateQueryParams({ pageNumber: (pageNumberFromUrl + 1).toString() })}
              className="rounded-sm bg-white px-4 py-2 text-sm font-bold text-gray-600 border border-gray-100 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        <div className="text-xs font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">{items.length}</span> of{" "}
          <span className="font-bold text-gray-900">{meta?.totalRecords || items.length}</span> items
        </div>
      </div>

      {/* Modals */}
      <FileFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        currentPath={currentFolder?.name || "Root"}
        initialData={selectedItem && !(selectedItem as any).isFolder ? (selectedItem as FileRecord) : undefined}
        isSubmitting={uploadMutation.isPending || updateMutation.isPending}
      />

      <FolderFormModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleFolderSubmit}
        currentParentId={folderIdFromUrl}
        initialData={selectedItem && (selectedItem as any).isFolder ? (selectedItem as Folder) : undefined}
        isSubmitting={createFolderMutation.isPending}
      />

      <FileDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        item={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onOpen={handleFolderClick}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        fileName={(selectedItem as any)?.fileName || (selectedItem as any)?.name || ""}
        isDeleting={deleteMutation.isPending || deleteFolderMutation.isPending}
        isFolder={(selectedItem as any)?.isFolder}
      />
    </div>
  );
}
