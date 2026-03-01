import Image from "next/image";
import {
  Container,
  Stack,
  Text,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "@packages/spark-ui";

export function CommunityShowcaseSection() {
  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Decorative blob \u2014 top left */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(900px, 65vw)",
          height: "min(800px, 70vh)",
          top: "calc(4rem - 300px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      {/* Decorative blob \u2014 right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#34A85333",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* \u2500\u2500 Page Heading \u2500\u2500 */}
          <Stack gap="md" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              Community Showcase
            </Text>
            <Text variant="body" weight="bold" align="center">
              Discover what our community has been building together.
            </Text>
          </Stack>

          {/* \u2500\u2500 Featured Event \u2500\u2500 */}
          <Stack gap="lg" className="mt-12">
            <Text variant="heading-2" align="center" weight="bold">
              Sample Event Name
            </Text>
            <Text variant="body" align="center" color="secondary">
              GDG PUP Nexus \u2014 March 15, 2026 \u00b7 2:00 PM
            </Text>

            <Text
              variant="heading-3"
              align="center"
              weight="bold"
              className="mt-4"
            >
              Today&apos;s Highlight
            </Text>

            {/* Sample event card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Sample Event Highlight</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body" color="secondary">
                  Event highlight content coming soon.
                </Text>
              </CardContent>
            </Card>

            {/* About + Stats row */}
            <div className="flex flex-col md:flex-row gap-8 mt-6">
              {/* About */}
              <Stack gap="sm" className="flex-2">
                <Text variant="heading-5" weight="bold">
                  About this event
                </Text>
                <Text variant="body" color="secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. This
                  event brought together our community to collaborate, learn, and
                  celebrate the shared effort that builds GDG PUP.
                </Text>
              </Stack>

              {/* Stats */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Event Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack gap="xs">
                    <Text variant="body" color="secondary">
                      RSVP: 120
                    </Text>
                    <Text variant="body" color="secondary">
                      Attendees: 98
                    </Text>
                    <Text variant="caption" color="secondary">
                      Team: Web Development
                    </Text>
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </Stack>

          {/* \u2500\u2500 Past Events \u2500\u2500 */}
          <Stack gap="xl" className="mt-20">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              Past Events
            </Text>
            <Text variant="body" align="center" color="secondary">
              Look back on the great things we&apos;ve accomplished.
            </Text>

            {/* Sample past event card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Image
                    src="/placeholder.svg"
                    alt={`Past event ${i}`}
                    width={600}
                    height={300}
                    className="w-full rounded-t-[28px] object-cover"
                  />
                  <CardContent>
                    <Stack gap="xs">
                      <Text variant="caption" color="secondary">
                        March {i}, 2026
                      </Text>
                      <Text variant="heading-6" weight="bold">
                        Sample Past Event {i}
                      </Text>
                      <Button variant="outline" size="sm">
                        Learn more
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
