"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import { useListMembers } from "../hooks/useListMembers";
import { useUpdateMember } from "../hooks/useUpdateMembers";
import { GdgMember, GdgMemberUpdate } from "../types";
import { MemberDetailsModal, MemberFormModal } from "./MemberModals";
import { MemberCard } from "./MemberCard";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";
import { AdminActionButton } from "@/components/admin/AdminActionButton";

export const MemberList: React.FC = () => {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("page", 1);
  const pageSize = getNumber("pageSize", 10);
  const searchQuery = getString("q", "");
  const modal = getString("modal", "");
  const selectedMemberId = getString("itemId", "");
  
  // API Hooks
  const { data: membersResponse, isLoading, isError, error, refetch } = useListMembers(page, pageSize);
  const updateMutation = useUpdateMember();

  const members: GdgMember[] = membersResponse?.data || [];
  const selectedMember = useMemo(
    () => members.find((member: GdgMember) => member.gdgId === selectedMemberId) || null,
    [members, selectedMemberId],
  );

  const isFormModalOpen = modal === "edit" && Boolean(selectedMember);
  const isDetailsModalOpen = modal === "view" && Boolean(selectedMember);

  const totalPages = membersResponse?.meta?.totalPages || 1;
  const totalRecords = membersResponse?.meta?.totalRecords || 0;

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

  const openModal = (nextModal: string, member: GdgMember) => {
    setQueryParams({ modal: nextModal, itemId: member.gdgId });
  };

  // Handlers
  const handleEdit = (member: GdgMember) => {
    openModal("edit", member);
  };

  const handleView = (member: GdgMember) => {
    openModal("view", member);
  };

  const handleFormSubmit = async (data: GdgMemberUpdate, profileImage?: File | null) => {
    if (!selectedMember) return;
    
    try {
      await updateMutation.mutateAsync({ 
        gdgId: selectedMember.gdgId, 
        data,
        profileImage
      });
      toast.success("Member updated successfully");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  // Filter members client-side for search
  const filteredMembers = members.filter((p: GdgMember) => 
    (p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.middleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.lastName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gdgId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <ListLoadingState accent="blue" message="Loading members..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load members"
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
            placeholder="Search members..."
            accent="blue"
            actions={
              <AdminActionButton variant="brandOutline" size="sm" onClick={applySearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        content={
          filteredMembers.length > 0 ? (
            <AdminCardGrid>
              {filteredMembers.map((member: GdgMember) => (
                <MemberCard
                  key={member.gdgId}
                  member={member}
                  onClick={handleView}
                  onEdit={handleEdit}
                />
              ))}
            </AdminCardGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
              <User size={48} className="mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">
                {searchQuery ? "No matching members found" : "No members found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "Try adjusting your search terms." : "No member members have been created yet."}
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
      <MemberFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
        isSubmitting={updateMutation.isPending}
      />

      <MemberDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        member={selectedMember}
        onEdit={handleEdit}
      />
    </>
  );
};
