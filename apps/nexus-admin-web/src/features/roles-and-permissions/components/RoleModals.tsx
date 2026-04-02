"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Trash2, Shield, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { z } from "zod";
import { contract } from "@packages/nexus-api-contracts";

type Role = z.infer<typeof contract.api.v1.roles.GET.response[200]>;
type RoleItem = Role["data"][number];

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: RoleItem | null;
  isSubmitting: boolean;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose} className="max-w-lg rounded-lg">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? "Edit Role" : "Create New Role"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Role Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Administrator"
            required
            disabled={!!initialData} // Usually role names are immutable or handled carefully
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this role..."
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import { RolePermissions } from "./RolePermissions";

interface RoleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
  onEdit: (role: RoleItem) => void;
  onDelete: (roleName: string) => void;
}

export const RoleDetailsModal: React.FC<RoleDetailsModalProps> = ({
  isOpen,
  onClose,
  role,
  onEdit,
  onDelete,
}) => {
  if (!role) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose} className="max-w-2xl rounded-lg">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-bold text-gray-900">Role Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
              <p className="text-sm text-gray-500">ID: {role.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Description</h4>
          <p className="text-gray-700">{role.description}</p>
        </div>

        <div className="space-y-4 pt-4">
          <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            <ShieldCheck size={16} />
            Permissions Management
          </h4>
          <RolePermissions role={role} />
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <Button className="flex-1" onClick={() => onEdit(role)}>
            <Save size={16} className="mr-2" />
            Edit Role Info
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
                onDelete(role.name);
                onClose();
              }
            }}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
