"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import { useGetOneEvent } from "../hooks/useGetOneEvent";
import { useListAttendees } from "../hooks/useListAttendees";
import { useCheckinToEvent } from "../hooks/useCheckinToEvent";
import { useParams } from "next/navigation";

export const EventDetails: React.FC = () => {
  const { eventId } = useParams() as { eventId: string };
  const { data: eventResponse, isLoading: isEventLoading, isError: isEventError } = useGetOneEvent(eventId);
  const [page, setPage] = useState(1);
  const { data: attendeesResponse, isLoading: isAttendeesLoading } = useListAttendees(eventId, page);
  const checkinMutation = useCheckinToEvent();
  const [attendeeId, setAttendeeId] = useState("");

  const event = eventResponse?.data;
  const attendees = attendeesResponse?.data || [];

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeId) return;
    try {
      await checkinMutation.mutateAsync({
        eventId,
        attendeeId,
        checkinMethod: "MANUAL",
      });
      alert("Checked in successfully!");
      setAttendeeId("");
    } catch (err) {
      alert(`Failed to check in: ${(err as Error).message}`);
    }
  };

  if (isEventLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-teal-600" />
      </div>
    );
  }

  if (isEventError || !event) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-red-100 bg-red-50 p-12 text-center">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h3 className="text-lg font-bold text-red-900">Event not found</h3>
        <p className="mt-1 text-sm text-red-700">The event you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Column: Event Details */}
      <div className="lg:col-span-1 space-y-6">
        <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
          {event.image_url && (
            <img src={event.image_url} alt={event.title} className="h-48 w-full object-cover" />
          )}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
            <span className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600 uppercase tracking-wider">
              {event.category}
            </span>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{event.description}</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-3 text-teal-600" />
                {new Date(event.start_date).toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-3 text-teal-600" />
                {event.venue || "No venue specified"}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-3 text-teal-600" />
                {event.attendees_count} Registered Attendees
              </div>
            </div>
          </div>
        </div>

        {/* Quick Check-in Form */}
        <div className="rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle size={18} className="mr-2 text-teal-600" />
            Quick Check-in
          </h3>
          <form onSubmit={handleCheckin} className="space-y-4">
            <input
              required
              value={attendeeId}
              onChange={(e) => setAttendeeId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={checkinMutation.isPending}
              className="w-full rounded-sm bg-teal-600 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700 disabled:bg-teal-300"
            >
              {checkinMutation.isPending ? "Checking in..." : "Check-in"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Attendee List */}
      <div className="lg:col-span-2">
        <div className="rounded-sm border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
            <h3 className="text-md font-bold text-gray-900 flex items-center">
              <Users size={18} className="mr-2 text-teal-600" />
              Attendee History
            </h3>
            <span className="text-xs font-medium text-gray-500">{event.attendees_count} total</span>
          </div>
          
          {isAttendeesLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 size={32} className="animate-spin text-teal-600" />
            </div>
          ) : attendees.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Checked In At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendees.map((attendee: any) => (
                  <tr key={attendee.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{attendee.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {attendee.checkin_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(attendee.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Users size={32} className="mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">No attendees checked in yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
