"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, Eye, ExternalLink, Link2 } from "lucide-react";
import { TeamResource } from "../types";
import Image from "next/image";

interface TeamResourceCardProps {
  resource: TeamResource;
  onView: (resource: TeamResource) => void;
  onEdit: (resource: TeamResource) => void;
  onDelete: (resource: TeamResource) => void;
}

export function TeamResourceCard({ resource, onView, onEdit, onDelete }: TeamResourceCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onView(resource)}
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {resource.thumbnail_public_url ? (
          <Image 
            src={resource.thumbnail_public_url} 
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <Link2 size={48} />
          </div>
        )}
        
        {/* Resource Type Badge */}
        <div className="absolute top-3 left-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur-sm">
          {resource.resource_type}
        </div>

        {/* Action Menu */}
        <div className="absolute top-3 right-3" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-teal-600"
          >
            <MoreVertical size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 z-10 mt-1 w-36 origin-top-right rounded border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-1">
              <button
                onClick={() => {
                  onView(resource);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} className="text-gray-400" />
                View Details
              </button>
              <button
                onClick={() => {
                  onEdit(resource);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit2 size={14} className="text-gray-400" />
                Update
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => {
                  onDelete(resource);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} className="text-red-400" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
          {resource.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 min-h-[40px]">
          {resource.description || "No description provided."}
        </p>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
            {resource.team_name}
          </span>
          <a 
            href={resource.resource_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-teal-600"
          >
            <span>Visit Link</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Decorative gradient bar at bottom */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
