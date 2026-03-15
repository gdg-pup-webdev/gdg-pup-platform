import Image from "next/image";
import { CosmosParticles } from "@/components/shared";
import { AuthParallaxBackground } from "@/features/auth/components/AuthParallaxBackground";
import { AuthParallaxMascot } from "@/features/auth/components/AuthParallaxMascot";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={350}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={80}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="bg-[#010b1d] min-h-screen"
    >
      <div className="flex flex-col items-center pt-[168px] pb-16 relative w-full min-h-screen overflow-hidden z-10">
        {/* Parallax Background graphics anchored to a centralized 1440px canvas */}
        <AuthParallaxBackground />
        
        {/* Content Container */}
        <div className="flex flex-col md:flex-row gap-[148px] items-start justify-center relative z-10 w-full max-w-7xl px-4">
          
          {/* Left Side Illustration */}
          <div className="hidden md:flex relative py-[100px]">
            <AuthParallaxMascot />
          </div>

          {/* Right Side Auth Form */}
          <div className="flex flex-col gap-[32px] items-center shrink-0 w-full md:w-[500px]">
             <div className="py-[40px] flex flex-col items-center">
               <div className="text-[32px] font-bold text-white leading-[1.4] whitespace-nowrap" style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}>GDG PUP</div>
               <div className="relative w-[145px] h-[34.48px] mt-1">
                  <Image src="/auth/auth-nexus-logo.svg" alt="Nexus Logo" className="object-contain" fill unoptimized={true} />
               </div>
             </div>
             
             {/* Here is where the form renders */}
             {children}
          </div>
        </div>
      </div>
    </CosmosParticles>
  );
}
