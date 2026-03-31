"use client";

import React from "react";
import { MemberShowcase } from "../types";
import { Calendar, Users, ExternalLink, Edit2, Trash2, Eye, User as UserIcon } from "lucide-react";
import Image from "next/image";

interface MemberShowcaseCardProps {
  showcase: MemberShowcase;
  onView: (showcase: MemberShowcase) => void;
  onEdit: (showcase: MemberShowcase) => void;
  onDelete: (showcase: MemberShowcase) => void;
}

export function MemberShowcaseCard({ showcase, onView, onEdit, onDelete }: MemberShowcaseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-sm border border-gray-100 bg-white transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        {showcase.thumbnailUrl ? (
          <Image
            src={showcase.thumbnailUrl}
            alt={showcase.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <Users size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        
        <div className="absolute top-3 right-3 flex gap-2 translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => onEdit(showcase)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-teal-600 shadow-sm transition-colors hover:bg-teal-600 hover:text-white"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(showcase)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-sm transition-colors hover:bg-red-600 hover:text-white"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-600">
            <Calendar size={12} />
            {new Date(showcase.date).toLocaleDateString()}
          </div>
          <div className="flex items-center -space-x-2">
            {showcase.showcasedMembers.slice(0, 3).map((member, idx) => (
              <div 
                key={member.gdgId} 
                className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm"
                title={member.fullName}
              >
                {member.avatarUrl ? (
                  <Image src={member.avatarUrl} alt={member.fullName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                    {member.firstName[0]}
                  </div>
                )}
              </div>
            ))}
            {showcase.showcasedMembers.length > 3 && (
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[8px] font-bold text-gray-500 shadow-sm">
                +{showcase.showcasedMembers.length - 3}
              </div>
            )}
          </div>
        </div>

        <h3 className="mb-2 line-clamp-1 text-base font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
          {showcase.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {showcase.description}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onView(showcase)}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-gray-100 bg-gray-50 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
          >
            <Eye size={14} />
            View Details
          </button>
          {showcase.articleUrl && (
            <a
              href={showcase.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-900 text-white transition-colors hover:bg-gray-800"
              title="Read Article"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
