"use client";

import React from "react";
import { User, Briefcase, GraduationCap, Globe } from "lucide-react";
import { GdgMember } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface MemberCardProps {
  member: GdgMember;
  onClick: (member: GdgMember) => void;
  onEdit?: (member: GdgMember) => void;
}

export function MemberCard({ member, onClick, onEdit }: MemberCardProps) {
  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  const programLabel = `${member.yearLevel ? `${member.yearLevel} Year` : ""} ${member.program || ""}`.trim() || "Program not set";

  return (
    <AdminEntityCard
      title={fullName}
      description={<span className="italic">"{member.displayName || "No nickname"}"</span>}
      mediaImageUrl={member.avatarUrl}
      mediaAlt={fullName}
      mediaFallback={<User size={56} />}
      mediaLabel={
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          {member.membershipType || "Member"}
        </span>
      }
      mediaStatus={
        <span className="rounded-full bg-gray-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
          {member.gdgId || "N/A"}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {member.isPublic ? "Public" : "Private"}
        </span>
      }
      metaItems={[
        {
          key: "department",
          icon: <Briefcase size={13} />,
          content: member.department || "General",
        },
        {
          key: "program",
          icon: <GraduationCap size={13} />,
          content: programLabel,
        },
        {
          key: "links",
          icon: member.portfolioWebsiteUrl ? <Globe size={13} /> : undefined,
          content: member.githubUrl ? "GitHub connected" : "No linked profiles",
          className: "font-semibold uppercase tracking-wider text-[10px]",
        },
      ]}
      onClick={() => onClick(member)}
      actions={{
        onView: () => onClick(member),
        onEdit: onEdit ? () => onEdit(member) : undefined,
        editLabel: "Update Member",
      }}
    />
  );
}
