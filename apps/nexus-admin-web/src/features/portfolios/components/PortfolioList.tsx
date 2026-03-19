"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Search, User } from "lucide-react";
import { useListPortfolios } from "../hooks/useListPortfolios";
import { useUpdatePortfolio } from "../hooks/useUpdatePortfolio";
import { Portfolio, PortfolioUpdate } from "../types";
import { Pagination } from "@/components/admin/Pagination";
import { PortfolioDetailsModal, PortfolioFormModal } from "./PortfolioModals";
import { PortfolioCard } from "./PortfolioCard";
import { toast } from "react-toastify";

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

  const handleFormSubmit = async (data: PortfolioUpdate) => {
    if (!selectedPortfolio) return;
    
    try {
      await updateMutation.mutateAsync({ 
        portfolioId: selectedPortfolio.id, 
        data 
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
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-red-900">Failed to load portfolios</h3>
        <p className="mt-1 text-sm text-red-700">{(error as any)?.message || "An unexpected error occurred."}</p>
        <button 
          onClick={() => refetch()}
          className="mt-6 rounded-sm bg-red-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search portfolios..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      {/* Grid of Cards */}
      {filteredPortfolios.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPortfolios.map((portfolio: Portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              onClick={handleView}
            />
          ))}
        </div>
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
      )}

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
    </div>
  );
};
