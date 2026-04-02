"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RoleList, MemberRoleAssignment } from "@/features/roles-and-permissions";
import { Shield, User } from "lucide-react";

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
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-lg bg-blue-600 p-3 text-white">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles and Permissions</h1>
          <p className="text-gray-500">
            Define system roles and configure fine-grained access control permissions.
          </p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('roles')}
        >
          Roles
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'members' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleTabChange('members')}
        >
          Members
        </button>
      </div>

      {activeTab === 'roles' && <RoleList />}
      {activeTab === 'members' && <MemberRoleAssignment />}
    </div>
  );
}
