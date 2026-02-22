/**
 * Events Page
 * 
 * Main events listing page with filtering, search, and grid display.
 * Features modern Google Material Design.
 */

"use client";

import React, { useMemo } from "react";
import {
  EventsGrid,
  EventsFilters,
  useEvents,
  useEventFilters,
} from "@/features/events";
import { Container, Stack, Inline } from "@packages/spark-ui";

export default function EventsPage() {
  const { filters, updateFilter, resetFilters, queryParams, filterEvents } =
    useEventFilters();

  const { data, isLoading, error, refetch } = useEvents(queryParams);

  // Apply client-side filtering (for search and sorting)
  const filteredEvents = useMemo(() => {
    if (!data?.data) return [];
    return filterEvents(data.data);
  }, [data?.data, filterEvents]);

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-12">
        <Stack gap="xl">
          {/* Hero Section */}
          <div className="bg-blue-600 rounded-lg p-8 text-white border border-blue-700">
            <Stack gap="md" className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold">
                Join Our Community Events
              </h2>
              <p className="text-lg">
                Connect with fellow developers, learn new skills, and build amazing
                projects together. From beginner-friendly workshops to advanced
                hackathons, there's something for everyone.
              </p>
              <Inline gap="md" wrap>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {data?.meta.totalRecords || 0}
                  </div>
                  <div className="text-sm text-gray-900">Total Events</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {filteredEvents.length}
                  </div>
                  <div className="text-sm text-gray-900">Showing</div>
                </div>
              </Inline>
            </Stack>
          </div>

          {/* Filters */}
          <EventsFilters
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            totalCount={filteredEvents.length}
          />

          {/* Events Grid */}
          <EventsGrid
            events={filteredEvents}
            isLoading={isLoading}
            error={error as Error | null}
            onRetry={() => refetch()}
          />

          {/* Pagination Info */}
          {data?.meta && !isLoading && !error && (
            <p className="text-sm text-gray-600 text-center">
              Page {data.meta.currentPage} of {data.meta.totalPages} •{" "}
              {data.meta.totalRecords} total events
            </p>
          )}
        </Stack>
      </Container>
    </div>
  );
}