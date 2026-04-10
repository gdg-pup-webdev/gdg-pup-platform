"use client";

import Image from "next/image";
import { Badge, Button, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { UserProfile } from "@/features/sparkmates";
import { GradientProfilePicture } from "./GradientProfilePicture";

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function SparkmatesMiniPreviewCard({ profile }: { profile: UserProfile }) {
  const fullName =
    [profile?.firstName, profile?.middleName, profile?.lastName, profile?.suffix]
      .filter(Boolean)
      .join(" ") || "Your Name";

  const topBadges = [profile.department, profile.technicalSkills?.[0]]
    .filter((value): value is string => Boolean(value))
    .slice(0, 2);

  const technicalSkills = profile.technicalSkills ?? [];
  const learningInterests = profile.learningInterests ?? [];

  return (
    <div className="relative h-[min(90dvh,860px)] overflow-y-auto sm:overflow-hidden rounded-3xl border border-white/20 bg-[#010B1D] text-white shadow-[0_22px_48px_rgba(0,0,0,0.52),inset_0px_4px_16px_rgba(255,255,255,0.1)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="absolute inset-x-0 top-0 h-56 pointer-events-none">
        <Image
          src={ASSETS.SPARKMATES.HORIZON}
          alt=""
          aria-hidden
          fill
          className="object-cover"
          style={{ objectPosition: "50% 65%" }}
          priority
        />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#010B1D] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#010B1D] to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 pb-4 pt-7">
        <div className="flex justify-center">
          <GradientProfilePicture
            size="sm"
            src={profile.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
            alt={profile.displayName || fullName}
            fallback={(profile.displayName || fullName).charAt(0)}
          />
        </div>

        <div className="mt-2.5 text-center">
          <Text variant="heading-6" weight="bold" align="center" className="text-center text-white leading-tight">
            {fullName}
          </Text>

          {profile.displayName ? (
            <Text variant="body-sm" align="center" className="mt-0.5 text-center text-zinc-400">
              ({profile.displayName})
            </Text>
          ) : null}

          <Text variant="body-sm" align="center" className="mt-1 text-center text-[#C1C7CD]">
            {profile.program || "Program & Year not set"}
          </Text>

          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            {topBadges.map((badge) => (
              <Badge key={badge} variant="yellow">
                {badge}
              </Badge>
            ))}
            <Badge variant="id">{profile.gdgId}</Badge>
          </div>

          <Text variant="body-sm" align="center" className="mt-2.5 text-center text-[#E5E5E5] leading-relaxed line-clamp-3">
            {profile.bio || "Share your story to let sparkmates know what you are building."}
          </Text>

          <div className="mt-5 space-y-2.5">
            <Button
              variant="default"
              size="sm"
              disabled={!profile.portfolioWebsiteUrl}
              className="h-11 w-full text-white disabled:opacity-40"
              onClick={() => {
                if (!profile.portfolioWebsiteUrl) return;
                openExternal(profile.portfolioWebsiteUrl);
              }}
            >
              Visit my website
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!profile.linkedinUrl}
              className="h-11 w-full border-white/30 bg-white/[0.03] text-white hover:bg-white/[0.08] disabled:opacity-40"
              onClick={() => {
                if (!profile.linkedinUrl) return;
                openExternal(profile.linkedinUrl);
              }}
            >
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!profile.githubUrl}
              className="h-11 w-full border-white/30 bg-white/[0.03] text-white hover:bg-white/[0.08] disabled:opacity-40"
              onClick={() => {
                if (!profile.githubUrl) return;
                openExternal(profile.githubUrl);
              }}
            >
              GitHub
            </Button>
          </div>

          <section className="mt-5 space-y-3">
            <Text variant="heading-6" gradient="white-blue" weight="bold" className="text-left">
              Skills & Interests
            </Text>

            <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.06)] px-4 py-3.5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.18)]">
              <div className="mb-2.5 flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m8 7-5 5 5 5M16 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <Text variant="body" weight="medium" className="text-white">
                  Technical Skills
                </Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.length > 0 ? (
                  technicalSkills.map((skill) => (
                    <Badge key={`technical-${skill}`} variant="blue" className="text-[#F2F4F8]">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    No technical skills yet.
                  </Text>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.06)] px-4 py-3.5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.18)]">
              <div className="mb-2.5 flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 5.5h8v14H4zM12 4l8-1v16l-8 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <Text variant="body" weight="medium" className="text-white">
                  Learning Interests
                </Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {learningInterests.length > 0 ? (
                  learningInterests.map((interest) => (
                    <Badge key={`interest-${interest}`} variant="blue" className="text-[#F2F4F8]">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    No learning interests yet.
                  </Text>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}