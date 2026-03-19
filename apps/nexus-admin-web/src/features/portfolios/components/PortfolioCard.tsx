"use client";

import React from "react";
import { User, Briefcase, GraduationCap, Globe, Mail } from "lucide-react";
import { Portfolio } from "../types";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: (portfolio: Portfolio) => void;
}

export function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
  const fullName = [portfolio.first_name, portfolio.middle_name, portfolio.last_name]
    .filter(Boolean)
    .join(" ") || "Anonymous";

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onClick(portfolio)}
    >
      {/* Profile Header */}
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <User size={32} className="text-blue-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-600">
            {portfolio.membership_type || "Member"}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
            {portfolio.gdg_id || "N/A"}
          </div>
        </div>

        <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {fullName}
        </h3>
        <p className="mb-4 text-xs font-medium text-gray-500 italic">
          "{portfolio.nickname || "No nickname"}"
        </p>
        
        <div className="mt-auto space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Briefcase size={14} className="text-gray-400" />
            <span className="line-clamp-1">{portfolio.department || "General"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <GraduationCap size={14} className="text-gray-400" />
            <span className="line-clamp-1">{portfolio.year_level ? `${portfolio.year_level} Year` : ""} {portfolio.program || ""}</span>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
            {portfolio.portfolio_website_url && (
               <Globe size={14} className="text-gray-400" />
            )}
            {portfolio.github_url && (
               <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            )}
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
               {portfolio.is_public ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative bar at top (visible on hover) */}
      <div className="absolute top-0 left-0 h-1 w-full bg-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
