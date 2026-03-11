import { EventDetailSection } from "@/features/events";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string | string[] }>;
};

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const rawTitle = Array.isArray(query?.title) ? query.title[0] : query?.title;

  return <EventDetailSection eventId={id} title={rawTitle} />;
}
