"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, FileStack, Folder as FolderIcon, ChevronRight, Home, ArrowLeft, FolderPlus } from "lucide-react";
import { FileCard } from "./FileCard";
import { FileFormModal, FileDetailsModal, DeleteConfirmModal, FolderFormModal } from "./FileModals";
import { useGetFiles, useUploadFile, useUpdateFile, useDeleteFile, useGetFolders, useCreateFolder, useGetFolder, useDeleteFolder } from "../hooks";
import { FileRecord, FileRecordInsert, FileRecordUpdate, Folder, FolderInsert, FolderUpdate } from "../types";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";

// Type for both files and folders to avoid 'any'
type FileOrFolder = (FileRecord | Folder) & { isFolder: boolean };

export function FileList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL State
  const folderIdFromUrl = searchParams.get("folderId") || null;
  const pageNumberFromUrl = (() => {
    const parsed = Number.parseInt(searchParams.get("pageNumber") || "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  })();
  const pageSizeFromUrl = (() => {
    const parsed = Number.parseInt(searchParams.get("pageSize") || "10", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  })();
  const searchQuery = searchParams.get("q") || "";
  const modalFromUrl = searchParams.get("modal") || "";
  const selectedItemIdFromUrl = searchParams.get("itemId") || "";
  const selectedItemTypeFromUrl = searchParams.get("itemType") || "";

  const [searchInput, setSearchInput] = useState(searchQuery);
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

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

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

  const selectedItem = useMemo(() => {
    if (!selectedItemIdFromUrl) {
      return null;
    }

    if (selectedItemTypeFromUrl === "folder") {
      return rawFolders.find((folder) => folder.id === selectedItemIdFromUrl) || null;
    }

    if (selectedItemTypeFromUrl === "file") {
      return rawFiles.find((file) => file.id === selectedItemIdFromUrl) || null;
    }

    return (
      rawFolders.find((folder) => folder.id === selectedItemIdFromUrl) ||
      rawFiles.find((file) => file.id === selectedItemIdFromUrl) ||
      null
    );
  }, [rawFiles, rawFolders, selectedItemIdFromUrl, selectedItemTypeFromUrl]);

  const selectedItemIsFolder =
    selectedItemTypeFromUrl === "folder" ||
    Boolean(selectedItem && "name" in selectedItem && !("fileName" in selectedItem));

  const isFormModalOpen =
    modalFromUrl === "upload" || (modalFromUrl === "editFile" && Boolean(selectedItem));
  const isFolderModalOpen =
    modalFromUrl === "newFolder" || (modalFromUrl === "editFolder" && Boolean(selectedItem));
  const isDetailsModalOpen = modalFromUrl === "view" && Boolean(selectedItem);
  const isDeleteModalOpen = modalFromUrl === "delete" && Boolean(selectedItem);
  
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

  const closeModal = () => {
    updateQueryParams({ modal: null, itemId: null, itemType: null });
  };

  const openModal = (nextModal: string, item?: FileRecord | Folder) => {
    const itemType = item ? ((item as any).isFolder ? "folder" : "file") : null;
    updateQueryParams({
      modal: nextModal,
      itemId: item?.id || null,
      itemType,
    });
  };

  const applySearch = () => {
    updateQueryParams({ q: searchInput.trim() || null, pageNumber: "1" });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateQueryParams({ q: null, pageNumber: "1" });
  };

  // Handlers
  const handleUpload = () => {
    openModal("upload");
  };

  const handleCreateFolderClick = () => {
    openModal("newFolder");
  };

  const handleEdit = (item: FileRecord | Folder) => {
    if ((item as any).isFolder) {
      openModal("editFolder", item);
      return;
    }

    openModal("editFile", item);
  };

  const handleView = (item: FileRecord | Folder) => {
    openModal("view", item);
  };

  const handleDeleteClick = (item: FileRecord | Folder) => {
    openModal("delete", item);
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
        if (selectedItem && !selectedItemIsFolder) {
          await updateMutation.mutateAsync({ id: selectedItem.id, data: data as FileRecordUpdate });
        } else if (file) {
          const formData = { 
            ...data,
            folderId: folderIdFromUrl,
          } as FileRecordInsert;
          
          await uploadMutation.mutateAsync({ data: formData, file });
        }
        closeModal();
        refetch();
    } catch (err) {
        console.error("Form submission failed:", err);
    }
  };

  const handleFolderSubmit = async (data: FolderInsert | FolderUpdate) => {
    try {
        if (selectedItem && selectedItemIsFolder) {
            // This is an update, which is not implemented.
            throw new Error("Update folder functionality is not implemented yet.");
        } else {
            // This is a create.
            await createFolderMutation.mutateAsync(data as FolderInsert);
        }
          closeModal();
        refetch();
    } catch (err) {
        console.error("Folder creation/update failed:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        if (selectedItemIsFolder) {
          await deleteFolderMutation.mutateAsync(selectedItem.id);
        } else {
          await deleteMutation.mutateAsync(selectedItem.id);
        }
        closeModal();
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
    <>
      <AdminListScaffold
        className="space-y-8"
        leading={
          <div className="flex flex-wrap items-center gap-2 rounded-sm border border-gray-100 bg-gray-50 p-3 text-sm text-gray-600">
            <button 
              onClick={handleBack}
              disabled={!folderIdFromUrl}
              className="flex items-center gap-1 rounded-sm border border-gray-200 bg-white px-2 py-1 text-xs font-bold disabled:opacity-30 hover:bg-gray-100"
            >
              <ArrowLeft size={14} />
              Up
            </button>

            <div className="mx-1 h-4 w-px bg-gray-300" />

            <button
              onClick={() => handleBreadcrumbClick(null)}
              className={`flex items-center gap-1.5 transition-colors hover:text-teal-600 ${
                !folderIdFromUrl ? "font-bold text-teal-700" : ""
              }`}
            >
              <Home size={14} />
              Root
            </button>

            {folderHistory.map((folder) => (
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
        }
        actions={
          <>
            <AdminActionButton
              onClick={handleCreateFolderClick}
              variant="brandOutline"
              className="flex-1 md:flex-none"
            >
              <FolderPlus size={18} />
              New Folder
            </AdminActionButton>
            <AdminActionButton
              onClick={handleUpload}
              variant="brand"
              className="flex-1 md:flex-none"
            >
              <Plus size={18} />
              Upload
            </AdminActionButton>
          </>
        }
        search={
          <AdminSearchSection
            value={searchInput}
            onValueChange={setSearchInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            placeholder="Search in this folder..."
            accent="teal"
            searchContainerClassName="max-w-md"
            inputClassName="border-gray-100 py-3 shadow-sm"
            actions={
              <>
                <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
                  Search
                </AdminActionButton>
                {searchQuery ? (
                  <AdminActionButton variant="neutralOutline" size="sm" onClick={clearSearch}>
                    Clear
                  </AdminActionButton>
                ) : null}
              </>
            }
          />
        }
        content={
          items.length > 0 ? (
            <AdminCardGrid>
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
            </AdminCardGrid>
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
                >
                  Upload Now
                </AdminActionButton>
              </div>
            </div>
          )
        }
        pagination={
          <div className="border-t border-gray-100 pt-8">
            <AdminPaginationSection
              currentPage={pageNumberFromUrl}
              totalPages={totalPages}
              pageSize={pageSizeFromUrl}
              totalRecords={meta?.totalRecords || items.length}
              onPageChange={(nextPage) => updateQueryParams({ pageNumber: nextPage.toString() })}
              onPageSizeChange={(nextSize) => updateQueryParams({ pageSize: nextSize.toString(), pageNumber: "1" })}
            />
          </div>
        }
      />

      {/* Modals */}
      <FileFormModal 
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        currentPath={currentFolder?.name || "Root"}
        initialData={selectedItem && !selectedItemIsFolder ? (selectedItem as FileRecord) : undefined}
        isSubmitting={uploadMutation.isPending || updateMutation.isPending}
      />

      <FolderFormModal
        isOpen={isFolderModalOpen}
        onClose={closeModal}
        onSubmit={handleFolderSubmit}
        currentParentId={folderIdFromUrl}
        initialData={selectedItem && selectedItemIsFolder ? (selectedItem as Folder) : undefined}
        isSubmitting={createFolderMutation.isPending}
      />

      <FileDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        item={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onOpen={handleFolderClick}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        fileName={(selectedItem as any)?.fileName || (selectedItem as any)?.name || ""}
        isDeleting={deleteMutation.isPending || deleteFolderMutation.isPending}
        isFolder={selectedItemIsFolder}
      />
    </>
  );
}
