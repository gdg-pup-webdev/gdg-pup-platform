"use client";

import React, { useState } from "react";
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

export const PortfolioList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: portfoliosResponse, isLoading, isError, error, refetch } = useListPortfolios(page, pageSize);
  const updateMutation = useUpdatePortfolio();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  const portfolios = portfoliosResponse?.data || [];
  const totalPages = portfoliosResponse?.meta?.totalPages || 1;
  const totalRecords = portfoliosResponse?.meta?.totalRecords || 0;

  // Handlers
  const handleEdit = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDetailsModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleView = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDetailsModalOpen(true);
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
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  // Filter portfolios client-side for search
  const filteredPortfolios = portfolios.filter(p => 
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
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search portfolios..."
            accent="blue"
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
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPortfolio}
        isSubmitting={updateMutation.isPending}
      />

      <PortfolioDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        portfolio={selectedPortfolio}
        onEdit={handleEdit}
      />
    </>
  );
};
