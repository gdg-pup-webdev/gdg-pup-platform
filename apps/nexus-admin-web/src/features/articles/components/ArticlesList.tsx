"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { useListArticles } from "../hooks/useListArticle";
import { useDeleteArticle } from "../hooks/useDeleteArticle";
import { useCreateArticle } from "../hooks/useCreateArticle";
import { useUpdateArticle } from "../hooks/useUpdateArticle";
import { Article, ArticleInsert, ArticleUpdate } from "../types";
import { ArticleFormModal, ArticleDetailsModal, DeleteConfirmModal } from "./ArticleModal";
import { ArticleCard } from "./ArticleCard";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export const ArticlesList: React.FC = () => {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 12);
  const searchQuery = getString("q", "");
  const modal = getString("modal", "");
  const selectedArticleId = getString("itemId", "");
  
  // API Hooks
  const { data: articlesResponse, isLoading, isError, error, refetch } = useListArticles(page, pageSize);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const deleteMutation = useDeleteArticle();

  const articles: Article[] = articlesResponse?.data || [];
  const selectedArticle = useMemo(
    () => articles.find((article: Article) => article.id === selectedArticleId) || null,
    [articles, selectedArticleId],
  );

  const isFormModalOpen = modal === "create" || (modal === "edit" && Boolean(selectedArticle));
  const isDetailsModalOpen = modal === "view" && Boolean(selectedArticle);
  const isDeleteModalOpen = modal === "delete" && Boolean(selectedArticle);

  const totalPages = articlesResponse?.meta?.totalPages || 1;
  const totalRecords = articlesResponse?.meta?.totalRecords || 0;

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, article?: Article | null) => {
    setQueryParams({
      modal: nextModal,
      itemId: article?.id || null,
    });
  };

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const applySearch = () => {
    setQueryParams({ q: searchInput.trim() || null, page: 1 });
  };

  const clearSearch = () => {
    setSearchInput("");
    setQueryParams({ q: null, page: 1 });
  };

  // Handlers
  const handleCreate = () => {
    openModal("create");
  };

  const handleEdit = (article: Article) => {
    openModal("edit", article);
  };

  const handleView = (article: Article) => {
    openModal("view", article);
  };

  const handleDeleteClick = (article: Article) => {
    openModal("delete", article);
  };

  const handleDeleteFromCard = async (article: Article) => {
    try {
      await deleteMutation.mutateAsync(article.id);
      toast.success("Article deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleFormSubmit = async (data: ArticleInsert | ArticleUpdate, thumbnail?: File) => {
    try {
      if (selectedArticle) {
        await updateMutation.mutateAsync({ id: selectedArticle.id, data: data as ArticleUpdate, thumbnailImage: thumbnail });
        toast.success("Article updated successfully");
      } else {
        await createMutation.mutateAsync({ data: data as ArticleInsert, thumbnailImage: thumbnail });
        toast.success("Article created successfully");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedArticle) {
      try {
        await deleteMutation.mutateAsync(selectedArticle.id);
        toast.success("Article deleted successfully");
        closeModal();
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  // Filter articles client-side for search
  const filteredArticles = articles.filter((a: Article) => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && !searchQuery) {
    return <ListLoadingState accent="teal" message="Loading articles..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load articles"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <AdminListScaffold
      actions={
        <AdminActionButton
          onClick={handleCreate}
          variant="brand"
          className="w-full md:w-auto"
        >
          <Plus size={18} />
          Create Article
        </AdminActionButton>
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
          placeholder="Search articles..."
          accent="teal"
          actions={
            <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
              Search
            </AdminActionButton>
          }
        />
      }
      content={
        filteredArticles.length > 0 ? (
          <AdminCardGrid>
            {filteredArticles.map((article: Article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteFromCard}
              />
            ))}
          </AdminCardGrid>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
            <FileText size={48} className="mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery ? "No matching articles found" : "No articles found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first article."}
            </p>
            {searchQuery ? (
              <AdminActionButton
                onClick={clearSearch}
                variant="dark"
                size="sm"
                className="mt-6"
              >
                Clear Search
              </AdminActionButton>
            ) : (
              <AdminActionButton
                onClick={handleCreate}
                variant="teal"
                size="sm"
                className="mt-6"
              >
                Create Article
              </AdminActionButton>
            )}
          </div>
        )
      }
      pagination={
        <AdminPaginationSection
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
    >

      {/* Modals */}
      <ArticleFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modal === "edit" ? selectedArticle : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ArticleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        article={selectedArticle}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={selectedArticle?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </AdminListScaffold>
  );
};
