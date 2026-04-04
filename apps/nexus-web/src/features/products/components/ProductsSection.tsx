"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
import { ResourceLibraryGrid } from "./products-section/ResourceLibraryGrid";
import { GdgProductsGrid } from "./products-section/GdgProductsGrid";

export function ProductsSection() {
  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-40 lg:pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Background layers */}
      <img
        src="/products/SPACE_BG_3_3.png"
        alt=""
        className="absolute top-250 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/SPACE_BG_3_2.png"
        alt=""
        className="absolute top-135 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
      />
      <img
        src="/products/SPACE_BG_3_1.png"
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute w-[1000px] h-[1000px] origin-top-left rotate-[7.71deg] opacity-10 mix-blend-hard-light bg-white/80 rounded-full blur-[200px] -translate-x-1/3" />
      <div className="absolute w-[792px] h-[640px] opacity-60 bg-blue-500/20 rounded-full blur-[289.55px] translate-y-9/10" />
      <img
        src="/products/gold-1.jpg"
        alt=""
        className="absolute -top-40 -left-40 w-[1200px] h-[1600px] rotate-[-162deg] mix-blend-screen blur-[150px] pointer-events-none z-0 -translate-x-3/5 -translate-y-1/10 opacity-30"
      />
      <img
        className="w-155 h-auto absolute top-90 -left-125 opacity-25 translate-x-1/3"
        src="/products/cogwheel-asset.png"
        alt=""
      />
      <img
        className="w-140 h-auto absolute bottom-235 -right-25 opacity-25 translate-x-1/3 rotate-[-18.99deg] z-10"
        src="/products/star-bubble.webp"
        alt=""
      />
      <img
        className="w-auto absolute bottom-0 right-0"
        src="/products/gold-2.webp"
        alt=""
      />
      <img
        className="w-140 h-auto absolute bottom-10 -left-105 translate-x-1/3 rotate-[158.50deg] opacity-40"
        src="/products/cross-bubble.webp"
        alt=""
      />

      <Container className="max-w-[1700px]">
        <Stack gap="2xl" className="relative z-10">
          <Text variant="heading-1" gradient="white-blue" align="center" weight="bold">
            PRODUCTS
          </Text>

          <ResourceLibraryGrid />
          <GdgProductsGrid />
        </Stack>
      </Container>
    </div>
  );
}
