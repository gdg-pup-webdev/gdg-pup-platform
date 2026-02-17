"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card } from "@/components/ui";
import Link from "next/link";

export default function AboutPage() {
  //   Sample content pa lang
  return (
    <PageLayout>
      <PageHeader
        title="About GDG PUP"
        description="Learn more about our community, mission, and the people behind it all."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Google Developer Group (GDG) Polytechnic University of the
            Philippines is a community of students passionate about technology,
            innovation, and collaborative learning.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We bring together developers, designers, and tech enthusiasts to
            learn, share knowledge, and build amazing projects together.
          </p>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Explore More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/about/who-is-gdg">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  What is GDG?
                </h3>
                <p className="text-gray-600">
                  Discover the Google Developer Group program and what it means
                  for students.
                </p>
              </Card>
            </Link>

            <Link href="/about/history">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Our History
                </h3>
                <p className="text-gray-600">
                  Learn about our journey from inception to where we are today.
                </p>
              </Card>
            </Link>

            <Link href="/about/meet-the-team">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Meet the Team
                </h3>
                <p className="text-gray-600">
                  Get to know the passionate individuals leading our community.
                </p>
              </Card>
            </Link>

            <Link href="/about/gdg-on-top">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  GDG on Top
                </h3>
                <p className="text-gray-600">
                  Celebrating our achievements and community milestones.
                </p>
              </Card>
            </Link>

            <Link href="/about/partnership">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Partnership
                </h3>
                <p className="text-gray-600">
                  Interested in partnering with us? Learn about collaboration
                  opportunities.
                </p>
              </Card>
            </Link>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700">
              To empower students through technology education, hands-on
              learning experiences, and collaborative innovation that shapes
              future tech leaders.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700">
              A thriving community where every student has the opportunity to
              learn, grow, and contribute to the ever-evolving world of
              technology.
            </p>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
