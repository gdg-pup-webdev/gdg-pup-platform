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
import { ASSETS } from "@/lib/constants/assets";

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

const CARD_COLORS: Record<string, string> = {
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC05",
  red: "#EA4335",
};

const benefits = [
  {
    title: "Google Access",
    body: "Access to Google-backed learning resources, tools, and technologies.",
    image: ASSETS.ABOUT.BENEFITS.GOOGLE_ACCESS,
    color: "blue",
  },
  {
    title: "Hands-On",
    body: "Hands-on workshops, Study Jams, Departmental skill-shares and real-world projects.",
    image: ASSETS.ABOUT.BENEFITS.HANDS_ON,
    color: "green",
  },
  {
    title: "Mentorship",
    body: "Opportunities to connect with industry professionals and mentors through our partnered initiatives.",
    image: ASSETS.ABOUT.BENEFITS.MENTORSHIP,
    color: "yellow",
  },
  {
    title: "Growth Network",
    body: "A global GDG network you can grow with—even after graduation.",
    image: ASSETS.ABOUT.BENEFITS.GROWTH_NETWORK,
    color: "red",
  },
  {
    title: "Leadership",
    body: "Leadership, collaboration, and career-building experiences.",
    image: ASSETS.ABOUT.BENEFITS.LEADERSHIP,
    color: "yellow",
  },
  {
    title: "Community",
    body: "Vibrant community where meaningful connections, valuable networks, and unforgettable experiences happen naturally. We grow, laugh, and build together.",
    image: ASSETS.ABOUT.BENEFITS.COMMUNITY,
    color: "blue",
  },
];

