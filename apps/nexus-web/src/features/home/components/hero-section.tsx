"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Button, Container, Stack, Text } from "@packages/spark-ui";
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
  scrollY: MotionValue<number>;
}

function ParallaxLayer({ src, speed, zIndex, scrollY }: ParallaxLayerProps) {
  const rawY = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);
  // Spring-smooth the transform for a less mechanical feel
  const y = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.4 });

  return (
    <motion.div
      style={{ y, zIndex }}
      className="absolute inset-0 will-change-transform"
    >
      <img
        src={src}
        alt=""
        role="presentation"
        draggable={false}
        className="h-full w-full object-fill select-none"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  HeroSection                                                       */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  // Single scroll listener shared across all parallax layers
  const { scrollY } = useScroll();
  const ctaOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const ctaY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Parallax image layers */}
      {HERO_LAYERS.map((layer) => (
        <ParallaxLayer
          key={layer.src}
          src={layer.src}
          speed={layer.speed}
          zIndex={layer.zIndex}
          scrollY={scrollY}
        />
      ))}

      {/* CTA overlay — above all layers */}
      <motion.div
        style={{ opacity: ctaOpacity, y: prefersReduced ? 0 : ctaY }}
        className="absolute inset-0 z-40 flex items-center justify-center"
      >
        <Container>
          <Stack align="center" justify="center" className="h-screen">
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
                  variant="heading-1"
                  align="center"
                  gradient="white-blue"
                  weight="bold"
                  className="text-4xl md:text-5xl lg:text-6xl leading-tight"
                >
                  Bridging the gap between theory and practice.
                </Text>
              </motion.div>

              <motion.div
                variants={prefersReduced ? undefined : ctaItemVariants}
                className="mt-4"
              >
                <Text
                  variant="body"
                  align="center"
                  weight="bold"
                  className="text-white max-w-3xl mx-auto leading-relaxed"
                >
                  GDG PUP helps student developers grow through real projects,
                  events, and mentorship connecting classroom learning to
                  industry practice.
                </Text>
              </motion.div>

              <motion.div
                variants={prefersReduced ? undefined : ctaItemVariants}
                className="mt-8 inline-block"
              >
                <Button variant="default" size="lg">
                  Spark your Journey
                </Button>
              </motion.div>
            </motion.div>
          </Stack>
        </Container>
      </motion.div>
    </section>
  );
}
