"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card } from "@/components/ui";

export default function WhoIsGDGPage() {
  //   Dummy data pa lang
  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="What is GDG?"
          description="Understanding the Google Developer Group program and community"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Google Developer Groups
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Google Developer Groups (GDGs) are community groups for college and
            university students interested in Google developer technologies.
            Students from all undergraduate or graduate programs with an
            interest in growing as a developer are welcome.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By joining a GDG, students grow their knowledge in a peer-to-peer
            learning environment and build solutions for local businesses and
            their community.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Learn</h3>
            <p className="text-gray-700">
              Gain hands-on experience with Google technologies through
              workshops, study jams, and peer-to-peer learning sessions.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Connect
            </h3>
            <p className="text-gray-700">
              Meet other students passionate about technology and build lasting
              connections within the developer community.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Grow</h3>
            <p className="text-gray-700">
              Develop your technical and leadership skills through community-led
              initiatives and collaborative projects.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">Build</h3>
            <p className="text-gray-700">
              Create solutions that matter by applying your skills to real-world
              problems and local community needs.
            </p>
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Why Join GDG PUP?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Access to workshops and events featuring the latest Google
              technologies
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Networking opportunities with industry professionals and fellow
              students
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Hands-on project experience to build your portfolio
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Leadership development through community involvement
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Recognition and rewards for active participation
            </li>
          </ul>
        </Card>
        </div>
      </div>
    </PageLayout>
  );
}
