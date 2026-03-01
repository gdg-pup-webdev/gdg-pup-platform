import Image from "next/image";
import {
  Container,
  Stack,
  Text,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@packages/spark-ui";

const STEPS = [
  {
    number: "1.",
    gradient: "blue" as const,
    title: "Apply for Membership",
    description:
      "Start by filling out the official GDG PUP membership application form.",
  },
  {
    number: "2.",
    gradient: "yellow" as const,
    title: "Receive Your GDG ID",
    description:
      "Once accepted, your unique GDG ID is generated and assigned to you.",
  },
  {
    number: "3.",
    gradient: "red" as const,
    title: "Find Your GDG ID",
    description:
      "Easily locate your GDG ID by using the GDG ID Platform. Search it with your registered name or email address you\u2019ve inputted in the application form.",
  },
  {
    number: "4.",
    gradient: "green" as const,
    title: "Use Across GDG Platforms",
    description:
      "Your GDG ID becomes your key to accessing future GDG PUP products, events, and community tools.",
  },
];

export function IdSection() {
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
          top: "calc(4rem + 200px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* \u2500\u2500 Hero \u2500\u2500 */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              GDG ID PLATFORM
            </Text>
            <Text variant="body" align="center" color="secondary">
              Built for the future of GDG PUP, the GDG ID Platform brings
              members together through a seamless, connected, and empowered
              digital experience.
            </Text>
          </Stack>

          {/* \u2500\u2500 How It Works \u2500\u2500 */}
          <div className="flex flex-col md:flex-row gap-12 items-center mt-12">
            {/* Left \u2014 mascot */}
            <div className="flex-shrink-0 w-full md:w-[340px] flex justify-center">
              <Image
                src="/placeholder.svg"
                alt="GDG Sparky mascot"
                width={340}
                height={400}
                className="object-contain"
              />
            </div>

            {/* Right \u2014 card */}
            <div className="flex-1">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>How the GDG ID Platform Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack gap="xl">
                    {STEPS.map((step) => (
                      <Stack key={step.number} gap="xs">
                        <Text
                          variant="heading-5"
                          gradient={step.gradient}
                          align="center"
                          weight="bold"
                        >
                          {step.number} {step.title}
                        </Text>
                        <Text variant="body" color="secondary" align="center">
                          {step.description}
                        </Text>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
