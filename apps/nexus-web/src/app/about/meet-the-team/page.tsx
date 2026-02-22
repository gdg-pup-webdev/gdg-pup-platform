"use client";

import { Card, Avatar, Stack, Grid, Button } from "@packages/spark-ui";

export default function MeetTheTeamPage() {
  //   Dummy data pa lang
  const teams = [
    {
      category: "Leadership",
      members: [
        { name: "John Doe", role: "President", image: "" },
        { name: "Jane Smith", role: "Vice President", image: "" },
      ],
    },
    {
      category: "Technical Team",
      members: [
        { name: "Mike Johnson", role: "Technical Lead", image: "" },
        { name: "Sarah Williams", role: "Frontend Lead", image: "" },
        { name: "David Brown", role: "Backend Lead", image: "" },
      ],
    },
    {
      category: "Operations",
      members: [
        { name: "Emily Davis", role: "Events Coordinator", image: "" },
        { name: "Chris Wilson", role: "Community Manager", image: "" },
      ],
    },
  ];

  return (
    <Stack gap="2xl">
        <div className="text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our team is composed of dedicated students who volunteer their time
            and energy to make GDG PUP a welcoming and enriching community for
            all.
          </p>
        </div>

        <Stack gap="2xl">
          {teams.map((team, idx) => (
            <Stack key={idx} gap="lg">
              <h2 className="text-3xl font-bold text-gray-900">
                {team.category}
              </h2>
              <Grid gap="lg" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {team.members.map((member, memberIdx) => (
                  <Card key={memberIdx} className="text-center">
                    <div className="flex flex-col items-center">
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
                      <p className="text-blue-600 font-medium">{member.role}</p>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Stack>
          ))}
        </Stack>

        <Card className="bg-blue-50 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Team
          </h3>
          <p className="text-gray-700 mb-6">
            We're always looking for passionate students to join our team and
            help build an even stronger community.
          </p>
          <Button variant="default">
            Get Involved
          </Button>
        </Card>
    </Stack>
  );
}
