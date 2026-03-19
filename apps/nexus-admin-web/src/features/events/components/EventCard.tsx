"use client";

import React from "react";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onClick(event)}
    >
      {/* Banner Image or Placeholder */}
      {event.image_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100/50">
          <Calendar size={48} className="text-teal-200" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-600">
            {event.category || "Event"}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star size={12} fill="currentColor" />
            {event.attendance_points} pts
          </div>
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
          {event.title}
        </h3>
        
        <div className="mt-auto space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} className="text-gray-400" />
            <span>{new Date(event.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            <span className="line-clamp-1">{event.venue || "TBA"}</span>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-50 pt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Users size={14} />
            <span>{event.attendees_count} Attendees</span>
          </div>
        </div>
      </div>

      {/* Decorative bar at top (visible on hover) */}
      <div className="absolute top-0 left-0 h-1 w-full bg-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
