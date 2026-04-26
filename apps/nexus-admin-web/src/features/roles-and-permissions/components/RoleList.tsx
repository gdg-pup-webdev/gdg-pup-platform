"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Shield, Plus, Edit2, Eye, Trash2 } from "lucide-react";
import { useListRoles, useCreateRole, useUpdateRole, useDeleteRole, useGetRoleById } from "../hooks";
import { RoleFormModal, RoleDetailsModal } from "./RoleModals";
import { toast } from "react-toastify";
import { z } from "zod";
import { contract } from "@packages/nexus-api-contracts";
import { ListLoadingState } from "@/components/admin/ListLoadingState";
import { ListErrorState } from "@/components/admin/ListErrorState";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { AdminSearchSection } from "@/components/admin/AdminSearchSection";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { AdminListScaffold } from "@/components/admin/AdminListScaffold";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

type Role = z.infer<typeof contract.api.v1.roles.GET.response[200]>;
type RoleItem = Role["data"][number];

export const RoleList: React.FC = () => {
  const { getNumber, getString, setQueryParams } = useAdminQueryParams();

  const page = getNumber("rolesPage", 1);
  const pageSize = getNumber("rolesPageSize", 10);
  const searchQuery = getString("rolesSearch", "");
  const modal = getString("rolesModal", "");
  const selectedRoleId = getString("rolesItem", "");

  const [searchValue, setSearchValue] = useState(searchQuery);

  const setPage = (nextPage: number) => {
    setQueryParams({ rolesPage: nextPage });
  };

  const setPageSize = (nextPageSize: number) => {
    setQueryParams({ rolesPageSize: nextPageSize, rolesPage: 1 });
  };

  const closeModal = () => {
    setQueryParams({ rolesModal: null, rolesItem: null });
  };

  const openModal = (nextModal: string, role?: RoleItem | null) => {
    setQueryParams({
      rolesModal: nextModal,
      rolesItem: role?.id || null,
    });
  };
  
  // API Hooks
  const { data: rolesResponse, isLoading, isError, error, refetch } = useListRoles({ pageNumber: page, pageSize, resourceName: searchQuery });
  const createMutation = useCreateRole();
  const deleteMutation = useDeleteRole();
  const updateMutation = useUpdateRole();

  const roles: RoleItem[] = rolesResponse?.data || [];
  const {data , isLoading: isRoleLoading} = useGetRoleById(selectedRoleId)
  const selectedRole = data?.data || null;
  console.log("selected role", selectedRole, selectedRoleId)
  // useMemo(
    // () => roles.find((role) => role.id === selectedRoleId) || null,
    // [roles, selectedRoleId],
  // );

  const isFormModalOpen = modal === "create" || (modal === "edit" && Boolean(selectedRole));
  const isDetailsModalOpen = modal === "view" && Boolean(selectedRole);

  const totalPages = rolesResponse?.meta?.totalPages || 1;
  const totalRecords = rolesResponse?.meta?.totalRecords || 0;

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Handlers
  const handleSearch = () => {
    setQueryParams({ rolesSearch: searchValue || null, rolesPage: 1 });
  };

  const handleCreate = () => {
    openModal("create");
  };

  const handleEdit = (role: RoleItem) => {
    openModal("edit", role);
  };

  const handleView = (role: RoleItem) => {
    openModal("view", role);
  };

  const handleDelete = async (roleName: string) => {
    try {
      await deleteMutation.mutateAsync(roleName);
      toast.success("Role deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleFormSubmit = async (data : contract.api.v1.roles.POST.request.body  ) => {
    try {
      if (selectedRole) {
        await updateMutation.mutateAsync({ 
          roleId: selectedRole.name, 
          payload: data 
        });
        toast.success("Role updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Role created successfully");
      }
      closeModal();
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
    <>
      <AdminListScaffold
        actions={
          <AdminActionButton onClick={handleCreate}>
            <Plus size={18} />
            Create Role
          </AdminActionButton>
        }
        search={
          <AdminSearchSection
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search roles..."
            accent="blue"
            actions={
              <AdminActionButton variant="brandOutline" onClick={handleSearch}>
                Search
              </AdminActionButton>
            }
          />
        }
        content={
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
                  roles.map((role: RoleItem) => (
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
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleFormSubmit({data: data})}
        initialData={modal === "edit" ? selectedRole : undefined}
        isSubmitting={selectedRole ? updateMutation.isPending : createMutation.isPending}
      />

      <RoleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        role={selectedRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};
