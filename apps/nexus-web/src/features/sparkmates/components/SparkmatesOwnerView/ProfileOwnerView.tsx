"use client";

import { Button, Modal, ShineBorder, Text } from "@packages/spark-ui";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "@/lib/nexus-toast";
import { useSparkmateProfile } from "../../hooks";
import { SparkmatesSource } from "../../types";
import { useUpdateSparkmateProfile } from "../../hooks/useUpdateSparkmateProfile";
import { SkillsAndLinksSection } from "../sections/SkillsAndLinksSection";
import { viewIcon } from "./icons/viewIcon";
import { Divider } from "./components/Divider";
import { SparkmatesRainbowStreak } from "./components/SparkmatesRainbowStreak";
import { FadeInSection } from "./components/FadeInSection";
import { NameAndProfileSection } from "../sections/NameAndProfileSection";
import { useGetProfileOfUserByGdgId } from "../../hooks/useGetProfileOfUserByGdgId";
import { BadgesSection } from "../sections/BadgesSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { ImpactSection } from "../sections/ImpactSection";
import { SuggestedPeopleSection } from "../sections/SuggestedPeopleSection";
import { SparkmatesMiniPreviewCard } from "./components/SparkmatesMiniPreviewCard";
import { CustomButtonsSection } from "../sections/CustomButtonsSection";
import {
  moveSparkmatesSection,
  normalizeSparkmatesSectionOrder,
  SparkmatesSectionId,
} from "../../sectionOrder";
import { ShareDropdown } from "./components/ShareDropdown";

const SECTION_LABELS: Record<SparkmatesSectionId, string> = {
  customButtons: "Custom Buttons",
  skillsAndInterests: "Skills and Interests",
  projects: "Projects",
  gdgImpact: "GDG Impact",
  badges: "Badges",
};

type SharePlatform = "facebook" | "instagram" | "linkedin";

const SHARE_PLATFORM_LABELS: Record<SharePlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

const SHARE_BUTTON_CLASSNAMES: Record<SharePlatform, string> = {
  facebook: "px-3 py-1 text-white border border-[#4267B2]/50 bg-[#4267B2]/20 hover:bg-[#4267B2]/30",
  instagram: "px-3 py-1 text-white border border-[#E4405F]/50 bg-[#E4405F]/20 hover:bg-[#E4405F]/30",
  linkedin: "px-3 py-1 text-white border border-[#0A66C2]/50 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30",
};

const areSectionOrdersEqual = (
  left: SparkmatesSectionId[],
  right: SparkmatesSectionId[],
) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
};

const getSectionOrderStorageKey = (gdgId: string) =>
  `sparkmates:section-order:${gdgId}`;

const readStoredSectionOrder = (
  gdgId: string,
): SparkmatesSectionId[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getSectionOrderStorageKey(gdgId));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(getSectionOrderStorageKey(gdgId));
      return null;
    }
    return normalizeSparkmatesSectionOrder(parsed);
  } catch {
    window.localStorage.removeItem(getSectionOrderStorageKey(gdgId));
    return null;
  }
};

const writeStoredSectionOrder = (gdgId: string, next: SparkmatesSectionId[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getSectionOrderStorageKey(gdgId), JSON.stringify(next));
  } catch {
    // Ignore local storage errors (quota/private mode) and keep in-memory state.
  }
};

