"use client";

import { type ReactNode, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Avatar,
  Badge,
  Button,
  Input,
  ShineBorder,
  Text,
} from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { SparkmatesRainbowStreak } from "./SparkmatesRainbowStreak";
import { SkillsAndLinksSection } from "./portfolio/sections";
import { useActivateSparkmatesCard } from "../hooks/useActivateSparkmatesCard";
import { useSparkmateProfile } from "../hooks/useSparkmateProfile";
import { useSuggestedSparkmates } from "../hooks/useSuggestedSparkmates";
import type { SparkmatesSource } from "../types";
import { ASSETS } from "@/lib/constants/assets";

const addIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const editIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 20h9" strokeLinecap="round" />
    <path
      d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const viewIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const searchIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const burgerIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

// TODO: Replace with actual assets and data from nextjs public assets
const FIGMA_ASSETS = {
  profileCard:
    "https://www.figma.com/api/mcp/asset/3b8f15f0-f794-48d7-90f6-7463afc9d894",
  profileRing:
    "https://www.figma.com/api/mcp/asset/323fd0a6-f443-4caf-abc2-779db7ae33f3",
  suggestedRing:
    "https://www.figma.com/api/mcp/asset/a40a5418-1468-4827-bd4c-4527aa87f5ea",
  customLinkGradient:
    "https://www.figma.com/api/mcp/asset/487a6240-2dc1-485b-b27c-b192f5ff9947",
  projectOne:
    "https://www.figma.com/api/mcp/asset/09b49507-b6fe-4d0f-9332-6444a16245d7",
  projectTwo:
    "https://www.figma.com/api/mcp/asset/902a5aa1-eaa6-4a5e-8b70-7dd296a0102f",
  projectThree:
    "https://www.figma.com/api/mcp/asset/c806405e-7622-4201-a669-939b69396d7f",
  badge:
    "https://www.figma.com/api/mcp/asset/298196a1-6987-40f4-b7ee-621502d4cac0",
};

// function resolveAuthenticatedAvatar(user: ReturnType<typeof useAuthContext>["user"]) {
//   if (!user) return null;

//   const metadata = user.user_metadata as Record<string, unknown> | undefined;
//   const identityAvatar =
//     Array.isArray(user.identities) && user.identities.length > 0
//       ? (user.identities[0]?.identity_data as Record<string, unknown> | undefined)?.avatar_url
//       : null;

//   const candidates = [
//     metadata?.avatar_url,
//     metadata?.picture,
//     metadata?.avatarUrl,
//     metadata?.photo_url,
//     metadata?.image,
//     identityAvatar,
//   ];

//   const firstUrl = candidates.find(
//     (candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0,
//   );

//   return firstUrl ?? null;
// }

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function getLinkTitle(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Custom Link";
  }
}

function SocialGlyph({ type }: { type: "github" | "linkedin" | "website" }) {
  if (type === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.77-1.33-1.77-1.09-.74.08-.72.08-.72 1.2.08 1.83 1.24 1.83 1.24 1.08 1.83 2.82 1.3 3.51 1 .1-.78.42-1.3.76-1.61-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.19 0 0 1.01-.33 3.3 1.23a11.37 11.37 0 0 1 6 0c2.28-1.56 3.29-1.23 3.29-1.23.66 1.66.25 2.89.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.61-2.8 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0 0 12 .5z" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.01 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.83v1.64h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.53c0-1.32-.02-3.02-1.84-3.02-1.85 0-2.13 1.45-2.13 2.93V21h-4V9z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M3 12h18M12 3c2.8 2.5 2.8 15.5 0 18M12 3c-2.8 2.5-2.8 15.5 0 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GradientProfilePicture({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt: string;
  fallback: string;
}) {
  return (
    <div className="relative h-43 w-43 shrink-0">
      <img
        src={FIGMA_ASSETS.profileRing}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div className="absolute left-1/2 top-1/2 h-41 w-41 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
        <Avatar
          src={src}
          alt={alt}
          fallback={fallback}
          className="h-full w-full rounded-full"
        />
      </div>
    </div>
  );
}

