"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  Avatar,
  Badge,
  Button,
  Input,
  Text,
} from "@packages/spark-ui";
import { toast } from "react-toastify";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useCardActivation } from "@/features/nfc-cards/hooks/useActivateCardMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SparkmatesSource, useSparkmateProfile, useSuggestedSparkmates } from "../.."; 
import { PublicSkillsAndLinksSection } from "./components/PublicSkillsAndLinksSection";
import { ComingSoonPlaceholder } from "../ComingSoonPlaceholder";
import { usePublicMemberProjects } from "../../hooks/usePublicMemberProjects";
import { ProjectCard } from "../SparkmatesOwnerView/components/ProjectCard";
import { GradientProfilePicture } from "../SparkmatesOwnerView/components/GradientProfilePicture";
import { ConnectedSuggestedCard } from "../SparkmatesOwnerView/components/ConnectedSuggestedCard";
import {
  normalizeSparkmatesSectionOrder,
  SparkmatesSectionId,
} from "../../sectionOrder";
import { parseCustomButtonLinks } from "../../utils/customButtonFavorites";

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

export function ProfilePublicView({
  gdgId,
  source,
  nfcCard,
  isNfcActivationRequired,
}: {
  gdgId: string;
  source: SparkmatesSource;
  nfcCard?: any;
  isNfcActivationRequired?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [activationSuccess, setActivationSuccess] = useState(false);
  const { decodedToken, status: authStatus } = useAuthContext();
  const activateCardMutation = useCardActivation();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useSparkmateProfile({ gdgId, source });
 
  const suggestedUsers = useSuggestedSparkmates({
    search,
    viewerGdgId: profile?.gdgId,
    // viewerPortfolio: profile?.portfolio ?? null,
  });

  const projectsQuery = usePublicMemberProjects(gdgId);

  // const isOwner = useMemo(() => {
  //   return Boolean(
  //     false,
  //     // user?.id && profile?.owner_user_id && user.id === profile.owner_user_id,
  //   );
  // }, [profile?.owner_user_id, user?.id]);

  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
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

  if (isNfcActivationRequired && nfcCard && !activationSuccess) {
    const isOwner = decodedToken?.memberInfo.gdgId === gdgId;

    return (
      <CosmosParticles
        particleColors={["#ffffff", "#4285f4"]}
        particleCount={180}
        particleSpread={14}
        speed={0.028}
        particleBaseSize={75}
        moveParticlesOnHover
        alphaParticles={true}
        className="min-h-screen bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] flex items-center justify-center p-4 w-full text-white"
      >
        <div className="relative z-10 w-full max-w-lg bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-[#FB2C36] to-[#2B7FFF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <Text variant="heading-5" className="text-white">
              Activate Nexus Card
            </Text>
            <Text variant="body-sm" className="text-zinc-400 mt-2 font-mono">
              {nfcCard.id}
            </Text>
          </div>

          {authStatus === "checking" ? (
            <div className="py-8"><LoadingScreen fullPage={false} message="Checking authentication..." /></div>
          ) : !decodedToken ? (
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 text-center">
                <Text variant="body-sm" className="text-yellow-200">
                  This digital portfolio is not activated yet. Log in to your account if this is your card to link it!
                </Text>
              </div>
              <Button
                variant="colored"
                subVariant="blue"
                size="lg"
                className="w-full text-white font-semibold"
                onClick={() => {
                  const currentPath = window.location.pathname + window.location.search;
                  window.location.href = `/signin?next=${encodeURIComponent(currentPath)}`;
                }}
              >
                Log In to Link Card
              </Button>
            </div>
          ) : !isOwner ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
               <Text variant="body-sm" className="text-red-200">
                You are not the owner of this card. You cannot activate it.
               </Text>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <GradientProfilePicture
                  size="sm"
                  src={decodedToken.memberInfo.avatarUrl || ASSETS.AUTH.AVATAR_DEFAULT}
                  alt={decodedToken.memberInfo.firstName}
                  fallback={decodedToken.memberInfo.firstName.charAt(0)}
                />
                <div className="flex-1 min-w-0">
                  <Text variant="body-sm" className="text-[#C1C7CD]">Activating as</Text>
                  <Text variant="body-lg" weight="bold" className="text-white truncate">
                    {decodedToken.memberInfo.firstName} {decodedToken.memberInfo.lastName}
                  </Text>
                </div>
              </div>

              <Button
                variant="colored"
                subVariant="blue"
                size="lg"
                className="w-full"
                disabled={activateCardMutation.isPending}
                onClick={() => {
                  activateCardMutation.mutate(nfcCard.id, {
                    onSuccess: () => {
                      toast.success("Card activated successfully!");
                      setActivationSuccess(true);
                      // Provide an initial invalidate but without letting it destroy the gate yet
                      queryClient.invalidateQueries({ queryKey: ["sparkmates-profile", gdgId] });
                      queryClient.invalidateQueries({ queryKey: ["nfc-card", gdgId] });
                    },
                    onError: (err: any) => {
                      toast.error(err.message || "Failed to activate card");
                    }
                  });
                }}
              >
                {activateCardMutation.isPending ? "Activating..." : "Confirm Activation"}
              </Button>
            </div>
          )}
        </div>
      </CosmosParticles>
    );
  }

  if (activationSuccess) {
    return (
      <CosmosParticles
        particleColors={["#ffffff", "#4285f4"]}
        particleCount={180}
        particleSpread={14}
        speed={0.028}
        particleBaseSize={75}
        moveParticlesOnHover
        alphaParticles={true}
        className="min-h-screen bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] flex items-center justify-center p-4 w-full text-white"
      >
        <div className="relative z-10 w-full max-w-lg bg-zinc-900/50 backdrop-blur-xl border border-[#00C950]/30 rounded-3xl p-8 shadow-2xl text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-[#00C950] to-[#2B7FFF] rounded-full flex items-center justify-center shadow-lg shadow-[#00C950]/30 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Text variant="heading-4" weight="bold" className="text-white mb-4">
            Link Successful!
          </Text>
          <Text variant="body" className="text-zinc-300 mb-8 max-w-sm mx-auto">
            Your physical Nexus Card is now officially active and linked to your digital identity. You will also receive a confirmation email shortly.
          </Text>
          <Button
            variant="colored"
            subVariant="blue"
            size="lg"
            className="w-full text-white font-bold"
            onClick={() => {
              setActivationSuccess(false);
            }}
          >
            Explore My Public Profile
          </Button>
        </div>
      </CosmosParticles>
    );
  }



  const displayName =
    profile?.firstName ||
    profile?.displayName ||
    // user?.user_metadata?.full_name ||
    profile.gdgId;

  const avatarUrl = profile?.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR;

  const parsedCustomButtonLinks = parseCustomButtonLinks(profile?.otherLinks);
  const customLinks = parsedCustomButtonLinks.links.map((url) => ({
    title: getLinkTitle(url),
    url,
    isStarred: parsedCustomButtonLinks.starredUrls.has(url),
  }));

  const projectList = projectsQuery.data || [];

  const socialLinks = [
    { key: "github", url: profile?.githubUrl, label: "GitHub" },
    {
      key: "linkedin",
      url: profile?.linkedinUrl,
      label: "LinkedIn",
    },
    {
      key: "website",
      url: profile?.portfolioWebsiteUrl,
      label: "Website",
    },
  ] as const;

  const sectionOrder = normalizeSparkmatesSectionOrder(profile.sectionOrder);

  const renderOrderedSection = (sectionId: SparkmatesSectionId) => {
    if (sectionId === "customButtons") {
      return (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Text variant="heading-6" gradient="white-blue" weight="bold">
              Custom Button
            </Text>
          </div>
          <div className="space-y-2.5">
            {customLinks.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`relative overflow-hidden rounded-2xl p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition-[box-shadow,background] duration-300 ${
                  item.isStarred
                    ? "rainbow-border bg-[#0F2449] bg-[linear-gradient(90deg,#0F2449_0%,#2A4F91_50%,#0F2449_100%)]"
                    : "border border-white/20 bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <Text
                      variant="body-lg"
                      className="text-white truncate block"
                      weight="medium"
                    >
                      {item.title}
                    </Text>
                    <Text variant="body" className="text-[#E5E5E5] break-all block">
                      {item.url}
                    </Text>
                  </div>
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
        </section>
      );
    }

    if (sectionId === "skillsAndInterests") {
      return <PublicSkillsAndLinksSection portfolio={profile} />;
    }

    if (sectionId === "projects") {
      return (
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
          <div className="space-y-3.5">
            {projectsQuery.isLoading ? (
              <Text variant="body-sm" className="text-zinc-500">
                Loading projects...
              </Text>
            ) : projectList.length > 0 ? (
              projectList.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center text-[#C1C7CD]">
                <Text variant="body-sm">No projects added yet.</Text>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (sectionId === "gdgImpact") {
      return (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Text variant="heading-6" gradient="white-blue" weight="bold">
              GDG Impact
            </Text>
          </div>
          <ComingSoonPlaceholder />
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Text variant="heading-6" gradient="white-blue" weight="bold">
            Badges
          </Text>
        </div>
        <ComingSoonPlaceholder />
      </section>
    );
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
      className="min-h-screen overflow-x-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-24 sm:pt-36 text-white"
    >
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden sm:block">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-325 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <FadeInSection className="p-0" delay={0.02}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text variant="heading-5" className="text-white">
                My Portfolio
              </Text>
            </div>

            <div className="mt-6 p-0">
              <div className="sm:hidden relative">
                <div
                  className="absolute z-0 top-0 h-[220px] -left-3 -right-3 pointer-events-none overflow-hidden"
                >
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

                <div className="relative z-10 flex justify-center pt-10">
                  <GradientProfilePicture
                    size="sm"
                    src={avatarUrl}
                    alt={displayName}
                    fallback={displayName.charAt(0)}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center px-4 mt-3 pb-2">
                  <Text variant="heading-6" className="text-white leading-tight" weight="bold">
                    {displayName}
                  </Text>

                  <Text variant="body-sm" className="text-[#C1C7CD] mt-1">
                    {profile?.program || "Program and Year not set"}
                  </Text>

                  <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                    <Badge variant={SPARK_BADGE.variantYellow as never}>UI/UX</Badge>
                    <Badge variant={SPARK_BADGE.variantRed as never}>Marketing</Badge>
                    <Badge variant={SPARK_BADGE.variantId as never}>{profile.gdgId}</Badge>
                  </div>

                  <Text
                    variant="body-sm"
                    className="mt-3 max-w-xs text-[#E5E5E5] leading-relaxed"
                  >
                    {profile?.bio ||
                      "Share your story to let sparkmates know what you are building."}
                  </Text>

                  <div className="mt-4 flex gap-2 justify-center">
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
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex sm:flex-row sm:items-start sm:gap-4 sm:justify-between mt-6">
                <div className="flex min-w-0 items-start gap-4">
                  <GradientProfilePicture
                    src={avatarUrl}
                    alt={displayName}
                    fallback={displayName.charAt(0)}
                  />

                  <div className="min-w-0 pt-2">
                    <Text
                      variant="heading-6"
                      className="text-white"
                      weight="bold"
                    >
                      {displayName}
                    </Text>
                    <Text variant="body-sm" className="text-[#C1C7CD] mt-1">
                      {profile?.program || "Program and Year not set"}
                    </Text>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant={SPARK_BADGE.variantYellow as never}>UI/UX</Badge>
                      <Badge variant={SPARK_BADGE.variantRed as never}>Marketing</Badge>
                      <Badge variant={SPARK_BADGE.variantId as never}>{profile.gdgId}</Badge>
                    </div>
                    <Text
                      variant="body-sm"
                      className="mt-2 max-w-sm text-[#E5E5E5] leading-relaxed"
                    >
                      {profile?.bio ||
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {sectionOrder.map((sectionId, index) => (
                <div key={sectionId} className="space-y-6">
                  {renderOrderedSection(sectionId)}
                  {index < sectionOrder.length - 1 ? <Divider /> : null}
                </div>
              ))}
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
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
                  gdgId={member.gdgId}
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




export const SparkmatesRainbowStreak = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="absolute pointer-events-none z-0 mix-blend-screen opacity-60 transition-transform duration-1000 ease-out"
      style={{
        width: "854px",
        height: "1518px",
        left: "65%",
        top: "55%",
        // Use translate based on mouse, but let CSS handle the rotation and drift inside
        transform: `translate(calc(-50% + ${mousePosition.x * -30}px), calc(-50% + ${mousePosition.y * -30}px))`,
      }}
    >
      <div className="relative w-full h-full animate-sparkmates-drift origin-center">
        <Image
          src={ASSETS.AUTH.RAINBOW_STREAK}
          alt="Rainbow Streak"
          className="object-cover blur-[60px]"
          fill
          priority
        />
      </div>
    </div>
  );
};
