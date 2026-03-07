/**
 * API function to fetch events from Nexus API via Next.js proxy route.
 */

import { EventsException, EventsQueryParams, EventsResponse } from "../types";

const buildQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

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
export async function getEvents(
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
    const response = await fetch(`/api/events?${qs}`, {
      method: "GET",
      cache: "no-store",
    });
    const payload = await response.json();

    // Check for successful response
    if (
      response.ok &&
      payload?.status === "success" &&
      Array.isArray(payload?.data)
    ) {
      return payload as EventsResponse;
    }

    // Handle error responses
    const detail =
      payload?.errors?.[0]?.detail || payload?.message || `Received status ${response.status}`;
    throw new EventsException(
      "Failed to fetch events",
      "FETCH_ERROR",
      detail
    );

  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new EventsException(
        "Failed to connect to events proxy. Please check if Nexus Web and Nexus API are running.",
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
