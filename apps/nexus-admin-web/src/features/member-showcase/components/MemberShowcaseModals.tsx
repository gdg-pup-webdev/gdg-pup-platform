"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Users, Plus, Trash2, Search, UserPlus, Image as ImageIcon, Upload, ExternalLink, Calendar } from "lucide-react";
import { MemberShowcase, CreateMemberShowcaseDTO, UpdateMemberShowcaseDTO, ShowcasedMember } from "../types";
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
// Showcase Form Modal (Create / Update)
// ==========================================
interface ShowcaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemberShowcaseDTO | UpdateMemberShowcaseDTO, thumbnail?: File) => void;
  initialData?: MemberShowcase;
  isSubmitting: boolean;
}

export function ShowcaseFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ShowcaseFormModalProps) {
  const [formData, setFormData] = useState<CreateMemberShowcaseDTO>({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    articleUrl: "",
    showcasedMembers: [],
  });
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Member search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<ShowcasedMember[]>([]);
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
        date: new Date(initialData.date).toISOString().split('T')[0],
        articleUrl: initialData.articleUrl,
        showcasedMembers: initialData.showcasedMembers.map(m => m.gdgId),
      });
      setPreviewUrl(initialData.thumbnailUrl);
      setSelectedMembers(initialData.showcasedMembers);
    } else {
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        articleUrl: "",
        showcasedMembers: [],
      });
      setPreviewUrl(null);
      setSelectedMembers([]);
    }
    setThumbnail(undefined);
    setSearchQuery("");
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectUser = (user: any) => {
    if (selectedMembers.some(m => m.gdgId === user.gdg_id)) {
      toast.warn("Member already added");
      return;
    }

    const newMember: ShowcasedMember = {
      gdgId: user.gdg_id,
      displayName: user.display_name,
      firstName: user.first_name || user.display_name?.split(' ')[0] || "User",
      lastName: user.last_name || "",
      fullName: user.display_name,
      avatarUrl: user.avatar_url,
      program: user.program || null,
      yearLevel: user.year_level || null,
    };

    const newSelected = [...selectedMembers, newMember];
    setSelectedMembers(newSelected);
    setFormData(prev => ({ ...prev, showcasedMembers: newSelected.map(m => m.gdgId) }));
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeMember = (gdgId: string) => {
    const newSelected = selectedMembers.filter(m => m.gdgId !== gdgId);
    setSelectedMembers(newSelected);
    setFormData(prev => ({ ...prev, showcasedMembers: newSelected.map(m => m.gdgId) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      toast.error("Please add at least one member");
      return;
    }
    if (!initialData && !thumbnail) {
      toast.error("Please upload a thumbnail image");
      return;
    }
    onSubmit(formData, thumbnail);
  };

  const searchResults = usersResponse?.body?.data?.filter((user: any) => 
    !selectedMembers.some(m => m.gdgId === user.gdg_id)
  ) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Showcase" : "Create New Showcase"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Showcase Title</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. Member of the Month - March 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Date</label>
            <input
              required
              type="date"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Article URL</label>
            <input
              required
              type="url"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="https://gdgpup.org/blog/..."
              value={formData.articleUrl}
              onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Describe the achievements of the showcased members..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Showcased Members</label>
            <div className="space-y-3">
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members to add..."
                    className="w-full rounded-sm border border-gray-200 py-2.5 pr-10 pl-10 text-sm outline-none transition-all focus:border-teal-500"
                    value={searchQuery}
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
                          <span className="text-xs text-gray-500">{user.email} ({user.gdg_id})</span>
                        </button>
                      ))
                    ) : !isSearching ? (
                      <div className="p-4 text-center text-sm text-gray-500 italic">
                        No matching users found.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div key={member.gdgId} className="flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 py-1 pl-1.5 pr-2">
                    <div className="relative h-5 w-5 overflow-hidden rounded-full bg-teal-200">
                      {member.avatarUrl ? (
                        <Image src={member.avatarUrl} alt={member.fullName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-teal-700">
                          {member.firstName[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-teal-900">{member.fullName}</span>
                    <button 
                      type="button"
                      onClick={() => removeMember(member.gdgId)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedMembers.length === 0 && (
                  <p className="text-xs text-gray-400 italic py-1">No members selected yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Thumbnail Image</label>
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-sm border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon size={32} />
                )}
              </div>
              <div className="flex-1">
                <p className="mb-3 text-xs text-gray-500 leading-relaxed">
                  Upload a thumbnail image. Recommended size: 800x450 (16:9).
                </p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Upload size={16} />
                  Choose Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
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
            {initialData ? "Save Changes" : "Create Showcase"}
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Showcase">
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
// Showcase View Modal
// ==========================================
interface ShowcaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  showcase: MemberShowcase | null;
}

export function ShowcaseViewModal({ isOpen, onClose, showcase }: ShowcaseViewModalProps) {
  if (!showcase) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Showcase Details">
      <div className="space-y-6">
        <div className="relative h-64 w-full overflow-hidden rounded-sm bg-gray-100 border border-gray-100">
          {showcase.thumbnailUrl ? (
            <Image src={showcase.thumbnailUrl} alt={showcase.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Users size={64} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">
            <Calendar size={14} />
            {new Date(showcase.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{showcase.title}</h3>
        </div>

        <div className="space-y-4 rounded-sm border border-gray-50 bg-gray-50/50 p-5">
          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
            <p className="text-sm leading-relaxed text-gray-700">{showcase.description}</p>
          </div>
          
          <div>
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Showcased Members</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showcase.showcasedMembers.map((member) => (
                <div key={member.gdgId} className="flex items-center gap-3 rounded-sm bg-white p-2 border border-gray-100">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-50 shadow-inner">
                    {member.avatarUrl ? (
                      <Image src={member.avatarUrl} alt={member.fullName} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400 uppercase">
                        {member.firstName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">{member.fullName}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{member.program} - Year {member.yearLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Article Link</h4>
            <a 
              href={showcase.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-sm border border-teal-100 bg-white p-3 text-sm font-medium text-teal-600 transition-all hover:bg-teal-50 hover:shadow-sm"
            >
              <ExternalLink size={18} />
              <span className="truncate">{showcase.articleUrl}</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Created at: {new Date(showcase.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-900 px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
