import Image from "next/image";
import Link from "next/link";
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

interface TeamSectionProps {
  teamName: string;
  teamSlug: string;
}

export function TeamSection({ teamName, teamSlug }: TeamSectionProps) {
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
          top: "calc(4rem + 300px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#34A85333",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />

      <Container>
        <Stack gap="2xl" className="relative z-10">
          {/* ── About the Team ── */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              About the team
            </Text>
            <Text variant="heading-3" align="center" color="secondary">
              {teamName}
            </Text>

            {/* Team image placeholder */}
            <div className="w-full max-w-3xl mx-auto mt-6">
              <Image
                src="/placeholder.svg"
                alt={`${teamName} team`}
                width={900}
                height={500}
                className="w-full rounded-2xl object-cover"
              />
            </div>

            {/* Description card */}
            <Card className="w-full max-w-3xl mx-auto mt-6">
              <CardHeader>
                <CardTitle>{teamName}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body" color="secondary">
                  This is the {teamName} team. Content coming soon.
                </Text>
              </CardContent>
            </Card>

            <Link href={`/products/${teamSlug}/team-structure`}>
              <Button size="lg">See team leads and structure</Button>
            </Link>
          </Stack>

          {/* ── Study Jams ── */}
          <Stack gap="xl" className="mt-16">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              STUDY JAMS
            </Text>

            <div className="flex flex-col md:flex-row gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="flex-1">
                  <CardHeader>
                    <CardTitle>Study Jam {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body" color="secondary">
                      Study jam content coming soon.
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
