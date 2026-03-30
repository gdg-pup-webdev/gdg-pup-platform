"use client";

import React from "react";
import { Edit2, Trash2, ExternalLink, Calendar, User, Layout, Eye } from "lucide-react";
import { MemberProject } from "../types";
import Image from "next/image";

interface MemberProjectCardProps {
  project: MemberProject;
  onView: (project: MemberProject) => void;
  onEdit: (project: MemberProject) => void;
  onDelete: (project: MemberProject) => void;
}

export function MemberProjectCard({ project, onView, onEdit, onDelete }: MemberProjectCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Project Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        {project.mainImageUrl ? (
          <Image
            src={project.mainImageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <Layout size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => onView(project)}
            className="rounded-full bg-white p-2.5 text-teal-600 shadow-lg hover:bg-teal-50 transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="rounded-full bg-white p-2.5 text-blue-600 shadow-lg hover:bg-blue-50 transition-colors"
            title="Edit Project"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="rounded-full bg-white p-2.5 text-red-600 shadow-lg hover:bg-red-50 transition-colors"
            title="Delete Project"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-600">
          <Calendar size={12} />
          <span>
            {new Date(project.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            {project.endDate ? ` — ${new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : ' — Present'}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-black text-gray-900 group-hover:text-teal-600 transition-colors">
          {project.title}
        </h3>
        
        <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {project.description}
        </p>

        <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <User size={12} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{project.memberGdgId}</span>
          </div>
        </div>
      </div>

      {/* Decorative Accent */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-teal-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
