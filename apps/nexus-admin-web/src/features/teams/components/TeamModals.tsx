"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, Users } from "lucide-react";
import { Team, TeamInsert, TeamUpdate } from "../types";

// ==========================================
// Modal Wrapper
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl min-w-[320px] sm:min-w-[450px] overflow-hidden rounded-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Team Form Modal (Create / Update)
// ==========================================
interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamInsert | TeamUpdate) => void;
  initialData?: Team;
  isSubmitting: boolean;
}

export function TeamFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: TeamFormModalProps) {
  const [formData, setFormData] = useState<TeamInsert>({
    name: "",
    description: "",
    responsibilities: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        responsibilities: initialData.responsibilities || "",
        parent_team_id: initialData.parent_team_id || undefined,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        responsibilities: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Team" : "Create New Team"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Team Name</label>
          <input
            required
            type="text"
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="e.g. Web Development Team"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Briefly describe what this team does..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Responsibilities</label>
          <textarea
            rows={4}
            className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="List the key responsibilities (one per line)..."
            value={formData.responsibilities || ""}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
          />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Team"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ==========================================
// Team Details Modal (View)
// ==========================================
interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
}

export function TeamDetailsModal({ isOpen, onClose, team }: TeamDetailsModalProps) {
  if (!team) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Details">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded bg-teal-50 text-teal-600">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">ID: {team.id}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-sm border border-gray-100 bg-gray-50/50 p-4">
          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
            <p className="text-sm leading-relaxed text-gray-700">{team.description}</p>
          </div>
          
          {team.responsibilities && (
            <div>
              <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Responsibilities</h4>
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{team.responsibilities}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="mb-3 text-sm font-bold text-gray-900">Members ({team.members?.length || 0})</h4>
          <div className="flex flex-col gap-2">
            {team.members && team.members.length > 0 ? (
              team.members.map((member: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-sm border border-gray-50 bg-white p-2 text-sm shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Users size={14} />
                  </div>
                  <span className="font-medium text-gray-700">{member.name || "Unnamed Member"}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-xs text-gray-400 italic">No members listed for this team.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// Delete Confirmation Modal
// ==========================================
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, isDeleting }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-sm bg-red-50 p-4">
          <div className="shrink-0 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900">Warning: Dangerous Action</p>
            <p className="mt-1 text-sm text-red-700 leading-relaxed">
              Are you sure you want to delete <span className="font-bold underline">"{itemName}"</span>? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-sm bg-red-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
