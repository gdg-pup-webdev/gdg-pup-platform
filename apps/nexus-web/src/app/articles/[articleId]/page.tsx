"use client";

import { ArticlePreview } from "@/features/articles/components/ArticlePreview";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const NfcPage = () => {
  const { articleId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <>
    <ArticlePreview articleId={articleId as string} />
  </>
};

export default NfcPage;
