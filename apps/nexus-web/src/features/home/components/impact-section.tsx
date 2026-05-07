"use client";

import { Container, Text, Inline } from "@packages/spark-ui";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ImpactCard } from "./impact-card";
import { ASSETS } from "@/lib/constants/assets";
import { FrostedContentContainer } from "./frosted-content-container";
import Image from "next/image";
import { PlanetCard } from "../../community-showcase/components/PlanetCard";

const buildWords = ["Creators", "Leaders", "Community"];

export function ImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bulletColors = ["#4285F4", "#F9AB00", "#34A853", "#EA4335"];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % buildWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const impactCards = [
    {
      color: "#2E74FF",
      title: "2,000+ Members",
      description:
        "Fostered a vibrant and engaged ecosystem of tech enthusiasts and innovators.",
      image: ASSETS.HOME.MEMBERS,
      imageAlt: "GDG PUP community",
    },
    {
      color: "#34A853",
      title: "Multiple Tech Teams",
      description:
        "Launched specialized teams to drive technical excellence and project execution.",
      image: ASSETS.HOME.MULTIPLE_TECH_TEAMS,
      imageAlt: "Student project showcase",
    },
    {
      color: "#F9AB00",
      title: "Workshops & Hackathons",
      description:
        "Organized dozens of high-impact events focused on building and competing.",
      image: ASSETS.HOME.WORKSHOPS_AND_HACKATHONS,
      imageAlt: "Community learning event",
    },
    {
      color: "#EA4335",
      title: "Industry Collaborations",
      description:
        "Bridged the gap between our community and leading professional organizations.",
      image: ASSETS.HOME.INDUSTRY_COLLABORATION,
      imageAlt: "Industry partner collaboration",
    },
  ];

  return (
    <section
      className="relative hidden lg:block z-30 mt-40 lg:my-110"
      ref={ref}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          <Text
            as="h2"
            align="center"
            variant="heading-2"
            weight="bold"
            className="text-white"
            style={{
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.95), 0 8px 24px rgba(0, 0, 0, 0.95), 0 16px 48px rgba(0, 0, 0, 0.85)",
            }}
          >
            The Impact
          </Text>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-35 grid grid-cols-1 auto-rows-fr gap-8 justify-items-stretch md:grid-cols-2 lg:grid-cols-4"
        >
          {impactCards.map((card) => (
            <ImpactCard
              key={`${card.color}-${card.title}`}
              color={card.color}
              title={card.title}
              description={card.description}
              image={card.image}
              imageAlt={card.imageAlt}
              className="justify-between min-h-[420px]"
            />
          ))}
        </motion.div>
      </Container>
      {/* beyond numbers section */}
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
          className="py-20"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-8">
              <Text
                as="h5"
                align="left"
                variant="heading-5"
                weight="bold"
                className="text-white"
              >
                But beyond numbers, <br />
                GDG PUP has helped students:
              </Text>
              <div className="flex flex-col gap-8">
                <FrostedContentContainer
                  contentClassName="px-6 py-4 w-133.5"
                  ringClassName="w-133.5"
                >
                  <Inline>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: bulletColors[0] }}
                    />
                    <Text
                      align="left"
                      variant="body"
                      weight="normal"
                      color="on-primary"
                      className="text-xl"
                    >
                      Build portfolio-ready projects
                    </Text>
                  </Inline>
                </FrostedContentContainer>
                <FrostedContentContainer
                  contentClassName="px-6 py-4 w-133.5"
                  ringClassName="w-133.5"
                  className="ml-8"
                >
                  <Inline>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: bulletColors[1] }}
                    />
                    <Text
                      align="left"
                      variant="body"
                      weight="normal"
                      color="on-primary"
                      className="text-xl"
                    >
                      Land internships and career opportunities
                    </Text>
                  </Inline>
                </FrostedContentContainer>
                <FrostedContentContainer
                  contentClassName="px-6 py-4 w-133.5"
                  ringClassName="w-133.5"
                  className="ml-16"
                >
                  <Inline>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: bulletColors[2] }}
                    />
                    <Text
                      align="left"
                      variant="body"
                      weight="normal"
                      color="on-primary"
                      className="text-xl"
                    >
                      Develop confidence in real-world problem solving
                    </Text>
                  </Inline>
                </FrostedContentContainer>
                <FrostedContentContainer
                  contentClassName="px-6 py-4 w-133.5"
                  ringClassName="w-133.5"
                  className="ml-24"
                >
                  <Inline>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: bulletColors[3] }}
                    />
                    <Text
                      align="left"
                      variant="body"
                      weight="normal"
                      color="on-primary"
                      className="text-xl"
                    >
                      Find a community that supports growth
                    </Text>
                  </Inline>
                </FrostedContentContainer>
              </div>
            </div>
            <div>
              <Image
                src={ASSETS.HOME.CIRBY_STICKER51}
                alt="cirby sticker"
                width={4096}
                height={4096}
                className="w-137 h-137 pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>
        </motion.div>
      </Container>
      {/* we dont just host events section */}
      <Container className="relative mt-96 flex flex-col items-center justify-center py-32 text-center">
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="relative grid items-start justify-items-center">
            <Image
              src={ASSETS.HOME.ELLIPSE207}
              alt="ellipse 207"
              width={850}
              height={806}
              className="col-start-1 row-start-1 object-cover pointer-events-none select-none"
              draggable={false}
            />
            <Image
              src={ASSETS.HOME.ELLIPSE208}
              alt="ellipse 208"
              width={719}
              height={636}
              className="col-start-1 row-start-1 object-cover mt-4.25 pointer-events-none select-none"
              draggable={false}
            />
            <div className="absolute top-75 -left-40 rotate-25">
              <PlanetCard
                image={ASSETS.HOME.MEMBERS_GDG_POSE}
                alt="planet"
                size={200}
              />
            </div>
            <div className="absolute top-20 -right-24">
              <PlanetCard image={ASSETS.HOME.MEMBERS} alt="planet" size={220} />
            </div>
            <div className="absolute -bottom-20 right-20 -scale-x-100 rotate-[-30deg]">
              <PlanetCard
                image={ASSETS.HOME.INDUSTRY_COLLABORATION}
                alt="planet"
                size={220}
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-12.5">
          {/* Add text here */}
          <Text
            as="h5"
            align="center"
            variant="heading-5"
            weight="bold"
            className="text-3xl text-white"
          >
            We don’t just host events...
          </Text>
          <div className="flex flex-col gap-2 items-center">
            <Text
              as="h4"
              align="center"
              color="on-primary"
              variant="heading-3"
              weight="bold"
              className="text-7xl"
            >
              We build
            </Text>
            <div className="relative flex justify-center items-center h-16 w-full overflow-hidden px-4">
              {/* Invisible placeholder to natively expand the container's width, preventing absolute elements from cropping */}
              <div
                aria-hidden
                className="invisible pointer-events-none select-none"
              >
                <Text
                  className="text-7xl"
                  as="span"
                  variant="heading-3"
                  weight="bold"
                >
                  Community
                </Text>
              </div>
              <AnimatePresence>
                <motion.div
                  key={currentWordIndex}
                  initial={{ y: 60 }}
                  animate={{ y: 0 }}
                  exit={{ y: -60 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute w-full flex justify-center"
                >
                  <Text
                    as="span"
                    align="center"
                    gradient="white-blue"
                    variant="heading-3"
                    weight="bold"
                    className="w-full text-7xl"
                  >
                    {buildWords[currentWordIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
