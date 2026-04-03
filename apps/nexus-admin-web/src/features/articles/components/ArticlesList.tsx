"use client";

import React, { useState } from "react";
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

export const ArticlesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: articlesResponse, isLoading, isError, error, refetch } = useListArticles(page, pageSize);
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const deleteMutation = useDeleteArticle();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles = articlesResponse?.data || [];
  const totalPages = articlesResponse?.meta?.totalPages || 1;
  const totalRecords = articlesResponse?.meta?.totalRecords || 0;
  // Handlers
  const handleCreate = () => {
    setSelectedArticle(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailsModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
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
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedArticle) {
      try {
        await deleteMutation.mutateAsync(selectedArticle.id);
        toast.success("Article deleted successfully");
        setIsDeleteModalOpen(false);
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    }
  };

  // Filter articles client-side for search
  const filteredArticles = articles.filter(a => 
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
      search={
        <AdminSearchSection
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search articles..."
          accent="teal"
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
                onClick={() => setSearchQuery("")}
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
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedArticle}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ArticleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        article={selectedArticle}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedArticle?.title || ""}
        isDeleting={deleteMutation.isPending}
      />
    </AdminListScaffold>
  );
};
