"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { OnboardingForm } from "@/features/onboarding/components/OnboardingForm";
import { STATUS } from "@/features/authentication/store/useAuthStore";
import { CosmosParticles } from "@/components/shared";

export default function OnboardingPage() {
  const router = useRouter();
  const { status, decodedToken, memberProfile } = useAuthContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === STATUS.UNAUTHENTICATED) {
      router.push("/signin");
      return;
    }

    // Redirect to profile if already onboarded
    if (status === STATUS.AUTHENTICATED && memberProfile && memberProfile.isOnboarded) {
      router.push("/sparkmates/me");
    }
  }, [status, memberProfile, router]);

  if (!mounted || !decodedToken || (status === STATUS.AUTHENTICATED && !memberProfile)) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#010b1d] flex flex-col items-center justify-center pt-24 text-zinc-300">
        Preparing onboarding...
      </div>
    );
  }

  return (
    <main className="relative my-20 px-0 min-h-screen w-full overflow-hidden bg-[#010b1d]">
      <CosmosParticles
        particleColors={["#ffffff", "#4285f4"]}
        particleCount={350}
        particleSpread={15}
        speed={0.03}
        particleBaseSize={80}
        moveParticlesOnHover
        alphaParticles={true}
        disableRotation={false}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <OnboardingForm
          gdgId={decodedToken.memberInfo.gdgId}
          firstName={decodedToken.memberInfo.firstName}
        />
      </div>
    </main>
  );
}
