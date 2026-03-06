<<<<<<< HEAD
/**
 * Home Page
 *
 * Modern landing page with Google Material Design.
 * Features hero section, highlights, and API health monitoring.
 */

"use client";

import { Header } from "@packages/spark-ui";
import { HealthChecksGrid } from "@/features/health-checks";
import { Card } from "@packages/spark-ui";
import { Button } from "@packages/spark-ui";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "Smart NFC Cards",
      description:
        "Tap to access your digital profile instantly. Activate and manage your GDG membership card.",
      link: "/activate",
      color: "bg-blue-600",
    },
    {
      title: "Community Events",
      description:
        "Join workshops, hackathons, and meetups. Learn, build, and connect with fellow developers.",
      link: "/events",
      color: "bg-green-600",
    },
    {
      title: "Member Profiles",
      description:
        "Showcase your projects, achievements, and contributions to the GDG community.",
      link: "/community",
      color: "bg-yellow-600",
    },
    {
      title: "Leaderboards",
      description:
        "Compete with peers, earn badges, and climb the rankings through active participation.",
      link: "/leaderboards",
      color: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Title */}
            <Header>
              <span className="text-blue-600">GDG PUP</span> Nexus
            </Header>

            {/* Subtitle */}
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Your gateway to the{" "}
              <strong className="text-blue-600">Google Developer Group</strong>{" "}
              community. Connect, learn, and build together with fellow
              developers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Explore Events
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to engage with the GDG community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                <div className={`${feature.color} p-6 text-center`}>
                  <h3 className="text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            System Status
          </h2>
          <p className="text-gray-600">
            Real-time monitoring of our platform services
          </p>
        </div>

        <HealthChecksGrid />
      </div>
    </div>
=======
"use client";

import { WhoAreWeSection, HeroSection, WhatWeDoSection, WhatDrivesUsSection, ImpactSection, SparkStartsHereSection } from "@/features/home";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhoAreWeSection />
      <WhatWeDoSection />
      <WhatDrivesUsSection />
      <ImpactSection />
      <SparkStartsHereSection />
    </>
>>>>>>> dev
  );
}
