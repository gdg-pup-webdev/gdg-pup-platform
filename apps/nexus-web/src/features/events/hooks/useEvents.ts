/**
 * Custom hooks for events feature
 *
 * These hooks use TanStack Query for efficient data fetching,
 * caching, and state management.
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { EventsQueryParams, EventFilters, Event } from "../types";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { addEventImage, deleteEventImage, reorderEventImages } from "../api/eventImages";

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
    queryFn: async () => { 
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.GET,
        {
          query: {
            pageNumber: params.pageNumber || 1,
            pageSize: params.pageSize || 10,
            year: params.year || undefined,
          },
        },
      );

      if (result.status === 200) {
        return result.body;
      }

      throw new Error(`Failed to fetch events: ${result.body.message}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.events.eventId.GET,
        {
          params: {
            eventId,
          },
        },
      );

      if (result.status === 200) {
        return result.body.data;
      }

      throw new Error(`Failed to fetch event: ${result.body.message}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
  });
}

export function useAddEventImage(eventId: string, token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: File) => {
      return addEventImage(eventId, image, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEventImage(eventId: string, token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageIndex: number) => {
      return deleteEventImage(eventId, imageIndex, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useReorderEventImages(eventId: string, token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
      return reorderEventImages(eventId, fromIndex, toIndex, token ?? undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
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
            new Date(a.start_date || "").getTime() - new Date(b.start_date || "").getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "attendees":
          comparison = (a.attendees_count || 0) - (b.attendees_count || 0);
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
