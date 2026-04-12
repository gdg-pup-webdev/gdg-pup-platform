"use client";

import React from "react";
import { useListArticles } from "../hooks/useListArticle";
import { WireframePagination } from "@/components/wireframing-ui/WireframePagination";
import { ASSETS } from "@/lib/constants/assets";
import Link from "next/link";

export const ArticleList = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, error, isLoading } = useListArticles(pageNumber, pageSize);

  if (!data || error || isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col gap-4 mt-50 max-w-5xl mx-auto">
        <div>ArticleList</div>
        <WireframePagination
          currentPage={pageNumber}
          totalPages={data?.meta.totalPages}
          pageSize={pageSize}
          totalRecords={data?.meta.totalRecords}
          onPageChange={setPageNumber}
          onPageSizeChange={setPageSize}
        />

        {data?.data.map((article) => (
          <Link prefetch={false} href={`/articles/${article.id}`} key={article.id}>
            <div
              className="border-5 p-5 flex flex-col gap-2 hover:bg-gray-400"
              key={article.id}
            >
              <img
                className="w-50 aspect-auto"
                src={article.image_url || ASSETS.PLACEHOLDERS.DEFAULT}
                alt={article.title}
              />
              <div>title: {article.title}</div>
              <div>description: {article.description}</div>
              <div>id: {article.id}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
