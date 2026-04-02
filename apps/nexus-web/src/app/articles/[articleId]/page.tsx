"use client";

import { ArticlePreview } from "@/features/articles/components/ArticlePreview";
import { useNfcCard } from "@/features/nfc-cards/hooks/useNfcCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const NfcPage = () => {
  const { articleId } = useParams(); 



  return <>
    <ArticlePreview articleId={articleId as string} />
  </>
};

export default NfcPage;
