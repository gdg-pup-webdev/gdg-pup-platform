/**
 * Type definitions for the events feature
 * 
 * This module contains all TypeScript interfaces and types used
 * in the events system.
 */

/**
 * Core event entity from the API
 */
export interface Event {
  /** Unique event identifier */
  id: string;
  
  /** Event title */
  title: string;
  
  /** Event description (optional) */
  description: string | null;
  
  /** Short event description (optional) */
  short_description?: string | null;
  
  /** Event start date-time (ISO string) */
  start_date: string;
  
  /** Event end date-time (ISO string) */
  end_date: string;
  
  /** Event venue/location */
  venue: string | null;
  
  /** Event category (workshop, meetup, hackathon, etc.) */
  category: string | null;
  
  /** Event tags for key themes */
  tags?: string[];
  
  /** Creator user ID */
  creator_id?: string;
  
  /** Event banner/image URL */
  banner_url?: string;
  
  /** Registration link  */
  registration_url?: string;
  
  /** External Bevy event URL */
  bevy_url?: string;
  
  /** Current attendee count */
  attendee_count?: number;
  
  /** Maximum capacity */
  max_capacity?: number;
  
  /** Record creation timestamp */
  created_at: string;
  
  /** Record last update timestamp */
  updated_at: string;
}

/**
 * Paginated response for events list
 */
export interface EventsResponse {
  /** List of events */
  data: Event[];
  
  /** Pagination metadata */
  meta: {
    totalRecords: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

/**
 * Query parameters for filtering events
 */
export interface EventsQueryParams {
  /** Page number (default: 1) */
  pageNumber?: number;
  
  /** Page size (default: 10) */
  pageSize?: number;
  
  /** Filter by creator user ID */
  creator_id?: string;
  
  /** Filter by category */
  category?: string;
  
  /** Filter by venue */
  venue?: string;
  
  /** Filter events starting on/after this date */
  start_date_gte?: string;
  
  /** Filter events starting on/before this date */
  start_date_lte?: string;
  
  /** Filter events ending on/after this date */
  end_date_gte?: string;
  
  /** Filter events ending on/before this date */
  end_date_lte?: string;
}

/**
 * Event category types
 */
export type EventCategory = 
  | "workshop"
  | "meetup"
  | "hackathon"
  | "talk"
  | "conference"
  | "social"
  | "other";

/**
 * Event filters for UI
 */
export interface EventFilters {
  /** Selected category filter */
  category: EventCategory | "all";
  
  /** Search query */
  search: string;
  
  /** Time filter (upcoming, past, all) */
  timeFilter: "upcoming" | "past" | "all";
  
  /** Sort order */
  sortBy: "date" | "title" | "attendees";
  
  /** Sort direction */
  sortOrder: "asc" | "desc";
}

/**
 * Exception for events-related errors
 */
export class EventsException extends Error {
  constructor(
    message: string,
    public code: 
      | "FETCH_ERROR"
      | "NETWORK_ERROR"
      | "SERVER_ERROR"
      | "NOT_FOUND"
      | "TIMEOUT_ERROR",
    public details?: string
  ) {
    super(message);
    this.name = "EventsException";
  }
}
