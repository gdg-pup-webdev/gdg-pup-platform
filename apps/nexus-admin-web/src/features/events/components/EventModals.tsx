"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit2,
  Type,
  FileText,
  Star,
  Image as ImageIcon,
  Tags,
  Info,
  Link2,
  Hash,
  Download,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Event, EventInsert, EventUpdate, EventAttendance } from "../types";
import { useListAttendees } from "../hooks/useListAttendees";
import { useCheckinToEvent } from "../hooks/useCheckinToEvent";
import { useGetBevyEvents } from "@/features/bevy-events/hooks/useGetBevyEvents";
import { useGetBevyEventDetail } from "@/features/bevy-events/hooks/useGetBevyEventDetail";
import { useSearchTeams } from "@/features/teams/hooks/useTeams";
import { toast } from "react-toastify";
import { WireframeUploadImage } from "@/components/wireframeUi/WireframeUploadImage";
import { FeatureModal as Modal } from "@/components/ui/FeatureModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AdminPaginationSection } from "@/components/admin/AdminPaginationSection";
import { ModalActionRow } from "@/components/admin/ModalActionRow";
import { AdminFormModal, AdminInputField, AdminListField, AdminTextAreaField } from "@/components/admin/form";

const MAX_EVENT_HIGHLIGHT_IMAGES = 20;

