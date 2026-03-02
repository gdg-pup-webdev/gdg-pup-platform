"use client";

import { Card, Button, Input, Stack, Grid } from "@packages/spark-ui";
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
    <Stack gap="2xl">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We're always looking for organizations that share our passion for
            technology education and community development. Partner with us to
            make a lasting impact.
          </p>
        </div>

        {/* Benefits */}
        <Stack gap="lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Partnership Benefits
          </h2>
          <Grid gap="lg" className="grid-cols-1 md:grid-cols-2">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">{benefit.description}</p>
              </Card>
            ))}
          </Grid>
        </Stack>

        {/* Partnership Types */}
        <Stack gap="lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Ways to Partner
          </h2>
          <Grid gap="lg" className="grid-cols-1 md:grid-cols-3">
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
          </Grid>
        </Stack>

        {/* Contact Form */}
        <Stack gap="lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Get in Touch
          </h2>
          <Card className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <Stack gap="xs">
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
              </Stack>

              <Stack gap="xs">
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
              </Stack>

              <Stack gap="xs">
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
              </Stack>

              <Button variant="primary" size="lg" className="w-full">
                Submit Partnership Inquiry
              </Button>
            </form>
          </Card>
        </Stack>
    </Stack>
  );
}
