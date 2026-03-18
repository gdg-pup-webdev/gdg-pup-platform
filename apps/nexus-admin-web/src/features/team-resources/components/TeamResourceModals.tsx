"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Link2, ExternalLink, Image as ImageIcon, Upload, Search, Users } from "lucide-react";
import { TeamResource, CreateTeamResourceDTO, UpdateTeamResourceDTO } from "../types";
import { useSearchTeams } from "@/features/teams/api/teams";
import Image from "next/image";

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
// Resource Form Modal (Create / Update)
// ==========================================
interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamResourceDTO | UpdateTeamResourceDTO, thumbnail?: File) => void;
  initialData?: TeamResource;
  isSubmitting: boolean;
}

export function ResourceFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ResourceFormModalProps) {
  const [formData, setFormData] = useState<CreateTeamResourceDTO>({
    title: "",
    description: "",
    resource_link: "",
    resource_type: "",
    team_name: "",
  });
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Team search state
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{ id: string; name: string } | null>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTeamSearch(teamSearchQuery), 300);
    return () => clearTimeout(timer);
  }, [teamSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        resource_link: initialData.resource_link,
        resource_type: initialData.resource_type,
        team_name: initialData.team_name,
      });
      setPreviewUrl(initialData.thumbnail_public_url);
      setTeamSearchQuery(initialData.team_name);
      setSelectedTeam({ id: "", name: initialData.team_name }); // ID not strictly needed for just the name display
    } else {
      setFormData({
        title: "",
        description: "",
        resource_link: "",
        resource_type: "",
        team_name: "",
      });
      setPreviewUrl(null);
      setTeamSearchQuery("");
      setSelectedTeam(null);
    }
    setThumbnail(undefined);
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

  const handleSelectTeam = (team: any) => {
    setSelectedTeam({ id: team.id, name: team.name });
    setTeamSearchQuery(team.name);
    setFormData(prev => ({ ...prev, team_name: team.name }));
    setShowTeamDropdown(false);
  };

  const clearTeamSelection = () => {
    setSelectedTeam(null);
    setTeamSearchQuery("");
    setFormData(prev => ({ ...prev, team_name: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_name) {
      alert("Please select a team");
      return;
    }
    onSubmit(formData, thumbnail);
  };

  const searchResults = teamsResponse?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Resource" : "Create New Resource"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Resource Title</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. Design Guidelines v1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Managing Team</label>
            <div className="relative" ref={teamDropdownRef}>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Search and select a team..."
                  className={`w-full rounded-sm border py-2.5 pr-10 pl-10 text-sm outline-none transition-all ${
                    selectedTeam ? "border-teal-500 bg-teal-50/30 font-bold text-teal-900" : "border-gray-200 bg-white"
                  }`}
                  value={teamSearchQuery}
                  onChange={(e) => {
                    setTeamSearchQuery(e.target.value);
                    if (!selectedTeam) setShowTeamDropdown(true);
                  }}
                  onFocus={() => !selectedTeam && setShowTeamDropdown(true)}
                  readOnly={!!selectedTeam}
                />
                {selectedTeam ? (
                  <button 
                    type="button"
                    onClick={clearTeamSelection}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-teal-600 hover:text-teal-800"
                  >
                    <X size={16} />
                  </button>
                ) : isSearchingTeams ? (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                ) : null}
              </div>
              
              {showTeamDropdown && teamSearchQuery.length >= 2 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95">
                  {searchResults.length > 0 ? (
                    searchResults.map((team: any) => (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => handleSelectTeam(team)}
                        className="flex w-full flex-col px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm font-bold text-gray-900">{team.name}</span>
                        <span className="text-xs text-gray-500 line-clamp-1">{team.description}</span>
                      </button>
                    ))
                  ) : !isSearchingTeams ? (
                    <div className="p-4 text-center text-sm text-gray-500 italic">
                      No matching teams found.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Resource Type</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. Documentation, Tool, Asset"
              value={formData.resource_type}
              onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Resource Link</label>
            <input
              required
              type="url"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="https://docs.google.com/..."
              value={formData.resource_link}
              onChange={(e) => setFormData({ ...formData, resource_link: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Briefly describe this resource..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
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
                  Upload a thumbnail image for this resource. Recommended size: 800x450 (16:9).
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
            {initialData ? "Save Changes" : "Create Resource"}
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Resource">
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
// Resource View Modal
// ==========================================
interface ResourceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: TeamResource | null;
}

export function ResourceViewModal({ isOpen, onClose, resource }: ResourceViewModalProps) {
  if (!resource) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resource Details">
      <div className="space-y-6">
        <div className="relative h-64 w-full overflow-hidden rounded-sm bg-gray-100 border border-gray-100">
          {resource.thumbnail_public_url ? (
            <Image src={resource.thumbnail_public_url} alt={resource.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Link2 size={64} />
            </div>
          )}
          <div className="absolute top-4 left-4 rounded bg-teal-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            {resource.resource_type}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">{resource.title}</h3>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mt-1">Managed by {resource.team_name}</p>
        </div>

        <div className="space-y-4 rounded-sm border border-gray-50 bg-gray-50/50 p-5">
          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
            <p className="text-sm leading-relaxed text-gray-700">{resource.description}</p>
          </div>
          
          <div className="pt-2">
            <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Resource Link</h4>
            <a 
              href={resource.resource_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-sm border border-teal-100 bg-white p-3 text-sm font-medium text-teal-600 transition-all hover:bg-teal-50 hover:shadow-sm"
            >
              <ExternalLink size={18} />
              <span className="truncate">{resource.resource_link}</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Created at: {new Date(resource.created_at).toLocaleDateString()}
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
