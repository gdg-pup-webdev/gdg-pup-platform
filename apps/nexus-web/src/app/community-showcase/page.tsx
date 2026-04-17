import { Metadata } from "next";
import { CommunityShowcaseSection } from "@/features/community-showcase";

export const metadata: Metadata = {
  title: "Community Showcase | GDG PUP Nexus",
  description: "Discover inspiring projects and stories from the GDG PUP community. See what our members are building and sharing.",
  openGraph: { images: ["/og/community-showcase.webp"] },
  twitter: { images: ["/og/community-showcase.webp"] },
};
import { CosmosParticles } from "@/components/shared";

export default function CommunityShowcasePage() {
  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={350}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={80}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="bg-[#010b1d] min-h-screen"
    >
      <CommunityShowcaseSection />{" "}
    </CosmosParticles>
  );
}
