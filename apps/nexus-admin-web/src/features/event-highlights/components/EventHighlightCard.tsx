"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar, User, Info, MoreHorizontal } from "lucide-react";
import { EventHighlight } from "../types";

interface EventHighlightCardProps {
  highlight: EventHighlight;
  onClick: (highlight: EventHighlight) => void;
}

export const EventHighlightCard: React.FC<EventHighlightCardProps> = ({
  highlight,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(highlight)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border border-gray-200 bg-white transition-all hover:border-teal-500 hover:shadow-lg"
    >
      {/* Media placeholder / Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {highlight.image_url ? (
          <img
            src={highlight.image_url}
            alt={highlight.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Info size={40} className="opacity-20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-900 transition-colors group-hover:text-teal-600">
          {highlight.title}
        </h3>
        
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {highlight.description}
        </p>

        <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={14} className="shrink-0" />
            <span>{new Date(highlight.created_at).toDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User size={14} className="shrink-0" />
            <span className="line-clamp-1">{highlight.author_id}</span>
          </div>
        </div>
      </div>

      {/* Action overlay (desktop hover) */}
      <div className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-gray-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <MoreHorizontal size={18} />
      </div>
    </div>
  );
};
