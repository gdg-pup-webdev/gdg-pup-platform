"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { useListMembers } from "../hooks/useListMembers";
import { useUpdateMember } from "../hooks/useUpdateMembers";
import { GdgMember, GdgMemberUpdate } from "../types";
import { Pagination } from "@/components/admin/Pagination";
import { MemberDetailsModal, MemberFormModal } from "./MemberModals";
import { MemberCard } from "./MemberCard";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { SearchInput } from "@/components/ui/SearchInput";

export const MemberList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: membersResponse, isLoading, isError, error, refetch } = useListMembers(page, pageSize);
  const updateMutation = useUpdateMember();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GdgMember | null>(null);

  const members = membersResponse?.data || [];
  const totalPages = membersResponse?.meta?.totalPages || 1;
  const totalRecords = membersResponse?.meta?.totalRecords || 0;

  // Handlers
  const handleEdit = (member: GdgMember) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleView = (member: GdgMember) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(true);
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
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  // Filter members client-side for search
  const filteredMembers = members.filter(p => 
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
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder="Search members..."
          accent="blue"
          containerClassName="w-full max-w-sm"
        />
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
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member: GdgMember) => (
            <MemberCard
              key={member.gdgId}
              member={member}
              onClick={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
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
      )}

      {/* Modals */}
      <MemberFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
        isSubmitting={updateMutation.isPending}
      />

      <MemberDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        member={selectedMember}
        onEdit={handleEdit}
      />
    </div>
  );
};
