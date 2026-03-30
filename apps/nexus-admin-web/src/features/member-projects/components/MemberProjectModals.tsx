"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Plus, Trash2, Search, UserPlus, Image as ImageIcon, Upload, ExternalLink, Calendar, Layout, FileText } from "lucide-react";
import { MemberProject, CreateMemberProjectDTO, UpdateMemberProjectDTO } from "../types";
import { useSearchUsers } from "@/features/teams/api/teams";
import Image from "next/image";
import { toast } from "react-toastify";

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
// Project Form Modal (Create / Update)
// ==========================================
interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemberProjectDTO | UpdateMemberProjectDTO, files?: { mainImage?: File; secondaryImage?: File; tertiaryImage?: File }) => void;
  initialData?: MemberProject;
  isSubmitting: boolean;
}

export function ProjectFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ProjectFormModalProps) {
  const [formData, setFormData] = useState<CreateMemberProjectDTO>({
    title: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    memberGdgId: "",
  });

  const [files, setFiles] = useState<{
    mainImage?: File;
    secondaryImage?: File;
    tertiaryImage?: File;
  }>({});

  const [previews, setPreviews] = useState<{
    main?: string | null;
    secondary?: string | null;
    tertiary?: string | null;
  }>({});
  
  // Member search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersResponse, isLoading: isSearching } = useSearchUsers(debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        startDate: new Date(initialData.startDate).toISOString().split('T')[0],
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : null,
        memberGdgId: initialData.memberGdgId,
      });
      setPreviews({
        main: initialData.mainImageUrl,
        secondary: initialData.secondaryImageUrl,
        tertiary: initialData.tertiaryImageUrl,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        memberGdgId: "",
      });
      setPreviews({});
    }
    setFiles({});
    setSearchQuery("");
  }, [initialData, isOpen]);

  const handleFileChange = (type: 'main' | 'secondary' | 'tertiary') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [`${type}Image`]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectUser = (user: any) => {
    setFormData(prev => ({ ...prev, memberGdgId: user.gdg_id }));
    setSearchQuery(user.display_name);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberGdgId) {
      toast.error("Please select a member");
      return;
    }
    onSubmit(formData, files);
  };

  const searchResults = usersResponse?.body?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Project" : "Create New Project"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Project Title</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. GDG Platform Redesign"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Associated Member</label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search member by name..."
                  className="w-full rounded-sm border border-gray-200 py-2.5 pr-10 pl-10 text-sm outline-none transition-all focus:border-teal-500"
                  value={searchQuery || (initialData ? formData.memberGdgId : "")}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                {isSearching && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              
              {showDropdown && searchQuery.length >= 2 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl">
                  {searchResults.length > 0 ? (
                    searchResults.map((user: any) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="flex w-full flex-col px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm font-bold text-gray-900">{user.display_name}</span>
                        <span className="text-xs text-gray-500">{user.gdg_id}</span>
                      </button>
                    ))
                  ) : !isSearching ? (
                    <div className="p-4 text-center text-sm text-gray-500 italic">No matching users found.</div>
                  ) : null}
                </div>
              )}
            </div>
            {formData.memberGdgId && (
              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-teal-600">
                <UserPlus size={12} />
                Selected: {formData.memberGdgId}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Start Date</label>
            <input
              required
              type="date"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">End Date (Optional)</label>
            <input
              type="date"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={formData.endDate || ""}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Provide a detailed description of the project, role, and achievements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Uploads */}
          <div className="md:col-span-2 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Project Gallery</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['main', 'secondary', 'tertiary'] as const).map((imgType) => (
                <div key={imgType} className="space-y-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                    {previews[imgType] ? (
                      <Image src={previews[imgType]!} alt={`${imgType} preview`} fill className="object-cover" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider">
                    <Upload size={14} />
                    {imgType} Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange(imgType)} />
                  </label>
                </div>
              ))}
            </div>
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
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </form>
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
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

// ==========================================
// Project View Modal
// ==========================================
interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: MemberProject | null;
}

export function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details">
      <div className="space-y-6">
        {/* Main Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-sm bg-gray-100 border border-gray-100 shadow-inner">
          {project.mainImageUrl ? (
            <Image src={project.mainImageUrl} alt={project.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Layout size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">
            <Calendar size={14} />
            {new Date(project.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            {project.endDate ? ` — ${new Date(project.endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` : ' — Present'}
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{project.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400 uppercase">
            <UserPlus size={14} />
            Member GDG ID: {project.memberGdgId}
          </div>
        </div>

        <div className="rounded-sm border border-gray-50 bg-gray-50/50 p-5 space-y-6">
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <FileText size={14} />
              Description
            </h4>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>
          
          {/* Gallery */}
          {(project.secondaryImageUrl || project.tertiaryImageUrl) && (
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Project Gallery</h4>
              <div className="grid grid-cols-2 gap-4">
                {project.secondaryImageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-sm border border-gray-100 shadow-sm bg-white">
                    <Image src={project.secondaryImageUrl} alt="Secondary" fill className="object-cover" />
                  </div>
                )}
                {project.tertiaryImageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-sm border border-gray-100 shadow-sm bg-white">
                    <Image src={project.tertiaryImageUrl} alt="Tertiary" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last Updated: {new Date(project.updatedAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-900 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
