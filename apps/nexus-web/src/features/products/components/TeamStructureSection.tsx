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
  TeamCard,
} from "@packages/spark-ui";

interface TeamStructureSectionProps {
  teamName: string;
  teamSlug: string;
}

const PLACEHOLDER_LEADS = [
  {
    name: "Team Lead",
    role: "Lead",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Co-Lead",
    role: "Co-Lead",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Assistant Lead",
    role: "Assistant Lead",
    imageSrc: "/placeholder.svg",
  },
];

export function TeamStructureSection({
  teamName,
  teamSlug,
}: TeamStructureSectionProps) {
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

            {/* Description card — no button on this page */}
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
          </Stack>

          {/* ── Current Team Leads ── */}
          <Stack gap="xl" className="mt-16">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              CURRENT TEAM LEADS
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLACEHOLDER_LEADS.map((lead) => (
                <TeamCard
                  key={lead.role}
                  name={lead.name}
                  role={lead.role}
                  imageSrc={lead.imageSrc}
                />
              ))}
            </div>
          </Stack>

          {/* ── Team Structure ── */}
          <Stack gap="xl" className="mt-16 items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              TEAM STRUCTURE
            </Text>
            <Text
              variant="heading-2"
              gradient="white-green"
              align="center"
              weight="bold"
            >
              Who are part of the team?
            </Text>

            <Stack gap="md" className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Member Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="body" color="secondary">
                    Member level content coming soon.
                  </Text>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Support Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text variant="body" color="secondary">
                    Support group content coming soon.
                  </Text>
                </CardContent>
              </Card>
            </Stack>

            <Link href={`/products/${teamSlug}`}>
              <Button variant="outline" size="lg">
                Back to resources
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
