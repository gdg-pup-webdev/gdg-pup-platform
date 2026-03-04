"use client";

import {
  Box,
  Stack,
  Grid,
  Container,
  Text,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@packages/spark-ui";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

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

{/* Card Colors */}
const CARD_COLORS: Record<string, string> = {
  blue:   "#4285F4",
  green:  "#34A853",
  yellow: "#FBBC05",
  red:    "#EA4335",
};

const benefits = [
  {
    title: "Google Access",
    body: "Access to Google-backed learning resources, tools, and technologies.",
    image: "/pages/about/benefits/GoogleAccess.png",
    color: "blue",
  },
  {
    title: "Hands-On",
    body: "Hands-on workshops, Study Jams, Departmental skill-shares and real-world projects.",
    image: "/pages/about/benefits/Hands-On.png",
    color: "green",
  },
  {
    title: "Mentorship",
    body: "Opportunities to connect with industry professionals and mentors through our partnered initiatives.",
    image: "/pages/about/benefits/Mentorship.png",
    color: "yellow",
  },
  {
    title: "Growth Network",
    body: "A global GDG network you can grow with—even after graduation.",
    image: "/pages/about/benefits/GrowthNetwork.png",
    color: "red",
  },
  {
    title: "Leadership",
    body: "Leadership, collaboration, and career-building experiences.",
    image: "/pages/about/benefits/Leadership.png",
    color: "yellow",
  },
  {
    title: "Community",
    body: "Vibrant community where meaningful connections, valuable networks, and unforgettable experiences happen naturally. We grow, laugh, and build together.",
    image: "/pages/about/benefits/Community.png",
    color: "blue",
  },
];

const BenefitCard = ({ benefit }: { benefit: typeof benefits[0] }) => {
  const [hovered, setHovered] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const c = CARD_COLORS[benefit.color];
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);

  const T = 6;
  const CORNER = 48;
  const R = 20;
  const SEG = 80;
  const SPEED = 3;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setDims({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!hovered) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      offsetRef.current -= SPEED;
      setOffset(offsetRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  {/* Constants for snake animation pattern*/}
  const { w, h } = dims;
  const perimeter = w > 0 ? 2 * (w + h) - 8 * R + 2 * Math.PI * R : 0;
  const snakes = [0, 0.25, 0.5, 0.75].map(frac => frac * perimeter);
  const path = w > 0
    ? `M ${R},0 H ${w - R} A ${R},${R} 0 0 1 ${w},${R} V ${h - R} A ${R},${R} 0 0 1 ${w - R},${h} H ${R} A ${R},${R} 0 0 1 0,${h - R} V ${R} A ${R},${R} 0 0 1 ${R},0 Z`
    : "";

  return (
    <motion.div
      ref={cardRef}
      className="relative h-full"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Static corner brackets — visible when not hovered */}
      {!hovered && <>
        <div className="absolute pointer-events-none z-10" style={{ top: -2, left: -2, width: CORNER, height: CORNER, borderTop: `${T}px solid ${c}`, borderLeft: `${T}px solid ${c}`, borderRadius: "20px 0 0 0" }} />
        <div className="absolute pointer-events-none z-10" style={{ top: -2, right: -2, width: CORNER, height: CORNER, borderTop: `${T}px solid ${c}`, borderRight: `${T}px solid ${c}`, borderRadius: "0 20px 0 0" }} />
        <div className="absolute pointer-events-none z-10" style={{ bottom: -2, left: -2, width: CORNER, height: CORNER, borderBottom: `${T}px solid ${c}`, borderLeft: `${T}px solid ${c}`, borderRadius: "0 0 0 20px" }} />
        <div className="absolute pointer-events-none z-10" style={{ bottom: -2, right: -2, width: CORNER, height: CORNER, borderBottom: `${T}px solid ${c}`, borderRight: `${T}px solid ${c}`, borderRadius: "0 0 20px 0" }} />
      </>}

      {/* SVG snake — follows rounded path exactly */}
      {hovered && w > 0 && (
        <svg
          className="absolute pointer-events-none z-10"
          style={{ top: 0, left: 0, overflow: "visible" }}
          width={w}
          height={h}
        >
          {snakes.map((startOffset, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={c}
              strokeWidth={T}
              strokeLinecap="round"
              strokeDasharray={`${SEG} ${perimeter - SEG}`}
              strokeDashoffset={-(startOffset + offset)}
            />
          ))}
        </svg>
      )}

      <Card
        style={{
          border: `1px solid ${c}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.25s ease",
          boxShadow: hovered ? `0 0 24px 2px ${c}44` : "none",
        }}
      >
        <CardHeader>
          <Text variant="heading-6" weight="semibold" align="left" className="text-white">
            {benefit.title}
          </Text>
        </CardHeader>
        <CardContent>
          <Text variant="body-sm" align="left" className="text-gray-300">
            {benefit.body}
          </Text>
        </CardContent>
        <div
          className="relative w-full rounded-[12px] overflow-hidden mt-4"
          style={{ height: "clamp(130px, 20vw, 170px)", flexShrink: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image src={benefit.image} alt={benefit.title} fill className="object-cover" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export function BenefitsSection() {
  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">

      {/* Responsive ellipse styles */}
      <style>{`
        .ellipse-blue {
          width: 700px;
          height: 800px;
          top: -40px;
          left: -200px;
        }
        .ellipse-yellow {
          width: 700px;
          height: 800px;
          top: 250px;
          right: -250px;
        }
        .ellipse-red {
          width: 700px;
          height: 800px;
          bottom: 100px;
          left: -200px;
        }
        .ellipse-green {
          width: 600px;
          height: 700px;
          bottom: -80px;
          right: -250px;
        }
        @media (max-width: 767px) {
          .ellipse-blue {
            width: 400px;
            height: 400px;
            left: -150px;
          }
          .ellipse-yellow {
            width: 350px;
            height: 400px;
            top: 250px;
            right: -150px;
          }
          .ellipse-red {
            width: 350px;
            height: 400px;
            bottom: 150px;
            left: -150px;
          }
          .ellipse-green {
            width: 350px;
            height: 350px;
            bottom: -50px;
            right: -150px;
          }
        }
      `}</style>

      {/* Decorative Ellipse - Top Left - Blue */}
      <div
        className="ellipse-blue absolute rounded-full pointer-events-none"
        style={{
          background: "#4285F433",
          filter: "blur(clamp(55px, 9vw, 90px))",
          WebkitFilter: "blur(clamp(55px, 9vw, 90px))",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Top Center - Light Blue */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "clamp(350px, 50vw, 800px)",
          height: "clamp(120px, 20vw, 220px)",
          top: "clamp(-110px, -8vw, -80px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, #7EC8F8CC 0%, #4AABF088 45%, transparent 40%)",
          filter: "blur(clamp(40px, 9vw, 70px))",
          WebkitFilter: "blur(clamp(40px, 7vw, 70px))",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Top Right - Yellow */}
      <div
        className="ellipse-yellow absolute rounded-full pointer-events-none"
        style={{
          background: "#FBBC0533",
          filter: "blur(clamp(50px, 8vw, 80px))",
          WebkitFilter: "blur(clamp(50px, 8vw, 80px))",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Bottom Left - Red */}
      <div
        className="ellipse-red absolute rounded-full pointer-events-none"
        style={{
          background: "#EA433533",
          filter: "blur(clamp(50px, 8vw, 80px))",
          WebkitFilter: "blur(clamp(50px, 8vw, 80px))",
          zIndex: 0,
        }}
      />

      {/* Decorative Ellipse - Bottom Right - Green */}
      <div
        className="ellipse-green absolute rounded-full pointer-events-none"
        style={{
          background: "#34A85333",
          filter: "blur(clamp(50px, 8vw, 80px))",
          WebkitFilter: "blur(clamp(50px, 8vw, 80px))",
          zIndex: 0,
        }}
      />

      {/* Decorative Asset - Top Left (Asset1.4) */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        style={{
          left: 0,
          top: 0,
          width: "clamp(150px, 32vw, 280px)",
          height: "clamp(150px, 32vw, 280px)",
          zIndex: 1,
        }}
      >
        <Image
          src="/pages/about/benefits/Asset1.4 1.svg"
          alt="Decorative top-left asset"
          width={280}
          height={280}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>

      {/* Decorative Asset - Bottom Right (Asset1.3) */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.92 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        style={{
          right: 0,
          bottom: "clamp(40px, 8vw, 80px)",
          width: "clamp(130px, 28vw, 250px)",
          height: "clamp(130px, 28vw, 250px)",
          zIndex: 1,
        }}
      >
        <Image
          src="/pages/about/benefits/Asset1.3 1.svg"
          alt="Decorative bottom-right asset"
          width={250}
          height={250}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>

      <Container maxWidth="7xl" padding="lg" className="relative">
        <Stack gap="2xl">
          {/* Section 1 — Hero */}
          <FadeInSection className="mb-32">
            <Stack gap="lg" align="center">
              <Text
                as="h1"
                variant="heading-2"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                GDG on TOP
              </Text>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8">
                  <Text variant="body" align="center" className="text-white">
                    Being part of GDG PUP means more than joining an
                    organization—it&apos;s about gaining access to opportunities
                    that help you grow as a developer, a leader, and a professional.
                    As a member, you&apos;re connected to a global network supported
                    by your own peers and industry professionals, with experiences
                    designed to help you learn, build, and stand out.
                  </Text>
                </CardContent>
              </Card>
            </Stack>
          </FadeInSection>

          {/* Section 2 — Benefits Grid */}
          <FadeInSection delay={0.1} className="mb-32">
            <Stack gap="xl" align="center">
              <Text
                variant="heading-4"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                WHAT BEING AN OFFICIAL GOOGLER INCLUDES
              </Text>

              {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
              <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl items-stretch">
                {benefits.map((benefit) => (
                  <BenefitCard key={benefit.title} benefit={benefit} />
                ))}
              </Grid>
            </Stack>
          </FadeInSection>

          {/* Section 3 — CTA */}
          <FadeInSection delay={0.2}>
            <Stack gap="lg" align="center">
              <Text
                as="h3"
                variant="heading-3"
                weight="bold"
                align="center"
                className="text-white"
              >
                YOUR JOURNEY STARTS HERE
              </Text>

              <Text variant="body" align="center" className="text-gray-300">
                Become a member, earn your GDG ID and start reaping the
                benefits!
              </Text>

              <Box>
                <Link href="/id">
                  <Button size="lg" variant="default" className="px-15">
                    Get ID
                  </Button>
                </Link>
              </Box>
            </Stack>
          </FadeInSection>
        </Stack>
      </Container>
    </div>
  );
}