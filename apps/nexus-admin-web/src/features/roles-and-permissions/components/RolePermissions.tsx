"use client";

import React, { useState } from "react";
import { Plus, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAddRolePermission, useRemoveRolePermission } from "../hooks";
import { toast } from "react-toastify";
import { RoleItem } from "../types";

interface RolePermissionsProps {
  role: RoleItem;
}

export const RolePermissions: React.FC<RolePermissionsProps> = ({ role }) => {
  const [resourceName, setResourceName] = useState("");
  const [action, setAction] = useState("");
  
  const addPermissionMutation = useAddRolePermission(role.name);
  const removePermissionMutation = useRemoveRolePermission(role.name);

  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName || !action) return;
    
    try {
      await addPermissionMutation.mutateAsync({ 
        resource_name: resourceName, 
        action 
      });
      toast.success("Permission added successfully");
      setResourceName("");
      setAction("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add permission");
    }
  };

  const handleRemovePermission = async (permResource: string, permAction: string) => {
    try {
      await removePermissionMutation.mutateAsync({ 
        resource: permResource, 
        action: permAction 
      });
      toast.success("Permission removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove permission");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-400">Resource</label>
          <Input 
            placeholder="e.g. users" 
            value={resourceName} 
            onChange={(e) => setResourceName(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-semibold uppercase text-gray-400">Action</label>
          <Input 
            placeholder="e.g. read" 
            value={action} 
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
        <Button onClick={handleAddPermission} disabled={addPermissionMutation.isPending}>
          <Plus size={18} className="mr-2" />
          Add
        </Button>
      </div>

      <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-1">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              <th className="px-4 py-2">Resource</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {role.permissions && role.permissions.length > 0 ? (
              role.permissions.map((perm, idx) => (
                <tr key={`${perm.resource}-${perm.action}-${idx}`} className="text-sm">
                  <td className="px-4 py-2 font-medium text-gray-700">{perm.resource}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {perm.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button 
                      onClick={() => handleRemovePermission(perm.resource, perm.action)}
                      className="text-gray-400 hover:text-red-600"
                      disabled={removePermissionMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                  No permissions assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
