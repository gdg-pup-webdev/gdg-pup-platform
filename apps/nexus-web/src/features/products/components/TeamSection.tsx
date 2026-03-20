import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/constants/assets";
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
    <div className="relative overflow-x-hidden overflow-y-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Bottom layer */}
      <img
        src="/products/RL-SPACE_BG_3_3.png"
        alt=""
        className="absolute top-280 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      {/* Middle layer (partially under top) */}
      <img
        src="/products/RL-SPACE_BG_3_2.png"
        alt=""
        className="absolute top-165 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      {/* Top layer */}
      <img
        src="/products/RL-SPACE_BG_3_1.png"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />
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
        <Stack gap="2xl" className="relative z-10 mt-30">
          {/* ── About the Team ── */}
          <Stack gap="lg" className="items-center">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
            >
              ABOUT THE TEAM
            </Text>
            <Text
              variant="heading-1"
              gradient="white-yellow"
              align="center"
              weight="bold"
              className="mt-10"
            >
              {teamName}
            </Text>

            {/* Team image + spirals */}
            <div className="w-full mt-20 flex flex-col items-center">
              {/* Main image */}
              <div className="w-full flex justify-center">
                <Image
                  src="/products/ui-ux-logo.png"
                  alt={`${teamName} team`}
                  width={900}
                  height={500}
                  className="w-full max-w-[600px] rounded-2xl object-cover relative z-20"
                />
              </div>

              {/* Spirals directly below image */}
              <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[1900px] pointer-events-none z-10">
                <Image
                  src="/products/gold-4.png"
                  alt=""
                  width={1200}
                  height={600}
                  className="w-full h-auto mix-blend-screen opacity-50 blur-[50px]"
                />
              </div>
              <div className="relative w-full max-w-3xl h-[140px] mt-[-10px] pointer-events-none">
                {/* Spiral outer */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-570 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Spiral outer */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-30 w-480 aspect-[1204/188] opacity-70">
                  <Image
                    src={ASSETS.ID.SPIRAL_OUTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Spiral center */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-410 aspect-[1018/125] opacity-80">
                  <Image
                    src={ASSETS.ID.SPIRAL_CENTER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Spiral inner */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-450 aspect-[697/66] opacity-100">
                  <Image
                    src={ASSETS.ID.SPIRAL_INNER}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            {/* Description card */}
            <Card className="w-full max-w-10xl mx-auto mt-30">
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
