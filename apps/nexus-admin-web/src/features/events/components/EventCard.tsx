"use client";

import React from "react";
import { Calendar, MapPin, Users, Star, RefreshCw, ExternalLink } from "lucide-react";
import { Event } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface EventCardProps {
  event: Event;
  onView: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void | Promise<void>;
  onSync?: (event: Event) => void | Promise<void>;
}

export function EventCard({ event, onView, onEdit, onDelete, onSync }: EventCardProps) {
  const eventDate = new Date(event.start_date || "").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const extraItems = [
    ...(event.bevyPreviewUrl
      ? [
          {
            key: "open-bevy",
            label: "Open Bevy Page",
            icon: ExternalLink,
            onClick: () => {
              window.open(event.bevyPreviewUrl as string, "_blank", "noopener,noreferrer");
            },
          },
        ]
      : []),
    ...(onSync
      ? [
          {
            key: "sync-bevy",
            label: "Sync with Bevy",
            icon: RefreshCw,
            onClick: () => {
              void onSync(event);
            },
          },
        ]
      : []),
  ];

  return (
    <AdminEntityCard
      title={event.title}
      description={event.description || "No event description provided."}
      mediaImageUrl={event.image_url}
      mediaAlt={event.title}
      mediaFallback={<Calendar size={56} />}
      mediaLabel={
        event.type ? (
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
            {event.type}
          </span>
        ) : undefined
      }
      mediaStatus={
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 shadow-sm">
          <Star size={11} fill="currentColor" />
          {event.attendance_points} pts
        </span>
      }
      topMetaLeft={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {event.category || "Event"}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
          {event.attendees_count} attendees
        </span>
      }
      metaItems={[
        {
          key: "date",
          icon: <Calendar size={13} />,
          content: eventDate,
        },
        {
          key: "venue",
          icon: <MapPin size={13} />,
          content: event.venue || "Venue TBA",
        },
        ...(event.speakers && event.speakers.length > 0
          ? [
              {
                key: "speakers",
                icon: <Users size={13} />,
                content: `${event.speakers.length} speakers`,
                className: "font-semibold uppercase tracking-wider text-[10px]",
              },
            ]
          : []),
      ]}
      onClick={() => onView(event)}
      actions={{
        onView: () => onView(event),
        onEdit: onEdit ? () => onEdit(event) : undefined,
        onDelete: onDelete ? () => onDelete(event) : undefined,
        extraItems: extraItems.length > 0 ? extraItems : undefined,
        editLabel: "Update Event",
        deleteDialogTitle: "Delete Event",
        deleteDialogDescription: (
          <>
            Event <strong>{event.title}</strong> will be permanently deleted.
          </>
        ),
      }}
    />
  );
}