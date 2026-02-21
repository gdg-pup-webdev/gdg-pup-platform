/**
 * Events Gallery Page
 * 
 * Visual gallery of past events with photos and highlights.
 * Features modern Google Material Design.
 */

"use client";

import React from "react";
import { Card, Button, Container, Grid, Stack, Inline } from '@packages/spark-ui';
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
    <div className="min-h-screen bg-white">
      <Container className="py-12">
        <Stack gap="xl">
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
          <Grid gap="lg" className="md:grid-cols-2 lg:grid-cols-4">
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
          </Grid>

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
              <Inline gap="sm" justify="center" wrap className="flex-col sm:flex-row">
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
              </Inline>
            </div>
          </Card>

          {/* Placeholder Gallery Grid */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recent Highlights
            </h3>
            <Grid gap="md" className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                >
                  Image {i}
                </div>
              ))}
            </Grid>
          </div>
        </Stack>
      </Container>
    </div>
  );
}