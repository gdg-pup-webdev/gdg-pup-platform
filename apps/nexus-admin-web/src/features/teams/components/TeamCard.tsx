"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, Eye, Users } from "lucide-react";
import { Team } from "../types";

interface TeamCardProps {
  team: Team;
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export function TeamCard({ team, onView, onEdit, onDelete }: TeamCardProps) {
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
      className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onView(team)}
    >
      {/* Header with Icon and Menu */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-teal-50 text-teal-600">
          <Users size={24} />
        </div>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 z-10 mt-1 w-36 origin-top-right rounded border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(team);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} className="text-gray-400" />
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(team);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit2 size={14} className="text-gray-400" />
                Update
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(team);
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
      <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
        {team.name}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
        {team.description || "No description provided."}
      </p>

      {/* Footer info */}
      <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Users size={14} />
          <span>{team.members?.length || 0} Members</span>
        </div>
      </div>

      {/* Decorative gradient bar at top */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
