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

export function MemberShowcaseSection() {
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
          background: "#F9AB0033",
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
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* \u2500\u2500 Hero / Intro \u2500\u2500 */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="yellow"
              align="center"
              weight="bold"
            >
              A Community of Sparks
            </Text>
            <Text variant="body" align="center" color="secondary" >
              GDG PUP helps student developers grow through real projects,
              events, and mentorship \u2014 connecting classroom learning to industry
              practice.
            </Text>

            <Card className="w-full mt-4">
              <CardHeader>
                <CardTitle>Looking for something?</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body" color="secondary">
                  Search and discovery content coming soon.
                </Text>
              </CardContent>
            </Card>
          </Stack>

          {/* \u2500\u2500 Spotlight of the Day \u2500\u2500 */}
          <div className="flex flex-col md:flex-row gap-12 items-center mt-16">
            {/* Left \u2014 featured image */}
            <div className="shrink-0 w-full md:w-120">
              <Image
                src="/placeholder.svg"
                alt="Spotlight featured image"
                width={480}
                height={340}
                className="w-full rounded-2xl object-cover"
              />
            </div>

            {/* Right \u2014 text stack */}
            <Stack gap="md" className="flex-1">
              <Text variant="heading-2" gradient="white-blue" weight="bold">
                Spotlight of the Day
              </Text>
              <Text variant="heading-4" gradient="yellow" weight="bold">
                Lorem ipsum dolor sit amet consectetur
              </Text>
              <Text variant="body" color="secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
              <div>
                <Button size="lg">Learn more</Button>
              </div>
            </Stack>
          </div>

          {/* \u2500\u2500 Member Achievements \u2500\u2500 */}
          <Stack gap="lg" className="mt-16">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              Member Achievements
            </Text>
            <Card className="w-full min-h-50 flex items-center justify-center">
              <CardContent>
                <Text variant="body" color="secondary" align="center">
                  Achievements content coming soon.
                </Text>
              </CardContent>
            </Card>
          </Stack>

          {/* \u2500\u2500 Member Stories & Features \u2500\u2500 */}
          <Stack gap="lg" className="mt-16">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              Member Stories &amp; Features
            </Text>
            <Text variant="body" color="secondary" align="center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discover
              the stories that define our community.
            </Text>
            <div className="flex justify-center">
              <Button size="lg">Read more</Button>
            </div>

            {/* Sample stories grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Member Story {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body" color="secondary">
                      Story content coming soon.
                    </Text>
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