export function ProfileOwnerView({
  gdgId,
  source,
}: {
  gdgId: string;
  source: SparkmatesSource;
}) {
  const shareBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || (typeof window !== "undefined" ? window.location.origin : "https://gdgpup.org");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const [sharePrompt, setSharePrompt] = useState<{
    isOpen: boolean;
    platform: SharePlatform | null;
    shareUrl: string;
    isClipboardCopied: boolean;
    clipboardText: string;
  }>({
    isOpen: false,
    platform: null,
    shareUrl: "",
    isClipboardCopied: false,
    clipboardText: "",
  });
  const [previewTilt, setPreviewTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isDesktopReorderMode, setIsDesktopReorderMode] = useState(false);
  const [isMobileReorderModalOpen, setIsMobileReorderModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [mobileDraggingIndex, setMobileDraggingIndex] = useState<number | null>(null);
  const [mobileDropIndex, setMobileDropIndex] = useState<number | null>(null);
  const mobileDraggingIndexRef = useRef<number | null>(null);
  const mobileDropIndexRef = useRef<number | null>(null);
  const mobileRowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const requestClosePreview = () => {
    setIsPreviewClosing(true);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setIsPreviewOpen(false);
      setIsPreviewClosing(false);
    }, 220);
  };

  const handlePreviewOpenChange = (open: boolean) => {
    if (open) {
      setIsPreviewClosing(false);
      setIsPreviewOpen(true);
      return;
    }
    requestClosePreview();
  };

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useSparkmateProfile({ gdgId, source });

  const {
    data: userprofiledata,
  } = useGetProfileOfUserByGdgId(gdgId);
  const userprofile = userprofiledata?.data;
  const effectiveGdgId = userprofile?.gdgId || gdgId;
  const pendingSectionOrderKeyRef = useRef<string | null>(null);
  const { mutate: updateProfileOrder, isPending: isSavingSectionOrder } =
    useUpdateSparkmateProfile(effectiveGdgId);
  const normalizedServerSectionOrder = normalizeSparkmatesSectionOrder(
    userprofile?.sectionOrder,
  );
  const normalizedServerSectionOrderKey = normalizedServerSectionOrder.join("|");
  const [sectionOrder, setSectionOrder] = useState<SparkmatesSectionId[]>(
    normalizeSparkmatesSectionOrder(userprofile?.sectionOrder),
  );

  useEffect(() => {
    if (pendingSectionOrderKeyRef.current) {
      return;
    }

    const storedOrder = readStoredSectionOrder(effectiveGdgId);
    if (storedOrder) {
      setSectionOrder((previous) =>
        areSectionOrdersEqual(previous, storedOrder)
          ? previous
          : storedOrder,
      );
      return;
    }

    const nextServerOrder = normalizeSparkmatesSectionOrder(
      userprofile?.sectionOrder,
    );

    setSectionOrder((previous) =>
      areSectionOrdersEqual(previous, nextServerOrder)
        ? previous
        : nextServerOrder,
    );
  }, [effectiveGdgId, normalizedServerSectionOrderKey, userprofile?.sectionOrder]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sparkmates:desktop-reorder-mode", {
        detail: { enabled: isDesktopReorderMode },
      }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("sparkmates:desktop-reorder-mode", {
          detail: { enabled: false },
        }),
      );
    };
  }, [isDesktopReorderMode]);

  const saveSectionOrder = (next: SparkmatesSectionId[]) => {
    pendingSectionOrderKeyRef.current = next.join("|");
    writeStoredSectionOrder(effectiveGdgId, next);
    setSectionOrder(next);
    updateProfileOrder(
      { sectionOrder: next },
      {
        onSuccess: () => {
          pendingSectionOrderKeyRef.current = null;
        },
        onError: () => {
          pendingSectionOrderKeyRef.current = null;
        },
      },
    );
  };

  const getShareUrl = () => {
    return `${shareBaseUrl}/sparkmates/${effectiveGdgId}`;
  };

  const getShareCaption = () => {
    const displayName = userprofile?.displayName?.trim()
      || `${userprofile?.firstName || ""} ${userprofile?.lastName || ""}`.trim()
      || effectiveGdgId;
    const team = userprofile?.department?.trim() || "Community";
    const teamTag = team.replace(/[^a-zA-Z0-9]/g, "");
    const shareUrl = getShareUrl();

    return `Meet ${displayName} from GDG PUP Nexus on Sparkmates.\nExplore projects, skills, and community impact here:\n${shareUrl}\n\n#GDGPUP #Sparkmates #GDGPUPNexus #DevCommunity #CampusTech #${teamTag} #${effectiveGdgId.replace(/[^a-zA-Z0-9]/g, "")}`;
  };

  const getFacebookQuote = () => {
    const displayName = userprofile?.displayName?.trim()
      || `${userprofile?.firstName || ""} ${userprofile?.lastName || ""}`.trim()
      || effectiveGdgId;
    const facebookProfileUrl = getShareUrl();

    return `Meet ${displayName} on Sparkmates: ${facebookProfileUrl} #GDGPUP #Sparkmates`;
  };

  const getLinkedInCaption = () => {
    return getShareUrl();
  };

  const getInstagramCaption = () => {
    return getShareUrl();
  };

  const copyTextToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const openShareWindow = (url: string) => {
    if (typeof window === "undefined") {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=620,height=720",
    );
  };

  const closeSharePrompt = () => {
    setSharePrompt({
      isOpen: false,
      platform: null,
      shareUrl: "",
      isClipboardCopied: false,
      clipboardText: "",
    });
  };

  const openSharePrompt = async (
    platform: SharePlatform,
    shareWindowUrl: string,
    clipboardText: string,
  ) => {
    setIsSharing(true);

    let copied = false;
    try {
      await copyTextToClipboard(clipboardText);
      copied = true;
    } catch {
      copied = false;
    } finally {
      setIsSharing(false);
    }

    setSharePrompt({
      isOpen: true,
      platform,
      shareUrl: shareWindowUrl,
      isClipboardCopied: copied,
      clipboardText,
    });
  };

  const handleCopyPromptText = async () => {
    if (!sharePrompt.clipboardText) {
      return;
    }

    try {
      await copyTextToClipboard(sharePrompt.clipboardText);
      setSharePrompt((previous) => ({
        ...previous,
        isClipboardCopied: true,
      }));
      toast.success("Copied to clipboard.");
    } catch {
      toast.error("Unable to copy clipboard in this browser.");
    }
  };

  const handleContinueShare = () => {
    if (!sharePrompt.shareUrl) {
      return;
    }

    openShareWindow(sharePrompt.shareUrl);
    closeSharePrompt();
  };

  const handleShare = async (platform: SharePlatform) => {
    const shareUrl = getShareUrl();
    if (!shareUrl) {
      toast.error("Unable to build share link.");
      return;
    }

    if (platform === "facebook") {
      const quote = getFacebookQuote();
      const shareUrlForFacebook = `${shareUrl}?share=facebook`;
      const searchParams = new URLSearchParams({
        u: shareUrlForFacebook,
        quote,
        hashtag: "#GDGPUP",
      });
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?${searchParams.toString()}`;
      await openSharePrompt("facebook", facebookShareUrl, getShareCaption());
      return;
    }

    if (platform === "linkedin") {
      const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      await openSharePrompt("linkedin", linkedInShareUrl, getLinkedInCaption());
      return;
    }

    await openSharePrompt("instagram", "https://www.instagram.com/", getInstagramCaption());
  };

  const handleDropSection = (targetIndex: number) => {
    if (!isDesktopReorderMode || draggingIndex === null) return;

    const next = moveSparkmatesSection(sectionOrder, draggingIndex, targetIndex);
    setDraggingIndex(null);
    setDropTargetIndex(null);
    if (next === sectionOrder) return;

    saveSectionOrder(next);
  };

  const handleMobileTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mobileDraggingIndexRef.current === null) return;

    const touchY = event.touches[0]?.clientY;
    if (typeof touchY !== "number") return;

    let nextDropIndex = mobileDropIndexRef.current;
    for (let i = 0; i < mobileRowRefs.current.length; i += 1) {
      const row = mobileRowRefs.current[i];
      if (!row) continue;
      const rect = row.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        nextDropIndex = i;
        break;
      }
    }

    if (typeof nextDropIndex === "number" && nextDropIndex !== mobileDropIndexRef.current) {
      mobileDropIndexRef.current = nextDropIndex;
      setMobileDropIndex(nextDropIndex);
    }

    event.preventDefault();
  };

  const finalizeMobileDrag = () => {
    const fromIndex = mobileDraggingIndexRef.current;
    const toIndex = mobileDropIndexRef.current;

    if (
      fromIndex !== null &&
      toIndex !== null &&
      fromIndex !== toIndex
    ) {
      const next = moveSparkmatesSection(
        sectionOrder,
        fromIndex,
        toIndex,
      );
      if (next !== sectionOrder) {
        saveSectionOrder(next);
      }
    }

    mobileDraggingIndexRef.current = null;
    mobileDropIndexRef.current = null;
    setMobileDraggingIndex(null);
    setMobileDropIndex(null);
  };

  const renderSection = (sectionId: SparkmatesSectionId) => {
    if (!userprofile) return null;

    if (sectionId === "customButtons") {
      return <CustomButtonsSection profile={userprofile} />;
    }
    if (sectionId === "skillsAndInterests") {
      return <SkillsAndLinksSection profile={userprofile} />;
    }
    if (sectionId === "projects") {
      return <ProjectsSection profile={userprofile} />;
    }
    if (sectionId === "gdgImpact") {
      return <ImpactSection profile={userprofile} />;
    }
    return <BadgesSection profile={userprofile} />;
  };


  if (isLoading) {
    return <LoadingScreen message="Loading your profile..." />;
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

  // const requiresActivation = profile.source === "nfc_card";
  // const showActivationGate =
  //   requiresActivation && profile.status !== "activated";

  // if (showActivationGate) {
  //   return (
  //     <div className="min-h-screen bg-[#010B1D] px-6 pb-24 pt-40 text-white">
  //       <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
  //         <Text variant="heading-5" className="text-white">
  //           Sparkmates Profile Not Active
  //         </Text>
  //         <Text variant="body" className="mt-2 text-[#C1C7CD]">
  //           This digital portfolio is not activated yet.
  //         </Text>
  //       </div>
  //     </div>
  //   );
  // }

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
        {/* RAINBOW ON THE BACKGROUND — desktop only */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden sm:block">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-325 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <FadeInSection className="min-w-0 p-0" delay={0.02}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 mb-8 sm:mb-0">
              <Text variant="heading-5" className="text-white text-center sm:text-left">
                My Portfolio
              </Text>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:justify-end" role="group" aria-label="Portfolio actions">
                <Link prefetch={false} href="/sparkmates/me/analytics">
                  <Button
                    variant="colored"
                    subVariant="blue"
                    size="sm"
                    className="px-3 py-1 text-white"
                  >
                    Analytics
                  </Button>
                </Link>
                <Button
                  variant="default"
                  size="sm"
                  iconRight={viewIcon}
                  className="px-3 py-1 text-white"
                  onClick={() => {
                    setIsPreviewClosing(false);
                    setIsPreviewOpen(true);
                  }}
                  disabled={!userprofile}
                >
                  Preview
                </Button>
                <ShareDropdown
                  gdgId={effectiveGdgId}
                  disabled={!userprofile || isSharing}
                  onShare={(platform) => { void handleShare(platform); }}
                />
              </div>
            </div>

            {userprofile && (
              <NameAndProfileSection
                profile={userprofile}
                onOpenReorderDesktop={() => setIsDesktopReorderMode((prev) => !prev)}
                onOpenReorderMobile={() => setIsMobileReorderModalOpen(true)}
              />
            )}

            <AnimatePresence>
              {isDesktopReorderMode ? (
                <motion.div
                  key="reorder-navbar"
                  initial={{ opacity: 0, y: -24, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.985 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="fixed left-0 right-0 top-0 z-60 hidden md:px-16 md:pt-10 sm:block pointer-events-none"
                >
                  <div className="pointer-events-auto mx-auto h-22 max-w-7xl md:rounded-[1.875rem] px-8 md:px-12 lg:px-20 flex items-center shadow-[0px_4px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040,0px_4px_36px_0px_#FFFFFF40_inset] bg-black/80 backdrop-blur-xl relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-0.5 before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]">
                    <div className="relative flex w-full items-center justify-between gap-3">
                      <Text variant="body" className="text-white" weight="bold">
                        Reorder mode enabled: drag sections directly. Drop to save instantly.
                      </Text>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-white"
                        onClick={() => {
                          setIsDesktopReorderMode(false);
                          setDraggingIndex(null);
                          setDropTargetIndex(null);
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-6 space-y-6">
              {sectionOrder.map((sectionId, index) => {
                const isLast = index === sectionOrder.length - 1;
                const isDraggingCurrent = draggingIndex === index;
                const isDropTarget = isDesktopReorderMode && dropTargetIndex === index;

                return (
                  <motion.div
                    key={sectionId}
                    layout
                    initial={false}
                    animate={{
                      opacity: isDesktopReorderMode ? 1 : 1,
                      y: isDesktopReorderMode ? 0 : 0,
                      scale: isDraggingCurrent ? 0.995 : 1,
                      filter: isDesktopReorderMode
                        ? "saturate(0.55) brightness(0.92)"
                        : "saturate(1) brightness(1)",
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className={`relative isolate space-y-4 rounded-2xl transition-all ${
                      isDesktopReorderMode
                        ? "hidden sm:block border border-white/20 bg-black/40 backdrop-blur-xl p-3 before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-[1.25px] before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]"
                        : ""
                    } ${isDraggingCurrent ? "opacity-60 scale-[0.995]" : ""} ${
                      isDropTarget
                        ? "shadow-[0_0_22px_rgba(255,255,255,0.22),0_0_30px_rgba(66,133,244,0.18)]"
                        : isDesktopReorderMode
                          ? "shadow-[0px_4px_36px_0px_#FFFFFF2A_inset,0_0_14px_rgba(255,255,255,0.08)]"
                          : ""
                    }`}
                    draggable={isDesktopReorderMode && !isSavingSectionOrder}
                    onDragStart={() => {
                      if (!isDesktopReorderMode) return;
                      setDraggingIndex(index);
                    }}
                    onDragOver={(event) => {
                      if (!isDesktopReorderMode) return;
                      event.preventDefault();
                      if (draggingIndex !== index) {
                        setDropTargetIndex(index);
                      }
                    }}
                    onDrop={() => handleDropSection(index)}
                    onDragEnd={() => {
                      setDraggingIndex(null);
                      setDropTargetIndex(null);
                    }}
                  >
                    {isDesktopReorderMode ? (
                      <div className="relative hidden sm:flex items-center justify-between rounded-xl border border-white/20 bg-black/30 px-3 py-2">
                        <Text variant="body-sm" className="text-white" weight="bold">
                          {SECTION_LABELS[sectionId]}
                        </Text>
                        <Text variant="body-sm" className="text-[#C1C7CD]">
                          Drag me ::
                        </Text>
                      </div>
                    ) : null}

                    <motion.div
                      animate={{
                        opacity: isDesktopReorderMode ? 0.85 : 1,
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={isDesktopReorderMode ? "pointer-events-none select-none" : ""}
                    >
                      {renderSection(sectionId)}
                    </motion.div>

                    {!isLast ? <Divider /> : null}
                  </motion.div>
                );
              })}
            </div>
          </FadeInSection>

          <div className="min-w-0">
            {userprofile && <SuggestedPeopleSection profile={userprofile} />}
          </div>
        </div>

        <Modal
          open={sharePrompt.isOpen}
          onOpenChange={(open) => {
            if (open) {
              return;
            }
            if (!open) {
              closeSharePrompt();
            }
          }}
          size="sm"
          placement="center"
          className="bg-[#081327]/95 border border-white/15 p-0 text-white"
        >
          <div className="w-full max-w-md px-5 py-5">
            <Text variant="heading-6" className="text-white" weight="bold">
              Share to {sharePrompt.platform ? SHARE_PLATFORM_LABELS[sharePrompt.platform] : "Social"}
            </Text>
            <Text variant="body-sm" className="mt-2 text-[#C1C7CD]">
              {sharePrompt.isClipboardCopied
                ? "Clipboard has been copied. Paste it in your post after the share page opens."
                : "Unable to auto-copy clipboard in this browser. You can still continue to share."}
            </Text>
            <Text variant="caption" className="mt-2 text-[#A9D1FF]">
              Tip: open the post composer, then paste from clipboard for the fastest workflow.
            </Text>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="default"
                size="sm"
                className="text-white"
                onClick={() => {
                  void handleCopyPromptText();
                }}
              >
                Copy Again
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-white"
                onClick={closeSharePrompt}
              >
                Cancel
              </Button>
              <Button
                variant="colored"
                subVariant="blue"
                size="sm"
                className="text-white"
                onClick={handleContinueShare}
              >
                Continue
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          open={isPreviewOpen}
          onOpenChange={handlePreviewOpenChange}
          size="sm"
          scrollBehavior="outside"
          placement="center"
          closeOnEsc={false}
          className="bg-transparent border-none p-0 shadow-none! isolate w-full max-w-102.5"
        >
          <div className="flex min-h-[calc(100dvh-1.5rem)] items-center justify-center px-3 py-2 sm:min-h-0 sm:px-4 sm:py-3">
            <div
              className="group relative"
              style={{ perspective: "1200px" }}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 10;
                const rotateX = (0.5 - y) * 10;
                setPreviewTilt({ rotateX, rotateY });
              }}
              onMouseLeave={() => setPreviewTilt({ rotateX: 0, rotateY: 0 })}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.84, y: 16 }}
                animate={
                  isPreviewClosing
                    ? { opacity: 0, scale: 0.9, y: 10 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div
                className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[linear-gradient(165deg,rgba(16,23,47,0.96),rgba(6,12,32,0.98))] p-2 shadow-[0_20px_55px_rgba(0,0,0,0.65)] transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateX(${previewTilt.rotateX}deg) rotateY(${previewTilt.rotateY}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <ShineBorder
                  borderWidth={2}
                  duration={8}
                  shineColor={["#EA4335", "#F9AB00", "#34A853", "#4285F4"]}
                  style={{ borderRadius: 28 }}
                />
                {userprofile ? <SparkmatesMiniPreviewCard profile={userprofile} /> : null}
              </div>
              </motion.div>
            </div>
          </div>
        </Modal>

        <Modal
          open={isMobileReorderModalOpen}
          onOpenChange={setIsMobileReorderModalOpen}
          size="sm"
          scrollBehavior="inside"
          className="bg-transparent border-none p-0 shadow-none! isolate sm:hidden"
        >
          <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-5 py-6 border border-white/10">
            <Text variant="heading-6" className="text-white" weight="bold">
              Reorder Sections
            </Text>
            <Text variant="body-sm" className="mt-1 text-[#C1C7CD]">
              Move sections up or down.
            </Text>

            <div className="mt-4 space-y-2">
              {sectionOrder.map((sectionId, index) => {
                const isDragging = mobileDraggingIndex === index;
                const isDropTarget =
                  mobileDraggingIndex !== null &&
                  mobileDropIndex === index &&
                  mobileDraggingIndex !== index;

                return (
                  <div
                    key={`mobile-${sectionId}`}
                    ref={(el) => {
                      mobileRowRefs.current[index] = el;
                    }}
                    data-mobile-reorder-index={index}
                    className={`rounded-xl border px-3 py-2 transition-all ${
                      isDropTarget
                        ? "border-[#57CAFF] bg-[#1A2B4A] shadow-[0_0_18px_rgba(87,202,255,0.3)]"
                        : "border-white/20 bg-[#091734]/70"
                    } ${isDragging ? "opacity-70 scale-[0.99]" : ""}`}
                    onTouchStart={() => {
                      mobileDraggingIndexRef.current = index;
                      mobileDropIndexRef.current = index;
                      setMobileDraggingIndex(index);
                      setMobileDropIndex(index);
                    }}
                    onTouchMove={handleMobileTouchMove}
                    onTouchEnd={finalizeMobileDrag}
                    onTouchCancel={finalizeMobileDrag}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Text variant="body" className="text-white">
                        {SECTION_LABELS[sectionId]}
                      </Text>
                      <Text variant="body-sm" className="text-[#C1C7CD]">
                        Drag ::
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="default"
                size="sm"
                className="text-white"
                onClick={() => setIsMobileReorderModalOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </CosmosParticles>
  );
}
