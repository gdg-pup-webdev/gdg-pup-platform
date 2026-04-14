"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stack, Text, Container, ShineBorder, Button } from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { BasicInfoFields } from "./BasicInfoFields";
import { LinksAndSkillsFields } from "./LinksAndSkillsFields";
import { ProjectsManager } from "./ProjectsManager";
import { ProfileVisibilityField } from "./ProfileVisibilityField";
import { useOnboardingForm } from "../hooks/useOnboardingForm";

type OnboardingFormProps = {
  gdgId: string;
  firstName?: string;
};

export function OnboardingForm({ gdgId, firstName }: OnboardingFormProps) {
  const {
    step,
    setStep,
    isPrefilling,
    isSaving,
    isSuccess,
    profileFile,
    setProfileFile,
    serverAvatarUrl,
    form,
    projects,
    updateField,
    updateProject,
    addProject,
    removeProject,
    updateProjectImages,
    removeExistingProjectImage,
    handleSave,
    handleSkip,
    fetchMemberProfile,
  } = useOnboardingForm(gdgId);

  const previewUrl = useMemo(
    () => (profileFile ? URL.createObjectURL(profileFile) : serverAvatarUrl),
    [profileFile, serverAvatarUrl],
  );

  return (
    <>
      {isSuccess && (
        <OnboardingSuccessModal 
          firstName={firstName} 
          onRedirect={() => fetchMemberProfile()} 
        />
      )}
      <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={180}
      particleSpread={14}
      speed={0.028}
      particleBaseSize={75}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="min-h-screen relative overflow-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] flex items-center justify-center"
    >
      <div className="relative z-10 w-full">
        <Container className="py-12">
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto rounded-3xl border border-white/20 bg-[rgba(255,255,255,0.02)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <ShineBorder
              borderWidth={1.5}
              duration={10}
              shineColor={["#FB2C36", "#F0B100", "#00C950", "#2B7FFF"]}
            />
            <div className="relative z-10">
              <Stack gap="xl" className="p-6 md:p-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-zinc-800/80 pb-6 mb-2">
                <div>
                  <Text
                    variant="heading-3"
                    className="text-white!"
                    gradient="white-yellow"
                    weight="bold"
                  >
                    Complete your profile
                  </Text>
                  <Text className="text-zinc-400 mt-2 text-base md:text-lg">
                    {firstName
                      ? `Nice to meet you, ${firstName}.`
                      : "Let us set up your Sparkmates profile."}{" "}
                    Upload your photo and portfolio details.
                  </Text>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Skip for now
                </Button>
              </div>

              <div className="flex items-center gap-2 py-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 4 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 5 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
              </div>

              {step === 1 && (
                <div className="flex justify-center py-8">
                  <ProfilePictureUpload previewUrl={previewUrl} setProfileFile={setProfileFile} />
                </div>
              )}

              {step === 2 && (
                <div>
                  <BasicInfoFields form={form} updateField={updateField} />
                </div>
              )}

              {step === 3 && (
                <div>
                  <LinksAndSkillsFields form={form} updateField={updateField} />
                </div>
              )}

              {step === 4 && (
                <div>
                  <ProjectsManager
                    projects={projects}
                    updateProject={updateProject}
                    addProject={addProject}
                    removeProject={removeProject}
                    imageInputMode="list"
                    updateProjectImages={updateProjectImages}
                    removeExistingProjectImage={removeExistingProjectImage}
                  />
                </div>
              )}

              {step === 5 && (
                <div className="py-8">
                  <ProfileVisibilityField form={form} updateField={updateField} />
                </div>
              )}

              <div className="mt-4 border-t border-zinc-800/80 pt-6 flex justify-between items-center">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4 | 5)}
                    className="rounded-xl px-6"
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <Button
                    variant="colored"
                    subVariant="blue"
                    onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4 | 5)}
                    disabled={isPrefilling}
                    className="rounded-xl px-8 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  >
                    {isPrefilling ? "Loading profile..." : "Continue"}
                  </Button>
                ) : (
                  <Button
                    variant="colored"
                    subVariant="blue"
                    onClick={handleSave}
                    disabled={isSaving || isPrefilling}
                    className="rounded-xl px-8 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                )}
              </div>
            </Stack>
            </div>
          </div>
        </Container>
      </div>
    </CosmosParticles>
    </>
  );
}

function OnboardingSuccessModal({ 
  firstName,
  onRedirect 
}: { 
  firstName?: string;
  onRedirect: () => Promise<void>;
}) {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleRedirect = async () => {
      await onRedirect();
      router.push("/sparkmates/me");
    };

    timer = setTimeout(handleRedirect, 3500);
    return () => clearTimeout(timer);
  }, [router, onRedirect]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#010B1D]/80 backdrop-blur-xl" />

      {/* Modal */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-12 max-w-sm w-full text-center">
        {/* Animated checkmark */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute h-24 w-24 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/40 bg-gradient-to-br from-blue-600/30 to-blue-400/10 shadow-[0_0_60px_rgba(59,130,246,0.5)]">
            <svg
              className="h-9 w-9 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {firstName ? `You're all set, ${firstName}!` : "Profile Complete!"}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your Sparkmates profile is ready. Redirecting you to your portfolio...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[2px] rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
            style={{
              animation: "slideProgress 3.5s linear forwards",
            }}
          />
        </div>

        <style>{`
          @keyframes slideProgress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
