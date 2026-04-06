export const formatPublishedDate = (publishedAt: string | null, fallback = "Unpublished") => {
  if (!publishedAt) return fallback;

  return new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
