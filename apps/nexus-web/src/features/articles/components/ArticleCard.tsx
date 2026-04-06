"use client";

import { ASSETS } from "@/lib/constants/assets";
import Link from "next/link";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    published_at: string | null;
  };
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unpublished";

  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_0_40px_rgba(66,133,244,0.12)]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-transparent to-transparent opacity-60" />

        <div className="relative aspect-video w-full overflow-hidden border-b border-white/10">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={article.image_url || ASSETS.PLACEHOLDERS.DEFAULT}
            alt={article.title}
          />
        </div>

        <div className="relative flex flex-1 flex-col p-5">
          <h2 className="line-clamp-2 text-lg font-semibold text-white">{article.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{article.description}</p>
          <p className="mt-5 text-xs text-zinc-500">{publishedDate}</p>
        </div>
      </article>
    </Link>
  );
};
