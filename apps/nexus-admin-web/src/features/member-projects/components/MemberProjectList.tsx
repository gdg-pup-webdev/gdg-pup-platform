"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, Search, AlertCircle, Layout, ChevronLeft, ChevronRight, X, User, Filter } from "lucide-react";
import { MemberProject } from "../types";
import { MemberProjectCard } from "./MemberProjectCard";
import { useMemberProjects } from "../hooks/useMemberProjects";
import { useMemberProjectsByGdgId } from "../hooks/useMemberProjectsByGdgId";
import { useSearchMemberProjects } from "../hooks/useSearchMemberProjects";
import { Pagination } from "@/components/admin/Pagination";

interface MemberProjectListProps {
  onCreate: () => void;
  onEdit: (project: MemberProject) => void;
  onDelete: (project: MemberProject) => void;
  onView: (project: MemberProject) => void;
}

export function MemberProjectList({ onCreate, onEdit, onDelete, onView }: MemberProjectListProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  
  // Local input state (for debouncing/controlled components)
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localMemberGdgId, setLocalMemberGdgId] = useState("");

  // Applied filter state (only updated on Search click)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    memberGdgId: ""
  });

  // API Hooks
  const listQuery = useMemberProjects(page, pageSize);
  const memberQuery = useMemberProjectsByGdgId(appliedFilters.memberGdgId, page, pageSize);
  const searchQuery = useSearchMemberProjects(appliedFilters.search, page, pageSize);

  // Determine which query to use based on applied filters
  // Priority: Search > Member Filter > Default List
  let currentQuery = listQuery;
  if (appliedFilters.search) {
    currentQuery = searchQuery;
  } else if (appliedFilters.memberGdgId) {
    currentQuery = memberQuery;
  }

  const { data: response, isLoading, isError, isFetching, refetch } = currentQuery;

  const projects = response?.data || [];
  const totalRecords = response?.meta?.totalRecords || 0;
  const totalPages = response?.meta?.totalPages || 1;

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      search: localSearchQuery.trim(),
      memberGdgId: localMemberGdgId.trim()
    });
    setPage(1);
  };

  const clearFilters = () => {
    setLocalSearchQuery("");
    setLocalMemberGdgId("");
    setAppliedFilters({
      search: "",
      memberGdgId: ""
    });
    setPage(1);
  };

  if (isLoading && !isFetching) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-gray-500 italic">Loading projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-red-200 bg-red-50/30 p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h3 className="text-lg font-bold text-red-900">Failed to load projects</h3>
          <p className="mt-1 text-sm text-red-700">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Main Action */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Member Projects</h2>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
            Manage and showcase technical projects built by GDG members
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 rounded-sm bg-teal-600 px-8 py-3 text-sm font-black text-white transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
        <form onSubmit={handleApplyFilters} className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Search Content</label>
            <div className="relative group">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by title or description..."
                className="w-full rounded-sm border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Member Filter</label>
            <div className="relative group">
              <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Filter by Member GDG ID..."
                className="w-full rounded-sm border border-gray-200 bg-white py-2 pl-10 pr-4 text-xs font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={localMemberGdgId}
                onChange={(e) => setLocalMemberGdgId(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end gap-2 pt-5">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-sm bg-gray-900 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-sm"
            >
              <Filter size={14} />
              Apply Filters
            </button>
            {(appliedFilters.search || appliedFilters.memberGdgId) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-all"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
        {projects.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project: MemberProject) => (
                <MemberProjectCard
                  key={project.id}
                  project={project}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalRecords={totalRecords}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/30 p-12 text-center">
            <div className="rounded-full bg-white p-6 shadow-sm text-gray-200">
              <Layout size={64} strokeWidth={1} />
            </div>
            <div className="max-w-xs">
              <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed italic">
                {appliedFilters.search || appliedFilters.memberGdgId 
                  ? "No projects matched your active filters. Try adjusting your search criteria." 
                  : "The project archive is empty. Start by showcasing a GDG member's hard work!"}
              </p>
            </div>
            {(appliedFilters.search || appliedFilters.memberGdgId) ? (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-sm border border-gray-900 px-6 py-2 text-xs font-bold text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={onCreate}
                className="mt-4 rounded-sm border border-teal-600 px-6 py-2 text-xs font-bold text-teal-600 transition-all hover:bg-teal-600 hover:text-white"
              >
                Launch First Project
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
