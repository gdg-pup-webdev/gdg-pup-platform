/**
 * Custom hooks for events feature
 *
 * These hooks use TanStack Query for efficient data fetching,
 * caching, and state management.
 */

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getEvents } from "../api/getEvents";
import { EventsQueryParams, EventFilters, Event } from "../types";

/**
 * Hook to fetch events with TanStack Query
 *
 * Provides automatic caching, background refetching, and state management
 * for events data.
 *
 * @param params - Query parameters for filtering events
 * @returns Query result with events data, loading state, and error
 *
 * @example
 * ```tsx
 * function EventsList() {
 *   const { data, isLoading, error, refetch } = useEvents({
 *     category: "workshop",
 *     pageSize: 20
 *   });
 *
 *   if (isLoading) return <LoadingState />;
 *   if (error) return <ErrorState error={error} />;
 *
 *   return <EventGrid events={data.data} />;
 * }
 * ```
 */
export function useEvents(params: EventsQueryParams = {}) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
  });
}

/**
 * Hook to manage event filters
 *
 * Provides state management and helper functions for filtering
 * events in the UI.
 *
 * @returns Filter state and update functions
 *
 * @example
 * ```tsx
 * function EventsPage() {
 *   const {
 *     filters,
 *     updateFilter,
 *     resetFilters,
 *     queryParams
 *   } = useEventFilters();
 *
 *   const { data } = useEvents(queryParams);
 *
 *   return (
 *     <>
 *       <FilterBar filters={filters} onChange={updateFilter} />
 *       <EventsList events={filteredEvents} />
 *     </>
 *   );
 * }
 * ```
 */
export function useEventFilters() {
  // Filter state
  const [filters, setFilters] = useState<EventFilters>({
    category: "all",
    search: "",
    timeFilter: "upcoming",
    sortBy: "date",
    sortOrder: "asc",
  });

  /**
   * Update a single filter
   */
  const updateFilter = <K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Reset all filters to defaults
   */
  const resetFilters = () => {
    setFilters({
      category: "all",
      search: "",
      timeFilter: "upcoming",
      sortBy: "date",
      sortOrder: "asc",
    });
  };

  /**
   * Convert UI filters to API query parameters
   */
  const queryParams: EventsQueryParams = useMemo(() => {
    const params: EventsQueryParams = {};

    // Category filter
    if (filters.category !== "all") {
      params.category = filters.category;
    }

    // Time filter
    const now = new Date().toISOString();
    if (filters.timeFilter === "upcoming") {
      params.start_date_gte = now;
    } else if (filters.timeFilter === "past") {
      params.end_date_lte = now;
    }

    return params;
  }, [filters]);

  /**
   * Client-side filtering function
   * (for search and sorting which aren't in the API)
   */
  const filterEvents = (events: Event[]): Event[] => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.venue?.toLowerCase().includes(searchLower),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "date":
          comparison =
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "attendees":
          comparison = (a.attendee_count || 0) - (b.attendee_count || 0);
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    queryParams,
    filterEvents,
  };
}
