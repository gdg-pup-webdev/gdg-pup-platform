"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Layout, X, User, Filter } from "lucide-react";
import { MemberProject } from "../types";
import {
  MemberProjectCard,
  MemberProjectCardSkeleton,
} from "./MemberProjectCard";
import { useMemberProjects } from "../hooks/useMemberProjects";
import { useMemberProjectsByGdgId } from "../hooks/useMemberProjectsByGdgId";
import { useSearchMemberProjects } from "../hooks/useSearchMemberProjects";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

interface MemberProjectListProps {
  onCreate: () => void;
  onEdit: (project: MemberProject) => void;
  onDelete: (project: MemberProject) => void;
  onView: (project: MemberProject) => void;
}

export function MemberProjectList({ onCreate, onEdit, onDelete, onView }: MemberProjectListProps) {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 8);
  const [localSearchQuery, setLocalSearchQuery] = useState(getString("search", ""));
  const [localMemberGdgId, setLocalMemberGdgId] = useState(getString("memberGdgId", ""));

  const appliedFilters = useMemo(
    () => ({
      search: getString("search", ""),
      memberGdgId: getString("memberGdgId", ""),
    }),
    [getString],
  );

  const setPage = (nextPage: number) => {
    setQueryParams({ page: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ pageSize: nextPageSize, page: 1 });
  };

  const listQuery = useMemberProjects(page, pageSize);
  const memberQuery = useMemberProjectsByGdgId(appliedFilters.memberGdgId, page, pageSize);
  const searchQuery = useSearchMemberProjects(appliedFilters.search, page, pageSize);

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

  useEffect(() => {
    setLocalSearchQuery(appliedFilters.search);
    setLocalMemberGdgId(appliedFilters.memberGdgId);
  }, [appliedFilters.memberGdgId, appliedFilters.search]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setQueryParams({
      search: localSearchQuery.trim() || null,
      memberGdgId: localMemberGdgId.trim() || null,
      page: 1,
    });
  };

  const clearFilters = () => {
    setLocalSearchQuery("");
    setLocalMemberGdgId("");
    setQueryParams({
      search: null,
      memberGdgId: null,
      page: 1,
    });
  };

  if (isLoading && !isFetching) {
    return (
      <AdminCardGrid>
        {Array.from({ length: pageSize }).map((_, i) => (
          <MemberProjectCardSkeleton key={i} />
        ))}
      </AdminCardGrid>
    );
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load projects"
        message="Please check your connection and try again."
        className="h-96"
        onRetry={() => refetch()}
      />
    );
  }

  const filtersSection = (
    <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
      <form onSubmit={handleApplyFilters} className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 space-y-1.5">
          <label className="ml-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Search Content</label>
          <AdminSearchSection
            value={localSearchQuery}
            onValueChange={setLocalSearchQuery}
            placeholder="Search by title or description..."
            accent="teal"
            className="border-gray-200 bg-white p-2 shadow-none"
            searchContainerClassName="md:max-w-none"
            inputClassName="py-2 text-xs font-medium"
          />
        </div>

        <div className="flex-1 space-y-1.5">
          <label className="ml-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Member Filter</label>
          <div className="group relative">
            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-teal-500" />
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
          <AdminActionButton
            type="submit"
            variant="dark"
            size="sm"
          >
            <Filter size={14} />
            Apply Filters
          </AdminActionButton>
          {(appliedFilters.search || appliedFilters.memberGdgId) && (
            <AdminActionButton
              type="button"
              onClick={clearFilters}
              variant="neutralOutline"
              size="sm"
            >
              <X size={14} />
              Clear
            </AdminActionButton>
          )}
        </div>
      </form>
    </div>
  );

  return (
    <AdminListScaffold
      className="space-y-8 pb-20"
      actions={
        <AdminActionButton
          onClick={onCreate}
          variant="brand"
          className="w-full md:w-auto"
        >
          <Plus size={18} />
          Create Project
        </AdminActionButton>
      }
      filters={filtersSection}
      content={
        <div className={`transition-opacity duration-200 ${isFetching ? "opacity-50" : "opacity-100"}`}>
          {projects.length > 0 ? (
            <AdminCardGrid>
              {projects.map((project: MemberProject) => (
                <MemberProjectCard
                  key={project.id}
                  project={project}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AdminCardGrid>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-sm border-2 border-dashed border-gray-100 bg-gray-50/30 p-12 text-center">
              <div className="rounded-full bg-white p-6 text-gray-200 shadow-sm">
                <Layout size={64} strokeWidth={1} />
              </div>
              <div className="max-w-xs">
                <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 italic">
                  {appliedFilters.search || appliedFilters.memberGdgId
                    ? "No projects matched your active filters. Try adjusting your search criteria."
                    : "The project archive is empty. Start by showcasing a GDG member's hard work!"}
                </p>
              </div>
              {(appliedFilters.search || appliedFilters.memberGdgId) ? (
                <AdminActionButton
                  onClick={clearFilters}
                  variant="dark"
                  size="sm"
                  className="mt-4"
                >
                  Clear All Filters
                </AdminActionButton>
              ) : (
                <AdminActionButton
                  onClick={onCreate}
                  variant="tealOutline"
                  size="sm"
                  className="mt-4"
                >
                  Launch First Project
                </AdminActionButton>
              )}
            </div>
          )}
        </div>
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
  );
}
