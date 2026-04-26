"use client";

import React from "react";
import { User, Briefcase, GraduationCap, Globe } from "lucide-react";
import { Portfolio } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: (portfolio: Portfolio) => void;
  onEdit?: (portfolio: Portfolio) => void;
}

export function PortfolioCard({ portfolio, onClick, onEdit }: PortfolioCardProps) {
  const fullName = [portfolio.first_name, portfolio.middle_name, portfolio.last_name]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  const programLabel = `${portfolio.year_level ? `${portfolio.year_level} Year` : ""} ${portfolio.program || ""}`.trim() || "Program not set";

  return (
    <AdminEntityCard
      title={fullName}
      description={<span className="italic">"{portfolio.nickname || "No nickname"}"</span>}
      mediaImageUrl={portfolio.profile_image}
      mediaAlt={fullName}
      mediaFallback={<User size={56} />}
      mediaLabel={
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          {portfolio.membership_type || "Member"}
        </span>
      }
      mediaStatus={
        <span className="rounded-full bg-gray-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
          {portfolio.gdg_id || "N/A"}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          {portfolio.is_public ? "Public" : "Private"}
        </span>
      }
      metaItems={[
        {
          key: "department",
          icon: <Briefcase size={13} />,
          content: portfolio.department || "General",
        },
        {
          key: "program",
          icon: <GraduationCap size={13} />,
          content: programLabel,
        },
        {
          key: "links",
          icon: portfolio.portfolio_website_url ? <Globe size={13} /> : undefined,
          content: portfolio.github_url ? "GitHub connected" : "No linked profiles",
          className: "font-semibold uppercase tracking-wider text-[10px]",
        },
      ]}
      onClick={() => onClick(portfolio)}
      actions={{
        onView: () => onClick(portfolio),
        onEdit: onEdit ? () => onEdit(portfolio) : undefined,
        editLabel: "Update Portfolio",
      }}
    />
  );
}
