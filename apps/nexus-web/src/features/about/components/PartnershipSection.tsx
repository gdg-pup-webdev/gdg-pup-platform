/* For improvements:
 *
 * Revamp the whole page because this is just the initial design.
 * Revamp the buttons here according to figma design
 * Add decorative elements based on figma
 * Proper image sizing and optimization
 * Add animations and interactions based on figma
 * Add real links to the CTA buttons
 */
"use client";

import {
  Box,
  Stack,
  Grid,
  Container,
  Text,
  Card,
  Button,
} from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";

// Animation wrapper — same pattern as AboutSection
const FadeInSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
export function PartnershipSection() {
  return (
    <div className="bg-[#010B1D] relative w-full overflow-hidden pt-60 pb-48 font-['Google_Sans',sans-serif]">
      {/* Stars Background */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-40 h-[100%] w-full z-0">
        <div
          className="absolute inset-0 w-full h-full opacity-60"
          style={{
            backgroundImage: `url(${ASSETS.LEADERBOARD.STARS_BG})`,
            backgroundRepeat: "repeat",
            backgroundSize: "cover"
          }}
        />
      </div>

      {/* Figma Perfect Background Elements Wrapper */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[1440px] h-full pointer-events-none z-0 overflow-visible">
        {/* Figma Background Overlay — Aurora lines, ellipses, and blue/purple glows */}
        {/* Using exact coordinates from Figma so it isn't distorted/stretched by viewport */}
        <div className="absolute w-[2330px] h-[2174px] left-[-541px] top-[-508px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.PARTNERS.BG_AURORA_OVERLAY}
            alt=""
            className="absolute max-w-none block"
            style={{
              top: "-23%",
              left: "-21.46%",
              width: "143%",
              height: "146%"
            }}
          />
        </div>

        {/* Floating 3D Elements from Figma — exact assets and positions */}
        {/* Asset1.2 — right side, rotated -13.18deg, opacity 20% (node 81:2258) */}
        <div className="absolute flex items-center justify-center" style={{ left: 1221, top: 399, width: 395, height: 395 }}>
          <div className="flex-none" style={{ transform: "rotate(-13.18deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ASSETS.PARTNERS.DECOR_ASSET_1} alt="" width={329} height={329} className="opacity-20 object-contain" />
          </div>
        </div>

        {/* Asset1.3 — far left, opacity 20% (node 81:2259) */}
        <div className="absolute" style={{ left: -327, top: 160, width: 543, height: 543 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.PARTNERS.DECOR_ASSET_2} alt="" className="w-full h-full opacity-20 object-contain" />
        </div>

      </div>

      {/* Bottom-left decorative elements — positioned to peek from left edge */}
      {/* Element SVG — flipped+rotated (node 81:2261) */}
      <div className="absolute flex items-center justify-center pointer-events-none z-[1]" style={{ left: -80, bottom: 380, width: 250.4, height: 250.4 }}>
        <div style={{ transform: "scaleY(-1) rotate(-168.31deg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.PARTNERS.DECOR_ELEMENT_3} alt="" width={212} height={212} style={{ opacity: 0.3 }} />
        </div>
      </div>

      {/* Small Element SVG (node 81:2263) */}
      <div className="absolute flex items-center justify-center pointer-events-none z-[1]" style={{ left: 0, bottom: 160, width: 95.4, height: 95.4 }}>
        <div style={{ transform: "scaleY(-1) rotate(-168.31deg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.PARTNERS.DECOR_ELEMENT_4} alt="" width={81} height={81} style={{ opacity: 0.3 }} />
        </div>
      </div>

      <Container maxWidth="7xl" padding="lg" className="relative z-10">
        <Stack gap="2xl" className="items-center">
          {/* Section 1 — Hero */}
          <FadeInSection className="mb-32 flex flex-col items-center w-full">
            <Stack align="center" style={{ gap: "24px" }} className="w-full">
              <Text variant="heading-2" gradient="white-yellow" align="center">Innovation Through Collaboration</Text>

              <div className="bg-[rgba(255,255,255,0.05)] border border-solid border-white rounded-[28px] p-[20px] max-w-[1200px] w-full flex items-center justify-center">
                <Text
                  variant="body"
                  align="center"
                  className="text-white text-[20px] sm:text-[18px] md:text-[24px] leading-[1.5]"
                >
                  We collaborate with forward-thinking organizations to foster
                  innovation, deliver meaningful programs, and bridge the gap
                  between technology and community. Together, we build platforms
                  that inspire developers, nurture talent, and shape future-ready
                  leaders.
                </Text>
              </div>
            </Stack>
          </FadeInSection>

          {/* Section 2 — Why We Do This */}
          <FadeInSection delay={0.1} className="mb-32 flex flex-col items-center w-full">
            <Stack align="center" style={{ gap: "28px" }} className="w-full max-w-[1000px]">
              <div className="flex flex-col items-center text-center w-full" style={{ gap: "18px" }}>
                <h2 className="font-['Roboto',sans-serif] font-bold text-[48px] leading-[1.2] bg-clip-text text-transparent bg-gradient-to-r from-[#FFF5C3] via-[#FCE48D] to-[#F2B64A] tracking-normal">
                  WHY WE DO THIS
                </h2>

                <h3 className="font-bold text-[36px] text-white">
                  Creating value through trust and shared purpose
                </h3>
              </div>

              <div className="border border-white border-solid p-[20px] rounded-[28px] w-full flex items-center justify-center">
                <p className="text-center text-[20px] leading-[1.5] text-white">
                  <span className="bg-clip-text bg-gradient-to-t from-[#51a2ff] text-transparent to-[#155dfc] font-semibold">
                    Google Developer Group PUP Nexus
                  </span>{" "}
                  exists to cultivate a collaborative tech community where
                  students and professionals grow together. Through
                  partnerships built on{" "}
                  <span className="bg-clip-text bg-gradient-to-r from-[#FFF5C3] via-[#FCE48D] to-[#F2B64A] text-transparent font-semibold">
                    trust and shared goals
                  </span>
                  , we create meaningful opportunities for{" "}
                  <span className="bg-clip-text bg-gradient-to-t from-[#5cdb6d] text-transparent to-[#31753a] font-semibold">
                    learning, innovation, and real-world impact.
                  </span>
                </p>
              </div>
            </Stack>
          </FadeInSection>

          {/* Section 3 — Partners Grid (Figma-exact CSS Grid with explicit col/row placement) */}
          <FadeInSection delay={0.15} className="mb-32 flex flex-col items-center w-full relative">
            <Stack align="center" style={{ gap: "64px" }} className="w-full">
              <h2 className="font-['Roboto',sans-serif] font-bold text-[32px] leading-[1.3] bg-clip-text text-transparent bg-gradient-to-r from-[#FFF5C3] via-[#FCE48D] to-[#F2B64A] text-center w-full tracking-normal">
                POWERED BY OUR PARTNERS
              </h2>

              {/* eslint-disable @next/next/no-img-element */}
              <div
                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                {/* ROW 1 — No white backgrounds */}
                <div className="flex items-center justify-center relative h-[60px] sm:h-[80px]">
                  <img src={ASSETS.PARTNERS.ACADARENA} alt="AcadArena" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-center relative h-[60px] sm:h-[80px] overflow-hidden">
                  <img src={ASSETS.PARTNERS.GLOBE} alt="Globe" className="max-h-[110%] object-contain" />
                </div>
                <div className="flex items-center justify-center relative h-[60px] sm:h-[80px] overflow-hidden">
                  <img src={ASSETS.PARTNERS.DEVCON} alt="Devcon" className="max-h-[160%] object-contain" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                </div>
                <div className="flex items-center justify-center relative h-[60px] sm:h-[100px]">
                  <img src={ASSETS.PARTNERS.V0} alt="v0" className="max-h-full max-w-full object-contain" />
                </div>

                {/* ROW 2 */}
                <div className="flex items-center justify-center relative h-[60px] sm:h-[80px] overflow-hidden">
                  <img src={ASSETS.PARTNERS.GEN_AI_PH} alt="Gen AI PH" className="max-h-[160%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.DATACAMP} alt="DataCamp" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2 overflow-hidden">
                  <img src={ASSETS.PARTNERS.PLDT} alt="PLDT" className="max-h-[140%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-3">
                  <img src={ASSETS.PARTNERS.YSPACE} alt="YSpace" className="max-h-full max-w-full object-contain" />
                </div>

                {/* ROW 3 — All white bg */}
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.WHITECLOAK} alt="Whitecloak" className="max-h-full max-w-[90%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.POCKY} alt="Pocky" className="max-h-full max-w-[70%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.HEY_ROOMIE} alt="Hey Roomie" className="max-h-full max-w-[80%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[50px] sm:h-[70px] p-2">
                  <img src={ASSETS.PARTNERS.POTICO} alt="Potico" className="max-h-full max-w-[85%] object-contain" />
                </div>

                {/* ROW 4 — 3 items */}
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[50px] sm:h-[70px] p-2">
                  <img src={ASSETS.PARTNERS.FLOWERSTORE} alt="FlowerStore.ph" className="max-h-full max-w-[85%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.HOMEROOM} alt="Homeroom" className="max-h-full max-w-[50%] object-contain" />
                </div>
                <div className="bg-white rounded-[8px] flex items-center justify-center h-[60px] sm:h-[80px] p-2">
                  <img src={ASSETS.PARTNERS.MOUNTAIN_DEW} alt="Mountain Dew" className="max-h-full max-w-[50%] object-contain" />
                </div>
              </div>
            </Stack>
          </FadeInSection>

          {/* Section 4 — CTA Card */}
          <FadeInSection delay={0.2} className="w-full">
            <div className="flex flex-col-reverse xl:flex-row items-center xl:items-center xl:justify-between p-6 sm:p-[50px] relative w-full rounded-[28px]" style={{ gap: "20px" }}>
              {/* Content */}
              <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0 z-10 w-full xl:w-auto" style={{ gap: "23px", maxWidth: "648px" }}>
                <h2 className="font-['Roboto',sans-serif] font-bold text-[36px] sm:text-[48px] leading-[1.2] bg-clip-text text-transparent bg-gradient-to-r from-[#FFF5C3] via-[#FCE48D] to-[#F2B64A] tracking-normal">
                  Ready to Partner With Us?
                </h2>

                <p className="text-[16px] sm:text-[20px] leading-[1.5] text-white">
                  Let&apos;s build something impactful together. By partnering
                  with GDG PUP, you gain access to a dynamic community of
                  aspiring developers, innovators, and changemakers eager to
                  learn, collaborate, and create solutions that matter.
                </p>

                <div className="pt-2">
                  <Link href="#" className="inline-block hover:scale-105 transition-transform" style={{ textDecoration: "none" }}>
                    {/* Gradient border wrapper */}
                    <div className="p-[1px] rounded-[10px] bg-[linear-gradient(90deg,#EA4335_0%,#FBBC04_33%,#34A853_66%,#4285F4_100%)] cursor-pointer" style={{ boxShadow: "0px 4px 46.1px 0px rgba(0,0,0,0.25), 0px 4px 4px 0px rgba(0,0,0,0.25)" }}>
                      {/* Inner background and shadows */}
                      <div className="bg-gradient-to-b from-[#4A4A4A] to-[#2B2B2B] rounded-[9px] py-[12px] px-[36px] flex items-center justify-center relative overflow-hidden h-full w-full" style={{ boxShadow: "inset 0px 2px 0px 0px rgba(255,255,255,0.3)" }}>
                        <span className="font-bold text-[24px] text-white leading-[1.5] tracking-wide text-center whitespace-nowrap" style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}>
                          Join Now!
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Cirby Mascot */}
              <div className="relative shrink-0 flex items-center justify-center w-[250px] sm:w-[300px] xl:w-[411px] h-[250px] sm:h-[300px] xl:h-[411px] z-10">
                <Image
                  src={ASSETS.PARTNERS.CIRBY_STICKER}
                  alt="Cirby Mascot"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          </FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}
