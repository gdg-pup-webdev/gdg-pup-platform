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
import { PageLayout, PageHeader } from "@/components/shared";

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
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <PageHeader
            title="Events"
            description="Discover and join our upcoming workshops, meetups, and hackathons"
          />

          {/* Hero Section */}
          <div className="mt-8 bg-blue-600 rounded-lg p-8 text-white border border-blue-700">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Community Events
              </h2>
              <p className="text-lg mb-6">
                Connect with fellow developers, learn new skills, and build
                amazing projects together. From beginner-friendly workshops to
                advanced hackathons, there's something for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
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
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8">
            <EventsFilters
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              totalCount={filteredEvents.length}
            />
          </div>

          {/* Events Grid */}
          <div className="mt-8">
            <EventsGrid
              events={filteredEvents}
              isLoading={isLoading}
              error={error as Error | null}
              onRetry={() => refetch()}
            />
          </div>

          {/* Pagination Info */}
          {data?.meta && !isLoading && !error && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Page {data.meta.currentPage} of {data.meta.totalPages} •{" "}
                {data.meta.totalRecords} total events
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
