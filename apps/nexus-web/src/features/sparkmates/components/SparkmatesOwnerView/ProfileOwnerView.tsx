"use client";
 
import { Badge, Button, Input, ShineBorder, Text } from "@packages/spark-ui";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";
import Link from "next/link";
import { useSparkmateProfile, useSuggestedSparkmates } from "../../hooks";
import { SparkmatesSource } from "../../types";
import { SkillsAndLinksSection } from "./sections/SkillsAndLinksSection"; 
import { viewIcon } from "./icons/viewIcon"; 
import { Divider } from "./components/Divider"; 
 import { SparkmatesRainbowStreak } from "./components/SparkmatesRainbowStreak";
import { FadeInSection } from "./components/FadeInSection";
import { NameAndProfileSection } from "./sections/NameAndProfileSection";
import { useGetProfileOfUserByGdgId } from "../../hooks/useGetProfileOfUserByGdgId";
import { CustomButtonsSection } from "./sections/CustomButtonsSection";
import { BadgesSection } from "./sections/BadgesSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ImpactSection } from "./sections/ImpactSection";
import { SuggestedPeopleSection } from "./sections/SuggestedPeopleSection";
 
export function ProfileOwnerView({
  gdgId,
  source,
}: {
  gdgId: string;
  source: SparkmatesSource;
}) {

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useSparkmateProfile({ gdgId, source });

  const {
    data: userprofiledata,
    error: usererror,
    isLoading: userisLoading,
  } = useGetProfileOfUserByGdgId(gdgId);
  const userprofile = userprofiledata?.data;
  console.log("User Profile:", userprofile);


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
      className="min-h-screen bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-24 sm:pt-36 text-white"
    >
      <div className="relative min-h-screen w-full">
        {/* RAINBOW ON THE BACKGROUND — desktop only */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden sm:block">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-325 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <FadeInSection className="p-0" delay={0.02}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text variant="heading-5" className="text-white">
                My Portfolio
              </Text>
              <div className="flex gap-2">
                <Link href="/sparkmates/me/analytics">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-white border-white/20 hover:bg-white/10"
                  >
                    Analytics
                  </Button>
                </Link>
                <Button
                  variant="default"
                  size="sm"
                  iconRight={viewIcon}
                  className="px-3 py-1 text-white"
                >
                  Preview
                </Button>
              </div>
            </div>

            {userprofile && <NameAndProfileSection profile={userprofile} />}

            <div className="mt-6 space-y-6">

              {/* {userprofile && <CustomButtonsSection profile={userprofile} />} */}
              <Divider />

              {userprofile && <SkillsAndLinksSection profile={userprofile} />}

              <Divider />

              {userprofile && <ProjectsSection profile={userprofile} />}

              <Divider />

              {userprofile && <ImpactSection profile={userprofile} />}

              <Divider />

              {userprofile && <BadgesSection profile={userprofile} />}
            </div>
          </FadeInSection>

          {userprofile && <SuggestedPeopleSection profile={userprofile} />}
        </div>
      </div>
    </CosmosParticles>
  );
}
