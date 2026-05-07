/**
 * API function to fetch events from Nexus API directly.
 */

import { EventsException, EventsQueryParams, EventsResponse } from "../types";
import { configs } from "@/configs/servers.config";

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");

const buildQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

type RawEvent = {
  venue?: string | null;
  location?: string | null;
  url?: string | null;
  registration_url?: string | null;
  attendee_virtual_venue_url?: string | null;
  attendee_virtual_venue_link?: string | null;
  bevy_url?: string | null;
  is_virtual_event?: boolean;
  banner_url?: string | null;
  cover_image_url?: string | null;
  gallery_images?: unknown;
  image_urls?: unknown;
  images?: unknown;
  media?: unknown;
  short_description?: string | null;
  description_short?: string | null;
  tags?: string[] | null;
  category?: string | null;
  event_type?: string | null;
  attendee_count?: number;
  attendees?: number;
  max_capacity?: number;
  total_capacity?: number;
} & Record<string, unknown>;

const firstNonEmptyString = (...values: Array<unknown>): string | null => {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return null;
};

const isImageLikeUrl = (value: string): boolean => {
  const normalized = value.trim();
  if (!normalized) return false;
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return true;
  }
  if (normalized.startsWith("/")) return true;
  return false;
};

const extractImageUrls = (value: unknown): string[] => {
  if (!value) return [];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        return extractImageUrls(JSON.parse(trimmed));
      } catch {
        return isImageLikeUrl(trimmed) ? [trimmed] : [];
      }
    }

    return isImageLikeUrl(trimmed) ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractImageUrls);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const commonKeys = [
      "url",
      "src",
      "image_url",
      "imageUrl",
      "public_url",
      "publicUrl",
      "secure_url",
      "secureUrl",
      "link",
      "href",
    ];

    for (const key of commonKeys) {
      const urls = extractImageUrls(obj[key]);
      if (urls.length > 0) return urls;
    }
  }

  return [];
};

const dedupeUrls = (urls: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const url of urls) {
    const normalized = url.trim();
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

const normalizeGalleryImages = (event: RawEvent): string[] =>
  dedupeUrls([
    ...extractImageUrls(event?.gallery_images),
    ...extractImageUrls(event?.image_urls),
    ...extractImageUrls(event?.images),
    ...extractImageUrls(event?.media),
  ]);

const normalizeEvent = (event: RawEvent) => ({
  ...event,
  short_description: firstNonEmptyString(
    event?.short_description,
    event?.description_short,
  ),
  venue: firstNonEmptyString(
    event?.venue,
    event?.location,
    event?.attendee_virtual_venue_url,
    event?.attendee_virtual_venue_link,
  ) ?? (event?.is_virtual_event ? "Online" : null),
  banner_url: firstNonEmptyString(event?.banner_url, event?.cover_image_url),
  cover_image_url: firstNonEmptyString(event?.cover_image_url, event?.banner_url),
  gallery_images: normalizeGalleryImages(event),
  category: event?.category ?? event?.event_type ?? null,
  tags: Array.isArray(event?.tags) ? event.tags : [],
  registration_url: firstNonEmptyString(
    event?.registration_url,
    event?.bevy_url,
    event?.url,
  ),
  attendee_count: event?.attendee_count ?? event?.attendees,
  max_capacity: event?.max_capacity ?? event?.total_capacity,
});

/**
 * Fetch events from the Nexus API
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated events response
 * @throws EventsException if the request fails
 * 
 * @example
 * ```tsx
 * // Get upcoming workshops
 * const events = await getEvents({
 *   category: "workshop",
 *   start_date_gte: new Date().toISOString(),
 *   pageSize: 20
 * });
 * ```
 */
export async function getEvents_deprecated(
  params: EventsQueryParams = {}
): Promise<EventsResponse> {
  try {
    // Set default pagination
    const queryParams = {
      pageNumber: 1,
      pageSize: 10,
      ...params,
    };

    const qs = buildQueryString(queryParams as Record<string, unknown>);
    const suffix = qs ? `?${qs}` : "";
    const baseUrl = trimTrailingSlash(configs.nexusApiBaseUrl);
    const candidatePaths = [
      `/api/v1/gdg-scraped-events${suffix}`,
      `/api/event-system/events${suffix}`,
      `/api/v0/event-system/events${suffix}`,
    ];
    const failures: Array<{ path: string; detail: string }> = [];

    for (const path of candidatePaths) {
      const url = `${baseUrl}${path}`;
      const response = await fetch(url, { method: "GET", cache: "no-store" });
      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (
        response.ok &&
        payload?.status === "success" &&
        Array.isArray(payload?.data)
      ) {
        return {
          ...payload,
          data: payload.data.map(normalizeEvent),
        } as EventsResponse;
      }

      const detail =
        typeof payload === "string"
          ? payload
          : payload?.errors?.[0]?.detail ||
            payload?.message ||
            `Received status ${response.status}`;
      failures.push({ path, detail });
    }

    const fallbackDetail = failures
      .map((failure) => `${failure.path}: ${failure.detail}`)
      .join(" | ");
    throw new EventsException(
      "Failed to fetch events",
      "FETCH_ERROR",
      fallbackDetail || "All events endpoints failed"
    );

  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new EventsException(
        "Failed to connect to events service. Please check if Nexus API is running.",
        "NETWORK_ERROR",
        error.message
      );
    }

    // Timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new EventsException(
        "Request timed out while fetching events",
        "TIMEOUT_ERROR",
        "The request took too long to complete"
      );
    }

    // Re-throw EventsException
    if (error instanceof EventsException) {
      throw error;
    }

    // Unknown errors
    throw new EventsException(
      "An unexpected error occurred while fetching events",
      "SERVER_ERROR",
      error instanceof Error ? error.message : String(error)
    );
  }
}
