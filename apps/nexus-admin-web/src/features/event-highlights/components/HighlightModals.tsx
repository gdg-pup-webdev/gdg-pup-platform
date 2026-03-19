"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, Calendar, User, Info, Edit2, Trash2, Image as ImageIcon, Type, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EventHighlight, EventHighlightInsert, EventHighlightUpdate } from "../types";
import { useListEvents } from "@/features/events/hooks/useListEvents";

// ==========================================
// Modal Wrapper (Mirroring EventModals)
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
      <div className="relative w-full max-w-2xl min-w-[320px] sm:min-w-[450px] overflow-hidden rounded-sm bg-white shadow-2xl">
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
// Highlight Form Modal (Create / Update)
// ==========================================
interface HighlightFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: EventHighlight | null;
  isSubmitting: boolean;
}

export function HighlightFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: HighlightFormModalProps) {
  const [formData, setFormData] = useState<EventHighlightInsert>({
    title: "",
    description: "",
    content: "",
    image_url: null,
    author_id: "",
    event_id: "",
  });

  const { data: eventsResponse, isLoading: isEventsLoading } = useListEvents(1, 100);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        content: initialData.content,
        image_url: initialData.image_url || null,
        author_id: initialData.author_id,
        event_id: initialData.event_id,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        image_url: null,
        author_id: "",
        event_id: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Highlight" : "Create Highlight"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Title</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Event</label>
            <select
              required
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.event_id}
              onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
            >
              <option value="">Select an event</option>
              {eventsResponse?.data.map((event: any) => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Author ID</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              placeholder="UUID or ID"
              value={formData.author_id}
              onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Content (Markdown)</label>
            <textarea
              required
              rows={8}
              className="w-full font-mono rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.content}
              placeholder="# Use Markdown here..."
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Image URL</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value || null })}
            />
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
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-sm bg-[#0B1F3B] px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0B1F3B]/90 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Highlight"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ==========================================
// Highlight Details Modal
// ==========================================
interface HighlightDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlight: EventHighlight | null;
  onEdit: (highlight: EventHighlight) => void;
  onDelete: (highlight: EventHighlight) => void;
}

export function HighlightDetailsModal({ isOpen, onClose, highlight, onEdit, onDelete }: HighlightDetailsModalProps) {
  if (!highlight) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Highlight Details">
      <div className="space-y-6">
        <div className="flex justify-end gap-2 border-b border-gray-50 pb-4">
          <button
            onClick={() => onEdit(highlight)}
            className="flex items-center gap-1.5 rounded-sm bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(highlight)}
            className="flex items-center gap-1.5 rounded-sm bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        <div className="space-y-4">
          {highlight.image_url && (
            <img 
              src={highlight.image_url} 
              alt={highlight.title} 
              className="w-full h-48 sm:h-64 object-cover rounded-sm border border-gray-100" 
            />
          )}
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{highlight.title}</h3>
            <p className="mt-2 text-sm text-gray-500 italic border-l-4 border-teal-500 pl-4">
              {highlight.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600" />
              {new Date(highlight.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-teal-600" />
              Author: {highlight.author_id}
            </div>
          </div>

          <div className="prose prose-sm max-w-none rounded-sm border border-gray-100 bg-gray-50 p-6">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
               {highlight.content}
             </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-8 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Highlight">
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
