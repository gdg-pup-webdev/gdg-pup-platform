"use client";

import { Container, Stack, Text } from "@packages/spark-ui";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function WhatWeDoSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative z-30" ref={ref}>
            <Container className="py-24">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                >
                    {/* Content on left*/}
                    <Stack gap="xl" align="start" className="w-[60%]">
                        <Text
                            as="h2"
                            align="left"
                            gradient="white-green"
                            variant="heading-2"
                            weight="bold"
                            className="mb-0.5"
                        >
                            What we do
                        </Text>
                        <Text
                            as="h3"
                            align="left"
                            variant="body"
                            weight="bold"
                            color="on-primary"
                            className="text-2xl whitespace-nowrap"
                        >
                            We design experiences that turn curiosity into capability:
                        </Text>
                        <Text
                            align="left"
                            variant="body"
                            weight="normal"
                            color="on-primary"
                            className="text-xl"
                        >
                            At Google Developer Groups on Campus – Polytechnic University of the Philippines, GDG PUP is a student-driven tech community built to bridge the gap between theory and real-world practice.
                        </Text>

                        <Text
                            align="left"
                            variant="body"
                            weight="normal"
                            color="on-primary"
                            className="text-xl"
                        >
                            We create spaces where students don't just study technology — they build with it.
                        </Text>

                        <Text
                            align="left"
                            variant="body"
                            weight="normal"
                            color="on-primary"
                            className="text-xl"
                        >
                            From hands-on workshops and Study Jams to hackathons, industry collaborations, and real startup projects, GDG PUP empowers learners to transform classroom knowledge into practical skills that matter in today's tech industry.
                        </Text>

                        <Text
                            align="left"
                            variant="body"
                            weight="normal"
                            color="on-primary"
                            className="text-xl"
                        >
                            hether you're exploring Web development, Artificial Intelligence and Machine Learning (AI/ML), Cybersecurity, Cloud Solutions, UI/UX Design, Internet of Things (IoT), Project Management,  or even as a core functional team member (Operations, Finance, Creatives, Marketing, Partnerships), our community provides opportunities to learn, collaborate, and grow alongside peers and mentors.
                        </Text>

                    </Stack>
                </motion.div>
            </Container>
        </section>
    );
}
