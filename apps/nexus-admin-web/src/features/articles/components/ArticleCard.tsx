"use client";

import React from "react";
import { Calendar, User, X, Globe } from "lucide-react";
import { Article } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";

interface ArticleCardProps {
  article: Article;
  onView: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void | Promise<void>;
}

export function ArticleCard({ article, onView, onEdit, onDelete }: ArticleCardProps) {
  const createdDate = new Date(article.created_at).toLocaleDateString();

  return (
    <AdminEntityCard
      title={article.title}
      description={article.description}
      mediaImageUrl={article.image_url}
      mediaAlt={article.title}
      mediaFallback={<Globe size={54} />}
      mediaLabel={
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          <Calendar size={11} />
          {createdDate}
        </span>
      }
      mediaStatus={
        article.is_published ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
            <Globe size={10} />
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
            <X size={10} />
            Draft
          </span>
        )
      }
      topMetaRight={
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
          Article
        </span>
      }
      metaItems={[
        {
          key: "author",
          icon: <User size={13} />,
          content: `Author ID: ${article.author_id?.slice(0, 8) || "None"}`,
          className: "font-semibold uppercase tracking-wider text-[10px]",
        },
      ]}
      onClick={() => onView(article)}
      actions={{
        onView: () => onView(article),
        onEdit: onEdit ? () => onEdit(article) : undefined,
        onDelete: onDelete ? () => onDelete(article) : undefined,
        editLabel: "Update Article",
        deleteDialogTitle: "Delete Article",
        deleteDialogDescription: (
          <>
            Article <strong>{article.title}</strong> will be permanently deleted.
          </>
        ),
      }}
    />
  );
}
