import { EventHighlightsGallerySection } from "@/features/events";

type EventHighlightsGalleryPageProps = {
  params: Promise<{ year: string; id: string }>;
  searchParams: Promise<{ title?: string | string[] }>;
};

export default async function EventHighlightsGalleryPage({
  params,
  searchParams,
}: EventHighlightsGalleryPageProps) {
  const { year, id } = await params;
  const query = await searchParams;
  const rawTitle = Array.isArray(query?.title) ? query.title[0] : query?.title;

  return (
    <EventHighlightsGallerySection
      yearParam={year}
      eventId={id}
      title={rawTitle}
    />
  );
}

