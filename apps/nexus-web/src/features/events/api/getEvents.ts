/**
 * API function to fetch events from Nexus API
 *
 * Retrieves a paginated list of events with optional filtering.
 */

import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/configs/servers.config";
import { EventsException, EventsQueryParams, EventsResponse } from "../types";

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
  params: EventsQueryParams = {},
): Promise<EventsResponse> {
  try {
    // Set default pagination
    const queryParams = {
      pageNumber: 1,
      pageSize: 10,
      ...params,
    };

    // Call the events endpoint
    const result = await callEndpoint(
      configs.nexusApiBaseUrl,
      contract.api.event_system.events.GET,
      {
        query: queryParams,
      },
    );

    // Check for successful response
    if (result.status == 200 && result.body) {
      return result.body as EventsResponse;
    }

    // Handle error responses
    throw new EventsException(
      "Failed to fetch events",
      "FETCH_ERROR",
      `Received status ${result.status}`,
    );
  } catch (error) {
    // Network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new EventsException(
        `Failed to connect to Nexus API at ${configs.nexusApiBaseUrl}. Please check if the API is running.`,
        "NETWORK_ERROR",
        error.message,
      );
    }

    // Timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new EventsException(
        "Request timed out while fetching events",
        "TIMEOUT_ERROR",
        "The request took too long to complete",
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
      error instanceof Error ? error.message : String(error),
    );
  }
}
