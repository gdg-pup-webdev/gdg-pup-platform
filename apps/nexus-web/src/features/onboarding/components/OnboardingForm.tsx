"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Stack, Text } from "@packages/spark-ui";
import { toast } from "react-toastify";
import {
  markOnboardingCompleted,
  saveOnboardingDraft,
} from "../utils/onboardingStorage";

type OnboardingFormProps = {
  gdgId: string;
  firstName?: string;
};

type FormState = {
  nickname: string;
  bio: string;
  department: string;
  yearLevel: string;
  program: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioWebsiteUrl: string;
  technicalSkills: string;
  learningInterests: string;
  toolsAndTechnologies: string;
  otherLinks: string;
};

const initialState: FormState = {
  nickname: "",
  bio: "",
  department: "",
  yearLevel: "",
  program: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioWebsiteUrl: "",
  technicalSkills: "",
  learningInterests: "",
  toolsAndTechnologies: "",
  otherLinks: "",
};

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function OnboardingForm({ gdgId, firstName }: OnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const previewUrl = useMemo(
    () => (profileFile ? URL.createObjectURL(profileFile) : null),
    [profileFile],
  );

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        gdg_id: gdgId,
        nickname: form.nickname || null,
        bio: form.bio || null,
        department: form.department || null,
        year_level: form.yearLevel ? Number(form.yearLevel) : null,
        program: form.program || null,
        github_url: form.githubUrl || null,
        linkedin_url: form.linkedinUrl || null,
        portfolio_website_url: form.portfolioWebsiteUrl || null,
        technical_skills: parseCsv(form.technicalSkills),
        learning_interests: parseCsv(form.learningInterests),
        tools_and_technologies: parseCsv(form.toolsAndTechnologies),
        other_links: parseCsv(form.otherLinks),
        profile_image_file_name: profileFile?.name ?? null,
        is_public: true,
      };

      saveOnboardingDraft(gdgId, payload);
      markOnboardingCompleted(gdgId);

      toast.success("Onboarding saved. You can connect backend next.");
      router.push("/sparkmates/me");
    } catch (error) {
      toast.error("Unable to save onboarding draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    markOnboardingCompleted(gdgId);
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-zinc-800/60 bg-zinc-950/70 p-6 md:p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">
      <Stack gap="xl">
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
                ? "Nice to meet you, ."
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
        </div>

        {step === 1 && (
          <div className="grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-inner">
              <p className="mb-4 text-sm font-medium text-zinc-400">
                Profile Picture
              </p>
              <label className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950/50 transition-all hover:border-blue-500/50 hover:bg-zinc-900/80">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 px-4 text-center">
                    <div className="rounded-full bg-zinc-800 p-3 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300">
                      Click to upload photo
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setProfileFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Input
                  value={form.nickname}
                  onChange={(event) =>
                    updateField("nickname", event.target.value)
                  }
                  placeholder="Nickname"
                  containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                  className="text-white! py-3"
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={form.yearLevel}
                  onChange={(event) =>
                    updateField("yearLevel", event.target.value)
                  }
                  placeholder="Year Level"
                  containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                  className="text-white! py-3"
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  value={form.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                  placeholder="Department (e.g. College of Computer and Information Sciences)"
                  containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                  className="text-white! py-3"
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  value={form.program}
                  onChange={(event) =>
                    updateField("program", event.target.value)
                  }
                  placeholder="Program (e.g. Bachelor of Science in Information Technology)"
                  containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                  className="text-white! py-3"
                />
              </div>
              <div className="sm:col-span-2">
                <textarea
                  value={form.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  placeholder="Tell us a little bit about yourself..."
                  rows={4}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-4 py-3 text-zinc-200 outline-none transition-all placeholder:text-zinc-500 hover:border-zinc-600 focus:border-blue-500/50 focus:bg-zinc-900/80 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              value={form.githubUrl}
              onChange={(event) => updateField("githubUrl", event.target.value)}
              placeholder="GitHub URL"
              containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
              className="text-white! py-3"
            />
            <Input
              value={form.linkedinUrl}
              onChange={(event) =>
                updateField("linkedinUrl", event.target.value)
              }
              placeholder="LinkedIn URL"
              containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
              className="text-white! py-3"
            />
            <div className="sm:col-span-2">
              <Input
                value={form.portfolioWebsiteUrl}
                onChange={(event) =>
                  updateField("portfolioWebsiteUrl", event.target.value)
                }
                placeholder="Personal Portfolio Website URL"
                containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                value={form.technicalSkills}
                onChange={(event) =>
                  updateField("technicalSkills", event.target.value)
                }
                placeholder="Core Technical Skills (comma-separated: React, Node.js, Python...)"
                containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                value={form.learningInterests}
                onChange={(event) =>
                  updateField("learningInterests", event.target.value)
                }
                placeholder="Learning Interests (comma-separated: Machine Learning, Web3...)"
                containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                value={form.toolsAndTechnologies}
                onChange={(event) =>
                  updateField("toolsAndTechnologies", event.target.value)
                }
                placeholder="Other Tools and Technologies (comma-separated: Docker, Figma, AWS...)"
                containerClassName="bg-zinc-900/50! border-zinc-700/80! hover:border-zinc-600! focus-within:border-blue-500/50!"
                className="text-white! py-3"
              />
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-zinc-800/80 pt-6 flex justify-between items-center">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>
      </Stack>
    </div>
  );
}
