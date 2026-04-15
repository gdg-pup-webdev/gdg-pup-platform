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
export {
  useEvents,
  useEvent,
  useEventFilters,
  useAddEventImage,
  useDeleteEventImage,
  useReorderEventImages,
} from "./hooks/useEvents";
 

// Types
export type {
  Event,
  EventsResponse,
  EventsQueryParams,
  EventCategory,
  EventFilters,
} from "./types";

export { EventsException } from "./types";