const getFileSignature = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${file.type}`;

const dedupeFiles = (files: File[]): File[] => {
  const seen = new Set<string>();
  const unique: File[] = [];

  for (const file of files) {
    const signature = getFileSignature(file);
    if (seen.has(signature)) {
      continue;
    }

    seen.add(signature);
    unique.push(file);
  }

  return unique;
};

const arrayMoveLocal = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);

  if (moved === undefined) {
    return items;
  }

  next.splice(toIndex, 0, moved);
  return next;
};

const PendingHighlightImagePreview = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => {
      setPreviewUrl(null);
    };
    reader.readAsDataURL(file);

    return () => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  return (
    <div className="rounded-sm border border-gray-100 bg-gray-50 p-2">
      <div className="relative h-28 overflow-hidden rounded-sm border border-gray-200 bg-white">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            Preview unavailable
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 rounded-full border border-white/50 bg-black/70 p-1 text-white transition-colors hover:bg-red-500"
          title="Remove queued image"
          aria-label={`Remove queued image ${file.name}`}
        >
          <X size={13} />
        </button>
      </div>
      <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-widest text-gray-500">
        Queued: {file.name}
      </p>
    </div>
  );
};

// ==========================================
// Bevy Event Search Modal
// ==========================================
interface BevyEventSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bevyEventId: string) => void;
  isSubmitting: boolean;
}

export function BevyEventSearchModal({
  isOpen,
  onClose,
  onSelect,
  isSubmitting,
}: BevyEventSearchModalProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data: bevyEventsResponse, isLoading } = useGetBevyEvents(
    page,
    pageSize,
  );

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
                    <span className="text-sm font-bold text-gray-900">
                      {event.title}
                    </span>
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
                      <span className="max-w-37.5 truncate">
                        {event.location || "TBA"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <AdminPaginationSection
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

export function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: EventFormModalProps) {
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
    images: [],
    speakers: [],
    tags: [],
    teamId: null,
    bevy_event_id: null,
    bevyPreviewUrl: null,
  });

  const [isBevySearchOpen, setIsBevySearchOpen] = useState(false);

  // Bevy import detail hook
  const bevyImportMutation = useGetBevyEventDetail();

  // Team search state
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [debouncedTeamSearch, setDebouncedTeamSearch] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  const { data: teamsResponse, isLoading: isSearchingTeams } =
    useSearchTeams(debouncedTeamSearch);

  const [selectedThumbnailPreviewUrl, setSelectedThumbnailPreviewUrl] =
    useState<string | null>(null);
  const [pendingHighlightImageFiles, setPendingHighlightImageFiles] =
    useState<File[]>([]);
  const [originalHighlightImages, setOriginalHighlightImages] =
    useState<string[]>([]);

  const highlightImages = formData.images || [];
  const totalQueuedHighlights =
    highlightImages.length + pendingHighlightImageFiles.length;
  const remainingHighlightSlots = Math.max(
    0,
    MAX_EVENT_HIGHLIGHT_IMAGES - totalQueuedHighlights,
  );
  const mainImagePreviewUrl =
    selectedThumbnailPreviewUrl ||
    formData.image_url?.trim() ||
    highlightImages[0] ||
    null;

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedTeamSearch(teamSearchQuery),
      300,
    );
    return () => clearTimeout(timer);
  }, [teamSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTeamDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setThumbnail = (image: File | undefined) => {
    setFormData((prev) => ({ ...prev, image }));
  };

  useEffect(() => {
    if (!formData.image) {
      setSelectedThumbnailPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.image);
    setSelectedThumbnailPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.image]);

  useEffect(() => {
    if (initialData) {
      const currentImageUrl =
        (typeof initialData.image_url === "string" &&
        initialData.image_url.trim().length > 0
          ? initialData.image_url.trim()
          : null) ||
        initialData.images?.find(
          (imageUrl) =>
            typeof imageUrl === "string" && imageUrl.trim().length > 0,
        ) ||
        null;

      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        short_description: initialData.short_description || null,
        category: initialData.category || "",
        type: initialData.type || null,
        venue: initialData.venue || "",
        start_date: initialData.start_date
          ? new Date(initialData.start_date).toISOString().slice(0, 16)
          : "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().slice(0, 16)
          : "",
        attendance_points: initialData.attendance_points,
        max_capacity: initialData.max_capacity,
        image_url: currentImageUrl,
        images: initialData.images || [],
        speakers: initialData.speakers || [],
        tags: initialData.tags || [],
        teamId: initialData.teamId || null,
        bevy_event_id: initialData.bevy_event_id || null,
        bevyPreviewUrl: initialData.bevyPreviewUrl || null,
      });
      setOriginalHighlightImages(initialData.images || []);
      setPendingHighlightImageFiles([]);
      setSelectedTeamName(
        initialData.teamId
          ? `Team (${initialData.teamId.substring(0, 8)}...)`
          : "",
      );
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
        images: [],
        speakers: [],
        tags: [],
        teamId: null,
        bevy_event_id: null,
        bevyPreviewUrl: null,
      });
      setOriginalHighlightImages([]);
      setPendingHighlightImageFiles([]);
      setSelectedTeamName("");
    }
  }, [initialData, isOpen]);

  const handleSelectTeam = (team: any) => {
    setFormData((prev) => ({ ...prev, teamId: team.id }));
    setSelectedTeamName(team.name);
    setShowTeamDropdown(false);
  };

  const handleUploadHighlightImages = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.currentTarget.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    if (remainingHighlightSlots <= 0) {
      toast.error("You can only add up to 20 highlight images.");
      return;
    }

    const maxPendingAllowed = Math.max(
      0,
      MAX_EVENT_HIGHLIGHT_IMAGES - highlightImages.length,
    );
    const nextPendingFiles = dedupeFiles([
      ...pendingHighlightImageFiles,
      ...selectedFiles,
    ]).slice(0, maxPendingAllowed);

    if (selectedFiles.length > nextPendingFiles.length - pendingHighlightImageFiles.length) {
      toast.info(
        "Some files were skipped due to duplicates or the 20-image limit.",
      );
    }

    setPendingHighlightImageFiles(nextPendingFiles);
  };

  const handleRemoveHighlightImage = (imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== imageIndex),
    }));
  };

  const handleMoveHighlightImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    if (toIndex < 0 || toIndex >= highlightImages.length) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: arrayMoveLocal(prev.images || [], fromIndex, toIndex),
    }));
  };

  const handleRemoveQueuedHighlightImage = (fileIndex: number) => {
    setPendingHighlightImageFiles((prev) =>
      prev.filter((_, index) => index !== fileIndex),
    );
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

      setFormData((prev) => ({
        ...prev,
        title: data.title,
        description: data.description || prev.description,
        short_description: data.short_description || prev.short_description,
        category: data.event_type || prev.category,
        venue: data.location || prev.venue,
        start_date: data.start_date
          ? new Date(data.start_date).toISOString().slice(0, 16)
          : prev.start_date,
        end_date: data.end_date
          ? new Date(data.end_date).toISOString().slice(0, 16)
          : prev.end_date,
        image_url: data.cover_image_url || prev.image_url,
        bevy_event_id: stringId,
        bevyPreviewUrl: data.bevy_url || null,
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

    const normalizedHighlights = (formData.images || [])
      .map((imageUrl) => imageUrl.trim())
      .filter((imageUrl) => imageUrl.length > 0);
    const normalizedQueuedFiles = dedupeFiles(pendingHighlightImageFiles);

    if (
      normalizedHighlights.length + normalizedQueuedFiles.length >
      MAX_EVENT_HIGHLIGHT_IMAGES
    ) {
      toast.error("You can only add up to 20 highlight images.");
      return;
    }

    if (normalizedHighlights.length > MAX_EVENT_HIGHLIGHT_IMAGES) {
      toast.error("You can only add up to 20 highlight images.");
      return;
    }

    // Ensure dates are in full ISO format for the API
    const submissionData = {
      ...formData,
      image_url: formData.image_url?.trim() || null,
      images: normalizedHighlights,
      highlightImageFiles: normalizedQueuedFiles,
      originalHighlightImages,
      start_date: formData.start_date
        ? new Date(formData.start_date).toISOString()
        : "",
      end_date: formData.end_date
        ? new Date(formData.end_date).toISOString()
        : "",
    };

    onSubmit(submissionData);
  };

  const teamResults = teamsResponse?.body?.data || [];

  return (
    <>
      <AdminFormModal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Update Event" : "Create New Event"}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={initialData ? "Save Changes" : "Create Event"}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setIsBevySearchOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-teal-200 bg-teal-50/50 py-4 text-sm font-bold text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50"
            >
              <Download size={18} />
              Import Details from Bevy Event
            </button>
          </div>

          <WireframeUploadImage image={formData.image} setImage={setThumbnail} />

          <div className="sm:col-span-2">
            <AdminInputField
              label="Main Image URL"
              type="url"
              placeholder="https://example.com/event-main-image.jpg"
              value={formData.image_url || ""}
              helperText="Used for the event thumbnail/pubmat. Uploading a thumbnail file overrides this URL."
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  image_url: e.target.value || null,
                }))
              }
            />
          </div>

          <div className="sm:col-span-2 rounded-sm border border-gray-100 bg-gray-50/50 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <ImageIcon size={12} />
              Current Main Image Preview
            </div>
            {mainImagePreviewUrl ? (
              <img
                src={mainImagePreviewUrl}
                alt="Current main image preview"
                className="h-42 w-full rounded-sm border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-42 w-full items-center justify-center rounded-sm border border-dashed border-gray-200 bg-white text-xs text-gray-500">
                No image to preview yet.
              </div>
            )}
            <p className="mt-2 text-[11px] text-gray-500">
              Preview priority: uploaded thumbnail, main image URL, then the first highlight image.
            </p>
          </div>

          <div className="sm:col-span-2">
            <AdminInputField
              label="Event Title"
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {formData.bevy_event_id ? (
            <div className="sm:col-span-2 flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/50 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Link2 size={14} />
                Linked to Bevy Event: {formData.bevy_event_id}
              </div>
              {formData.bevyPreviewUrl ? (
                <a
                  href={formData.bevyPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase text-blue-600 hover:underline"
                >
                  View Source
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="sm:col-span-2">
            <AdminInputField
              label="Short Description"
              type="text"
              placeholder="A brief summary of the event..."
              value={formData.short_description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  short_description: e.target.value || null,
                })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <AdminTextAreaField
              label="Full Description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <AdminInputField
            label="Category"
            required
            type="text"
            placeholder="e.g. Workshop, Talk"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <AdminInputField
            label="Event Type (Internal)"
            type="text"
            placeholder="e.g. Study Jam, Special Event"
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value || null })}
          />

          <AdminInputField
            label="Venue"
            required
            type="text"
            placeholder="Online or Physical Location"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />

          <AdminInputField
            label="Max Capacity"
            required
            type="number"
            value={formData.max_capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_capacity: parseInt(e.target.value, 10) || 0,
              })
            }
          />

          <AdminInputField
            label="Start Date"
            required
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />

          <AdminInputField
            label="End Date"
            required
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />

          <AdminInputField
            label="Attendance Points"
            required
            type="number"
            value={formData.attendance_points}
            onChange={(e) =>
              setFormData({
                ...formData,
                attendance_points: parseInt(e.target.value, 10) || 0,
              })
            }
          />

          <div className="relative" ref={teamDropdownRef}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">
              Related Team
            </label>
            <div className="relative">
              <Users className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search team..."
                className={`w-full rounded-sm border py-2.5 pl-10 pr-10 text-sm outline-none transition-all ${
                  formData.teamId
                    ? "border-teal-500 bg-teal-50/30"
                    : "border-gray-200 bg-white"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800"
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

          <div className="sm:col-span-2">
            <AdminListField
              label="Speakers"
              items={formData.speakers}
              onChange={(items) => setFormData((prev) => ({ ...prev, speakers: items }))}
              placeholder="Add a speaker and press Enter..."
            />
          </div>

          <div className="sm:col-span-2">
            <AdminListField
              label="Tags"
              items={formData.tags}
              onChange={(items) => setFormData((prev) => ({ ...prev, tags: items }))}
              placeholder="Add a tag and press Enter..."
            />
          </div>

          <div className="sm:col-span-2">
            <div className="rounded-sm border border-gray-100 bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                  Highlight Images
                </label>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  {totalQueuedHighlights}/{MAX_EVENT_HIGHLIGHT_IMAGES}
                </span>
              </div>

              <input
                id="event-highlight-image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadHighlightImages}
                disabled={isSubmitting || remainingHighlightSlots === 0}
              />

              <label
                htmlFor="event-highlight-image-upload"
                className={`mb-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed py-3 text-sm font-bold transition-all ${
                  isSubmitting || remainingHighlightSlots === 0
                    ? "pointer-events-none border-gray-200 bg-gray-100 text-gray-400"
                    : "border-teal-200 bg-teal-50/50 text-teal-700 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                <Plus size={16} />
                {remainingHighlightSlots === 0
                  ? "Maximum highlight images reached"
                  : "Add Highlight Images"}
              </label>

              <p className="mb-3 text-[11px] text-gray-500">
                New files are queued locally and uploaded one-by-one only after you click Save.
              </p>

              {highlightImages.length > 0 ? (
                <>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Existing Highlights
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {highlightImages.map((imageUrl, imageIndex) => (
                      <div
                        key={`${imageUrl}-${imageIndex}`}
                        className="rounded-sm border border-gray-100 bg-gray-50 p-2"
                      >
                        <div className="relative h-28 overflow-hidden rounded-sm border border-gray-200 bg-white">
                          <img
                            src={imageUrl}
                            alt={`Highlight image ${imageIndex + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlightImage(imageIndex)}
                            disabled={isSubmitting}
                            className="absolute top-1.5 right-1.5 rounded-full border border-white/50 bg-black/70 p-1 text-white transition-colors hover:bg-red-500 disabled:opacity-60"
                            title="Remove image"
                            aria-label={`Remove highlight image ${imageIndex + 1}`}
                          >
                            <X size={13} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            Position {imageIndex + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveHighlightImage(imageIndex, imageIndex - 1)}
                              disabled={isSubmitting || imageIndex === 0}
                              className="rounded-sm border border-gray-200 bg-white p-1 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800 disabled:opacity-40"
                              title="Move up"
                              aria-label={`Move highlight image ${imageIndex + 1} up`}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveHighlightImage(imageIndex, imageIndex + 1)}
                              disabled={isSubmitting || imageIndex === highlightImages.length - 1}
                              className="rounded-sm border border-gray-200 bg-white p-1 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-800 disabled:opacity-40"
                              title="Move down"
                              aria-label={`Move highlight image ${imageIndex + 1} down`}
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {pendingHighlightImageFiles.length > 0 ? (
                <>
                  <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Queued Uploads
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingHighlightImageFiles.map((file, fileIndex) => (
                      <PendingHighlightImagePreview
                        key={`${file.name}-${file.lastModified}-${fileIndex}`}
                        file={file}
                        onRemove={() => handleRemoveQueuedHighlightImage(fileIndex)}
                      />
                    ))}
                  </div>
                </>
              ) : null}

              {highlightImages.length === 0 && pendingHighlightImageFiles.length === 0 ? (
                <div className="rounded-sm border border-dashed border-gray-200 bg-gray-50/60 px-4 py-6 text-center text-xs text-gray-500">
                  No highlight images yet. Add images now and they will upload when you save.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </AdminFormModal>

      <BevyEventSearchModal
        isOpen={isBevySearchOpen}
        onClose={() => setIsBevySearchOpen(false)}
        onSelect={handleBevyImport}
        isSubmitting={bevyImportMutation.isPending}
      />
    </>
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
  onSync: (event: Event) => void | Promise<void>;
  isSyncing?: boolean;
}

export function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  onSync,
  isSyncing = false,
}: EventDetailsModalProps) {
  const [page, setPage] = useState(1);
  const { data: attendeesResponse, isLoading: isAttendeesLoading } =
    useListAttendees(event?.id || "", page);
  const checkinMutation = useCheckinToEvent();
  const [attendeeId, setAttendeeId] = useState("");

  if (!event) return null;

  const attendees = attendeesResponse?.data || [];
  const mainImage = event.image_url || event.images?.[0] || null;

  const eventActions = [
    ...(event.bevyPreviewUrl
      ? [
          {
            key: "open-bevy-page",
            label: "Open Bevy Page",
            icon: ExternalLink,
            onClick: () => {
              window.open(event.bevyPreviewUrl as string, "_blank", "noopener,noreferrer");
            },
          },
        ]
      : []),
    {
      key: "sync",
      label: "Sync with Bevy",
      loadingLabel: "Syncing...",
      icon: RefreshCw,
      onClick: () => {
        void onSync(event);
      },
      isLoading: isSyncing,
    },
    {
      key: "edit",
      label: "Edit Event",
      icon: Edit2,
      onClick: () => onEdit(event),
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      tone: "danger" as const,
      onClick: () => onDelete(event),
    },
  ];

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
        <ModalActionRow
          actions={eventActions}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {mainImage && (
            <img
              src={mainImage}
              alt={event.title}
              className="h-32 w-full sm:w-48 object-cover rounded-sm border border-gray-100"
            />
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
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-teal-600 uppercase tracking-widest"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {event.images && event.images.length > 0 && (
          <div className="text-xs font-semibold text-gray-600">
            Highlight Images: {event.images.length}
          </div>
        )}

        {event.speakers && event.speakers.length > 0 && (
          <div className="rounded-sm border border-gray-100 bg-white p-4">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Users size={12} />
              Speakers
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker) => (
                <span
                  key={speaker}
                  className="rounded-sm bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-100"
                >
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
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {event.description}
          </p>
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
            <h4 className="text-sm font-bold text-gray-900">
              Attendee History ({event.attendees_count})
            </h4>
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
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      User ID
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Method
                    </th>
                    <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {attendees.map((attendee: any) => (
                    <tr key={attendee.id}>
                      <td className="max-w-30 truncate px-4 py-2.5 text-xs font-medium text-gray-900">
                        {attendee.user_id}
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-gray-600">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-bold uppercase">
                          {attendee.checkin_method}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-gray-500">
                        {new Date(attendee.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-8 text-xs text-gray-400 italic">
                No attendees checked in yet.
              </p>
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

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isConfirming={isDeleting}
      title="Delete Event"
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
