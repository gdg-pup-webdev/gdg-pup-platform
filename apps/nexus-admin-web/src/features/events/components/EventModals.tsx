"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, Calendar, MapPin, Users, CheckCircle, Plus, Trash2, Edit2, Type, FileText, Star, Image as ImageIcon } from "lucide-react";
import { Event, EventInsert, EventUpdate, EventAttendance } from "../types";
import { useListAttendees } from "../hooks/useListAttendees";
import { useCheckinToEvent } from "../hooks/useCheckinToEvent";
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
    category: "",
    venue: "",
    start_date: "",
    end_date: "",
    attendance_points: 10,
    image_url: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        category: initialData.category || "",
        venue: initialData.venue || "",
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
        attendance_points: initialData.attendance_points,
        image_url: initialData.image_url,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        venue: "",
        start_date: "",
        end_date: "",
        attendance_points: 10,
        image_url: null,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Update Event" : "Create New Event"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Venue</label>
            <input
              required
              type="text"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500">Points</label>
            <input
              required
              type="number"
              className="w-full rounded-sm border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-all"
              value={formData.attendance_points}
              onChange={(e) => setFormData({ ...formData, attendance_points: parseInt(e.target.value) })}
            />
          </div>
          <div>
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
            className="flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>
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
            <span className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-600 uppercase tracking-widest">
              {event.category}
            </span>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center text-xs text-gray-600">
                <Calendar size={14} className="mr-2 text-teal-600" />
                {new Date(event.start_date).toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin size={14} className="mr-2 text-teal-600" />
                {event.venue || "No venue specified"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</h4>
          <p className="text-sm leading-relaxed text-gray-700">{event.description}</p>
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
