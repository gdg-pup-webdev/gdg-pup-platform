/**
 * EventCard Component
 * 
 * Displays an individual event using SparkUI primitives and components.
 */

"use client";

import React from "react";
import { Card, Badge, Button, Stack, Inline, Text } from '@packages/spark-ui';
import { Event } from "../types";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

/**
 * Card component for displaying a single event
 * 
 * Features Material Design aesthetics with gradients,
 * shadows, and modern typography.
 */
export function EventCard({ event }: EventCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get category badge color
  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "workshop":
        return "default";
      case "meetup":
        return "success";
      case "hackathon":
        return "destructive";
      case "talk":
        return "warning";
      default:
        return "default";
    }
  };

  const isUpcoming = new Date(event.start_date) > new Date();

  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
        {/* Event Banner */}
        {event.banner_url ? (
          <div className="relative h-48 w-full overflow-hidden bg-gray-50">
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              {event.category && (
                <Badge variant={getCategoryColor(event.category)}>
                  {event.category.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-48 w-full bg-blue-500 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-2">
                {event.category === "workshop" && "🛠️"}
                {event.category === "meetup" && "👥"}
                {event.category === "hackathon" && "💻"}
                {event.category === "talk" && "🎤"}
                {!event.category && "📅"}
              </div>
            </div>
            <div className="absolute top-3 right-3">
              {event.category && (
                <Badge variant={getCategoryColor(event.category)}>
                  {event.category.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Event Content */}
        <Stack gap="md" className="p-6">
          {/* Event Title */}
          <Text variant="heading-3" className="line-clamp-2">
            {event.title}
          </Text>

          {/* Event Description */}
          {event.description && (
            <Text variant="body-sm" className="text-gray-600 line-clamp-3">
              {event.description}
            </Text>
          )}

          {/* Event Details */}
          <Stack gap="xs">
            {/* Date & Time */}
            <Inline gap="xs" align="center" className="text-sm">
              <span>📅</span>
              <Text variant="body-sm" className="font-medium">
                {formatDate(event.start_date)}
              </Text>
              <span className="text-gray-400">•</span>
              <Text variant="body-sm" className="text-gray-600">
                {formatTime(event.start_date)}
              </Text>
            </Inline>

            {/* Venue */}
            {event.venue && (
              <Inline gap="xs" align="center" className="text-sm">
                <span>📍</span>
                <Text variant="body-sm">{event.venue}</Text>
              </Inline>
            )}

            {/* Attendees */}
            {event.attendee_count !== undefined && (
              <Inline gap="xs" align="center" className="text-sm">
                <span>👥</span>
                <Text variant="body-sm">
                  {event.attendee_count}
                  {event.max_capacity && ` / ${event.max_capacity}`} attending
                </Text>
              </Inline>
            )}
          </Stack>

          {/* Action Button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full"
          >
            {isUpcoming ? "Register Now" : "View Details"}
          </Button>
        </Stack>
      </Card>
    </Link>
  );
}
