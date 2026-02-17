"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Avatar } from "@/components/ui";

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
    <PageLayout>
      <PageHeader
        title="Meet the Team"
        description="The passionate individuals driving our community forward"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our team is composed of dedicated students who volunteer their time
            and energy to make GDG PUP a welcoming and enriching community for
            all.
          </p>
        </div>

        <div className="space-y-12">
          {teams.map((team, idx) => (
            <section key={idx}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {team.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              </div>
            </section>
          ))}
        </div>

        <Card className="mt-12 bg-blue-50 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Team
          </h3>
          <p className="text-gray-700 mb-6">
            We're always looking for passionate students to join our team and
            help build an even stronger community.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Involved
          </button>
        </Card>
      </div>
    </PageLayout>
  );
}
