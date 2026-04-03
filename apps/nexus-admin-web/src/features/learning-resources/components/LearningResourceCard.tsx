"use client";

import React from "react";
import { ExternalLink, Link2, Users, Calendar } from "lucide-react";
import { LearningResource } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface LearningResourceCardProps {
  resource: LearningResource;
  onView: (resource: LearningResource) => void;
  onEdit: (resource: LearningResource) => void;
  onDelete: (resource: LearningResource) => void | Promise<void>;
}

export function LearningResourceCard({ resource, onView, onEdit, onDelete }: LearningResourceCardProps) {
  return (
    <AdminEntityCard
      title={resource.title}
      description={resource.description || "No description provided."}
      mediaImageUrl={resource.thumbnailUrl}
      mediaAlt={resource.title}
      mediaFallback={<Link2 size={52} />}
      mediaLabel={
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          Resource
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {resource.tags.length} tags
        </span>
      }
      metaItems={[
        ...(resource.team
          ? [
              {
                key: "team",
                icon: <Users size={13} />,
                content: resource.team.name,
                className: "font-semibold uppercase tracking-wider text-[10px]",
              },
            ]
          : []),
        ...(resource.event
          ? [
              {
                key: "event",
                icon: <Calendar size={13} />,
                content: resource.event.title,
                className: "font-semibold uppercase tracking-wider text-[10px]",
              },
            ]
          : []),
      ]}
      tags={
        <>
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-sm bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-teal-700">
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 ? (
            <span className="rounded-sm bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-500">
              +{resource.tags.length - 3}
            </span>
          ) : null}
        </>
      }
      footer={
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-teal-600"
        >
          <span>Visit Link</span>
          <ExternalLink size={12} />
        </a>
      }
      onClick={() => onView(resource)}
      actions={{
        onView: () => onView(resource),
        onEdit: () => onEdit(resource),
        onDelete: () => onDelete(resource),
        editLabel: "Update Resource",
        deleteDialogTitle: "Delete Resource",
        deleteDialogDescription: (
          <>
            Resource <strong>{resource.title}</strong> will be permanently deleted.
          </>
        ),
      }}
    />
  );
}
