"use client";

import React, { useState } from "react";
import { X, User } from "lucide-react";
import { useListMembers } from "@/features/members/hooks/useListMembers";
import { useGetMemberRoles, useAssignRoleToUser, useRemoveRoleFromUser, useListRoles } from "../hooks";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "react-toastify";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";

export const MemberRoleAssignment: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const { data: membersResponse, isLoading } = useListMembers(page, pageSize, searchQuery);
  const { data: rolesResponse } = useListRoles({ pageSize: 100 });
  const { data: memberRoles } = useGetMemberRoles(selectedMember?.gdgId || "");
  const assignRole = useAssignRoleToUser();
  const removeRole = useRemoveRoleFromUser();

  const members = membersResponse?.data || [];
  const totalPages = membersResponse?.meta?.totalPages || 1;
  const totalRecords = membersResponse?.meta?.totalRecords || 0;
  const roles = rolesResponse?.data || [];

  const handleSearch = () => {
    setSearchQuery(searchValue);
    setPage(1);
  };

  const handleOpenRoleModal = (member: any) => {
    setSelectedMember(member);
    setIsRoleModalOpen(true);
  };

  const handleAssignRole = async (roleName: string) => {
    try {
      await assignRole.mutateAsync({ gdgId: selectedMember.gdgId, roleName });
      toast.success("Role assigned successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    try {
      await removeRole.mutateAsync({ gdgId: selectedMember.gdgId, roleName });
      toast.success("Role removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove role");
    }
  };

  if (isLoading) return <ListLoadingState accent="blue" message="Loading members..." className="h-32" iconSize={32} />;

  return (
    <>
      <AdminListScaffold
        search={
          <AdminSearchSection
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search members..."
            accent="blue"
            actions={
              <AdminActionButton variant="brandOutline" onClick={handleSearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        content={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member: any) => (
              <div key={member.gdgId} className="flex items-center justify-between rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{member.displayName}</span>
                </div>
                <Button variant="outline" onClick={() => handleOpenRoleModal(member)}>Manage Roles</Button>
              </div>
            ))}
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

      <Modal open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen} className="max-w-lg rounded-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Manage Roles for {selectedMember?.displayName}</h2>
          <button onClick={() => setIsRoleModalOpen(false)}><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Assigned Roles</h3>
            <div className="flex flex-wrap gap-2">
              {memberRoles?.roles.map((role ) => (
                <span key={role} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {role}
                  <button onClick={() => handleRemoveRole(role)}><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Available Roles</h3>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role: any) => (
                <Button key={role.id} variant="outline" onClick={() => handleAssignRole(role)}>
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
