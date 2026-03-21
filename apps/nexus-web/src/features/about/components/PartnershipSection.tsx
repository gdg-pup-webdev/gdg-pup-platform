"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";

// ─── Animation Wrapper ───────────────────────────────────────────────────────
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
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Partner Data ─────────────────────────────────────────────────────────────
const featuredPartners = [
  { name: "Acadarena Education", src: ASSETS.PARTNERS.ACADARENA },
  { name: "Globe", src: ASSETS.PARTNERS.GLOBE },
  { name: "DEVCON Manila Chapter", src: ASSETS.PARTNERS.DEVCON },
  { name: "v0", src: ASSETS.PARTNERS.V0 },
];

const regularPartners = [
  { name: "Gen AI Philippines", src: ASSETS.PARTNERS.GEN_AI_PH },
  { name: "DataCamp Donates", src: ASSETS.PARTNERS.DATACAMP },
  { name: "PLDT", src: ASSETS.PARTNERS.PLDT },
  { name: "YSpaces", src: ASSETS.PARTNERS.YSPACE },
  { name: "Whitecloak", src: ASSETS.PARTNERS.WHITECLOAK },
  { name: "Pocky", src: ASSETS.PARTNERS.POCKY },
  { name: "Hey Roomie", src: ASSETS.PARTNERS.HEY_ROOMIE },
  { name: "Potico.ph", src: ASSETS.PARTNERS.POTICO },
  { name: "FlowerStore.ph", src: ASSETS.PARTNERS.FLOWERSTORE },
  { name: "Homeroom", src: ASSETS.PARTNERS.HOMEROOM },
  { name: "Mountain Dew", src: ASSETS.PARTNERS.MOUNTAIN_DEW },
];

