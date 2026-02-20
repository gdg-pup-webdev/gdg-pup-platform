"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Badge } from "@packages/spark-ui";

export default function ProductsPage() {
  //   Dummy data pa lang
  const products = [
    {
      name: "Nexus Platform",
      category: "Community Management",
      description:
        "Our flagship platform for managing events, tracking attendance, and building community engagement through NFC technology.",
      features: [
        "Event Management",
        "NFC Integration",
        "User Profiles",
        "Leaderboards",
      ],
      status: "Active",
      icon: "🚀",
    },
    {
      name: "Study Buddy",
      category: "Education",
      description:
        "AI-powered study companion that helps students organize their learning materials and track progress.",
      features: [
        "Smart Scheduling",
        "Progress Tracking",
        "Resource Library",
        "Peer Matching",
      ],
      status: "Beta",
      icon: "📚",
    },
    {
      name: "Campus Navigator",
      category: "Utility",
      description:
        "Mobile app helping students navigate the campus with interactive maps and building information.",
      features: [
        "Interactive Maps",
        "Room Finder",
        "Event Locations",
        "Offline Mode",
      ],
      status: "Active",
      icon: "🗺️",
    },
    {
      name: "Project Hub",
      category: "Collaboration",
      description:
        "Platform for students to showcase projects, find collaborators, and get feedback from the community.",
      features: [
        "Project Showcase",
        "Team Formation",
        "Code Reviews",
        "Resource Sharing",
      ],
      status: "Coming Soon",
      icon: "💡",
    },
    {
      name: "Skill Tracker",
      category: "Professional Development",
      description:
        "Track your technical skills, set learning goals, and get personalized recommendations for growth.",
      features: [
        "Skill Assessment",
        "Learning Paths",
        "Certifications",
        "Progress Reports",
      ],
      status: "Beta",
      icon: "📊",
    },
    {
      name: "Event Space Booking",
      category: "Operations",
      description:
        "Streamlined system for booking venues and managing resources for community events.",
      features: [
        "Space Reservation",
        "Resource Management",
        "Calendar Integration",
        "Approval Workflow",
      ],
      status: "Coming Soon",
      icon: "📅",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Beta":
        return "warning";
      case "Coming Soon":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="Our Products"
          description="Tools and platforms we've built to empower our community"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <section className="mb-16 text-center">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our community doesn't just learn about technology—we build it.
              Here are some of the products and services we've developed to
              solve real problems and enhance the student experience.
            </p>
          </section>

          {/* Products Grid */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, idx) => (
                <Card
                  key={idx}
                  className="hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{product.icon}</div>
                    <Badge variant={getStatusColor(product.status) as any}>
                      {product.status}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">
                    {product.category}
                  </p>

                  <p className="text-gray-700 mb-6 flex-1">
                    {product.description}
                  </p>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="text-blue-600 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Product Categories */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Product Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="text-4xl mb-3">🛠️</div>
                <h4 className="font-semibold text-gray-900">Utilities</h4>
                <p className="text-sm text-gray-700 mt-2">Everyday tools</p>
              </Card>

              <Card className="text-center">
                <div className="text-4xl mb-3">🎓</div>
                <h4 className="font-semibold text-gray-900">Education</h4>
                <p className="text-sm text-gray-700 mt-2">Learning aids</p>
              </Card>

              <Card className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-semibold text-gray-900">Community</h4>
                <p className="text-sm text-gray-700 mt-2">Social platforms</p>
              </Card>

              <Card className="text-center">
                <div className="text-4xl mb-3">💼</div>
                <h4 className="font-semibold text-gray-900">Professional</h4>
                <p className="text-sm text-gray-700 mt-2">Career tools</p>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
