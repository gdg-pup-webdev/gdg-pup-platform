"use client";

import { Card, Avatar, Badge, Button, Container, Grid, Stack } from "@packages/spark-ui";

export default function MemberShowcasePage() {
  //   Dummy data pa lang
  const featuredMembers = [
    {
      name: "Alex Rivera",
      role: "Full-Stack Developer",
      bio: "Built a community management platform used by 5+ student organizations",
      achievements: ["Top Contributor", "Hackathon Winner"],
      projects: 12,
      events: 25,
    },
    {
      name: "Sam Chen",
      role: "ML Engineer",
      bio: "Developed an AI-powered study assistant that helps students optimize learning",
      achievements: ["Research Leader", "Certified Cloud Professional"],
      projects: 8,
      events: 30,
    },
    {
      name: "Jordan Lee",
      role: "UI/UX Designer",
      bio: "Redesigned the campus mobile app, improving user satisfaction by 40%",
      achievements: ["Design Award Winner", "Community Mentor"],
      projects: 15,
      events: 20,
    },
    {
      name: "Taylor Park",
      role: "Mobile Developer",
      bio: "Created an emergency alert system for campus safety with 1000+ downloads",
      achievements: ["Innovation Award", "Bug Hunter"],
      projects: 10,
      events: 18,
    },
    {
      name: "Morgan Smith",
      role: "Cloud Architect",
      bio: "Architected scalable solutions for 3 local startups as part of community projects",
      achievements: ["Cloud Expert", "Speaker"],
      projects: 7,
      events: 22,
    },
    {
      name: "Casey Johnson",
      role: "DevOps Engineer",
      bio: "Implemented CI/CD pipelines that reduced deployment time by 70%",
      achievements: ["Automation Expert", "Workshop Leader"],
      projects: 9,
      events: 16,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container className="py-12">
        <Stack gap="2xl">
        {/* Introduction */}
        <section className="text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our community thrives because of the incredible people who make it
            up. Here are some of the outstanding members who inspire us every
            day.
          </p>
        </section>

        {/* Featured Members Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Members
          </h2>
          <Grid gap="xl" className="md:grid-cols-2 lg:grid-cols-3">
            {featuredMembers.map((member, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar
                    size="xl"
                    fallback={member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    className="mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-700 text-sm mb-4">{member.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {member.achievements.map((achievement, aIdx) => (
                    <Badge key={aIdx} variant="success" size="sm">
                      {achievement}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {member.projects}
                    </div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {member.events}
                    </div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Call to Action */}
        <Card className="bg-blue-600 text-white border-blue-700">
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">Want to be Featured?</h2>
            <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
              Stay active in the community, contribute to projects, and share
              your knowledge. Your achievements could be highlighted next!
            </p>
              <Button variant="secondary">Get Started Today</Button>
          </div>
        </Card>
        </Stack>
      </Container>
    </div>
  );
}
