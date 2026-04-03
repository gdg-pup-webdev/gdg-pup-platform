"use client";

import React from "react";
import { MemberShowcase } from "../types";
import { Calendar, Users, ExternalLink } from "lucide-react";
import Image from "next/image";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface MemberShowcaseCardProps {
  showcase: MemberShowcase;
  onView: (showcase: MemberShowcase) => void;
  onEdit: (showcase: MemberShowcase) => void;
  onDelete: (showcase: MemberShowcase) => void | Promise<void>;
}

export function MemberShowcaseCard({ showcase, onView, onEdit, onDelete }: MemberShowcaseCardProps) {
  const showcaseDate = new Date(showcase.date).toLocaleDateString();

  return (
    <AdminEntityCard
      title={showcase.title}
      description={showcase.description}
      mediaImageUrl={showcase.thumbnailUrl}
      mediaAlt={showcase.title}
      mediaFallback={<Users size={52} />}
      mediaLabel={
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          <Calendar size={11} />
          {showcaseDate}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {showcase.showcasedMembers.length} members
        </span>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center -space-x-2">
            {showcase.showcasedMembers.slice(0, 3).map((member) => (
              <div
                key={member.gdgId}
                className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm"
                title={member.fullName}
              >
                {member.avatarUrl ? (
                  <Image src={member.avatarUrl} alt={member.fullName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase text-gray-500">
                    {member.firstName[0]}
                  </div>
                )}
              </div>
            ))}
            {showcase.showcasedMembers.length > 3 ? (
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-50 text-[9px] font-bold text-gray-500 shadow-sm">
                +{showcase.showcasedMembers.length - 3}
              </div>
            ) : null}
          </div>
          {showcase.articleUrl ? (
            <a
              href={showcase.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition-colors hover:text-teal-600"
            >
              Article
              <ExternalLink size={12} />
            </a>
          ) : null}
        </div>
      }
      onClick={() => onView(showcase)}
      actions={{
        onView: () => onView(showcase),
        onEdit: () => onEdit(showcase),
        onDelete: () => onDelete(showcase),
        editLabel: "Update Showcase",
        deleteDialogTitle: "Delete Showcase",
        deleteDialogDescription: (
          <>
            Showcase <strong>{showcase.title}</strong> will be permanently deleted.
          </>
        ),
      }}
    />
  );
}
