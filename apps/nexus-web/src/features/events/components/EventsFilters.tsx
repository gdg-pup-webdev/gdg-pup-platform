/**
 * EventsFilters Component
 * 
 * Filter and search controls for events with Google Material Design styling.
 */

"use client";

import React from "react";
import { Card } from '@packages/spark-ui';
import { Input } from '@packages/spark-ui';
import { Button } from '@packages/spark-ui';
import { Badge } from '@packages/spark-ui';
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
    <Card className="bg-linear-to-br from-white to-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              Filter Events
            </h2>
            {totalCount !== undefined && (
              <p className="text-sm text-gray-600 mt-1">
                Showing {totalCount} event{totalCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center gap-1">
              <span>🔄</span>
              Reset
            </span>
          </Button>
        </div>

        {/* Search Bar */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Search Events
          </label>
          <Input
            type="text"
            placeholder="Search by title, description, or venue..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onFilterChange("category", cat.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${
                    filters.category === cat.value
                      ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">
            Time Period
          </label>
          <div className="flex gap-2">
            {timeFilters.map((time) => (
              <button
                key={time.value}
                onClick={() => onFilterChange("timeFilter", time.value)}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${
                    filters.timeFilter === time.value
                      ? "bg-linear-to-r from-green-600 to-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-900">
          {/* Sort By */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Sort By
            </label>
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
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Sort Order
            </label>
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
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.search || filters.category !== "all" || filters.timeFilter !== "upcoming") && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
