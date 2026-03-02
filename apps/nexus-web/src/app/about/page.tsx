"use client";

import { Card, Grid, Stack } from "@packages/spark-ui";
import Link from "next/link";

export default function AboutPage() {
  const sections = [
    {
      title: "What is GDG?",
      description:
        "Discover the Google Developer Group program and what it means for students.",
      link: "/about/who-is-gdg",
      color: "bg-blue-600",
    },
    {
      title: "Our History",
      description:
        "Learn about our journey from inception to where we are today.",
      link: "/about/history",
      color: "bg-green-600",
    },
    {
      title: "Meet the Team",
      description:
        "Get to know the passionate individuals leading our community.",
      link: "/about/meet-the-team",
      color: "bg-yellow-600",
    },
    {
      title: "GDG on Top",
      description: "Celebrating our achievements and community milestones.",
      link: "/about/gdg-on-top",
      color: "bg-red-600",
    },
    {
      title: "Partnership",
      description:
        "Interested in partnering with us? Learn about collaboration opportunities.",
      link: "/about/partnership",
      color: "bg-blue-600",
    },
  ];

  return (
    <Stack gap="2xl">

          {/* Hero Introduction */}
          <section className="mb-16 mt-8">
            <Card className="bg-blue-600 text-white p-8 md:p-12 border-blue-700">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Who We Are
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-900">
                <strong>
                  Google Developer Group (GDG) Polytechnic University of the
                  Philippines
                </strong>{" "}
                is a vibrant community of students passionate about technology,
                innovation, and collaborative learning.
              </p>
              <p className="text-lg leading-relaxed text-gray-900">
                We bring together developers, designers, and tech enthusiasts to
                learn, share knowledge, and build amazing projects together.
                From workshops and hackathons to tech talks and social events,
                we create opportunities for students to grow their skills and
                network with like-minded peers.
              </p>
            </Card>
          </section>

          {/* Quick Links with Modern Cards */}
          <section>
            <Stack align="center" gap="xs" className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Explore More</h2>
              <p className="text-gray-700">Dive deeper into what makes GDG PUP special</p>
            </Stack>
            <Grid gap="lg" className="md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, index) => (
                <Link key={index} href={section.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden">
                    <div className={`${section.color} p-6 text-center`}>
                      <h3 className="text-xl font-bold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700">{section.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>

          {/* Mission & Vision */}
          <Grid gap="xl" className="lg:grid-cols-2">
            <Card className="bg-blue-50 border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Our Mission
              </h3>
              <p className="text-blue-800 leading-relaxed">
                To empower students through technology education, hands-on
                learning experiences, and collaborative innovation that shapes
                future tech leaders. We strive to create an inclusive
                environment where everyone can learn, experiment, and grow their
                technical skills.
              </p>
            </Card>

            <Card className="bg-green-50 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                Our Vision
              </h3>
              <p className="text-green-800 leading-relaxed">
                A thriving community where every student has the opportunity to
                learn, grow, and contribute to the ever-evolving world of
                technology. We envision a future where our members become the
                next generation of innovators and leaders in tech.
              </p>
            </Card>
          </Grid>

          {/* Core Values */}
          <section>
            <Stack align="center" gap="xs" className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
              <p className="text-gray-700">The principles that guide everything we do</p>
            </Stack>
            <Grid gap="lg" className="md:grid-cols-3">
              <Card className="text-center hover:shadow-lg transition-shadow bg-green-50 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Collaboration
                </h3>
                <p className="text-green-800">
                  We believe in the power of working together and sharing
                  knowledge.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow bg-yellow-50 border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Innovation
                </h3>
                <p className="text-yellow-800">
                  We encourage creative thinking and pushing the boundaries of
                  what's possible.
                </p>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow bg-red-50 border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Inclusivity
                </h3>
                <p className="text-red-800">
                  We welcome everyone regardless of background or skill level.
                </p>
              </Card>
            </Grid>
          </section>
    </Stack>
  );
}
