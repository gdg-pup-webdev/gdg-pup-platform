"use client";

import React from "react";
import { Calendar, User, CheckCircle2, X, Globe } from "lucide-react";
import { Article } from "../types";

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={() => onClick(article)}
    >
      {/* Article Image or Placeholder */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-200">
            <Globe size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {article.is_published ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              <Globe size={10} />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              <X size={10} />
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {article.description}
        </p>
        
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            <Calendar size={12} className="text-teal-600" />
            <span>{new Date(article.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">
            <User size={12} className="text-teal-600" />
            <span>ID: {article.author_id?.slice(0, 8) || "Unknown"}</span>
          </div>
        </div>
      </div>

      {/* Decorative bar at top (visible on hover) */}
      <div className="absolute top-0 left-0 h-1 w-full bg-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
