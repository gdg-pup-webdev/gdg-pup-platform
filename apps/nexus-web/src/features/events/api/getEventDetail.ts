import { Event } from "../types";
import { getEvents } from "./getEvents";

const MAX_PAGES = 8;
const PAGE_SIZE = 50;

type ResolveInput = {
  routeId: string;
  title?: string;
};

function matchEvent(event: Event, routeId: string, decodedRouteId: string, title?: string) {
  if (event.id === routeId || event.id === decodedRouteId) return true;
  if (event.bevy_url && (event.bevy_url === routeId || event.bevy_url === decodedRouteId)) return true;
  if (title && event.title === title) return true;
  return false;
}

export async function getEventDetail({
  routeId,
  title,
}: ResolveInput): Promise<Event | null> {
  const decodedRouteId = decodeURIComponent(routeId);

  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber += 1) {
    const response = await getEvents({
      pageNumber,
      pageSize: PAGE_SIZE,
    });

    const found = response.data.find((event) =>
      matchEvent(event, routeId, decodedRouteId, title),
    );
    if (found) return found;

    if (pageNumber >= (response.meta?.totalPages ?? pageNumber)) break;
  }

  return null;
}
