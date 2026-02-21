/**
 * Events Feature Module
 *
 * Main export point for the events feature.
 *
 * This module provides comprehensive event management capabilities
 * including listing, filtering, and displaying events.
 */

// Components
export * from "./components";

// Hooks
export { useEvents, useEventFilters } from "./hooks/useEvents";

// API
export { getEvents } from "./api/getEvents";

// Types
export type {
  Event,
  EventsResponse,
  EventsQueryParams,
  EventCategory,
  EventFilters,
} from "./types";

export { EventsException } from "./types";
