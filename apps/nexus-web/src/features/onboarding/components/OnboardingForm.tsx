"use client";

import { useMemo } from "react";
import { Stack, Text, Container, ShineBorder } from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { ProfilePictureUpload } from "./ProfilePictureUpload";
import { BasicInfoFields } from "./BasicInfoFields";
import { LinksAndSkillsFields } from "./LinksAndSkillsFields";
import { ProjectsManager } from "./ProjectsManager";
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
    profileFile,
    setProfileFile,
    serverAvatarUrl,
    form,
    projects,
    updateField,
    updateProject,
    addProject,
    removeProject,
    handleSave,
    handleSkip,
  } = useOnboardingForm(gdgId);

  const previewUrl = useMemo(
    () => (profileFile ? URL.createObjectURL(profileFile) : serverAvatarUrl),
    [profileFile, serverAvatarUrl],
  );

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
      className="min-h-screen relative overflow-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] flex items-center justify-center"
    >
      <div className="relative z-10 w-full">
        <Container className="py-12">
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto rounded-3xl border border-white/20 bg-[rgba(255,255,255,0.02)] shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)] backdrop-blur-2xl">
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
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Skip for now
                </button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800"}`}
                />
              </div>

              {step === 1 && (
                <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                  <ProfilePictureUpload previewUrl={previewUrl} setProfileFile={setProfileFile} />
                  <BasicInfoFields form={form} updateField={updateField} />
                </div>
              )}

              {step === 2 && (
                <div>
                  <LinksAndSkillsFields form={form} updateField={updateField} />
                </div>
              )}

              {step === 3 && (
                <div>
                  <ProjectsManager
                    projects={projects}
                    updateProject={updateProject}
                    addProject={addProject}
                    removeProject={removeProject}
                  />
                </div>
              )}

              <div className="mt-4 border-t border-zinc-800/80 pt-6 flex justify-between items-center">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                    className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                    disabled={isPrefilling}
                    className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                  >
                    {isPrefilling ? "Loading profile..." : "Continue"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isPrefilling}
                    className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center gap-2"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                )}
              </div>
            </Stack>
            </div>
          </div>
        </Container>
      </div>
    </CosmosParticles>
  );
}
