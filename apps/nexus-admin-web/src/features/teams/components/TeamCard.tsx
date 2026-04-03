"use client";

import React from "react";
import { Users } from "lucide-react";
import { Team } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface TeamCardProps {
  team: Team;
  onView: (team: Team) => void;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void | Promise<void>;
}

export function TeamCard({ team, onView, onEdit, onDelete }: TeamCardProps) {
  const memberCount = team.members?.length || 0;

  return (
    <AdminEntityCard
      title={team.name}
      description={team.description || "No description provided."}
      mediaFallback={<Users size={56} />}
      mediaLabel={
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-teal-700 shadow-sm">
          Team
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {memberCount} members
        </span>
      }
      metaItems={[
        {
          key: "members",
          icon: <Users size={13} />,
          content: `${memberCount} active members`,
          className: "font-semibold uppercase tracking-wider text-[10px]",
        },
      ]}
      actions={{
        onView: () => onView(team),
        onEdit: () => onEdit(team),
        onDelete: () => onDelete(team),
        editLabel: "Update Team",
        deleteDialogTitle: "Delete Team",
        deleteDialogDescription: (
          <>
            Team <strong>{team.name}</strong> will be permanently removed from the system.
          </>
        ),
      }}
    />
  );
}
