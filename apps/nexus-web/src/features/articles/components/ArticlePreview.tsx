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

const DEFAULT_COLOR = { blob: "#4DB368CC", border: "#00C950" };

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

  return (
    <div className="relative min-h-screen bg-[#0F0E0E] px-4 py-16 md:px-8 lg:px-16 overflow-hidden">

      {/* Gradient blob background */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600,
          height: 600,
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          background: colors.blob,
          filter: "blur(180px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

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