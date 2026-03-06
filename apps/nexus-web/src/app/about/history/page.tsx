import { HistorySection } from "@/features/about";

export default function HistoryPage() {
<<<<<<< HEAD
  //   Dummy data pa lang
  const milestones = [
    {
      year: "2024",
      title: "Digital Transformation",
      description:
        "Launched our digital platform with NFC card integration for seamless event attendance.",
    },
    {
      year: "2023",
      title: "Community Growth",
      description:
        "Reached 500+ active members and hosted 20+ technical workshops and events.",
    },
    {
      year: "2022",
      title: "Expansion",
      description:
        "Expanded our programs to include more diverse tech tracks and specializations.",
    },
    {
      year: "2021",
      title: "Foundation",
      description:
        "GDG PUP was officially established, bringing together tech enthusiasts.",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="Our History"
          description="A journey of growth, innovation, and community building"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              The Beginning
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              GDG PUP started with a simple vision: to create a space where
              students could learn, collaborate, and grow together in the field
              of technology.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              What began as a small group of passionate developers has grown
              into a thriving community that continues to inspire and empower
              students across PUP.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Key Milestones
            </h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="border-l-4 border-blue-600">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-blue-50 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Looking Forward
            </h3>
            <p className="text-blue-800 leading-relaxed">
              As we continue to grow, our commitment remains unchanged: to
              provide every student with opportunities to learn, innovate, and
              make a meaningful impact through technology. The best is yet to
              come!
            </p>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
=======
  return <HistorySection />;
>>>>>>> dev
}
