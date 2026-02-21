"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Badge } from "@packages/spark-ui";

export default function GDGOnTopPage() {
  //   Dummy data pa lang
  const achievements = [
    {
      title: "500+ Active Members",
      description: "Growing community of passionate tech enthusiasts",
      badge: "Community",
    },
    {
      title: "50+ Events Hosted",
      description: "Workshops, hackathons, and tech talks throughout the year",
      badge: "Events",
    },
    {
      title: "20+ Projects Completed",
      description: "Collaborative projects solving real-world problems",
      badge: "Innovation",
    },
    {
      title: "100+ Certifications",
      description: "Members obtaining professional certifications",
      badge: "Learning",
    },
  ];

  const highlights = [
    "Winner of Best Tech Community Award 2024",
    "Hosted the largest student hackathon in PUP history",
    "Partnership with 10+ tech companies for career opportunities",
    "Over 1000 hours of workshops and learning sessions delivered",
    "Featured in multiple tech publications and media outlets",
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="GDG on Top"
          description="Celebrating our achievements and community excellence"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              By the Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, idx) => (
                <Card
                  key={idx}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <Badge variant="default" className="mb-4">
                    {achievement.badge}
                  </Badge>
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-700">{achievement.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Key Highlights
            </h2>
            <Card>
              <ul className="space-y-4">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-2xl mr-4">🏆</span>
                    <span className="text-lg text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Impact Statement */}
          <Card className="bg-blue-600 text-white border-blue-700">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-4">Making an Impact</h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Every achievement is a testament to our incredible community.
                Together, we're not just learning technology—we're shaping the
                future of tech education and innovation at PUP.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
