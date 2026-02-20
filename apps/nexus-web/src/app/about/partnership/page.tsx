"use client";

import { PageLayout, PageHeader } from "@/components/shared";
import { Card, Button, Input } from "@packages/spark-ui";
import { useState } from "react";

export default function PartnershipPage() {
  //   Dummy data pa lang
  const [formData, setFormData] = useState({
    organization: "",
    email: "",
    message: "",
  });

  const benefits = [
    {
      title: "Brand Visibility",
      description:
        "Get exposure to 500+ tech-savvy students and the broader PUP community.",
    },
    {
      title: "Talent Pipeline",
      description:
        "Connect directly with skilled students for internships and recruitment.",
    },
    {
      title: "Community Impact",
      description:
        "Support education and give back to the next generation of developers.",
    },
    {
      title: "Event Collaboration",
      description:
        "Co-host workshops, hackathons, and tech talks with our community.",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <PageHeader
          title="Partnership Opportunities"
          description="Let's work together to empower the next generation of tech leaders"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <section className="mb-16 text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We're always looking for organizations that share our passion for
            technology education and community development. Partner with us to
            make a lasting impact.
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Partnership Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Partnership Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Ways to Partner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Educational
              </h3>
              <p className="text-gray-700">
                Provide learning resources, workshops, or training programs
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Recruitment
              </h3>
              <p className="text-gray-700">
                Access our talent pool for internships and full-time roles
              </p>
            </Card>

            <Card className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Event Sponsorship
              </h3>
              <p className="text-gray-700">
                Support our events and initiatives as a sponsor
              </p>
            </Card>
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Get in Touch
          </h2>
          <Card className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <Input
                  placeholder="Your company or organization"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Tell us about your partnership ideas..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <Button variant="primary" size="lg" className="w-full">
                Submit Partnership Inquiry
              </Button>
            </form>
          </Card>
        </section>
        </div>
      </div>
    </PageLayout>
  );
}
