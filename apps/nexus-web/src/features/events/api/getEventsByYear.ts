import type { Event } from "../types";
import { getEvents } from "./getEvents";

const PAGE_SIZE = 50;
const MAX_PAGES = 8;

function getEventYear(event: Event): number | null {
  const source = event.start_date || event.end_date;
  if (!source) return null;
  const date = new Date(source);
  if (Number.isNaN(date.getTime())) return null;
  return date.getFullYear();
}

export async function getEventsByYear(year: number): Promise<Event[]> {
  const matches: Event[] = [];

  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber += 1) {
    const response = await getEvents({
      pageNumber,
      pageSize: PAGE_SIZE,
    });

    const pageMatches = response.data.filter((event) => getEventYear(event) === year);
    matches.push(...pageMatches);

    if (pageNumber >= (response.meta?.totalPages ?? pageNumber)) break;
  }

  return matches.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );
}

