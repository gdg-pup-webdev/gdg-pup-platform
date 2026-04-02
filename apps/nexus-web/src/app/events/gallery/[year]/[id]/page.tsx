import { EventHighlightsGallerySection } from "@/features/events";

type EventHighlightsGalleryPageProps = {
  params: Promise<{ year: string; id: string }>;
  searchParams: Promise<{ title?: string }>;
};

export default async function EventHighlightsGalleryPage({
  params,
  searchParams,
}: EventHighlightsGalleryPageProps) {
  const { year, id } = await params;
  const { title } = await searchParams;

  return (
    <EventHighlightsGallerySection
      yearParam={year}
      eventId={id}
      title={title}
    />
  );
}
