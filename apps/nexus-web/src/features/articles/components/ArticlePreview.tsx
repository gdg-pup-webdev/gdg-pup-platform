"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetOneArticle } from "@/features/articles/hooks/useGetOneArticle";
import { useRouter } from "next/navigation";
import { BrandedSkeleton } from "@/components/shared";

// Maps article ID to its milestone color
const ARTICLE_COLOR_MAP: Record<string, {
  blob: string;
  border: string;
  accent: string;
  year: string;
}> = {
  "a5e895ea-1223-4958-af05-1319cc98ec0a": { blob: "#4DB368CC", border: "#00C950", accent: "#00C950", year: "2022" }, // The Spark — green
  "3e672b68-5890-4990-86a8-4622e019e7d3": { blob: "#F9AB00B3", border: "#F0B100", accent: "#F0B100", year: "2022-2023" }, // Year One — yellow
  "55cf5ee1-1ab1-4a9d-b9d0-497d644baa53": { blob: "#EA4335BF", border: "#EA4335", accent: "#EA4335", year: "2023-2024" }, // Year Two — red
  "aa4ec512-a068-4866-ba5d-8bf9bb90325c": { blob: "#4285F4B3", border: "#2B7FFF", accent: "#2B7FFF", year: "2024-2025" }, // Year Three — blue
  "e5c96ec3-71c2-4e36-b065-0105aee46a08": { blob: "#4DB368CC", border: "#00C950", accent: "#00C950", year: "2025" }, // The Impact — green
  "1713f93d-558b-4eab-9530-29d0770080f9": { blob: "#F9AB00B3", border: "#F0B100", accent: "#F0B100", year: "2025-2026" }, // Living Community — yellow
  "f946e2dd-e0e2-41f2-9329-360b5dc44c2c": { blob: "#EA4335BF", border: "#EA4335", accent: "#EA4335", year: "Now is the Moment" }, // Your Chapter — red
};

