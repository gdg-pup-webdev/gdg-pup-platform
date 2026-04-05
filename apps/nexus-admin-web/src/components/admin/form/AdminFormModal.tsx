"use client";
import React from "react";
import { X, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AdminActionButton } from "../AdminActionButton";
import { cn } from "@/lib/utils";

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string; // used for adjusting width (e.g. max-w-2xl)
}

export function AdminFormModal({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Changes",
  children,
  className,
}: AdminFormModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} className={cn("max-w-2xl rounded-md", className)}>
      <div className="flex h-full max-h-[90vh] flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/30">
          <form id="admin-form" onSubmit={onSubmit} className="space-y-6">
            {children}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <AdminActionButton
            type="button"
            variant="neutralOutline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </AdminActionButton>
          <AdminActionButton
            type="submit"
            form="admin-form"
            variant="brand"
            isLoading={isSubmitting}
            loadingLabel="Saving..."
          >
            {submitLabel}
          </AdminActionButton>
        </div>
      </div>
    </Modal>
  );
}
