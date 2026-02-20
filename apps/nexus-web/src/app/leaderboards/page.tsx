"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Avatar, Badge } from "@packages/spark-ui";

export default function LeaderboardsPage() {
  //   Dummy data pa lang
  const leaderboardData = [
    {
      rank: 1,
      name: "Alex Rivera",
      points: 2450,
      events: 35,
      projects: 12,
      badges: ["Top Contributor", "Event Champion"],
    },
    {
      rank: 2,
      name: "Sam Chen",
      points: 2280,
      events: 32,
      projects: 10,
      badges: ["Research Leader", "Mentor"],
    },
    {
      rank: 3,
      name: "Jordan Lee",
      points: 2150,
      events: 28,
      projects: 15,
      badges: ["Design Expert", "Innovator"],
    },
    {
      rank: 4,
      name: "Taylor Park",
      points: 1980,
      events: 30,
      projects: 8,
      badges: ["Mobile Dev", "Bug Hunter"],
    },
    {
      rank: 5,
      name: "Morgan Smith",
      points: 1850,
      events: 25,
      projects: 9,
      badges: ["Cloud Expert", "Speaker"],
    },
    {
      rank: 6,
      name: "Casey Johnson",
      points: 1720,
      events: 22,
      projects: 7,
      badges: ["DevOps Pro", "Automation"],
    },
    {
      rank: 7,
      name: "Riley Davis",
      points: 1650,
      events: 24,
      projects: 6,
      badges: ["Quick Learner"],
    },
    {
      rank: 8,
      name: "Jamie Wilson",
      points: 1520,
      events: 20,
      projects: 8,
      badges: ["Community Helper"],
    },
    {
      rank: 9,
      name: "Avery Brown",
      points: 1480,
      events: 19,
      projects: 7,
      badges: ["Rising Star"],
    },
    {
      rank: 10,
      name: "Quinn Taylor",
      points: 1390,
      events: 18,
      projects: 6,
      badges: ["Consistent"],
    },
  ];

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="Leaderboards"
          description="Community rankings based on participation, contributions, and achievements"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-3xl font-bold text-yellow-800 mb-1">
                  500+
                </div>
                <div className="text-sm text-yellow-700">
                  Active Competitors
                </div>
              </Card>

              <Card className="text-center bg-blue-50 border-2 border-blue-200">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-blue-800 mb-1">50+</div>
                <div className="text-sm text-blue-700">Events This Month</div>
              </Card>

              <Card className="text-center bg-purple-50 border-2 border-purple-200">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-purple-800 mb-1">
                  2,450
                </div>
                <div className="text-sm text-purple-700">Highest Score</div>
              </Card>
            </div>
          </section>

          {/* How Points Work */}
          <section className="mb-12">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                How Points Work
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-blue-700">
                    Event Attendance:
                  </span>{" "}
                  <span className="text-blue-800">50 points per event</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">
                    Project Completion:
                  </span>{" "}
                  <span className="text-blue-800">100 points per project</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-700">
                    Helping Others:
                  </span>{" "}
                  <span className="text-blue-800">
                    25 points per contribution
                  </span>
                </div>
              </div>
            </Card>
          </section>

          {/* Top 10 Leaderboard */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Top 10 Members
            </h2>

            <div className="space-y-4">
              {leaderboardData.map((member) => (
                <Card
                  key={member.rank}
                  className={`hover:shadow-lg transition-shadow ${
                    member.rank <= 3 ? "border-2 border-yellow-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <div
                        className={`text-3xl font-bold ${
                          member.rank <= 3 ? "text-yellow-600" : "text-gray-400"
                        }`}
                      >
                        {getRankEmoji(member.rank)}
                      </div>
                    </div>

                    {/* Avatar */}
                    <Avatar
                      size="lg"
                      fallback={member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {member.badges.map((badge, idx) => (
                          <Badge key={idx} variant="success" size="sm">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex gap-8 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {member.points}
                        </div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {member.events}
                        </div>
                        <div className="text-xs text-gray-600">Events</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {member.projects}
                        </div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {member.points}
                      </div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {member.events}
                      </div>
                      <div className="text-xs text-gray-600">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {member.projects}
                      </div>
                      <div className="text-xs text-gray-600">Projects</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
