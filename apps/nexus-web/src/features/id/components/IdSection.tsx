"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container, Stack, Text, Card, CardContent, Spotlight } from "@packages/spark-ui";
import { GdgIdCard } from "@packages/spark-ui";
import { IdBlobs } from "./IdBlobs";

export function IdSection() {
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-32 pb-48 px-4 md:px-8 lg:px-16">

      {/* 4-color drifting blobs and spotlights */}
      <IdBlobs />

      <Container>
        <Stack gap="2xl" className="relative z-10">

          {/* ── HERO HEADER ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <Text variant="heading-1" gradient="white-blue" align="center" weight="bold">
              GDG ID PLATFORM
            </Text>
            <Text variant="body" align="center" color="secondary" className="mt-3 mx-auto">
              Built for the future of GDG PUP, the GDG ID Platform brings
              members together through a seamless, connected, and empowered
              digital experience.
            </Text>
          </motion.div>

          {/* ── HERO STAGE — spirals + decorative split + card ─ */}
          <div
            className="relative flex items-center justify-center transition-all duration-300"
            style={{
              minHeight: "clamp(400px, 65vh, 620px)",
              // USER: Edit these variables to move spirals individually
              "--outer-y": "420px",
              "--center-y": "400px",
              "--inner-y": "385px",
              // USER: Edit these to move beams left/right
              "--beam-1-x": "-15%",
              "--beam-2-x": "5%",
              "--beam-3-x": "25%",
              "--beam-4-x": "45%"
            } as any}
          >
            {/* --- Refined Vertical Spotlight Beams --- */}
            <div className="absolute inset-0 z-[40] flex items-center justify-center opacity-100 pointer-events-none overflow-hidden">
              <Spotlight id="red" className="-top-[10%] w-[50vw]" style={{ left: "var(--beam-1-x)" } as any} fill="url(#hero-red)" />
              <Spotlight id="green" className="-top-[10%] w-[50vw]" style={{ left: "var(--beam-2-x)" } as any} fill="url(#hero-green)" />
              <Spotlight id="blue" className="-top-[10%] w-[50vw]" style={{ left: "var(--beam-3-x)" } as any} fill="url(#hero-blue)" />
              <Spotlight id="yellow" className="-top-[10%] w-[50vw]" style={{ left: "var(--beam-4-x)" } as any} fill="url(#hero-yellow)" />

              <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
                <defs>
                  <linearGradient id="hero-red" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(234, 67, 53, 0)" />
                    <stop offset="100%" stopColor="#EA4335" />
                  </linearGradient>
                  <linearGradient id="hero-green" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(52, 168, 83, 0)" />
                    <stop offset="100%" stopColor="#34A853" />
                  </linearGradient>
                  <linearGradient id="hero-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(66, 133, 244, 0)" />
                    <stop offset="100%" stopColor="#4285F4" />
                  </linearGradient>
                  <linearGradient id="hero-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(249, 171, 0, 0)" />
                    <stop offset="100%" stopColor="#F9AB00" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* spiral-outer (1204 / 188.74) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ zIndex: 10, y: "var(--outer-y)" }}
              initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
              animate={{ opacity: 0.7, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.7 }}
            >
              <div
                className="relative"
                style={{ width: "clamp(300px, 83.6vw, 1204px)", aspectRatio: "1204 / 188" }}
              >
                <Image src="/pages/id/spiral-outer.png" alt="" aria-hidden fill className="object-contain" />
              </div>
            </motion.div>

            {/* spiral-center (1018.83 / 125.33) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ zIndex: 20, y: "var(--center-y)" }}
              initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
              animate={{ opacity: 0.85, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.35 }}
            >
              <div
                className="relative"
                style={{ width: "clamp(250px, 70.7vw, 1018px)", aspectRatio: "1018 / 125" }}
              >
                <Image src="/pages/id/spiral-center.png" alt="" aria-hidden fill className="object-contain" />
              </div>
            </motion.div>

            {/* spiral-inner (697.51 / 65.88) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ zIndex: 30, y: "var(--inner-y)" }}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.0 }}
            >
              <div
                className="relative"
                style={{ width: "clamp(180px, 48.4vw, 697px)", aspectRatio: "697 / 66" }}
              >
                <Image src="/pages/id/spiral-inner.png" alt="" aria-hidden fill className="object-contain" />
              </div>
            </motion.div>

            {/* Decorative left */}
            <motion.div
              className="absolute pointer-events-none select-none hidden md:block"
              style={{ left: "clamp(0px, 4vw, 60px)", top: "50%", y: "-50%", zIndex: 40 }}
              initial={{ opacity: 0, x: "50%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
            >
              <motion.div
                animate={{ y: [0, -25, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <Image
                  src="/pages/id/decorative-element-left.png"
                  alt=""
                  aria-hidden
                  width={250}
                  height={430}
                  style={{ width: "clamp(120px, 18vw, 250px)", height: "auto" }}
                />
              </motion.div>
            </motion.div>

            {/* Decorative right */}
            <motion.div
              className="absolute pointer-events-none select-none hidden md:block"
              style={{ right: "clamp(0px, 4vw, 60px)", top: "50%", y: "-50%", zIndex: 40 }}
              initial={{ opacity: 0, x: "-50%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
            >
              <motion.div
                animate={{ y: [0, -30, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <Image
                  src="/pages/id/decorative-element-right.png"
                  alt=""
                  aria-hidden
                  width={250}
                  height={430}
                  style={{ width: "clamp(120px, 18vw, 250px)", height: "auto" }}
                />
              </motion.div>
            </motion.div>

            {/* GdgIdCard */}
            <motion.div
              className="relative"
              style={{ zIndex: 50 }}
              initial={{ opacity: 0, scale: 0.82, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1], delay: 1.3 }}
            >
              <GdgIdCard
                name="Arky"
                gdgId="GDG-PUP-26-001"
                fullName="Sparky Batumbakal"
                email="sparky.batumbakal@gmail.com"
                course="BS in Information Technology"
              />
            </motion.div>
          </div>

          {/* ── HOW IT WORKS SECTION ────────────────────────── */}
          <div className="mt-32 pt-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-shrink-0 w-64 md:w-80 relative z-10">
                <Image
                  src="/pages/id/cirby2.png"
                  alt="Cirby mascot"
                  width={320}
                  height={320}
                  className="object-contain w-full h-auto drop-shadow-2xl"
                />
              </div>

              <div className="flex-1 relative z-10 w-full">
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <CardContent className="p-8 md:p-10 relative z-10">
                    <Stack gap="lg">
                      <Text variant="heading-2" weight="bold">
                        How the GDG ID Platform Works
                      </Text>

                      <Text variant="body" color="secondary" className=" text-lg">
                        Your GDG ID is your passport to everything GDG PUP. It connects your profile, your event history, and your community contributions all in one elegant card.
                      </Text>

                      <div className="space-y-6 pt-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                          <div className="mt-1 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-blue-500/10">1</div>
                          <Text variant="body" color="primary" className="leading-relaxed">Sign in using your student credentials to automatically generate your personalized profile.</Text>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                          <div className="mt-1 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-green-500/10">2</div>
                          <Text variant="body" color="primary" className="leading-relaxed">Attend events, join teams, and unlock achievements that automatically reflect on your digital ID.</Text>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                          <div className="mt-1 w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center flex-shrink-0 font-bold shadow-lg shadow-yellow-500/10">3</div>
                          <Text variant="body" color="primary" className="leading-relaxed">Showcase your digital ID card everywhere using the secure sharing link.</Text>
                        </div>
                      </div>
                    </Stack>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        </Stack>
      </Container>
    </div>
  );
}
