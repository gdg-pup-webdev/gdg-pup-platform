import { Container, Stack, Text, Card, CardHeader, CardTitle, CardContent } from "@packages/spark-ui";

export function EventsSection() {
  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Decorative blob — top left */}
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
      {/* Decorative blob — right */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 200px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* ── Events Calendar ── */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              EVENTS CALENDAR
            </Text>
            <Text variant="body" align="center" color="secondary">
              Upcoming events promoting leadership, collaboration, learning, and
              the shared effort that builds our community. Every entry on this
              calendar is an invitation to add your story to ours.
            </Text>

            {/* Calendar placeholder */}
            <Card className="w-full mt-8 min-h-100 flex items-center justify-center">
              <CardContent>
                <Text variant="body" color="secondary" align="center">
                  Calendar — coming soon
                </Text>
              </CardContent>
            </Card>
          </Stack>

          {/* ── Events Gallery ── */}
          <Stack gap="lg" className="items-center mt-24">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              EVENTS GALLERY
            </Text>
            <Text variant="body" align="center" color="secondary" >
              A behind-the-scenes moment from our past events, capturing
              collaboration, learning, and the shared effort that builds our
              community.
            </Text>

            {/* Gallery placeholder */}
            <Card className="w-full mt-8 min-h-100 flex items-center justify-center">
              <CardContent>
                <Text variant="body" color="secondary" align="center">
                  Gallery — coming soon
                </Text>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
