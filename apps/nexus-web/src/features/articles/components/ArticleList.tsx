"use client";

import React from "react";
import { useListArticles } from "../hooks/useListArticle";
import { WireframePagination } from "@/components/wireframing-ui/WireframePagination";
import { Loader2 } from "lucide-react";
import { CosmosParticles } from "@/components/shared";
import { ArticleCard } from "./ArticleCard";

const LOADING_SKELETON_COUNT = 6;

export const ArticleList = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, error, isLoading } = useListArticles(pageNumber, pageSize);

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={90}
      particleSpread={16}
      speed={0.02}
      particleBaseSize={65}
      moveParticlesOnHover
      alphaParticles
      disableRotation={false}
      className="min-h-screen bg-[#0F0E0E] px-4 pb-14 pt-28 text-white md:px-8 md:pt-36"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Articles</h1>
          <p className="text-sm text-zinc-400 md:text-base">
            Stories, milestones, and highlights from the GDG on Campus PUP community.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-[#4285F4]" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: LOADING_SKELETON_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                />
              ))}
            </div>
          </div>
        ) : error || !data ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            Failed to load articles. Please try again.
          </div>
        ) : data.data.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
            <p className="text-lg font-semibold text-white">No articles published yet.</p>
            <p className="mt-2 text-sm text-zinc-400">Please check back soon for new updates.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <WireframePagination
              currentPage={pageNumber}
              totalPages={data.meta.totalPages}
              pageSize={pageSize}
              totalRecords={data.meta.totalRecords}
              onPageChange={setPageNumber}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </CosmosParticles>
  );
};
