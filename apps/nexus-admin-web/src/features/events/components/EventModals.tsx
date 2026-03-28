"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, AlertTriangle, Calendar, MapPin, Users, CheckCircle, Plus, Trash2, Edit2, Type, FileText, Star, Image as ImageIcon, Tags, Info, Link2, Hash, Download } from "lucide-react";
import { Event, EventInsert, EventUpdate, EventAttendance } from "../types";
import { useListAttendees } from "../hooks/useListAttendees";
import { useCheckinToEvent } from "../hooks/useCheckinToEvent";
import { useGetBevyEvents } from "@/features/bevy-events/hooks/useGetBevyEvents";
import { useGetBevyEventDetail } from "@/features/bevy-events/hooks/useGetBevyEventDetail";
import { useSearchTeams } from "@/features/teams/api/teams";
import { toast } from "react-toastify";
import { Pagination } from "@/components/admin/Pagination";
import { WireframeUploadImage } from "@/components/wireframeUi/WireframeUploadImage";

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
// Bevy Event Search Modal
// ==========================================
interface BevyEventSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bevyEventId: string) => void;
  isSubmitting: boolean;
}

export function BevyEventSearchModal({ isOpen, onClose, onSelect, isSubmitting }: BevyEventSearchModalProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: bevyEventsResponse, isLoading } = useGetBevyEvents(page, pageSize);

  const bevyEvents = bevyEventsResponse?.data || [];
  const totalPages = bevyEventsResponse?.meta?.totalPages || 1;
  const totalRecords = bevyEventsResponse?.meta?.totalRecords || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Bevy Event">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Select a Bevy event to import its details into a new community event.
        </p>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-teal-600" />
          </div>
        ) : bevyEvents.length > 0 ? (
          <div className="space-y-2">
            <div className="divide-y divide-gray-100 rounded-sm border border-gray-100 bg-white shadow-sm">
              {bevyEvents.map((event: any) => (
                <button
                  key={event.id}
                  disabled={isSubmitting}
                  onClick={() => onSelect(event.id)}
                  className="flex w-full flex-col p-4 text-left hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-gray-900">{event.title}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 uppercase">
                      {event.event_type}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-teal-600" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-teal-600" />
                      <span className="truncate max-w-[150px]">{event.location || "TBA"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalRecords={totalRecords}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar size={32} className="mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No Bevy events found.</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-100 px-8 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// Event Form Modal (Create / Update)
// ==========================================
interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Event | null;
  isSubmitting: boolean;
}

export function EventFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }: EventFormModalProps) {
  const [formData, setFormData] = useState<EventInsert>({
    title: "",
    description: "",
    short_description: null,
    category: "",
    type: null,
    venue: "",
    start_date: "",
    end_date: "",
    attendance_points: 10,
    max_capacity: 999999,
    image_url: null,
    speakers: [],
    tags: [],
    teamId: null,
    bevy_event_id: null,
    bevyPreviewUrl: null,
  });

  const [speakerInput, setSpeakerInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isBevySearchOpen, setIsBevySearchOpen] = useState(false);
  
  // Bevy import detail hook
  const bevyImportMutation = useGetBevyEventDetail();

  // Team search state
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
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

  const setThumbnail = (image: File | undefined) => {
    setFormData({ ...formData, image: image });
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        short_description: initialData.short_description || null,
        category: initialData.category || "",
        type: initialData.type || null,
        venue: initialData.venue || "",
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
        attendance_points: initialData.attendance_points,
        max_capacity: initialData.max_capacity,
        image_url: initialData.image_url,
        speakers: initialData.speakers || [],
        tags: initialData.tags || [],
        teamId: initialData.teamId || null,
        bevy_event_id: initialData.bevy_event_id || null,
        bevyPreviewUrl: initialData.bevyPreviewUrl || null,
      });
      setSelectedTeamName(initialData.teamId ? `Team (${initialData.teamId.substring(0,8)}...)` : "");
    } else {
      setFormData({
        title: "",
        description: "",
        short_description: null,
        category: "",
        type: null,
        venue: "",
        start_date: "",
        end_date: "",
        attendance_points: 10,
        max_capacity: 999999,
        image_url: null,
        speakers: [],
        tags: [],
        teamId: null,
        bevy_event_id: null,
        bevyPreviewUrl: null,
      });
      setSelectedTeamName("");
    }
  }, [initialData, isOpen]);

  const handleAddSpeaker = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && speakerInput.trim()) {
      e.preventDefault();
      if (!formData.speakers.includes(speakerInput.trim())) {
        setFormData(prev => ({ ...prev, speakers: [...prev.speakers, speakerInput.trim()] }));
      }
      setSpeakerInput("");
    }
  };

  const removeSpeaker = (speakerToRemove: string) => {
    setFormData(prev => ({ ...prev, speakers: prev.speakers.filter(s => s !== speakerToRemove) }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSelectTeam = (team: any) => {
    setFormData(prev => ({ ...prev, teamId: team.id }));
    setSelectedTeamName(team.name);
    setShowTeamDropdown(false);
  };

  const handleBevyImport = async (bevyEventId: string) => {
    try {
      const bevyEvent = await bevyImportMutation.mutateAsync(bevyEventId);
      const data = bevyEvent.data;
      
      // Check if this Bevy event is already linked to a Nexus event
      // We can use the events list or a specific check if needed, 
      // but for now let's just populate and let the unique constraint handle the error gracefully on the backend
      // if it's already there. 
      // Actually, we should ensure the ID is a string.
      const stringId = data.id.toString();

      setFormData(prev => ({
        ...prev,
        title: data.title,
        description: data.description || prev.description,
        short_description: data.short_description || prev.short_description,
        category: data.event_type || prev.category,
        venue: data.location || prev.venue,
        start_date: data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : prev.start_date,
        end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : prev.end_date,
        image_url: data.thumbnail_image_url || prev.image_url,
        bevy_event_id: stringId,
        bevyPreviewUrl: data.direct_url,
        tags: [...new Set([...prev.tags, ...(data.tags || [])])],
      }));

      toast.success("Imported details from Bevy successfully!");
      setIsBevySearchOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to import Bevy event");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure dates are in full ISO format for the API
    const submissionData = {
      ...formData,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : "",
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : "",
    };
    
    onSubmit(submissionData);
  };

  const teamResults = teamsResponse?.body?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Event" : "Create New Event"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Bevy Import Trigger */}
          <div className="sm:col-span-2">
             <button
              type="button"
              onClick={() => setIsBevySearchOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-teal-200 bg-teal-50/50 py-4 text-sm font-bold text-teal-700 transition-all hover:bg-teal-50 hover:border-teal-300"
            >
              <Download size={18} />
              Import Details from Bevy Event
            </button>
          </div>

          <WireframeUploadImage image={formData.image} setImage={setThumbnail} />
          
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Event Title</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {formData.bevy_event_id && (
            <div className="sm:col-span-2 rounded-sm bg-blue-50/50 border border-blue-100 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Link2 size={14} />
                Linked to Bevy Event: {formData.bevy_event_id}
              </div>
              {formData.bevyPreviewUrl && (
                <a href={formData.bevyPreviewUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-bold text-blue-600 hover:underline">
                  View Source
                </a>
              )}
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Short Description</label>
            <input
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              placeholder="A brief summary of the event..."
              value={formData.short_description || ""}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value || null })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Full Description</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
            <input
              required
              type="text"
              placeholder="e.g. Workshop, Talk"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Event Type (Internal)</label>
            <input
              type="text"
              placeholder="e.g. Study Jam, Special Event"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.type || ""}
              onChange={(e) => setFormData({ ...formData, type: e.target.value || null })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Venue</label>
            <input
              required
              type="text"
              placeholder="Online or Physical Location"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Max Capacity</label>
            <input
              required
              type="number"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Start Date</label>
            <input
              required
              type="datetime-local"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">End Date</label>
            <input
              required
              type="datetime-local"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Attendance Points</label>
            <input
              required
              type="number"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.attendance_points}
              onChange={(e) => setFormData({ ...formData, attendance_points: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="relative" ref={teamDropdownRef}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Related Team</label>
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
              {formData.teamId && (
                <button 
                  type="button"
                  onClick={() => { setFormData({...formData, teamId: null}); setSelectedTeamName(""); }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-teal-600 hover:text-teal-800"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {showTeamDropdown && teamSearchQuery.length >= 2 && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-gray-100 bg-white shadow-xl">
                {teamResults.length > 0 ? (
                  teamResults.map((team: any) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelectTeam(team)}
                      className="flex w-full flex-col px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm font-bold text-gray-900">{team.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 italic">No teams found.</div>
                )}
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Speakers</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.speakers.map(speaker => (
                <span key={speaker} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {speaker}
                  <button type="button" onClick={() => removeSpeaker(speaker)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded-sm border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
                placeholder="Type speaker name and press Enter..."
                value={speakerInput}
                onChange={(e) => setSpeakerInput(e.target.value)}
                onKeyDown={handleAddSpeaker}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded-sm border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-teal-500"
                placeholder="Type tag and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
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
            {initialData ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>

      <BevyEventSearchModal 
        isOpen={isBevySearchOpen}
        onClose={() => setIsBevySearchOpen(false)}
        onSelect={handleBevyImport}
        isSubmitting={bevyImportMutation.isPending}
      />
    </Modal>
  );
}

// ==========================================
// Event Details Modal (View & Check-in)
// ==========================================
interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export function EventDetailsModal({ isOpen, onClose, event, onEdit, onDelete }: EventDetailsModalProps) {
  const [page, setPage] = useState(1);
  const { data: attendeesResponse, isLoading: isAttendeesLoading } = useListAttendees(event?.id || "", page);
  const checkinMutation = useCheckinToEvent();
  const [attendeeId, setAttendeeId] = useState("");

  if (!event) return null;

  const attendees = attendeesResponse?.data || [];

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeId) return;
    try {
      await checkinMutation.mutateAsync({
        eventId: event.id,
        attendeeId,
        checkinMethod: "MANUAL",
      });
      toast.success("Checked in successfully!");
      setAttendeeId("");
    } catch (err: any) {
      toast.error(err.message || "Failed to check in");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details & Attendance">
      <div className="space-y-6">
        {/* Action Buttons for the Event */}
        <div className="flex justify-end gap-2 border-b border-gray-50 pb-4">
          <button
            onClick={() => onEdit(event)}
            className="flex items-center gap-1.5 rounded-sm bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={14} />
            Edit Event
          </button>
          <button
            onClick={() => onDelete(event)}
            className="flex items-center gap-1.5 rounded-sm bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {event.image_url && (
            <img src={event.image_url} alt={event.title} className="h-32 w-full sm:w-48 object-cover rounded-sm border border-gray-100" />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                {event.category}
              </span>
              {event.type && (
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {event.type}
                </span>
              )}
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center text-xs text-gray-600">
                <Calendar size={14} className="mr-2 text-teal-600" />
                {new Date(event.start_date || "").toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin size={14} className="mr-2 text-teal-600" />
                {event.venue || "No venue specified"}
              </div>
              {event.bevyPreviewUrl && (
                <a 
                  href={event.bevyPreviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:underline"
                >
                  <Link2 size={14} className="mr-2" />
                  View on Bevy
                </a>
              )}
            </div>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {event.speakers && event.speakers.length > 0 && (
          <div className="rounded-sm border border-gray-100 bg-white p-4">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Users size={12} />
              Speakers
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map(speaker => (
                <span key={speaker} className="rounded-sm bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-100">
                  {speaker}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Info size={12} />
            Description
          </h4>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle size={18} className="text-teal-600" />
            Quick Check-in
          </h4>
          <form onSubmit={handleCheckin} className="flex gap-2">
            <input
              required
              value={attendeeId}
              onChange={(e) => setAttendeeId(e.target.value)}
              placeholder="Enter User ID"
              className="flex-1 rounded-sm border border-gray-200 px-4 py-2 text-sm outline-none focus:border-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={checkinMutation.isPending}
              className="rounded-sm bg-teal-600 px-6 py-2 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition-all"
            >
              {checkinMutation.isPending ? "..." : "Check-in"}
            </button>
          </form>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">Attendee History ({event.attendees_count})</h4>
          </div>
          
          <div className="overflow-x-auto rounded-sm border border-gray-50">
            {isAttendeesLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-teal-600" />
              </div>
            ) : attendees.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">User ID</th>
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Method</th>
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {attendees.map((attendee: any) => (
                    <tr key={attendee.id}>
                      <td className="px-4 py-2.5 text-xs font-medium text-gray-900 truncate max-w-[120px]">{attendee.user_id}</td>
                      <td className="px-4 py-2.5 text-[10px] text-gray-600">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-bold uppercase">{attendee.checkin_method}</span>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-gray-500">
                        {new Date(attendee.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-8 text-xs text-gray-400 italic">No attendees checked in yet.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
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
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event">
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