function ConnectedSuggestedCard({
  avatarUrl,
  name,
  bio,
}: {
  avatarUrl?: string;
  name: string;
  bio: string;
}) {
  return (
    <article className="relative flex items-center pl-11.5">
      <div className="w-full overflow-hidden rounded-r-2xl border border-white/20 bg-[rgba(255,255,255,0.05)] pl-16 pr-4 py-3.5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
        <Text variant="body-lg" className="truncate text-white" weight="medium">
          {name}
        </Text>
        <Text variant="body-sm" className="truncate text-[#E5E5E5]">
          {bio}
        </Text>
      </div>

      <div className="absolute left-0 top-1/2 h-23.5 w-23.5 -translate-y-1/2">
        <img
          src={FIGMA_ASSETS.suggestedRing}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div className="absolute left-1/2 top-1/2 h-21.5 w-21.5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
          <Avatar
            src={avatarUrl}
            alt={name}
            fallback={name.charAt(0)}
            className="h-full w-full rounded-full"
          />
        </div>
      </div>
    </article>
  );
}

function Divider() {
  return (
    <div className="h-px w-full bg-[linear-gradient(90deg,#0F2449_0%,#2A4F91_50%,#0F2449_100%)]" />
  );
}

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SPARK_BADGE = {
  variantYellow: "yellow",
  variantRed: "red",
  variantId: "id",
} as const;

function ProjectCard({ image }: { image: string }) {
  return (
    <article className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <Text variant="body" className="text-white" weight="medium">
        Project Title
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
        Month Year · Month Year
      </Text>
      <Text variant="body-sm" className="mt-1 text-[#E5E5E5]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
        ullamcorper sed eros, non sollicitudin.
      </Text>
      <img
        src={image}
        alt="Project preview"
        className="mt-2 h-20 w-full rounded-md object-cover"
      />
    </article>
  );
}

