"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Link2, ExternalLink, Search, Calendar, Users, Info, MapPin, Clock, Edit2, Trash2 } from "lucide-react";
import { LearningResource, CreateLearningResourceDTO, UpdateLearningResourceDTO } from "../types";
import { useSearchTeams } from "@/features/teams/hooks/useTeams";
import { useListEvents } from "@/features/events/hooks/useListEvents";
import Image from "next/image";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ModalActionRow } from "@/components/admin/ModalActionRow";
import {
  AdminFormModal,
  AdminImageUploadField,
  AdminInputField,
  AdminListField,
  AdminTextAreaField,
} from "@/components/admin/form";

// ==========================================
// Resource Form Modal (Create / Update)
// ==========================================
interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLearningResourceDTO | UpdateLearningResourceDTO, thumbnail?: File) => void;
  initialData?: LearningResource;
  isSubmitting: boolean;
}

export function ResourceFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: ResourceFormModalProps) {
  const [formData, setFormData] = useState<CreateLearningResourceDTO>({
    title: "",
    description: "",
    url: "",
    tags: [],
    teamId: null,
    eventId: null,
    thumbnailUrl: null,
  });
  
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Team search state
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  // Event search/list state
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const eventDropdownRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } = useSearchTeams(debouncedTeamSearch);
  const { data: eventsResponse, isLoading: isLoadingEvents } = useListEvents(1, 20);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTeamSearch(teamSearchQuery), 300);
    return () => clearTimeout(timer);
  }, [teamSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target as Node)) {
        setShowEventDropdown(false);
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
        url: initialData.url,
        tags: initialData.tags,
        teamId: initialData.teamId,
        eventId: initialData.eventId,
        thumbnailUrl: initialData.thumbnailUrl,
      });
      setPreviewUrl(initialData.thumbnailUrl);
      setSelectedTeamName(initialData.team?.name || (initialData.teamId ? `Team (${initialData.teamId.substring(0,8)}...)` : ""));
      setSelectedEventTitle(initialData.event?.title || (initialData.eventId ? `Event (${initialData.eventId.substring(0,8)}...)` : ""));
    } else {
      setFormData({
        title: "",
        description: "",
        url: "",
        tags: [],
        teamId: null,
        eventId: null,
        thumbnailUrl: null,
      });
      setPreviewUrl(null);
      setSelectedTeamName("");
      setSelectedEventTitle("");
    }
    setThumbnail(undefined);
  }, [initialData, isOpen]);

  const handleThumbnailChange = (file: File | null, nextPreviewUrl: string | null) => {
    setThumbnail(file || undefined);
    setPreviewUrl(nextPreviewUrl);
  };

  const handleSelectTeam = (team: any) => {
    setFormData(prev => ({ ...prev, teamId: team.id }));
    setSelectedTeamName(team.name);
    setShowTeamDropdown(false);
  };

  const handleSelectEvent = (event: any) => {
    setFormData(prev => ({ ...prev, eventId: event.id }));
    setSelectedEventTitle(event.title);
    setShowEventDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, thumbnail);
  };

  const teamResults = teamsResponse?.body?.data || [];
  const eventResults = eventsResponse?.data || [];

  return (
    <AdminFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Update Resource" : "Create New Resource"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? "Save Changes" : "Create Resource"}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminInputField
            label="Resource Title"
            required
            type="text"
            placeholder="e.g. Intro to React"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <AdminInputField
            label="Resource URL"
            required
            type="url"
            placeholder="https://..."
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <AdminTextAreaField
            label="Description"
            required
            rows={3}
            placeholder="Briefly describe this resource..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Related Team (Optional)</label>
          <div className="relative" ref={teamDropdownRef}>
            <div className="relative">
              <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search team..."
                className={`w-full rounded-sm border py-2.5 pr-10 pl-10 text-sm outline-none transition-all ${
                  formData.teamId ? "border-teal-500 bg-teal-50/30" : "border-gray-200 bg-white"
                }`}
                value={formData.teamId ? selectedTeamName : teamSearchQuery}
                onChange={(e) => {
                  setTeamSearchQuery(e.target.value);
                  if (!formData.teamId) setShowTeamDropdown(true);
                }}
                onFocus={() => !formData.teamId && setShowTeamDropdown(true)}
                readOnly={!!formData.teamId}
              />
              {formData.teamId ? (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, teamId: null });
                    setSelectedTeamName("");
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-teal-600 hover:text-teal-800"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>

            {showTeamDropdown && teamSearchQuery.length >= 2 ? (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl">
                {teamResults.length > 0 ? (
                  teamResults.map((team: any) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team)}
                      className="flex w-full flex-col border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-teal-50"
                    >
                      <span className="text-sm font-bold text-gray-900">{team.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm italic text-gray-500">No teams found.</div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Related Event (Optional)</label>
          <div className="relative" ref={eventDropdownRef}>
            <div className="relative">
              <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Select event..."
                className={`w-full rounded-sm border py-2.5 pr-10 pl-10 text-sm outline-none transition-all ${
                  formData.eventId ? "border-teal-500 bg-teal-50/30" : "border-gray-200 bg-white"
                }`}
                value={formData.eventId ? selectedEventTitle : ""}
                onClick={() => !formData.eventId && setShowEventDropdown(true)}
                readOnly
              />
              {formData.eventId ? (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, eventId: null });
                    setSelectedEventTitle("");
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-teal-600 hover:text-teal-800"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>

            {showEventDropdown ? (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl">
                {eventResults.length > 0 ? (
                  eventResults.map((event: any) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleSelectEvent(event)}
                      className="flex w-full flex-col border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-teal-50"
                    >
                      <span className="text-sm font-bold text-gray-900">{event.title}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm italic text-gray-500">No events found.</div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-2">
          <AdminListField
            label="Tags"
            items={formData.tags}
            onChange={(items) => setFormData((prev) => ({ ...prev, tags: items }))}
            placeholder="Add a tag and press Enter..."
            helperText="Used for filtering and quick discovery."
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <AdminImageUploadField
            label="Thumbnail"
            previewUrl={previewUrl}
            onImageChange={handleThumbnailChange}
            helperText="Upload a thumbnail image for this resource. Recommended size: 800x450 (16:9)."
          />

          <AdminInputField
            label="Thumbnail URL (Optional)"
            type="text"
            placeholder="Or paste a thumbnail URL manually..."
            value={formData.thumbnailUrl || ""}
            onChange={(e) => {
              const val = e.target.value || null;
              setFormData({ ...formData, thumbnailUrl: val });
              if (!thumbnail) setPreviewUrl(val);
            }}
          />
        </div>
      </div>
    </AdminFormModal>
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
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isConfirming={isDeleting}
      title="Delete Resource"
      confirmLabel="Confirm Delete"
      description={
        <>
          <p className="text-sm font-bold text-red-900">Warning: Dangerous Action</p>
          <p className="mt-1">
            Are you sure you want to delete <span className="font-bold underline">"{itemName}"</span>? This action is permanent and cannot be undone.
          </p>
        </>
      }
    />
  );
}

// ==========================================
// Resource View Modal
// ==========================================
interface ResourceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
  onEdit: (resource: LearningResource) => void;
  onDelete: (resource: LearningResource) => void;
}

export function ResourceViewModal({ isOpen, onClose, resource, onEdit, onDelete }: ResourceViewModalProps) {
  if (!resource) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resource Details">
      <div className="space-y-6">
        <ModalActionRow
          actions={[
            {
              key: "visit-link",
              label: "Visit Link",
              icon: ExternalLink,
              onClick: () => {
                window.open(resource.url, "_blank", "noopener,noreferrer");
              },
            },
            {
              key: "edit",
              label: "Edit Resource",
              icon: Edit2,
              onClick: () => {
                onClose();
                onEdit(resource);
              },
            },
            {
              key: "delete",
              label: "Delete",
              icon: Trash2,
              tone: "danger",
              onClick: () => {
                onClose();
                onDelete(resource);
              },
            },
          ]}
        />

        <div className="relative h-64 w-full overflow-hidden rounded-sm bg-gray-100 border border-gray-100">
          {resource.thumbnailUrl ? (
            <Image src={resource.thumbnailUrl} alt={resource.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Link2 size={64} />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">{resource.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {resource.tags.map(tag => (
              <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resource.team && (
            <div className="flex flex-col gap-2 rounded-sm border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 text-teal-600">
                <Users size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Related Team</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{resource.team.name}</h4>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{resource.team.description}</p>
              </div>
            </div>
          )}

          {resource.event && (
            <div className="flex flex-col gap-2 rounded-sm border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 text-teal-600">
                <Calendar size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">Related Event</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{resource.event.title}</h4>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                  <Clock size={10} />
                  <span>{resource.event.startDate ? new Date(resource.event.startDate).toLocaleDateString() : "TBD"}</span>
                  {resource.event.venue && (
                    <>
                      <MapPin size={10} className="ml-1" />
                      <span className="truncate">{resource.event.venue}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-sm border border-gray-100 bg-gray-50/50 p-5">
          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Info size={12} />
              Description
            </h4>
            <p className="text-sm leading-relaxed text-gray-700">{resource.description}</p>
          </div>
          
          <div className="pt-2">
            <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Link2 size={12} />
              Resource Link
            </h4>
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-sm border border-teal-100 bg-white p-3 text-sm font-medium text-teal-600 transition-all hover:bg-teal-50 hover:shadow-sm"
            >
              <ExternalLink size={18} />
              <span className="truncate">{resource.url}</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
            Created: {new Date(resource.createdAt).toLocaleDateString()}
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
