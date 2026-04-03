"use client";

import React, { useState } from "react";
import { Shield, Plus, Edit2, Eye, Trash2 } from "lucide-react";
import { useListRoles, useCreateRole, useUpdateRole, useDeleteRole } from "../hooks";
import { Pagination } from "@/components/admin/Pagination";
import { RoleFormModal, RoleDetailsModal } from "./RoleModals";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { z } from "zod";
import { contract } from "@packages/nexus-api-contracts";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { SearchInput } from "@/components/ui/SearchInput";

type Role = z.infer<typeof contract.api.v1.roles.GET.response[200]>;
type RoleItem = Role["data"][number];

export const RoleList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // API Hooks
  const { data: rolesResponse, isLoading, isError, error, refetch } = useListRoles({ pageNumber: page, pageSize, resourceName: searchQuery });
  const createMutation = useCreateRole();
  const deleteMutation = useDeleteRole();
  const updateMutation = useUpdateRole();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const roles = rolesResponse?.data || [];
  const totalPages = rolesResponse?.meta?.totalPages || 1;
  const totalRecords = rolesResponse?.meta?.totalRecords || 0;

  // Handlers
  const handleSearch = () => {
    setSearchQuery(searchValue);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (role: RoleItem) => {
    setSelectedRole(role);
    setIsDetailsModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleView = (role: RoleItem) => {
    setSelectedRole(role);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (roleName: string) => {
    try {
      await deleteMutation.mutateAsync(roleName);
      toast.success("Role deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedRole) {
        await updateMutation.mutateAsync({ 
          roleName: selectedRole.name, 
          payload: data 
        });
        toast.success("Role updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Role created successfully");
      }
      setIsFormModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  if (isLoading) {
    return <ListLoadingState accent="blue" message="Loading roles..." />;
  }

  if (isError) {
    return (
      <ListErrorState
        title="Failed to load roles"
        message={(error as any)?.message || "An unexpected error occurred."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex gap-2 w-full max-w-sm">
          <SearchInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search roles..."
            accent="blue"
            containerClassName="flex-1"
          />
          <Button variant="outline" onClick={handleSearch}>Search</Button>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={18} />
          Create Role
        </Button>
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

      {/* Roles List */}
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                        <Shield size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-1 text-sm text-gray-600">{role.description}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleView(role)} className="text-gray-400 hover:text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEdit(role)} className="text-gray-400 hover:text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
                            handleDelete(role.name);
                          }
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRole}
        isSubmitting={selectedRole ? updateMutation.isPending : createMutation.isPending}
      />

      <RoleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        role={selectedRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
