"use client";

import React from "react";
import { RoleList, MemberRoleAssignment } from "@/features/roles-and-permissions";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { useAdminQueryParams } from "@/lib/useAdminQueryParams";

export default function RolesAndPermissionsPage() {
  const { getString, setQueryParams } = useAdminQueryParams();
  const activeTab = getString("tab", "roles");

  const handleTabChange = (tab: string) => {
    setQueryParams({ tab }, { method: "push" });
  };

  return (
    <AdminPageScaffold pageKey="rolesPermissions" className="py-2">
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        <AdminActionButton
          variant={activeTab === "roles" ? "brand" : "neutral"}
          size="sm"
          onClick={() => handleTabChange("roles")}
        >
          Roles
        </AdminActionButton>
        <AdminActionButton
          variant={activeTab === "members" ? "brand" : "neutral"}
          size="sm"
          onClick={() => handleTabChange("members")}
        >
          Members
        </AdminActionButton>
      </div>

      {activeTab === "roles" && <RoleList />}
      {activeTab === "members" && <MemberRoleAssignment />}
    </AdminPageScaffold>
  );
}
