"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";

export default function CommunityPage() {
  //   Dummy data pa lang
  const stats = [
    { label: "Active Members", value: "500+", icon: "👥" },
    { label: "Projects", value: "20+", icon: "🚀" },
    { label: "Events This Year", value: "50+", icon: "📅" },
    { label: "Partners", value: "10+", icon: "🤝" },
  ];

  const activities = [
    {
      title: "Weekly Study Jams",
      description:
        "Collaborative learning sessions covering various tech topics and Google technologies.",
      schedule: "Every Wednesday, 6:00 PM",
    },
    {
      title: "Monthly Workshops",
      description:
        "Hands-on technical workshops led by industry professionals and community leaders.",
      schedule: "First Saturday of the month",
    },
    {
      title: "Hackathons",
      description:
        "Build innovative solutions to real-world problems in intensive coding events.",
      schedule: "Quarterly",
    },
    {
      title: "Tech Talks",
      description:
        "Inspiring talks from industry experts sharing insights and experiences.",
      schedule: "Bi-monthly",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="Our Community"
          description="A vibrant ecosystem of learners, builders, and innovators"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-700">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* About Community */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What Makes Us Special
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our community is more than just a student organization—it's a
                family of passionate individuals who support each other's growth
                and success.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Whether you're a beginner taking your first steps in programming
                or an experienced developer looking to share knowledge, there's
                a place for you here.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Badge variant="info">Inclusive</Badge>
                <Badge variant="success">Collaborative</Badge>
                <Badge variant="warning">Innovative</Badge>
                <Badge variant="default">Student-Led</Badge>
              </div>
            </div>
            <Card className="bg-blue-50 border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Join Our Community
              </h3>
              <p className="text-blue-800 mb-6">
                Ready to start your journey with us? Connect with like-minded
                peers and grow your skills together.
              </p>
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Become a Member
              </button>
            </Card>
          </div>
        </section>

        {/* Activities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Community Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-700 mb-3">{activity.description}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  {activity.schedule}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Member Showcase Link */}
        <section>
          <Card className="bg-purple-50 border-2 border-purple-200">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                Member Showcase
              </h2>
              <p className="text-purple-800 mb-6 max-w-2xl mx-auto">
                Discover the amazing projects, achievements, and stories from
                our talented community members.
              </p>
              <Link href="/community/member-showcase">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Member Showcase
                </button>
              </Link>
            </div>
          </Card>
        </section>
        </div>
      </div>
    </PageLayout>
  );
}
