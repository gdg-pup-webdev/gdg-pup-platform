"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Button, Container, Stack, Text } from "@packages/spark-ui";
import Link from "next/link";
import { ASSETS } from "@/lib/constants/assets";

/* ------------------------------------------------------------------ */
/*  Layer config — front (high z) to back (low z)                     */
/* ------------------------------------------------------------------ */

const HERO_LAYERS = [
  { src: ASSETS.HOME.HERO.LAYER_SPARKY, speed: 0.7, zIndex: 10 },
  { src: ASSETS.HOME.HERO.LAYER_CLOUDS, speed: 0.05, zIndex: 9 },
  { src: ASSETS.HOME.HERO.LAYER_B1, speed: 0.5, zIndex: 8 },
  { src: ASSETS.HOME.HERO.LAYER_B2, speed: 0.5, zIndex: 7 },
  { src: ASSETS.HOME.HERO.LAYER_DE, speed: 0.4, zIndex: 6 },
  { src: ASSETS.HOME.HERO.LAYER_F1, speed: 0.04, zIndex: 5 },
  { src: ASSETS.HOME.HERO.LAYER_F2, speed: 0.05, zIndex: 4 },
  { src: ASSETS.HOME.HERO.LAYER_F3, speed: 0.06, zIndex: 3 },
  { src: ASSETS.HOME.HERO.LAYER_F4, speed: 0.07, zIndex: 2 },
  { src: ASSETS.HOME.HERO.LAYER_F5, speed: 0.08, zIndex: 1 },
  { src: ASSETS.HOME.HERO.LAYER_BG, speed: 0.1, zIndex: 0 },
] as const;

const MOBILE_DISABLED_LAYERS = new Set<string>([
  ASSETS.HOME.HERO.LAYER_B1,
  ASSETS.HOME.HERO.LAYER_B2,
  ASSETS.HOME.HERO.LAYER_F1,
  ASSETS.HOME.HERO.LAYER_F4,
  ASSETS.HOME.HERO.LAYER_F5,
]);

/* ------------------------------------------------------------------ */
/*  CTA entrance animation variants                                   */
/* ------------------------------------------------------------------ */

const ctaContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const ctaItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  ParallaxLayer — receives a shared scrollY to avoid 11 listeners   */
/* ------------------------------------------------------------------ */

interface ParallaxLayerProps {
  src: string;
  speed: number;
  zIndex: number;
  scrollYProgress: MotionValue<number>;
  distance: number;
  isMobileViewport: boolean;
  disableParallax: boolean;
}

const ParallaxLayer = memo(function ParallaxLayer({
  src,
  speed,
  zIndex,
  scrollYProgress,
  distance,
  isMobileViewport,
  disableParallax,
}: ParallaxLayerProps) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -distance * speed],
  );

  return (
    <motion.div
      style={{ y: disableParallax ? 0 : y, zIndex }}
      className={`absolute inset-0 ${disableParallax ? "" : "will-change-transform"}`}
    >
      <img
        src={src}
        alt=""
        role="presentation"
        draggable={false}
        className={`h-full w-full select-none ${
          isMobileViewport ? "object-cover object-center" : "object-fill"
        }`}
      />
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/*  HeroSection                                                       */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Scope hero motion to this section so transforms remain predictable.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const ctaY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobileViewport ? 0 : -48],
  );
  const desktopCtaOpacity = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [1, 0.9, 0.75],
  );

  const ctaOpacity = isMobileViewport ? 1 : desktopCtaOpacity;

  const parallaxDistance = isMobileViewport ? 120 : 300;
  const headingVariant = isMobileViewport ? "heading-4" : "heading-2";
  const bodyVariant = isMobileViewport ? "body-sm" : "body";
  const ctaButtonSize = isMobileViewport ? "md" : "lg";
  const disableParallax = Boolean(prefersReduced);
  const activeLayers = useMemo(() => {
    if (!isMobileViewport) {
      return HERO_LAYERS;
    }

    return HERO_LAYERS.filter((layer) => !MOBILE_DISABLED_LAYERS.has(layer.src));
  }, [isMobileViewport]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden"
    >
      {/* Parallax image layers */}
      {activeLayers.map((layer) => (
        <ParallaxLayer
          key={layer.src}
          src={layer.src}
          speed={layer.speed}
          zIndex={layer.zIndex}
          scrollYProgress={scrollYProgress}
          distance={parallaxDistance}
          isMobileViewport={isMobileViewport}
          disableParallax={disableParallax}
        />
      ))}

      {/* CTA overlay — above all layers */}
      <motion.div
        style={{ opacity: ctaOpacity, y: prefersReduced ? 0 : ctaY }}
        className="absolute inset-0 z-40 flex items-center justify-center"
      >
        <Container>
          <Stack
            align="center"
            justify="center"
            className="h-[100svh] min-h-[560px]"
          >
            <motion.div
              variants={prefersReduced ? undefined : ctaContainerVariants}
              initial="hidden"
              animate="visible"
              className="text-center px-6 max-w-4xl"
            >
              <motion.div
                variants={prefersReduced ? undefined : ctaItemVariants}
              >
                <Text
                  as="h1"
                  variant={headingVariant}
                  align="center"
                  gradient="white-blue"
                  weight="bold"
                  className="leading-tight"
                >
                  Bridging the gap between theory and practice.
                </Text>
              </motion.div>

              <motion.div
                variants={prefersReduced ? undefined : ctaItemVariants}
                className="mt-4"
              >
                <Text
                  variant={bodyVariant}
                  align="center"
                  weight="bold"
                  className="text-white max-w-[54ch] mx-auto leading-relaxed"
                >
                  GDG PUP helps student developers grow through real projects,
                  events, and mentorship connecting classroom learning to
                  industry practice.
                </Text>
              </motion.div>

              <motion.div
                variants={prefersReduced ? undefined : ctaItemVariants}
                className="mt-6 md:mt-8 inline-block"
              >
                <Button asChild variant="default" size={ctaButtonSize}>
                  <Link prefetch={false} href="/signin">Spark your Journey</Link>
                </Button>
              </motion.div>
            </motion.div>
          </Stack>
        </Container>
      </motion.div>
    </section>
  );
}
