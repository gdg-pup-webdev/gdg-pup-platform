"use client";

import React, { useState } from "react";
import { Plus, Loader2, Search, AlertCircle, Users, Layout, ChevronLeft, ChevronRight, X, User } from "lucide-react";
import { MemberProject } from "../types";
import { MemberProjectCard } from "./MemberProjectCard";
import { useMemberProjects } from "../hooks/useMemberProjects";
import { useMemberProjectsByGdgId } from "../hooks/useMemberProjectsByGdgId";
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
  const [memberFilter, setMemberFilter] = useState("");
  const [activeMemberGdgId, setActiveMemberGdgId] = useState<string | null>(null);

  // Choose hook based on whether we are filtering by member
  const listQuery = useMemberProjects(page, pageSize);
  const memberQuery = useMemberProjectsByGdgId(activeMemberGdgId || "", page, pageSize);

  const query = activeMemberGdgId ? memberQuery : listQuery;
  const { data: response, isLoading, isError, isFetching } = query;

  const projects = response?.data || [];
  const totalRecords = response?.meta?.totalRecords || 0;
  const totalPages = response?.meta?.totalPages || 1;

  const handleMemberSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberFilter.trim()) {
      setActiveMemberGdgId(memberFilter.trim());
      setPage(1);
    }
  };

  const clearFilter = () => {
    setMemberFilter("");
    setActiveMemberGdgId(null);
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
      {/* Action Bar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-gray-100 pb-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Member Projects</h2>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
              Manage and showcase technical projects built by GDG members
            </p>
          </div>
          
          <form onSubmit={handleMemberSearch} className="flex items-center gap-2">
            <div className="relative group">
              <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                placeholder="Filter by Member GDG ID..."
                className="w-full min-w-[240px] rounded-sm border border-gray-200 py-2 pl-10 pr-10 text-xs font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
              />
              {activeMemberGdgId && (
                <button
                  type="button"
                  onClick={clearFilter}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-sm bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-sm"
            >
              Apply Filter
            </button>
          </form>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 rounded-sm bg-teal-600 px-8 py-3 text-sm font-black text-white transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} />
          Create Project
        </button>
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
                {activeMemberGdgId 
                  ? `No projects were found for member "${activeMemberGdgId}". Try a different ID.` 
                  : "The project archive is empty. Start by showcasing a GDG member's hard work!"}
              </p>
            </div>
            {!activeMemberGdgId && (
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
