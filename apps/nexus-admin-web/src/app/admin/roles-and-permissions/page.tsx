"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RoleList, MemberRoleAssignment } from "@/features/roles-and-permissions";
import { AdminPageScaffold } from "@/components/admin/AdminPageScaffold";
import { AdminActionButton } from "@/components/admin/AdminActionButton";

export default function RolesAndPermissionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "roles";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
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
