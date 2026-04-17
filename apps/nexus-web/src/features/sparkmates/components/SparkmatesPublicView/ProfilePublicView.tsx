"use client";

import React, { useState } from "react";
import { Button, Text } from "@packages/spark-ui";
import { toast } from "react-toastify";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useCardActivation } from "@/features/nfc-cards/hooks/useActivateCardMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SparkmatesSource, useSparkmateProfile } from "../..";
import { GradientProfilePicture } from "../SparkmatesOwnerView/components/GradientProfilePicture";
import { SparkmatesRainbowStreak } from "../SparkmatesOwnerView/components/SparkmatesRainbowStreak";
import { FadeInSection } from "../SparkmatesOwnerView/components/FadeInSection";
import { Divider } from "../SparkmatesOwnerView/components/Divider";

import { NameAndProfileSection } from "../sections/NameAndProfileSection";
import { CustomButtonsSection } from "../sections/CustomButtonsSection";
import { SkillsAndLinksSection } from "../sections/SkillsAndLinksSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { ImpactSection } from "../sections/ImpactSection";
import { BadgesSection } from "../sections/BadgesSection";
import { SuggestedPeopleSection } from "../sections/SuggestedPeopleSection";

import {
  normalizeSparkmatesSectionOrder,
  SparkmatesSectionId,
} from "../../sectionOrder";

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

  const sectionOrder = normalizeSparkmatesSectionOrder(profile.sectionOrder);

  const renderSection = (sectionId: SparkmatesSectionId) => {
    if (sectionId === "customButtons") {
      return <CustomButtonsSection profile={profile} readOnly />;
    }
    if (sectionId === "skillsAndInterests") {
      return <SkillsAndLinksSection profile={profile} readOnly />;
    }
    if (sectionId === "projects") {
      return <ProjectsSection profile={profile} readOnly />;
    }
    if (sectionId === "gdgImpact") {
      return <ImpactSection profile={profile} readOnly />;
    }
    return <BadgesSection profile={profile} readOnly />;
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
          <FadeInSection className="min-w-0 p-0" delay={0.02}>
            <NameAndProfileSection profile={profile} readOnly />

            <div className="mt-6 space-y-6">
              {sectionOrder.map((sectionId, index) => {
                const isLast = index === sectionOrder.length - 1;
                return (
                  <div key={sectionId} className="space-y-6">
                    {renderSection(sectionId)}
                    {!isLast ? <Divider /> : null}
                  </div>
                );
              })}
            </div>
          </FadeInSection>

          <div className="min-w-0">
            <SuggestedPeopleSection profile={profile} readOnly />
          </div>
        </div>
      </div>
    </CosmosParticles>
  );
}
