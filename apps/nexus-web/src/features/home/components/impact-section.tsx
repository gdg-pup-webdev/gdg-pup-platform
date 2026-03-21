"use client";

import { Container, Text } from "@packages/spark-ui";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ImpactCard } from "./impact-card";

export function ImpactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const impactCards = [
        {
            color: "#2E74FF",
            corner: "/blue-corner.png",
            title: "2,000+ Members",
            logo: "/team-icon.svg",
            logoAlt: "team icon",
            description: "Fostered a vibrant and engaged ecosystem of tech enthusiasts and innovators.",
            image: "/blue-img-placeholder.png",
            imageAlt: "GDG PUP community",
        },
        {
            color: "#34A853",
            corner: "/green-corner.png",
            title: "Multiple Tech Teams",
            logo: "/tech-icon.svg",
            logoAlt: "tech icon",
            description: "Launched specialized teams to drive technical excellence and project execution.",
            image: "/green-img-placeholder.jpg",
            imageAlt: "Student project showcase",
        },
        {
            color: "#F9AB00",
            corner: "/yellow-corner.png",
            title: "Workshops & Hackathons",
            logo: "/lightbulb-icon.svg",
            logoAlt: "lightbulb icon",
            description: "Organized dozens of high-impact events focused on building and competing.",
            image: "/yellow-img-placeholder.jpg",
            imageAlt: "Community learning event",
        },
        {
            color: "#EA4335",
            corner: "/red-corner.png",
            title: "Industry Collaborations",
            logo: "/handshake-icon.svg",
            logoAlt: "handshake icon",
            description: "Bridged the gap between our community and leading professional organizations.",
            image: "/red-img-placeholder.jpg",
            imageAlt: "Industry partner collaboration",
        },
    ];

    return (
        <section className="relative z-30 mt-40 lg:mt-100" ref={ref}>
            <Container className="pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                >
                    <Text
                        as="h2"
                        align="center"
                        gradient="white-blue"
                        variant="heading-2"
                        weight="bold"
                    >
                        The Impact
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="mt-42 grid grid-cols-1 auto-rows-fr gap-10 justify-items-stretch md:grid-cols-2 xl:grid-cols-4"
                >
                    {impactCards.map((card) => (
                        <ImpactCard
                            key={`${card.color}-${card.title}`}
                            color={card.color}
                            corner={card.corner}
                            title={card.title}
                            logo={card.logo}
                            logoAlt={card.logoAlt}
                            description={card.description}
                            image={card.image}
                            imageAlt={card.imageAlt}
                            className="justify-between"
                        />
                    ))}
                </motion.div>
            </Container>

            {/* Space for future content */}
            <div className="h-64" />
        </section>
    );
}