export function SparkmatesPortfolio({
  gdgId,
  source,
}: {
  gdgId: string;
  source: SparkmatesSource;
}) {
  const [search, setSearch] = useState("");
  const [starredCustomButtons, setStarredCustomButtons] = useState<Set<number>>(
    () => new Set([0]),
  );

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useSparkmateProfile({ gdgId, source });

  const activateMutation = useActivateSparkmatesCard({ gdgId, source });

  const suggestedUsers = useSuggestedSparkmates({
    search,
    viewerGdgId: profile?.gdg_id,
    viewerPortfolio: profile?.portfolio ?? null,
  });

  // const isOwner = useMemo(() => {
  //   return Boolean(
  //     false,
  //     // user?.id && profile?.owner_user_id && user.id === profile.owner_user_id,
  //   );
  // }, [profile?.owner_user_id, user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010B1D] px-6 pb-24 pt-40 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-20">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load sparkmates profile.";

    return (
      <div className="min-h-screen bg-[#010B1D] px-6 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-950/30 p-8">
          <Text variant="heading-6" className="text-red-200">
            Unable to load Sparkmates profile
          </Text>
          <Text variant="body" className="mt-2 text-red-100">
            {message}
          </Text>
        </div>
      </div>
    );
  }

  const requiresActivation = profile.source === "nfc_card";
  const showActivationGate =
    requiresActivation && profile.status !== "activated";

  if (showActivationGate) {
    return (
      <div className="min-h-screen bg-[#010B1D] px-6 pb-24 pt-40 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
          <Text variant="heading-5" className="text-white">
            Sparkmates Profile Not Active
          </Text>
          <Text variant="body" className="mt-2 text-[#C1C7CD]">
            This digital portfolio is not activated yet.
          </Text>
          {/* {isOwner ? (
            <Button
              variant="colored"
              subVariant="blue"
              size="lg"
              className="mt-6 w-full"
              disabled={activateMutation.isPending}
              onClick={() => {
                if (!token) return;
                activateMutation.mutate(token);
              }}
            >
              {activateMutation.isPending
                ? "Activating..."
                : "Activate Sparkmates Profile"}
            </Button>
          ) : null} */}
        </div>
      </div>
    );
  }

  const displayName =
    profile.portfolio?.full_name ||
    profile.portfolio?.nickname ||
    // user?.user_metadata?.full_name ||
    profile.gdg_id;

  const avatarUrl = ASSETS.BRANDING.GDG_LOGO_WEBP; //resolveAuthenticatedAvatar(user);

  const customLinks = (profile.portfolio?.other_links ?? []).map((url) => ({
    title: getLinkTitle(url),
    url,
  }));

  const badgeCards = [1, 2, 3];

  const projectImages = [
    FIGMA_ASSETS.projectOne,
    FIGMA_ASSETS.projectTwo,
    FIGMA_ASSETS.projectThree,
  ];

  const socialLinks = [
    { key: "github", url: profile.portfolio?.github_url, label: "GitHub" },
    {
      key: "linkedin",
      url: profile.portfolio?.linkedin_url,
      label: "LinkedIn",
    },
    {
      key: "website",
      url: profile.portfolio?.portfolio_website_url,
      label: "Website",
    },
  ] as const;

  const toggleStar = (index: number) => {
    setStarredCustomButtons((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={180}
      particleSpread={14}
      speed={0.028}
      particleBaseSize={75}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="min-h-screen bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-6 pb-24 pt-36 text-white"
    >
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-325 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <FadeInSection className="p-0" delay={0.02}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text variant="heading-5" className="text-white">
                My Portfolio
              </Text>
              <Button
                variant="default"
                size="sm"
                iconRight={viewIcon}
                className="px-3 py-1 text-white"
              >
                Preview
              </Button>
            </div>

            <div className="mt-6 p-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <GradientProfilePicture
                    src={avatarUrl ?? FIGMA_ASSETS.profileCard}
                    alt={displayName}
                    fallback={displayName.charAt(0)}
                  />

                  <div className="min-w-0">
                    <Text
                      variant="heading-6"
                      className="text-white"
                      weight="bold"
                    >
                      {displayName}
                    </Text>
                    <Text variant="body-sm" className="text-[#C1C7CD]">
                      {profile.portfolio?.year_and_program ||
                        "Program and Year not set"}
                    </Text>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={SPARK_BADGE.variantYellow as never}>
                        UI/UX
                      </Badge>
                      <Badge variant={SPARK_BADGE.variantRed as never}>
                        Marketing
                      </Badge>
                      <Badge variant={SPARK_BADGE.variantId as never}>
                        {profile.gdg_id}
                      </Badge>
                    </div>
                    <Text
                      variant="body-sm"
                      className="mt-2 max-w-130 text-[#E5E5E5]"
                    >
                      {profile.portfolio?.bio ||
                        "Share your story to let sparkmates know what you are building."}
                    </Text>
                    <div className="mt-3 flex gap-2">
                      {socialLinks.map((social) => (
                        <Button
                          key={social.key}
                          variant="ghost"
                          size="sm"
                          title={social.label}
                          disabled={!social.url}
                          className="h-8 w-8 rounded-full border border-white/25 bg-[#091734] p-0 text-[11px] text-white disabled:opacity-40"
                          onClick={() => {
                            if (!social.url) return;
                            openExternal(social.url);
                          }}
                        >
                          <SocialGlyph type={social.key} />
                        </Button>
                      ))}

                      <Button
                        variant="ghost"
                        size="sm"
                        title="Add Socials"
                        className="h-8 w-8 rounded-full border border-white/25 bg-[#091734] p-0 text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white"
                    title="Menu"
                    aria-label="Menu"
                  >
                    {burgerIcon}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white"
                    title="Edit"
                    aria-label="Edit"
                  >
                    {editIcon}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text variant="heading-6" gradient="white-blue" weight="bold">
                    Custom Button
                  </Text>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white"
                    title="Edit Custom Button"
                    aria-label="Edit Custom Button"
                  >
                    {editIcon}
                  </Button>
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  Add a custom button that appears on your profile.
                </Text>
                <div className="space-y-2.5">
                  {customLinks.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="relative overflow-hidden rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.05)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition-[border-color,box-shadow] duration-300"
                    >
                      <ShineBorder
                        borderWidth={1.25}
                        duration={9}
                        shineColor={[
                          "#FB2C36",
                          "#F0B100",
                          "#00C950",
                          "#2B7FFF",
                        ]}
                        className={
                          starredCustomButtons.has(index)
                            ? "opacity-100 transition-opacity duration-300"
                            : "opacity-0 transition-opacity duration-300"
                        }
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <Text
                            variant="body-lg"
                            className="text-white"
                            weight="medium"
                          >
                            {item.title}
                          </Text>
                          <Text variant="body" className="text-[#E5E5E5]">
                            {item.url}
                          </Text>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white"
                          onClick={() => toggleStar(index)}
                        >
                          {starredCustomButtons.has(index) ? "★" : "☆"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customLinks.length === 0 ? (
                    <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center">
                      <Text variant="body-sm" className="text-[#C1C7CD]">
                        No custom links yet.
                      </Text>
                    </div>
                  ) : null}
                </div>
                <Button
                  variant="dashed-outline"
                  className="w-full"
                  iconLeft={addIcon}
                >
                  Add Custom Buttons
                </Button>
              </section>

              <Divider />

              <SkillsAndLinksSection
                portfolio={profile.portfolio}
                editIcon={editIcon}
                addIcon={addIcon}
                onOpenExternal={openExternal}
              />

              <Divider />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text variant="heading-6" gradient="white-blue" weight="bold">
                    Projects
                  </Text>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white"
                    iconRight={viewIcon}
                  >
                    View All
                  </Button>
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  Feature your best works to highlight your skills.
                </Text>
                <div className="space-y-3.5">
                  {projectImages.map((image, index) => (
                    <ProjectCard key={`project-${index}`} image={image} />
                  ))}
                </div>
                <Button
                  variant="dashed-outline"
                  className="w-full"
                  iconLeft={addIcon}
                >
                  Add New Projects
                </Button>
              </section>

              <Divider />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text variant="heading-6" gradient="white-blue" weight="bold">
                    GDG Impact
                  </Text>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white"
                    iconRight={viewIcon}
                  >
                    View
                  </Button>
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  Track your milestones and growth within GDG.
                </Text>
                <div className="grid grid-cols-3 gap-4">
                  {["Study Jam", "Workshop", "Hackathon"].map((label) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.04)] px-5 py-6 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]"
                    >
                      <Text
                        variant="heading-5"
                        align="center"
                        gradient="white-yellow"
                        weight="bold"
                      >
                        00
                      </Text>
                      <Text
                        variant="body-sm"
                        align="center"
                        className="text-white"
                      >
                        {label}
                      </Text>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text variant="heading-6" gradient="white-blue" weight="bold">
                    Badges
                  </Text>
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white"
                    iconRight={viewIcon}
                  >
                    View All
                  </Button>
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  Unlock exclusive collectibles by attending events.
                </Text>
                <div className="grid grid-cols-3 gap-4">
                  {badgeCards.map((badge) => (
                    <div
                      key={badge}
                      className="rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.04)] p-4 text-center shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]"
                    >
                      <img
                        src={FIGMA_ASSETS.badge}
                        alt="Badge"
                        className="mx-auto h-20 w-20 object-cover"
                      />
                      <Text
                        variant="body-sm"
                        className="mt-2 text-white"
                        align="center"
                      >
                        Badge Name
                      </Text>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              leftIcon={searchIcon}
              containerClassName="h-9 border-white/20 bg-black/20"
              className="text-white placeholder:text-[#C1C7CD]"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <Text variant="body-lg" className="text-white">
                Suggested To You
              </Text>
              <Button
                variant="default"
                size="sm"
                iconRight={viewIcon}
                className="text-white"
              >
                View All
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {suggestedUsers.map((member) => (
                <ConnectedSuggestedCard
                  key={member.gdgId}
                  avatarUrl={member.avatarUrl ?? undefined}
                  name={member.name}
                  bio={member.bio}
                />
              ))}

              {suggestedUsers.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    No matches found.
                  </Text>
                </div>
              ) : null}
            </div>
          </FadeInSection>
        </div>
      </div>
    </CosmosParticles>
  );
}
