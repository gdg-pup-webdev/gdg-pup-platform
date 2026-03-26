"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Search, Shield, Plus, X, User } from "lucide-react";
import { useListMembers } from "@/features/members/hooks/useListMembers";
import { useGetMemberRoles, useAssignRoleToUser, useRemoveRoleFromUser, useListRoles } from "../hooks";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "react-toastify";

export const MemberRoleAssignment: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const { data: membersResponse, isLoading, isError, error, refetch } = useListMembers(page, pageSize, searchQuery);
  const { data: rolesResponse } = useListRoles({ pageSize: 100 });
  const { data: memberRoles, isLoading: isLoadingRoles } = useGetMemberRoles(selectedMember?.gdgId || "");
  const assignRole = useAssignRoleToUser();
  const removeRole = useRemoveRoleFromUser();

  const members = membersResponse?.data || [];
  const roles = rolesResponse?.data || [];

  const handleOpenRoleModal = (member: any) => {
    setSelectedMember(member);
    setIsRoleModalOpen(true);
  };

  const handleAssignRole = async (roleName: string) => {
    try {
      await assignRole.mutateAsync({ userId: selectedMember.gdgId, roleName });
      toast.success("Role assigned successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign role");
    }
  };

  const handleRemoveRole = async (roleName: string) => {
    try {
      await removeRole.mutateAsync({ userId: selectedMember.gdgId, roleName });
      toast.success("Role removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove role");
    }
  };

  if (isLoading) return <Loader2 className="animate-spin text-blue-600" size={40} />;

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          className="w-full rounded-sm border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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

      <Modal open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen} className="max-w-lg rounded-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Manage Roles for {selectedMember?.displayName}</h2>
          <button onClick={() => setIsRoleModalOpen(false)}><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Assigned Roles</h3>
            <div className="flex flex-wrap gap-2">
              {memberRoles?.map((role: any) => (
                <span key={role.name} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {role.name}
                  <button onClick={() => handleRemoveRole(role.name)}><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Available Roles</h3>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role: any) => (
                <Button key={role.id} variant="outline" onClick={() => handleAssignRole(role.name)}>
                  {role.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
