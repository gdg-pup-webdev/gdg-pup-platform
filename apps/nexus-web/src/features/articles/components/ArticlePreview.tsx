"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetOneArticle } from "@/features/articles/hooks/useGetOneArticle";
import Link from "next/link";

// Maps article ID to its milestone color
const ARTICLE_COLOR_MAP: Record<string, {
  blob: string;
  border: string;
  accent: string;
}> = {
  "a5e895ea-1223-4958-af05-1319cc98ec0a": { blob: "#4DB368CC", border: "#00C950", accent: "#00C950" }, // The Spark — green
  "3e672b68-5890-4990-86a8-4622e019e7d3": { blob: "#F9AB00B3", border: "#F0B100", accent: "#F0B100" }, // Year One — yellow
  "55cf5ee1-1ab1-4a9d-b9d0-497d644baa53": { blob: "#EA4335BF", border: "#EA4335", accent: "#EA4335" }, // Year Two — red
  "aa4ec512-a068-4866-ba5d-8bf9bb90325c": { blob: "#4285F4B3", border: "#2B7FFF", accent: "#2B7FFF" }, // Year Three — blue
  "e5c96ec3-71c2-4e36-b065-0105aee46a08": { blob: "#4DB368CC", border: "#00C950", accent: "#00C950" }, // The Impact — green
  "1713f93d-558b-4eab-9530-29d0770080f9": { blob: "#F9AB00B3", border: "#F0B100", accent: "#F0B100" }, // Living Community — yellow
  "f946e2dd-e0e2-41f2-9329-360b5dc44c2c": { blob: "#EA4335BF", border: "#EA4335", accent: "#EA4335" }, // Your Chapter — red
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

function ArticleBlobBackground({ colors }: { colors: { blob: string } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let leftX = 0, leftY = 0;
    let rightX = 0, rightY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };

    const tick = () => {
      leftX += (mouseX * 0.18 - leftX) * 0.08;
      leftY += (mouseY * 0.18 - leftY) * 0.08;
      rightX += (mouseX * -0.18 - rightX) * 0.08;
      rightY += (mouseY * -0.18 - rightY) * 0.08;

      if (leftRef.current) {
        leftRef.current.style.translate = `${leftX.toFixed(1)}px ${leftY.toFixed(1)}px`;
      }
      if (rightRef.current) {
        rightRef.current.style.translate = `${rightX.toFixed(1)}px ${rightY.toFixed(1)}px`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const blobStyle: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
    willChange: "transform",
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">

      {/* Top center blob — fade in, no mouse follow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
        style={{
          ...blobStyle,
          width: 700, height: 600,
          top: -100, left: "calc(50% - 400px)",
          background: colors.blob,
          filter: "blur(150px)",
        }}
      />

      {/* Left blob — higher up, mouse follow */}
      <motion.div
        ref={leftRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "20%", left: "-150px",
          background: colors.blob,
          filter: "blur(200px)",
        }}
      />

       {/* Left blob — lower down, mouse follow */}
      <motion.div
        ref={leftRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "50%", left: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

      {/* Right blob — higher up, mouse follow opposite */}
      <motion.div
        ref={rightRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "30%", right: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

      {/* Right blob — lower down, mouse follow opposite */}
      <motion.div
        ref={rightRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "60%", right: "-150px",
          background: colors.blob,
          filter: "blur(200px)",
        }}
      />

      {/* Bottom center blob — fade in, no mouse follow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 1.05 }}
        style={{
          ...blobStyle,
          width: 800, height: 600,
          bottom: -100, left: "calc(50% - 400px)",
          background: colors.blob,
          filter: "blur(180px)",
        }}
      />

    </div>
  );
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
    <ArticleBlobBackground colors={colors} />

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

        {/* ── Article title — large heading ── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {article.title}
          </h1>
        </div>

        {/* ── Hero image — main article image with rounded border ── */}
        {article.image_url && (
          <div className="w-full rounded-xl overflow-hidden mb-10 border border-white/10">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-56 md:h-72 object-cover"
            />
          </div>
        )}

        {/* ── Article content — markdown rendered with dark theme typography ──
        * prose-invert: dark mode text colors
        * prose-headings: white bold headers
        * prose-code: dark code blocks with border
        * prose-blockquote: colored left border matching milestone color
        * prose-img: rounded images with border
        */}
        <div
          className="prose prose-invert prose-base md:prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-code:bg-white/10 prose-code:rounded prose-code:px-1
            prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-4 prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:pl-4
            prose-img:rounded-xl prose-img:border prose-img:border-white/10"
          style={{
            ["--tw-prose-quote-borders" as string]: colors.accent,
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {/* This removes the first instance of a # Header from the string */}
          {article.content.replace(/^#\s+.+\n?/, '')}
        </ReactMarkdown>
          </div>
      </div>
    </div>
  );
}