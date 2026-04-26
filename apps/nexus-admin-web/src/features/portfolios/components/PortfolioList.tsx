"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import { useListPortfolios } from "../hooks/useListPortfolios";
import { useUpdatePortfolio } from "../hooks/useUpdatePortfolio";
import { Portfolio, PortfolioUpdate } from "../types";
import { PortfolioDetailsModal, PortfolioFormModal } from "./PortfolioModals";
import { PortfolioCard } from "./PortfolioCard";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";
import { AdminActionButton } from "@/components/admin/AdminActionButton";

export const PortfolioList: React.FC = () => {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 10);
  const searchQuery = getString("q", "");
  const modal = getString("modal", "");
  const selectedPortfolioId = getString("itemId", "");
  
  // API Hooks
  const { data: portfoliosResponse, isLoading, isError, error, refetch } = useListPortfolios(page, pageSize);
  const updateMutation = useUpdatePortfolio();

  const portfolios: Portfolio[] = portfoliosResponse?.data || [];
  const selectedPortfolio = useMemo(
    () => portfolios.find((portfolio: Portfolio) => portfolio.id === selectedPortfolioId) || null,
    [portfolios, selectedPortfolioId],
  );

  const isFormModalOpen = modal === "edit" && Boolean(selectedPortfolio);
  const isDetailsModalOpen = modal === "view" && Boolean(selectedPortfolio);

  const totalPages = portfoliosResponse?.meta?.totalPages || 1;
  const totalRecords = portfoliosResponse?.meta?.totalRecords || 0;

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const applySearch = () => {
    setQueryParams({ q: searchInput.trim() || null, page: 1 });
  };

  const closeModal = () => {
    setQueryParams({ modal: null, itemId: null });
  };

  const openModal = (nextModal: string, portfolio: Portfolio) => {
    setQueryParams({ modal: nextModal, itemId: portfolio.id });
  };

  // Handlers
  const handleEdit = (portfolio: Portfolio) => {
    openModal("edit", portfolio);
  };

  const handleView = (portfolio: Portfolio) => {
    openModal("view", portfolio);
  };

  const handleFormSubmit = async (data: PortfolioUpdate, profileImage?: File | null) => {
    if (!selectedPortfolio) return;
    
    try {
      await updateMutation.mutateAsync({ 
        portfolioId: selectedPortfolio.id, 
        data,
        profileImage
      });
      toast.success("Portfolio updated successfully");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  // Filter portfolios client-side for search
  const filteredPortfolios = portfolios.filter((p: Portfolio) => 
    (p.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.middle_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gdg_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <ListLoadingState accent="blue" message="Loading portfolios..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load portfolios"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <AdminListScaffold
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
            placeholder="Search portfolios..."
            accent="blue"
            actions={
              <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        content={
          filteredPortfolios.length > 0 ? (
            <AdminCardGrid>
              {filteredPortfolios.map((portfolio: Portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onClick={handleView}
                  onEdit={handleEdit}
                />
              ))}
            </AdminCardGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
              <User size={48} className="mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">
                {searchQuery ? "No matching portfolios found" : "No portfolios found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms." : "No member portfolios have been created yet."}
              </p>
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
      />

      {/* Modals */}
      <PortfolioFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={selectedPortfolio}
        isSubmitting={updateMutation.isPending}
      />

      <PortfolioDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        portfolio={selectedPortfolio}
        onEdit={handleEdit}
      />
    </>
  );
};
