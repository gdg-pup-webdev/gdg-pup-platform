"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Text } from "@packages/spark-ui";
import { useListArticles } from "../hooks/useListArticle";
import { ASSETS } from "@/lib/constants/assets";
import { BrandedSkeleton } from "@/components/shared";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";

// ── Same color map as ArticlePreview so each card matches its article page ──
const ARTICLE_COLOR_MAP: Record<
  string,
  { blob: string; border: string; accent: string; year: string }
> = {
  "a5e895ea-1223-4958-af05-1319cc98ec0a": {
    blob: "#4DB368CC",
    border: "#00C950",
    accent: "#00C950",
    year: "2022",
  },
  "3e672b68-5890-4990-86a8-4622e019e7d3": {
    blob: "#F9AB00B3",
    border: "#F0B100",
    accent: "#F0B100",
    year: "2022–2023",
  },
  "55cf5ee1-1ab1-4a9d-b9d0-497d644baa53": {
    blob: "#EA4335BF",
    border: "#EA4335",
    accent: "#EA4335",
    year: "2023–2024",
  },
  "aa4ec512-a068-4866-ba5d-8bf9bb90325c": {
    blob: "#4285F4B3",
    border: "#2B7FFF",
    accent: "#2B7FFF",
    year: "2024–2025",
  },
  "e5c96ec3-71c2-4e36-b065-0105aee46a08": {
    blob: "#4DB368CC",
    border: "#00C950",
    accent: "#00C950",
    year: "2025",
  },
  "1713f93d-558b-4eab-9530-29d0770080f9": {
    blob: "#F9AB00B3",
    border: "#F0B100",
    accent: "#F0B100",
    year: "2025–2026",
  },
  "f946e2dd-e0e2-41f2-9329-360b5dc44c2c": {
    blob: "#EA4335BF",
    border: "#EA4335",
    accent: "#EA4335",
    year: "Now is the Moment",
  },
};

const DEFAULT_COLOR = {
  blob: "#4DB368CC",
  border: "#00C950",
  accent: "#00C950",
  year: "Now",
};

function estimateReadTime(content?: string): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Subtle ambient background blobs for the list page ──
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
      <div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "-10%",
          background: "#4285F44A",
          filter: "blur(180px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          bottom: "5%",
          right: "-10%",
          background: "#EA43354A",
          filter: "blur(180px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          top: "40%",
          left: "40%",
          background: "#F9AB004A",
          filter: "blur(160px)",
        }}
      />
    </div>
  );
}

export const ArticleList = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize] = React.useState(8);
  const { data, error, isLoading } = useListArticles(pageNumber, pageSize);

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="relative min-h-screen bg-[#0F0E0E] overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-28 md:pt-40 pb-20">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <Text variant="caption" className="text-gray-500 tracking-[0.2em] uppercase font-semibold mb-3 inline-block">
            GDG PUP · Stories
          </Text>
          <Text
            as="h1"
            variant="heading-1"
            gradient="white-blue"
            align="center"
            weight="bold"
            className="text-5xl md:text-6xl lg:text-7xl z-20"
            style={{
              filter:
                "drop-shadow(0 0 20px rgba(0,0,0,1)) drop-shadow(0 2px 10px rgba(0,0,0,0.9))",
            }}
          >
            Our Articles
          </Text>
          <Text
            as="p"
            variant="body-lg"
            align="center"
            weight="bold"
            className="text-white text-base md:text-lg lg:max-w-none mt-4 max-w-xl mx-auto z-10"
            style={{
              textShadow: "0 0 20px rgba(0,0,0,1), 0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            Chapters of our journey — written by the community, for the
            community.
          </Text>
        </motion.div>

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <BrandedSkeleton className="h-44 w-full rounded-none" withGradientRing />
                <div className="p-5 flex flex-col gap-3">
                  <BrandedSkeleton className="h-4 w-20" variant="chip" />
                  <BrandedSkeleton className="h-5 w-3/4" variant="text" />
                  <BrandedSkeleton className="h-4 w-full" variant="text" />
                  <BrandedSkeleton className="h-4 w-2/3" variant="text" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {error && !isLoading && (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">Could not load articles. Please try again.</p>
          </div>
        )}

        {/* ── Article grid ── */}
        {!isLoading && !error && data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
              {data.data.map((article, i) => {
                const colors =
                  ARTICLE_COLOR_MAP[article.id] ?? DEFAULT_COLOR;
                const readTime = estimateReadTime(article.content);

                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: i * 0.06,
                    }}
                    className="h-full"
                  >
                    <Link prefetch={false} href={`/articles/${article.id}`} className="block h-full">
                      <div className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer">
                        <div
                          className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${colors.border}, ${colors.accent})`,
                            WebkitMask:
                              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                            padding: "1px",
                          }}
                        />

                        {/* Hero image */}
                        <div className="relative h-44 overflow-hidden shrink-0"> {/* Prevent image from shrinking */}
                          <img
                            src={
                              article.image_url ||
                              ASSETS.PLACEHOLDERS.DEFAULT
                            }
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0E]/80 via-transparent to-transparent" />

                          {/* Year badge */}
                          <span
                            className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{
                              background: `${colors.accent}22`,
                              color: colors.accent,
                              border: `1px solid ${colors.accent}55`,
                            }}
                          >
                            {colors.year}
                          </span>
                        </div>

                        {/* Card body - 4. Add flex-1 to take up remaining height */}
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          {/* Read time */}
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <Clock size={11} />
                            <span>{readTime} min read</span>
                          </div>

                          {/* Title */}
                          <h2 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-gray-100 transition-colors">
                            {article.title}
                          </h2>

                          {/* Description */}
                          {article.description && (
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                              {article.description}
                            </p>
                          )}

                          {/* Read more link - 5. Change mt-1 to mt-auto to push it to the bottom */}
                          <div
                            className="flex items-center gap-1.5 text-xs font-semibold mt-auto transition-all duration-200 group-hover:gap-2.5"
                            style={{ color: colors.accent }}
                          >
                            Read story
                            <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex items-center justify-center gap-3"
              >
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber === 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pg = i + 1;
                  const isActive = pg === pageNumber;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPageNumber(pg)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
                        isActive
                          ? "text-white border-white/20 bg-white/10"
                          : "text-gray-500 border-white/5 bg-transparent hover:bg-white/5 hover:text-gray-300"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setPageNumber((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={pageNumber === totalPages}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !error && data?.data.length === 0 && (
          <div className="text-center py-24 text-gray-600">
            <p className="text-lg font-medium">No articles yet.</p>
            <p className="text-sm mt-1">Check back soon — the story is still being written.</p>
          </div>
        )}
      </div>
    </div>
  );
};