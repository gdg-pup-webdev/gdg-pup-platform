"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Search, Plus, Info } from "lucide-react";
import { useListHighlights } from "../hooks/useListHighlights";
import { EventHighlight } from "../types";
import { Pagination } from "@/components/admin/Pagination";
import { EventHighlightCard } from "./EventHighlightCard";

export const EventHighlightsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventIdFilter, setEventIdFilter] = useState<string | undefined>(undefined);
  
  // API Hooks
  const { data: highlightsResponse, isLoading, isError, error, refetch } = useListHighlights(page, pageSize, eventIdFilter);

  const highlights = highlightsResponse?.data || [];
  const totalPages = highlightsResponse?.meta?.totalPages || 1;
  const totalRecords = highlightsResponse?.meta?.totalRecords || 0;

  const handleCreate = () => {
    // Logic for create modal would go here
    alert("Create functionality would open a modal here.");
  };

  const handleView = (highlight: EventHighlight) => {
    // Logic for view/edit modal would go here
    alert(`Viewing highlight: ${highlight.title}`);
  };

  // Filter highlights client-side for search (simple implementation)
  const filteredHighlights = highlights.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-red-900">Failed to load highlights</h3>
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
            placeholder="Search highlights..."
            className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <button
            onClick={handleCreate}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 md:flex-none"
          >
            <Plus size={18} />
            Create Highlight
          </button>
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
      {filteredHighlights.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredHighlights.map((highlight: EventHighlight) => (
            <EventHighlightCard
              key={highlight.id}
              highlight={highlight}
              onClick={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
          <Info size={48} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery ? "No matching highlights found" : "No highlights found"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? "Try adjusting your search terms." : "Get started by highlighting moments from your events."}
          </p>
          {!searchQuery && (
            <button 
              onClick={handleCreate}
              className="mt-6 rounded-sm bg-teal-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700"
            >
              Create Highlight
            </button>
          )}
        </div>
      )}
    </div>
  );
};
