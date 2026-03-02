/**
 * EventsFilters Component
 * 
 * Filter and search controls for events with Google Material Design styling.
 */

"use client";

import React from "react";
import { Card, Input, Button, Badge, Stack, Inline, Text, Grid } from '@packages/spark-ui';
import { EventFilters, EventCategory } from "../types";

interface EventsFiltersProps {
  filters: EventFilters;
  onFilterChange: <K extends keyof EventFilters>(
    key: K,
    value: EventFilters[K]
  ) => void;
  onReset: () => void;
  totalCount?: number;
}

/**
 * Events filter bar component
 * 
 * Provides controls for category, time, search, and sorting
 * with modern Material Design aesthetics.
 */
export function EventsFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: EventsFiltersProps) {
  const categories: Array<{ value: EventCategory | "all"; label: string; icon: string }> = [
    { value: "all", label: "All Events", icon: "📅" },
    { value: "workshop", label: "Workshops", icon: "🛠️" },
    { value: "meetup", label: "Meetups", icon: "👥" },
    { value: "hackathon", label: "Hackathons", icon: "💻" },
    { value: "talk", label: "Talks", icon: "🎤" },
    { value: "conference", label: "Conferences", icon: "🎯" },
    { value: "social", label: "Social", icon: "🎉" },
    { value: "other", label: "Other", icon: "✨" },
  ];

  const timeFilters: Array<{ value: EventFilters["timeFilter"]; label: string }> = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
    { value: "all", label: "All Time" },
  ];

  return (
    <Card className="p-8">
      <Stack gap="lg">
        {/* Header */}
        <Inline align="center" justify="between">
          <Stack gap="xs">
            <Inline gap="xs" align="center">
              <Text variant="heading-3">🔍 Filter Events</Text>
            </Inline>
            {totalCount !== undefined && (
              <Text variant="body-sm" className="text-gray-600">
                Showing {totalCount} event{totalCount !== 1 ? "s" : ""}
              </Text>
            )}
          </Stack>
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
          >
            🔄 Reset
          </Button>
        </Inline>

        {/* Search Bar */}
        <Stack gap="xs">
          <Text variant="label" className="text-gray-700">
            Search Events
          </Text>
          <Input
            type="text"
            placeholder="Search by title, description, or venue..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full"
          />
        </Stack>

        {/* Category Filter */}
        <Stack gap="xs">
          <Text variant="label" className="text-gray-700">
            Category
          </Text>
          <Inline gap="xs" className="flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => onFilterChange("category", cat.value)}
                variant={filters.category === cat.value ? "primary" : "secondary"}
                size="sm"
              >
                {cat.icon} {cat.label}
              </Button>
            ))}
          </Inline>
        </Stack>

        {/* Time Filter */}
        <Stack gap="xs">
          <Text variant="label" className="text-gray-700">
            Time Period
          </Text>
          <Inline gap="xs">
            {timeFilters.map((time) => (
              <Button
                key={time.value}
                onClick={() => onFilterChange("timeFilter", time.value)}
                variant={filters.timeFilter === time.value ? "primary" : "secondary"}
                size="sm"
                className="flex-1"
              >
                {time.label}
              </Button>
            ))}
          </Inline>
        </Stack>

        {/* Sort Options */}
        <Grid gap="md" className="grid-cols-1 md:grid-cols-2">
          {/* Sort By */}
          <Stack gap="xs">
            <Text variant="label" className="text-gray-700">
              Sort By
            </Text>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange(
                  "sortBy",
                  e.target.value as EventFilters["sortBy"]
                )
              }
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="attendees">Attendees</option>
            </select>
          </Stack>

          {/* Sort Order */}
          <Stack gap="xs">
            <Text variant="label" className="text-gray-700">
              Sort Order
            </Text>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                onFilterChange(
                  "sortOrder",
                  e.target.value as EventFilters["sortOrder"]
                )
              }
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </Stack>
        </Grid>

        {/* Active Filters Summary */}
        {(filters.search || filters.category !== "all" || filters.timeFilter !== "upcoming") && (
          <Stack gap="xs" className="pt-4 border-t border-gray-200">
            <Text variant="label" className="text-gray-700">
              Active Filters:
            </Text>
            <Inline gap="xs" className="flex-wrap">
              {filters.search && (
                <Badge variant="default">
                  Search: "{filters.search}"
                </Badge>
              )}
              {filters.category !== "all" && (
                <Badge variant="default">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.timeFilter !== "upcoming" && (
                <Badge variant="default">
                  Time: {filters.timeFilter}
                </Badge>
              )}
            </Inline>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
