"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button, Container, Stack, Text } from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";

const MERCH_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScHpLnjgSSaQ0DboVlJhkb6lpn3EFExr6IJ14g-H8HHQKcq2Q/closedform";

export function MerchSection() {
  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4", "#ea4335", "#fbbc04", "#34a853"]}
      particleCount={300}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={80}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="relative overflow-x-hidden pt-40 pb-20 md:pt-48 md:pb-32 min-h-svh bg-[#0F0E0E]"
    >
      <Container className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="relative mx-auto w-full max-w-6xl p-1 rainbow-border rounded-[2.5rem]">
          {/* Glassmorphism Card */}
          <div className="relative rounded-[2.5rem] bg-white/4 p-8 md:p-12 lg:p-16 backdrop-blur-2xl border border-white/8 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Inner glow accent */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-30 rounded-[2.5rem]" />

            <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
              <Stack gap="lg" className="text-center lg:text-left order-2 lg:order-1 relative z-10">
                <Stack gap="md">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Text as="h1" variant="heading-2" gradient="white-blue" weight="bold" className="tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                      Official GDG PUP Merch
                    </Text>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <Text variant="body" className="text-white/90 max-w-[55ch] mx-auto lg:mx-0 text-lg leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Rep the community with premium, limited-run merch. 
                      Secure your slot now to guarantee your size. We will announce fulfillment updates 
                      via email once pre-orders close.
                    </Text>
                  </motion.div>
                </Stack>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pt-4">
                  <Button asChild variant="colored" subVariant="blue" size="lg" className="shadow-[0_0_40px_-10px_rgba(43,127,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(43,127,255,0.7)] transition-shadow">
                    <a href={MERCH_FORM_URL}>Pre-order Now</a>
                  </Button>
                </motion.div>
              </Stack>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="relative mx-auto w-full max-w-85 md:max-w-105 lg:max-w-full order-1 lg:order-2"
              >
                {/* Mascot Backlight */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
                
                <motion.div
                  animate={{ y: [-12, 12, -12] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Image
                    src={ASSETS.ABOUT.WHO.MASCOT_1}
                    alt="GDG Mascot"
                    width={800}
                    height={800}
                    priority
                    className="pointer-events-none select-none relative h-auto w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </CosmosParticles>
  );
}