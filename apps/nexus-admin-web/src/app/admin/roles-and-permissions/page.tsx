import React from "react";
import { RoleList } from "@/features/roles-and-permissions";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Roles and Permissions | Nexus Admin",
  description: "Manage system roles and their associated permissions.",
};

export default function RolesAndPermissionsPage() {
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

      <RoleList />
    </div>
  );
}
