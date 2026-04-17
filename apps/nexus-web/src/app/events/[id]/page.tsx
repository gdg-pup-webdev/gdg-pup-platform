import { EventDetailSection } from "@/features/events";
import { Metadata } from "next";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string | string[] }>;
};

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  let title = "Event | GDG PUP Nexus";
  let description = "Event details for GDG PUP Nexus";
  let images = ["/og/events.webp"];

  try {
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.v1.events.eventId.GET,
      { params: { eventId: id } }
    );

    if (result.status === 200 && result.body?.data) {
      const data = result.body.data;
      title = `${data.title} | GDG PUP`;
      description = data.short_description || description;
      if (data.image_url) images = [data.image_url];
    }
  } catch (error) {}

  return { title, description, openGraph: { images }, twitter: { images } };
}

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const rawTitle = Array.isArray(query?.title) ? query.title[0] : query?.title;

  return <EventDetailSection eventId={id} title={rawTitle} />;
}
