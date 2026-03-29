"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  Info,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Type,
  FileText,
  Search,
  MapPin,
  Upload,
  CheckCircle2,
  Globe,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Article, ArticleInsert, ArticleUpdate, UserType } from "../types";
import { useGetOneArticle } from "../hooks/useGetOneArticle";

// ==========================================
// Article Details Modal
// ==========================================
interface ArticleDetailsModalProps {
  articleId: string;
}

export function ArticlePreview({ articleId }: ArticleDetailsModalProps) {
  const { data, error, isLoading } = useGetOneArticle(articleId);

  if (!data || isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-teal-600" />
      </div>
    );
  }

  const article = data?.data;

  return (
    <div className="flex mx-auto mt-50 max-w-5xl border-3 p-6">
      <div className="space-y-6 w-full">
        <div className="space-y-4">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-48 sm:h-64 object-cover rounded-sm border border-gray-100"
            />
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {article.title}
              </h3>
              {article.is_published ? (
                <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 uppercase border border-teal-100">
                  <Globe size={10} />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-400 uppercase border border-gray-100">
                  <X size={10} />
                  Draft
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500 italic border-l-4 border-teal-500 pl-4">
              {article.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600" />
              Created: {new Date(article.created_at).toLocaleDateString()}
            </div>
            {article.published_at && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-teal-600" />
                Published: {new Date(article.published_at).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-teal-600" />
              Author ID: {article.author_id}
            </div>
          </div>

          <div className="prose prose-sm max-w-none rounded-sm border border-gray-100 bg-gray-50 p-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
