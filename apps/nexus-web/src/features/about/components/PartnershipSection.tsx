/* For improvements:
 * Add real links to the CTA buttons
 * Add devcon.png to /public/pages/about/partnership/
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";


// ─── Animation Wrapper ──────────────────────────────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Partner Data ────────────────────────────────────────────────────────────
const featuredPartners = [
  { name: "Acadarena Education", slug: "acadarena", ext: "png" },
  { name: "Globe", slug: "globe", ext: "png" },
  { name: "DEVCON Manila Chapter", slug: "devcon", ext: "png" },
  { name: "v0", slug: "v0", ext: "png" },
];

const regularPartners = [
  { name: "Gen AI Philippines", slug: "gen-ai-philippines", ext: "jpg" },
  { name: "DataCamp Donates", slug: "datacamp", ext: "png" },
  { name: "PLDT", slug: "pldt", ext: "png" },
  { name: "YSpaces", slug: "yspace", ext: "png" },
  { name: "Whitecloak", slug: "whitecloak", ext: "png" },
  { name: "Pocky", slug: "pocky", ext: "png" },
  { name: "Hey Roomie", slug: "hey-roomie", ext: "png" },
  { name: "Potico.ph", slug: "potico", ext: "png" },
  { name: "FlowerStore.ph", slug: "flowerstore", ext: "png" },
  { name: "Homeroom", slug: "homeroom", ext: "jpg" },
  { name: "Mountain Dew", slug: "mountain-dew", ext: "png" },
];

// ─── Logo image helper ───────────────────────────────────────────────────────
function PartnerLogo({
  slug,
  name,
  ext,
}: {
  slug: string;
  name: string;
  ext: string;
}) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={`/pages/about/partnership/${slug}.${ext}`}
        alt={name}
        fill
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = "0";
        }}
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function PartnershipSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* ── 1. Starfield background ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Global Dark Glass Gradients for Floating 3D Objects */}
            <linearGradient id="darkGlassFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(10,10,10,0.6)" />
            </linearGradient>
            <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>

            <pattern id="stars" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="50" r="1.5" fill="#FFF" opacity="0.8" />
              <circle cx="80" cy="120" r="1" fill="#FFF" opacity="0.4" />
              <circle cx="150" cy="30" r="2" fill="#FFF" opacity="0.9" filter="drop-shadow(0 0 2px #fff)" />
              <circle cx="180" cy="150" r="1.5" fill="#FFF" opacity="0.6" />
              <circle cx="40" cy="180" r="1" fill="#FFF" opacity="0.3" />
              <circle cx="120" cy="90" r="1.5" fill="#FFF" opacity="0.7" />
              <circle cx="10" cy="10" r="0.5" fill="#FFF" opacity="0.5" />
              <circle cx="190" cy="10" r="1" fill="#FFF" opacity="0.6" />
              <circle cx="100" cy="160" r="0.5" fill="#FFF" opacity="0.4" />
            </pattern>
            <pattern id="stars2" width="350" height="350" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="70" r="1" fill="#FFF" opacity="0.6" />
              <circle cx="150" cy="220" r="1.5" fill="#FFF" opacity="0.8" />
              <circle cx="250" cy="80" r="0.5" fill="#FFF" opacity="0.4" />
              <circle cx="300" cy="300" r="2" fill="#FFF" opacity="0.9" filter="drop-shadow(0 0 3px #FFF)" />
              <circle cx="50" cy="280" r="1" fill="#FFF" opacity="0.5" />
              <circle cx="200" cy="150" r="1.2" fill="#FFF" opacity="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stars)" />
          <rect width="100%" height="100%" fill="url(#stars2)" />
        </svg>
      </div>

      {/* ── 2. Glow Blobs ── */}
      <div className="pointer-events-none absolute z-0 -top-[20%] left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_50%_30%,rgba(255,180,20,0.15)_0%,transparent_60%)] blur-[80px] mix-blend-screen" />
      <div className="pointer-events-none absolute z-0 -left-[20%] top-[20%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(255,50,50,0.12)_0%,transparent_60%)] blur-[80px] mix-blend-screen" />
      <div className="pointer-events-none absolute z-0 -right-[20%] top-[30%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(0,120,255,0.15)_0%,transparent_60%)] blur-[80px] mix-blend-screen" />

      {/* ── 3. Dark 3D Glass Decorative Elements ── */}
      {/* Heavy Gear Shape (Left Side) - Half Offscreen */}
      <motion.div
        className="pointer-events-none absolute -left-[140px] lg:-left-[180px] top-[25%] z-[1] w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-100"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.8))">
          <path fill="url(#darkGlassFill)" stroke="url(#glassBorder)" strokeWidth="0.8" fillRule="evenodd" d="M 98.78253626555092 45.3886926473928 A 49 49 0 0 1 98.78253626555092 54.6113073526072 L 85.13300342979491 57.85315669027553 A 36 36 0 0 1 80.39580531807255 69.28976461924388 L 87.75514889601368 81.2337754976858 L 87.75514889601368 81.2337754976858 A 49 49 0 0 1 81.2337754976858 87.75514889601368 L 69.28976461924387 80.39580531807255 A 36 36 0 0 1 57.85315669027554 85.13300342979491 L 54.61130735260721 98.78253626555092 L 54.61130735260721 98.78253626555092 A 49 49 0 0 1 45.388692647392794 98.78253626555092 L 42.14684330972447 85.13300342979491 A 36 36 0 0 1 30.710235380756128 80.39580531807255 L 18.766224502314202 87.75514889601368 L 18.766224502314202 87.75514889601368 A 49 49 0 0 1 12.244851103986335 81.2337754976858 L 19.604194681927456 69.28976461924388 A 36 36 0 0 1 14.866996570205096 57.85315669027554 L 1.2174637344490833 54.611307352607206 L 1.2174637344490833 54.611307352607206 A 49 49 0 0 1 1.2174637344490833 45.38869264739281 L 14.866996570205089 42.14684330972447 A 36 36 0 0 1 19.604194681927453 30.710235380756128 L 12.244851103986328 18.76622450231421 L 12.244851103986328 18.76622450231421 A 49 49 0 0 1 18.766224502314213 12.24485110398632 L 30.71023538075613 19.60419468192745 A 36 36 0 0 1 42.146843309724446 14.866996570205103 L 45.38869264739277 1.2174637344490833 L 45.38869264739277 1.2174637344490833 A 49 49 0 0 1 54.61130735260721 1.2174637344490833 L 57.85315669027555 14.866996570205096 A 36 36 0 0 1 69.28976461924385 19.604194681927442 L 81.23377549768577 12.244851103986313 L 81.23377549768577 12.244851103986313 A 49 49 0 0 1 87.75514889601368 18.76622450231421 L 80.39580531807255 30.71023538075613 A 36 36 0 0 1 85.1330034297949 42.14684330972444 L 98.78253626555092 45.38869264739277 Z M 50 26 A 24 24 0 1 0 50 74 A 24 24 0 1 0 50 26 Z" />
        </svg>
      </motion.div>

      {/* Massive Glass Chevron > Shape (Right Side) */}
      <motion.div
        className="pointer-events-none absolute -right-[60px] lg:-right-[80px] top-[30%] lg:top-[35%] z-[1] w-[350px] h-[350px] md:w-[500px] md:h-[500px]"
        animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.8))">
          {/* Deeply rounded thick Chevron */}
          <path fill="url(#darkGlassFill)" stroke="url(#glassBorder)" strokeWidth="0.8" strokeLinejoin="round"
            d="M 25 22.5 L 67.5 50 L 25 77.5 A 12.5 12.5 0 0 0 37.5 95 L 87.5 58 A 12.5 12.5 0 0 0 87.5 42 L 37.5 5 A 12.5 12.5 0 0 0 25 22.5 Z" />
        </svg>
      </motion.div>

      {/* Gemini / Sparkle Star */}
      <motion.div
        className="pointer-events-none absolute left-[5%] lg:left-[10%] top-[10%] lg:top-[12%] z-[1] w-[100px] h-[100px] lg:w-[140px] lg:h-[140px]"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))">
          <path fill="url(#darkGlassFill)" stroke="url(#glassBorder)" strokeWidth="0.6"
            d="M50 10 C50 40 60 50 90 50 C60 50 50 60 50 90 C50 60 40 50 10 50 C40 50 50 40 50 10 Z" />
        </svg>
      </motion.div>

      {/* Bottom Left Diamonds (Seamless SVGs) */}
      <motion.div
        className="pointer-events-none absolute left-[5%] lg:left-[15%] bottom-[20%] z-[1] w-[120px] h-[120px]"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.8))">
          <rect x="15" y="15" width="55" height="55" rx="12" transform="rotate(-15 42 42)" fill="url(#darkGlassFill)" stroke="url(#glassBorder)" strokeWidth="1" />
          <rect x="55" y="55" width="35" height="35" rx="8" transform="rotate(25 72 72)" fill="url(#darkGlassFill)" stroke="url(#glassBorder)" strokeWidth="1" />
        </svg>
      </motion.div>


      {/* ─── Narrow center content column ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-[780px] flex-col items-center px-5 pb-40 pt-28 sm:px-8 md:pt-32">
        {/* ══ SECTION 1: Hero ══════════════════════════════════════════════════ */}
        <FadeIn className="mb-20 w-full text-center">
          <h1 className="mb-8 text-[2.6rem] font-bold leading-[1.08] tracking-tight sm:text-[3.2rem] md:text-[3.6rem]">
            <span className="text-white">Innovation Through </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Collaboration
            </span>
          </h1>

          {/* Dark Obsidian Glass Description Card */}
          <div className="w-full bg-[#0A0A0A]/60 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-md sm:px-10 sm:py-7 mx-auto shadow-2xl relative overflow-hidden">
            {/* Subtle inner top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-[14px] leading-[1.8] text-[#C8C8C8] md:text-base text-center relative z-10">
              We collaborate with forward-thinking organizations to foster
              innovation, deliver meaningful programs, and bridge the gap
              between technology and community. Together, we build platforms
              that inspire developers, nurture talent, and shape future-ready
              leaders.
            </p>
          </div>
        </FadeIn>

        {/* ══ SECTION 2: Why We Do This ════════════════════════════════════════ */}
        <FadeIn delay={0.1} className="mb-20 w-full text-center">
          <p className="mb-4 text-[10px] font-[900] tracking-[0.45em] sm:text-[12px] bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            WHY WE DO THIS
          </p>

          <h2 className="mb-8 text-xl font-bold text-white sm:text-2xl">
            Creating value through trust and shared purpose
          </h2>

          {/* Dark Obsidian Glass Why Card */}
          <div className="w-full bg-[#0A0A0A]/60 border border-[rgba(87,202,255,0.15)] rounded-[2rem] px-7 py-6 sm:px-10 sm:py-7 backdrop-blur-md shadow-[0_0_30px_rgba(87,202,255,0.05)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#57CAFF]/30 to-transparent" />
            <p className="text-[14px] leading-[1.85] text-[#C8C8C8] md:text-base text-center relative z-10">
              <span className="font-semibold text-[#57CAFF]">
                Google Developer Group PUP Nexus
              </span>{" "}
              exists to cultivate a collaborative tech community where students
              and professionals grow together. Through partnerships built on{" "}
              <span className="font-semibold text-[#FFD700]">
                trust and shared goals
              </span>
              , we create meaningful opportunities for{" "}
              <span className="font-semibold text-[#5CDB6D]">
                learning, innovation, and real-world impact.
              </span>
            </p>
          </div>
        </FadeIn>

        {/* ══ SECTION 3: Partners Grid ═════════════════════════════════════════ */}
        <FadeIn delay={0.15} className="mb-20 w-full">
          <p className="mb-8 text-center text-[10px] font-[900] tracking-[0.45em] sm:text-[12px] bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            POWERED BY OUR PARTNERS
          </p>

          {/* Row 1 — Featured (dark/transparent, no white box) */}
          <div className="mb-4 grid grid-cols-4 gap-4">
            {featuredPartners.map((p) => (
              <div
                key={p.slug}
                className="flex h-16 sm:h-20 items-center justify-center p-3 transition-transform duration-200 hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                <div className="relative h-full w-full">
                  <PartnerLogo {...p} />
                </div>
              </div>
            ))}
          </div>

          {/* Rows 2+ — Regular (white rounded pill format) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {regularPartners.map((p) => {
              const noBg = p.slug === "gen-ai-philippines";
              return (
                <div
                  key={p.slug}
                  className={`flex h-14 sm:h-16 items-center justify-center p-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${noBg ? "drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]" : "bg-white rounded-full shadow-md"
                    }`}
                >
                  <div className="relative h-full w-[80%]">
                    <PartnerLogo {...p} />
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* ══ SECTION 4: CTA Card ═══════════════════════════════════════════ */}
        <FadeIn delay={0.2} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-8">
            {/* Left: Copy + CTA */}
            <div className="flex flex-col gap-5 text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-white to-yellow-400 bg-clip-text text-transparent">
                  Ready to Partner With Us?
                </span>
              </h2>

              <p className="text-[14px] leading-[1.85] text-[#C8C8C8] md:text-base">
                Let&apos;s build something impactful together. By partnering
                with GDG PUP, you gain access to a dynamic community of
                aspiring developers, innovators, and changemakers eager to
                learn, collaborate, and create solutions that matter.
              </p>

              <div>
                <Link
                  href="#"
                  className="inline-block bg-black/80 hover:bg-black border border-white/20 rounded-lg px-8 py-3 text-white font-medium transition-colors hover:shadow-[0_0_15px_rgba(255,200,50,0.2)]"
                >
                  Join Now!
                </Link>
              </div>
            </div>

            {/* Right: Mascot */}
            <div className="flex justify-center md:justify-end">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]"
              >
                <Image
                  src="/pages/about/partnership/cirby-sticker.png"
                  alt="GDG PUP Mascot"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0";
                  }}
                />
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}