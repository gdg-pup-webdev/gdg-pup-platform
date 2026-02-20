/**
 * Events Gallery Page
 * 
 * Visual gallery of past events with photos and highlights.
 * Features modern Google Material Design.
 */

"use client";

import React from "react";
import { PageLayout, PageHeader } from "@/components/shared";
import { Card } from '@packages/spark-ui';
import { Button } from '@packages/spark-ui';
import Link from "next/link";

export default function EventsGalleryPage() {
  // Sample gallery data (replace with actual API call later)
  const galleryCategories = [
    {
      title: "Workshops",
      count: 24,
      color: "bg-blue-600",
    },
    {
      title: "Hackathons",
      count: 12,
      color: "bg-green-600",
    },
    {
      title: "Meetups",
      count: 36,
      color: "bg-yellow-600",
    },
    {
      title: "Conferences",
      count: 8,
      color: "bg-red-600",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <PageHeader
            title="Event Gallery"
            description="Relive the moments from our past events"
          />

          {/* Hero Section */}
          <div className="mt-8 bg-red-600 rounded-lg p-8 text-white border border-red-700">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Capture the Memories
              </h2>
              <p className="text-lg mb-6">
                Browse through our collection of photos and videos from past events.
                See the community in action, the learning moments, and the fun we
                had together!
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryCategories.map((category) => (
              <Card
                key={category.title}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className={`${category.color} p-8 text-center`}>
                  <h3 className="text-xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-2xl font-bold text-gray-700">
                    {category.count} events
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <Card className="mt-8 bg-yellow-50 border-yellow-300 border-2">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Gallery Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're currently building out our event gallery feature. Soon you'll
                be able to browse through photos, videos, and highlights from all
                our past events. Check back soon!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/events">
                  <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Upcoming Events
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="secondary">
                    Visit Community Page
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Placeholder Gallery Grid */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recent Highlights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                >
                  Image {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}