/**
 * EventCard Component
 * 
 * Displays an individual event with Google Material Design styling.
 */

"use client";

import React from "react";
import { Card } from '@packages/spark-ui';
import { Badge } from '@packages/spark-ui';
import { Button } from '@packages/spark-ui';
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
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-blue-300">
        {/* Event Banner */}
        {event.banner_url ? (
          <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-pink-100">
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
          <div className="relative h-48 w-full bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
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
        <div className="p-5">
          {/* Event Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          {/* Event Description */}
          {event.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {event.description}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600">📅</span>
              <span className="text-gray-700 font-medium">
                {formatDate(event.start_date)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                {formatTime(event.start_date)}
              </span>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-600">📍</span>
                <span className="text-gray-700">{event.venue}</span>
              </div>
            )}

            {/* Attendees */}
            {event.attendee_count !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">👥</span>
                <span className="text-gray-700">
                  {event.attendee_count}
                  {event.max_capacity && ` / ${event.max_capacity}`} attending
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
          >
            {isUpcoming ? "Register Now" : "View Details"}
          </Button>
        </div>
      </Card>
    </Link>
  );
}
