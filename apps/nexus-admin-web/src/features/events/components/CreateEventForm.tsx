"use client";

import React, { useState } from "react";
import { Loader2, Calendar, MapPin, Type, FileText, Star, Image as ImageIcon } from "lucide-react";
import { useCreateEvent } from "../hooks/useCreateEvent";

export const CreateEventForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const createEventMutation = useCreateEvent();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    start_date: "",
    end_date: "",
    attendance_points: 10,
    image_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "attendance_points" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEventMutation.mutateAsync({
        ...formData,
        image_url: formData.image_url || null,
      });
      alert("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        venue: "",
        start_date: "",
        end_date: "",
        attendance_points: 10,
        image_url: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(`Failed to create event: ${(err as Error).message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-sm border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <Type size={16} className="mr-2 text-teal-600" />
            Event Title
          </label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. React Workshop"
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <Star size={16} className="mr-2 text-teal-600" />
            Category
          </label>
          <input
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Workshop, Seminar"
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <FileText size={16} className="mr-2 text-teal-600" />
            Description
          </label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about the event..."
            rows={3}
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <MapPin size={16} className="mr-2 text-teal-600" />
            Venue
          </label>
          <input
            required
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. Main Auditorium"
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <Star size={16} className="mr-2 text-teal-600" />
            Attendance Points
          </label>
          <input
            required
            type="number"
            name="attendance_points"
            value={formData.attendance_points}
            onChange={handleChange}
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <Calendar size={16} className="mr-2 text-teal-600" />
            Start Date
          </label>
          <input
            required
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <Calendar size={16} className="mr-2 text-teal-600" />
            End Date
          </label>
          <input
            required
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center text-sm font-bold text-gray-700">
            <ImageIcon size={16} className="mr-2 text-teal-600" />
            Image URL (Optional)
          </label>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={createEventMutation.isPending}
          className="flex items-center rounded-sm bg-teal-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-teal-700 disabled:bg-teal-300"
        >
          {createEventMutation.isPending ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </button>
      </div>
    </form>
  );
};