// Fallback color if article ID is not in the map
const DEFAULT_COLOR = { blob: "#4DB368CC", border: "#00C950", accent: "#00C950", year: "Now is the Moment" };

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
  const leftTopRef = useRef<HTMLDivElement>(null);
  const leftBottomRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };

    const tick = () => {
  // Use slightly different multipliers (0.18, 0.15, etc.) for variety
  const lx = mouseX * 0.18;
  const ly = mouseY * 0.18;
  const rx = mouseX * -0.18;
  const ry = mouseY * -0.18;

  // Apply to all 4 refs with the same values for left and right blobs
  if (leftTopRef.current) {
    leftTopRef.current.style.translate = `${lx.toFixed(1)}px ${ly.toFixed(1)}px`;
  }
  if (leftBottomRef.current) {
    leftBottomRef.current.style.translate = `${lx.toFixed(1)}px ${ly.toFixed(1)}px`;
  }
  if (rightTopRef.current) {
    rightTopRef.current.style.translate = `${rx.toFixed(1)}px ${ry.toFixed(1)}px`;
  }
  if (rightBottomRef.current) {
    rightBottomRef.current.style.translate = `${rx.toFixed(1)}px ${ry.toFixed(1)}px`;
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
          width: 500, height: 500,
          top: -100, left: "calc(50% - 250px)",
          background: colors.blob,
          filter: "blur(150px)",
        }}
      />

      {/* Left blob — higher up, mouse follow */}
      <motion.div
        ref={leftTopRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }}
        style={{
          ...blobStyle,
          width: 500, height: 700,
          top: "20%", left: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

       {/* Left blob — bottom down, mouse follow */}
      <motion.div
        ref={leftBottomRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.35 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "55%", left: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

      {/* Right blob — higher up, mouse follow opposite */}
      <motion.div
        ref={rightTopRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
        style={{
          ...blobStyle,
          width: 500, height: 700,
          top: "30%", right: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

      {/* Right blob — lower down, mouse follow opposite */}
      <motion.div
        ref={rightBottomRef}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.7 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          top: "65%", right: "-150px",
          background: colors.blob,
          filter: "blur(250px)",
        }}
      />

      {/* Bottom center blob — fade in, no mouse follow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 1.05 }}
        style={{
          ...blobStyle,
          width: 500, height: 500,
          bottom: -100, left: "calc(50% - 250px)",
          background: colors.blob,
          filter: "blur(200px)",
        }}
      />

    </div>
  );
}

export function ArticlePreview({ articleId }: ArticleDetailsModalProps) {
  const router = useRouter();
  const { data, isLoading } = useGetOneArticle(articleId);
  const colors = ARTICLE_COLOR_MAP[articleId] ?? DEFAULT_COLOR;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/articles");
  };

  if (!data || isLoading) {
    return (
      <div className="relative min-h-screen bg-[#0F0E0E] overflow-hidden px-4 pb-14 md:px-8">
        <ArticleBlobBackground colors={colors} />
        <div className="relative z-10 max-w-5xl mx-auto mt-28 md:mt-40">
          <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 md:p-12 lg:p-16">
            <div className="flex items-center justify-between mb-10">
              <BrandedSkeleton className="h-4 w-36" variant="text" />
              <BrandedSkeleton className="h-8 w-36" variant="chip" />
            </div>
            <div className="space-y-4 mb-10">
              <BrandedSkeleton className="h-12 w-full" variant="text" />
              <BrandedSkeleton className="h-12 w-4/5" variant="text" />
            </div>
            <BrandedSkeleton className="w-full aspect-video rounded-2xl mb-12" withGradientRing />
            <div className="space-y-4">
              <BrandedSkeleton className="h-5 w-full" variant="text" />
              <BrandedSkeleton className="h-5 w-full" variant="text" />
              <BrandedSkeleton className="h-5 w-11/12" variant="text" />
              <BrandedSkeleton className="h-5 w-full" variant="text" />
              <BrandedSkeleton className="h-5 w-10/12" variant="text" />
              <BrandedSkeleton className="h-5 w-9/12" variant="text" />
            </div>
          </div>
        </div>
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

// ── Page wrapper — dark background matching history page ──
return (
    <div className="relative min-h-screen bg-[#0F0E0E] overflow-hidden px-4 pb-14 md:px-8">
    {/* Gradient blob background */}
    <ArticleBlobBackground colors={colors} />

    {/* ── Main Article Container ── */}
    <div className="relative z-10 max-w-5xl mx-auto mt-28 md:mt-40">
      
      {/*  THE GLASS CONTAINER 
          - bg-white/[0.03]: Adds that subtle "white opacity"
          - backdrop-blur-xl: Makes the blobs behind it look creamy and professional
      */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
        
        {/* THE GRADIENT BORDER OVERLAY (Matching History Page) */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-10"
          style={{
            /* 1. Use a solid or 45deg gradient so color exists on all sides */
            background: `linear-gradient(45deg, ${colors.border}, ${colors.accent}, ${colors.border})`,
            
            /* 2. THE SECRET: Adjust the inner mask with 'inset' */
            /* top/bottom: 3px (Thick) | left/right: 0.5px (Thin) */
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            
            /* 3. Set padding to the THICKEST value you want (top/bottom) */
            padding: "3px 0.5px", 
          }}
        />
        {/*  INNER CONTENT PADDING */}
        <div className="p-6 md:p-12 lg:p-16">

          {/* ── Top navigation bar ── */}
          <div className="flex items-center justify-between mb-12 text-sm font-medium">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
            >
              Back
            </button>
            <span className="text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {colors.year} • {readTime} min read
            </span>
          </div>

          {/* ── Article title ── */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-10 tracking-tight">
            {article.title}
          </h1>

          {/* ── Hero image ── */}
          {article.image_url && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10 shadow-lg">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* ── Article content (Typography) ── */}
          <div
            className="prose prose-invert prose-base md:prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-white
              prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-black/40 prose-pre:backdrop-blur-sm prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-blockquote:border-l-4 prose-blockquote:text-gray-200 prose-blockquote:italic prose-blockquote:pl-6 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
              prose-img:rounded-2xl prose-img:border prose-img:border-white/10
              prose-li:text-gray-300"
            style={{
              ["--tw-prose-quote-borders" as string]: colors.accent,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content.replace(/^#\s+.+\n?/, '')}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}