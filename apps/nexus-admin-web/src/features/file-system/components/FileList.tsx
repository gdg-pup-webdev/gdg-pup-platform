"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, FileStack, Folder as FolderIcon, ChevronRight, Home, ArrowLeft, FolderPlus } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal, FolderFormModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile, useGetFolders, useCreateFolder, useGetFolder, useDeleteFolder } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate, Folder, FolderInsert, FolderUpdate } from "../types";
import { SearchInput } from "@/components/ui/SearchInput";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { Pagination } from "@/components/admin/Pagination";
import { AdminActionButton } from "@/components/admin/AdminActionButton";

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

  const handleDeleteFromCard = async (item: FileRecord | Folder) => {
    try {
      if ((item as any).isFolder) {
        await deleteFolderMutation.mutateAsync(item.id);
      } else {
        await deleteMutation.mutateAsync(item.id);
      }
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
    }
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
    return <ListLoadingState accent="teal" message="Loading your files..." className="h-96" iconSize={48} />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load files"
        message={(error as any)?.message || "An unexpected error occurred while fetching files."}
        onRetry={() => refetch()}
      />
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
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search in this folder..."
          accent="teal"
          containerClassName="w-full max-w-md max-md:max-w-none"
          inputClassName="border-gray-100 py-3 shadow-sm"
        />
        
        <div className="flex w-full gap-2 md:w-auto">
          <AdminActionButton
            onClick={handleCreateFolderClick}
            variant="tealOutline"
            size="lg"
            className="flex-1 md:w-auto"
          >
            <FolderPlus size={18} />
            New Folder
          </AdminActionButton>
          <AdminActionButton
            onClick={handleUpload}
            variant="teal"
            size="lg"
            className="flex-1 hover:shadow-lg md:w-auto"
          >
            <Plus size={18} />
            Upload
          </AdminActionButton>
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
              onDelete={handleDeleteFromCard}
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
            <AdminActionButton
              onClick={handleCreateFolderClick}
              variant="tealOutline"
            >
              Create Folder
            </AdminActionButton>
            <AdminActionButton
              onClick={handleUpload}
              variant="teal"
              className="px-8 hover:shadow-md"
            >
              Upload Now
            </AdminActionButton>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="border-t border-gray-100 pt-8">
        <Pagination
          currentPage={pageNumberFromUrl}
          totalPages={totalPages}
          pageSize={pageSizeFromUrl}
          totalRecords={meta?.totalRecords || items.length}
          onPageChange={(nextPage) => updateQueryParams({ pageNumber: nextPage.toString() })}
          onPageSizeChange={(nextSize) => updateQueryParams({ pageSize: nextSize.toString(), pageNumber: "1" })}
        />
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