function PartnerLogo({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={src} alt={name} fill className="object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PartnershipSection() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#06080f]">

      {/* ══════════════════════════════════════════════════════
          BACKGROUND
      ══════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">

        {/* Base: very dark navy gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_55%_at_50%_0%,#0b1525_0%,#06080f_60%,#020305_100%)]" />

        {/* Stars */}
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="sg" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="1.1" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sgl" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* tiny stars */}
            <pattern id="sA" width="220" height="220" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="22" r="0.45" fill="#fff" opacity="0.16" />
              <circle cx="95" cy="10" r="0.55" fill="#fff" opacity="0.13" />
              <circle cx="150" cy="72" r="0.45" fill="#fff" opacity="0.14" />
              <circle cx="55" cy="135" r="0.45" fill="#fff" opacity="0.11" />
              <circle cx="195" cy="48" r="0.55" fill="#fff" opacity="0.14" />
              <circle cx="115" cy="188" r="0.45" fill="#fff" opacity="0.12" />
              <circle cx="32" cy="195" r="0.40" fill="#fff" opacity="0.10" />
              <circle cx="175" cy="155" r="0.45" fill="#fff" opacity="0.13" />
              <circle cx="78" cy="85" r="0.40" fill="#fff" opacity="0.09" />
              <circle cx="140" cy="40" r="0.45" fill="#fff" opacity="0.12" />
            </pattern>
            {/* medium stars */}
            <pattern id="sB" width="400" height="400" patternUnits="userSpaceOnUse">
              <circle cx="62" cy="88" r="0.95" fill="#fff" opacity="0.48" filter="url(#sg)" />
              <circle cx="238" cy="52" r="1.15" fill="#fff" opacity="0.52" filter="url(#sg)" />
              <circle cx="355" cy="205" r="0.88" fill="#fff" opacity="0.40" />
              <circle cx="108" cy="295" r="0.95" fill="#fff" opacity="0.46" filter="url(#sg)" />
              <circle cx="295" cy="362" r="0.78" fill="#fff" opacity="0.36" />
              <circle cx="385" cy="92" r="1.05" fill="#fff" opacity="0.48" filter="url(#sg)" />
              <circle cx="175" cy="178" r="0.75" fill="#fff" opacity="0.33" />
              <circle cx="320" cy="140" r="0.88" fill="#fff" opacity="0.40" />
            </pattern>
            {/* hero stars */}
            <pattern id="sC" width="680" height="680" patternUnits="userSpaceOnUse">
              <circle cx="125" cy="165" r="1.75" fill="#fff" opacity="0.68" filter="url(#sgl)" />
              <circle cx="450" cy="108" r="1.95" fill="#fff" opacity="0.70" filter="url(#sgl)" />
              <circle cx="580" cy="432" r="1.55" fill="#fff" opacity="0.60" filter="url(#sgl)" />
              <circle cx="205" cy="545" r="1.45" fill="#fff" opacity="0.56" filter="url(#sgl)" />
              <circle cx="340" cy="310" r="1.20" fill="#fff" opacity="0.45" filter="url(#sg)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sA)" />
          <rect width="100%" height="100%" fill="url(#sB)" />
          <rect width="100%" height="100%" fill="url(#sC)" />
        </svg>

        {/* Amber glow — top center */}
        <div className="absolute -top-[6%] left-1/2 -translate-x-1/2 h-[42vw] w-[85vw] max-w-[960px]
          bg-[radial-gradient(ellipse_at_50%_0%,rgba(188,128,10,0.40)_0%,rgba(130,82,4,0.12)_44%,transparent_66%)]
          blur-[58px]"/>

        {/* Blue right edge */}
        <div className="absolute -right-[2%] top-[6%] h-[88vw] w-[22vw] max-w-[275px]
          bg-[radial-gradient(ellipse_at_100%_32%,rgba(16,72,192,0.24)_0%,rgba(6,42,145,0.06)_54%,transparent_74%)]
          blur-[46px]"/>

        {/* Blue left edge */}
        <div className="absolute -left-[2%] top-[10%] h-[78vw] w-[17vw] max-w-[210px]
          bg-[radial-gradient(ellipse_at_0%_38%,rgba(10,52,168,0.17)_0%,rgba(4,28,115,0.04)_54%,transparent_74%)]
          blur-[46px]"/>

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-[22vw]
          bg-[linear-gradient(to_top,rgba(2,3,8,0.60)_0%,transparent_100%)]"/>

        {/* Dot grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.038]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="38" height="38" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* ── GEAR — left, ~40% peeking in ── */}
        <motion.div
          className="absolute -left-[155px] top-[10%]
                     h-[300px] w-[300px] opacity-50
                     md:-left-[195px] md:h-[420px] md:w-[420px]"
          animate={{ y: [0, -12, 0], rotate: [0, -2.5, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={ASSETS.ABOUT.PARTNERSHIP.GEAR}
            alt="" fill className="object-contain"
          />
        </motion.div>

        {/* ── CHEVRON > — right, ~40% peeking in, flipped ── */}
        <motion.div
          className="absolute -right-[105px] top-[28%]
                     h-[320px] w-[320px] opacity-40
                     md:-right-[165px] md:h-[480px] md:w-[480px]"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative h-full w-full [transform:scaleX(-1)]">
            <Image
              src={ASSETS.ABOUT.PARTNERSHIP.CHEVRON}
              alt="" fill className="object-contain"
            />
          </div>
        </motion.div>

      </div>
      {/* ══ END BACKGROUND ══ */}


      {/* ══════════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center
                      px-5 pb-40 pt-44 sm:px-8 md:pt-52">

        {/* ── SECTION 1: Hero ──────────────────────────────── */}
        <FadeIn className="mb-14 w-full text-center">

          {/* Heading */}
          <h1 className="mb-5 text-[2.2rem] font-bold leading-[1.12] tracking-tight
                         sm:text-[2.75rem] md:text-[3.1rem]">
            <span className="text-white">Innovation Through</span>
            <br />
            <span className="bg-gradient-to-r from-[#F9A825] to-[#FFD54F]
                             bg-clip-text text-transparent">
              Collaboration
            </span>
          </h1>

          {/* Description card — wide flat glass rectangle */}
          <div
            className="relative mx-auto overflow-hidden rounded-[0.9rem]
                       border border-white/[0.13] bg-white/[0.04]"
            style={{
              width: "min(800px, 95vw)",
              marginLeft: "50%",
              transform: "translateX(-50%)",
              padding: "0.95rem 2.2rem 1.05rem",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
                            from-transparent via-white/[0.13] to-transparent"/>
            <p className="text-center text-[0.82rem] leading-[1.65] text-white/55
                          sm:text-[0.88rem]">
              We collaborate with forward-thinking organizations to foster innovation,
              deliver meaningful programs, and bridge the gap between technology and
              community. Together, we build platforms that inspire developers, nurture
              talent, and shape future-ready leaders.
            </p>
          </div>
        </FadeIn>

        {/* ── SECTION 2: Why We Do This ────────────────────── */}
        <FadeIn delay={0.08} className="mb-14 w-full text-center">

          {/* Yellow label */}
          <p className="mb-3 text-[0.78rem] font-black uppercase tracking-[0.38em]
                        text-[#FFD700]">
            WHY WE DO THIS
          </p>

          {/* Heading */}
          <h2 className="mb-6 text-[1.28rem] font-bold leading-snug text-white
                         sm:text-[1.42rem]">
            Creating value through trust and shared purpose
          </h2>

          {/* Glass card with blue border */}
          <div
            className="relative overflow-hidden rounded-[0.9rem]
                       border border-[rgba(87,202,255,0.22)]
                       bg-[rgba(7,11,28,0.55)] backdrop-blur-sm"
            style={{
              padding: "0.95rem 1.5rem 1.1rem",
              boxShadow: "inset 0 1px 0 rgba(87,202,255,0.11), 0 0 22px rgba(87,202,255,0.05)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
                            from-transparent via-[rgba(87,202,255,0.32)] to-transparent"/>
            <p className="relative z-10 text-center text-[0.80rem] leading-[1.70]
                          text-white/55 sm:text-[0.86rem]">
              <span className="font-semibold text-[#57CAFF]">
                Google Developer Group PUP Nexus
              </span>{" "}
              exists to cultivate a collaborative tech community where students and
              professionals grow together. Through partnerships built on{" "}
              <span className="font-semibold text-[#FFD700]">trust and shared goals</span>,
              we create meaningful opportunities for{" "}
              <span className="font-semibold text-[#5CDB6D]">
                learning, innovation, and real-world impact.
              </span>
            </p>
          </div>
        </FadeIn>

        {/* ── SECTION 3: Partners ──────────────────────────── */}
        <FadeIn delay={0.14} className="mb-14 w-full">

          {/* Label */}
          <p className="mb-8 text-center text-[0.72rem] font-bold uppercase
                        tracking-[0.20em] text-white/75 sm:text-[0.80rem]">
            POWERED BY OUR PARTNERS
          </p>

          {/* Featured row — 4 logos, transparent bg */}
          <div className="mb-8 grid grid-cols-4 gap-6">
            {featuredPartners.map((p) => (
              <div key={p.src}
                className="flex h-16 items-center justify-center p-2 sm:h-20
                           grayscale opacity-80 transition-all duration-300
                           hover:grayscale-0 hover:opacity-100 hover:-translate-y-1">
                <div className="relative h-full w-full">
                  <PartnerLogo {...p} />
                </div>
              </div>
            ))}
          </div>

          {/* Regular rows — white rectangular cards, 4 cols */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {regularPartners.map((p) => {
              const isTransparent = p.src === ASSETS.PARTNERS.GEN_AI_PH;
              return (
                <div key={p.src}
                  className={[
                    "flex h-20 sm:h-24 items-center justify-center rounded-xl",
                    "border border-white/[0.08] p-4",
                    "transition-all duration-300 hover:-translate-y-1",
                    "hover:border-white/[0.18] hover:bg-white/[0.04]",
                    isTransparent
                      ? "bg-black/40 backdrop-blur-sm"
                      : "bg-white shadow-md shadow-black/20",
                  ].join(" ")}
                >
                  <div className="relative h-full w-full">
                    <PartnerLogo {...p} />
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* ── SECTION 4: CTA ───────────────────────────────── */}
        <FadeIn delay={0.18} className="w-full">
          <div className="grid grid-cols-1 items-center gap-6
                          md:grid-cols-[1fr_auto]">

            {/* Left */}
            <div className="flex flex-col gap-3.5">
              <h2 className="text-[1.42rem] font-bold leading-tight sm:text-[1.6rem]
                             bg-gradient-to-r from-[#F9A825] to-[#FFD54F] bg-clip-text text-transparent">
                Ready to Partner With Us?
              </h2>
              <p className="text-[0.80rem] leading-relaxed text-white/52
                            sm:text-[0.86rem]">
                Let&apos;s build something impactful together. By partnering with
                GDG PUP, you gain access to a dynamic community of aspiring
                developers, innovators, and changemakers eager to learn,
                collaborate, and create solutions that matter.
              </p>
              <div>
                <Link
                  href="#"
                  className="inline-block rounded-lg border border-white/22
                             bg-black/85 px-6 py-2.5 text-[0.80rem] font-semibold
                             text-white transition-colors
                             hover:bg-black hover:shadow-[0_0_12px_rgba(255,200,50,0.16)]"
                >
                  Join Now!
                </Link>
              </div>
            </div>

            {/* Right: mascot */}
            <div className="flex justify-center md:justify-end">
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, 1.5, -1.5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56
                           drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]"
              >
                <Image
                  src={ASSETS.PARTNERS.CIRBY_STICKER}
                  alt="GDG PUP Mascot" fill className="object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                />
              </motion.div>
            </div>

          </div>
        </FadeIn>

      </div>
    </div>
  );
}