const BenefitCard = ({ benefit }: { benefit: (typeof benefits)[0] }) => {
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

  const { w, h } = dims;
  const perimeter = w > 0 ? 2 * (w + h) - 8 * R + 2 * Math.PI * R : 0;
  const snakes = [0, 0.25, 0.5, 0.75].map((frac) => frac * perimeter);
  const path =
    w > 0
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
      {!hovered && (
        <>
          <div
            className="absolute pointer-events-none z-10"
            style={{
              top: -2,
              left: -2,
              width: CORNER,
              height: CORNER,
              borderTop: `${T}px solid ${c}`,
              borderLeft: `${T}px solid ${c}`,
              borderRadius: "20px 0 0 0",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              top: -2,
              right: -2,
              width: CORNER,
              height: CORNER,
              borderTop: `${T}px solid ${c}`,
              borderRight: `${T}px solid ${c}`,
              borderRadius: "0 20px 0 0",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              bottom: -2,
              left: -2,
              width: CORNER,
              height: CORNER,
              borderBottom: `${T}px solid ${c}`,
              borderLeft: `${T}px solid ${c}`,
              borderRadius: "0 0 0 20px",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              bottom: -2,
              right: -2,
              width: CORNER,
              height: CORNER,
              borderBottom: `${T}px solid ${c}`,
              borderRight: `${T}px solid ${c}`,
              borderRadius: "0 0 20px 0",
            }}
          />
        </>
      )}

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
        <CardHeader
          style={{
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Text
            variant="heading-6"
            weight="semibold"
            align="center"
            className="text-white"
          >
            {benefit.title}
          </Text>
        </CardHeader>

        <CardContent
          style={{
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <Text
            variant="body-sm"
            align="center"
            className="text-gray-300 text-center"
          >
            {benefit.body}
          </Text>
        </CardContent>

        <div
          className="relative w-full rounded-[12px] overflow-hidden"
          style={{
            height: "clamp(130px, 20vw, 170px)",
            flexShrink: 0,
            margin: "auto 16px 16px 16px",
            width: "calc(100% - 32px)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.75 : 1.5 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={benefit.image}
              alt={benefit.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export function BenefitsSection() {
  return (
    <div className="relative overflow-hidden pt-32 md:pt-48 pb-16 md:pb-28 px-4 md:px-8 lg:px-16 bg-[#010B1D]">
      <style>{`
        /* ── Ellipses ── */
        .ellipse-blue {
          width: 620px;
          height: 680px;
          top: -40px;
          left: -220px;
          opacity: 0.6;
        }
        .ellipse-yellow {
          width: 620px;
          height: 680px;
          top: 400px;
          right: -240px;
          opacity: 0.6;
        }
        .ellipse-red {
          width: 680px;
          height: 620px;
          bottom: 280px;
          left: -260px;
          opacity: 0.6;
        }
        .ellipse-green {
          width: 640px;
          height: 680px;
          bottom: 60px;
          right: -270px;
          opacity: 0.6;
        }
        @media (max-width: 767px) {
          .ellipse-blue   { width: 550px; height: 600px; left: -250px; top: 40px; }
          .ellipse-yellow { width: 550px; height: 600px; top: 900px;   right: -300px; }
          .ellipse-red    { width: 520px; height: 550px; bottom: 700px; left: -300px; }
          .ellipse-green  { width: 500px; height: 520px; bottom: 180px; right: -200px; }
        }
      `}</style>

      {/* ── Ellipse: Top Left — Blue ── */}
      <div
        className="ellipse-blue absolute rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #4285F488 0%, #4285F444 40%, transparent 72%)",
          filter: "blur(32px)",
          WebkitFilter: "blur(32px)",
          zIndex: 0,
        }}
      />

      {/* ── Ellipse: Top Center — Light Blue arc ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "clamp(300px, 45vw, 680px)",
          height: "clamp(90px, 12vw, 160px)",
          top: "clamp(-80px, -6vw, -60px)",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 50% 100%, #7EC8F8CC 0%, #4AABF066 50%, transparent 72%)",
          filter: "blur(40px)",
          WebkitFilter: "blur(40px)",
          zIndex: 0,
        }}
      />

      {/* ── Ellipse: Mid Right — Yellow ── */}
      <div
        className="ellipse-yellow absolute rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #FBBC0588 0%, #FBBC0544 40%, transparent 72%)",
          filter: "blur(32px)",
          WebkitFilter: "blur(32px)",
          zIndex: 0,
        }}
      />

      {/* ── Ellipse: Bottom Left — Red ── */}
      <div
        className="ellipse-red absolute rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #EA433588 0%, #EA433544 40%, transparent 72%)",
          filter: "blur(32px)",
          WebkitFilter: "blur(32px)",
          zIndex: 0,
        }}
      />

      {/* ── Ellipse: Bottom Right — Green ── */}
      <div
        className="ellipse-green absolute rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #34A85388 0%, #34A85344 40%, transparent 72%)",
          filter: "blur(32px)",
          WebkitFilter: "blur(32px)",
          zIndex: 0,
        }}
      />

      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        style={{
          left: 0,
          top: 100,
          width: "clamp(140px, 20vw, 200px)",
          height: "clamp(140px, 20vw, 200px)",
          zIndex: 1,
        }}
      >
        <Image
          src={ASSETS.ABOUT.BENEFITS.DECOR_RIGHT}
          alt=""
          width={160}
          height={160}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.92 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        style={{
          right: 0,
          bottom: 450,
          width: "clamp(120px, 16vw, 160px)",
          height: "clamp(120px, 16vw, 160px)",
          zIndex: 1,
        }}
      >
        <Image
          src={ASSETS.ABOUT.BENEFITS.DECOR_LEFT}
          alt=""
          width={180}
          height={180}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>

      <Container maxWidth="7xl" padding="lg" className="relative">
        <Stack gap="xl">
          {/* ── Section 1: Hero ── */}
          <FadeInSection className="mb-16">
            <Stack gap="lg" align="center">
              <Text
                as="h1"
                variant="heading-3"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                GDG on TOP
              </Text>

              <Card
                className="border-white/15"
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "0.5px solid rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <CardContent
                  style={{
                    paddingTop: "32px",
                    paddingBottom: "32px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                  }}
                >
                  <Text
                    variant="body-lg"
                    align="center"
                    className="text-white leading-relaxed"
                  >
                    Being part of GDG PUP means more than joining an
                    organization—it&apos;s about gaining access to opportunities
                    that help you grow as a developer, a leader, and a
                    professional. As a member, you&apos;re connected to a global
                    network supported by your own peers and industry
                    professionals, with experiences designed to help you learn,
                    build, and stand out.
                  </Text>
                </CardContent>
              </Card>
            </Stack>
          </FadeInSection>

          {/* ── Section 2: Benefits Grid ── */}
          <FadeInSection delay={0.1} className="mb-20">
            <Stack gap="xl" align="center">
              <Text
                variant="heading-4"
                weight="bold"
                align="center"
                gradient="white-blue"
              >
                WHAT BEING AN OFFICIAL GOOGLER INCLUDES
              </Text>

              <Grid
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl"
                style={{ alignItems: "stretch", gridAutoRows: "1fr" }}
              >
                {benefits.map((benefit) => (
                  <BenefitCard key={benefit.title} benefit={benefit} />
                ))}
              </Grid>
            </Stack>
          </FadeInSection>

          {/* ── Section 3: CTA ── */}
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
                <Link prefetch={false} href="/id">
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
