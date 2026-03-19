"use client";

import React, { useEffect } from "react";
import { X, Calendar, MapPin, Users, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useGetBevyEvent } from "../hooks/useGetBevyEvent";

interface BevyEventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string | null;
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
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

export function BevyEventDetails({ isOpen, onClose, eventId }: BevyEventDetailsProps) {
  const { data, isLoading, isError, error } = useGetBevyEvent(eventId || "");

  if (!eventId) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-teal-600" />
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Event Details">
        <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle size={40} className="mb-3 text-red-500" />
          <p className="text-sm text-red-700">{(error as any)?.message || "Failed to load event details"}</p>
        </div>
      </Modal>
    );
  }

  const event = data?.data;
  if (!event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
      <div className="space-y-6">
        {/* Banner Image */}
        {event.cover_image_url && (
          <div className="relative -mx-6 -mt-6 mb-6 h-56 overflow-hidden rounded-t-sm bg-gradient-to-b from-gray-200 to-gray-100">
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Start Date</label>
            <div className="mt-1.5 flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              <span className="text-sm text-gray-900">{formatDate(event.start_date)}</span>
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">End Date</label>
            <div className="mt-1.5 flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              <span className="text-sm text-gray-900">{formatDate(event.end_date)}</span>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</label>
              <div className="mt-1.5 flex items-center gap-2">
                <MapPin size={16} className="text-teal-600" />
                <span className="text-sm text-gray-900">{event.location}</span>
              </div>
            </div>
          )}

          {/* Event Type */}
          {event.event_type && (
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type</label>
              <div className="mt-1.5">
                <span className="text-sm text-gray-900">{event.event_type}</span>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees !== undefined && (
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Attendees</label>
              <div className="mt-1.5 flex items-center gap-2">
                <Users size={16} className="text-teal-600" />
                <span className="text-sm text-gray-900">
                  {event.attendees} {event.total_capacity ? `/ ${event.total_capacity}` : ""}
                </span>
              </div>
            </div>
          )}

          {/* Status */}
          {event.status && (
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
              <div className="mt-1.5">
                <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  {event.status}
                </span>
              </div>
            </div>
          )}

          {/* Virtual Event */}
          {event.is_virtual_event && (
            <div className="flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Format</label>
              <div className="mt-1.5">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Virtual Event
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        {event.short_description && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</label>
            <p className="mt-2 text-sm text-gray-700">{event.short_description}</p>
          </div>
        )}

        {/* Full Description */}
        {event.description && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Details</label>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-6 sm:flex-row">
          {event.bevy_url && (
            <a
              href={event.bevy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              View on Bevy
            </a>
          )}
          {event.attendee_virtual_venue_url && (
            <a
              href={event.attendee_virtual_venue_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              Virtual Venue
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
