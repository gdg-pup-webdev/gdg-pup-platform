"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetOneArticle } from "@/features/articles/hooks/useGetOneArticle";
import Link from "next/link";

// Maps article ID to its milestone color
const ARTICLE_COLOR_MAP: Record<string, {
  blob: string;
  border: string;
}> = {
  "a5e895ea-1223-4958-af05-1319cc98ec0a": { blob: "#4DB368CC", border: "#00C950" }, // The Spark — green
  "3e672b68-5890-4990-86a8-4622e019e7d3": { blob: "#F9AB00B3", border: "#F0B100" }, // Year One — yellow
  "55cf5ee1-1ab1-4a9d-b9d0-497d644baa53": { blob: "#EA4335BF", border: "#EA4335" }, // Year Two — red
  "aa4ec512-a068-4866-ba5d-8bf9bb90325c": { blob: "#4285F4B3", border: "#2B7FFF" }, // Year Three — blue
  "e5c96ec3-71c2-4e36-b065-0105aee46a08": { blob: "#4DB368CC", border: "#00C950" }, // The Impact — green
  "1713f93d-558b-4eab-9530-29d0770080f9": { blob: "#F9AB00B3", border: "#F0B100" }, // Living Community — yellow
  "f946e2dd-e0e2-41f2-9329-360b5dc44c2c": { blob: "#EA4335BF", border: "#EA4335" }, // Your Chapter — red
};

// Fallback color if article ID is not in the map
const DEFAULT_COLOR = { blob: "#4DB368CC", border: "#00C950", accent: "#00C950" };

// ── Read time estimator — estimates reading time based on word count ──
// Average reading speed: 200 words per minute
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
interface ArticleDetailsModalProps {
  articleId: string;
}

export function ArticlePreview({ articleId }: ArticleDetailsModalProps) {
  const { data, isLoading } = useGetOneArticle(articleId);
  const colors = ARTICLE_COLOR_MAP[articleId] ?? DEFAULT_COLOR;

  if (!data || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F0E0E]">
        <Loader2 size={32} className="animate-spin" style={{ color: colors.border }} />
      </div>
    );
  }

  const article = data?.data;
  const readTime = estimateReadTime(article.content ?? "");
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  
{/* ── Page wrapper — dark background matching history page ── */}
  return (
    <div className="relative min-h-screen bg-[#0F0E0E] px-4 py-16 md:px-8 lg:px-16 overflow-hidden">

      {/* Gradient blob background */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 800,
          height: 600,
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          background: colors.blob,
          filter: "blur(180px)",
          zIndex: 0,
        }}
      />

      {/* ── Card container — bordered card wrapping all article content ── */}
      <div className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-white/20 bg-[#0F0E0E]/80 backdrop-blur-sm p-6 md:p-10">

        {/* ── Top navigation bar — back button and published date + read time ── */}
        <div className="flex items-center justify-between mb-8 text-sm text-gray-400">
          <Link
            href="/about/history"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            ← Back to History
          </Link>
          {publishedDate && (
            <span>{publishedDate} • {readTime} min read</span>
          )}
        </div>

        {/* Back button */}
        <Link
          href="/about/history"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to History
        </Link>

        {/* Hero image with border */}
        {article.image_url && (
          <div
            className="w-full rounded-2xl overflow-hidden mb-10 p-[1.5px]"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.border}, transparent)`,
            }}
          >
            <div className="rounded-2xl overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          {article.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none rounded-2xl border p-8"
          style={{ borderColor: `${colors.border}33`, background: "rgba(255,255,255,0.03)" }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>

      </div>
    </div>
  );
}