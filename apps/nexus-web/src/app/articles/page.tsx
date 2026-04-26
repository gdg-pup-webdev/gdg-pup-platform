import { Metadata } from "next";
import { ArticleList } from "@/features/articles/components/ArticleList";
import React from "react";

export const metadata: Metadata = {
  title: "Articles | GDG PUP Nexus",
  description: "Read the latest tech blogs, articles, and knowledge shared by our developer community.",
  openGraph: { images: ["/og/articles.webp"] },
  twitter: { images: ["/og/articles.webp"] },
};

const page = () => {
  return <ArticleList />;
};

export default page;
