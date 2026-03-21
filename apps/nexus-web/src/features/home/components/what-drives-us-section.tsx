"use client";

import { Container, Stack, Text, Inline } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ASSETS } from "@/lib/constants/assets";
import { FrostedContentContainer } from "./frosted-content-container";

export function WhatDrivesUsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative z-30" ref={ref}>
            <Container className="py-24">
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                >
                    <Image
                        src="/Sparky%20Thinking%201.png"
                        alt=""
                        aria-hidden
                        width={473}
                        height={630}
                        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-20"
                    />

                    {/* Content on right */}
                    <Stack gap="xl" align="start" className="w-[60%] ml-auto">
                        <Text
                            as="h2"
                            align="left"
                            gradient="white-green"
                            variant="heading-2"
                            weight="bold"
                            className="mb-0.5"
                        >
                            What drives us
                        </Text>
                        <FrostedContentContainer contentClassName="p-12.5">
                            <Stack gap="xl" align="start">
                                <Text
                                    as="h3"
                                    align="left"
                                    variant="heading-5"
                                    weight="bold"
                                    gradient="white-yellow"
                                    // className="text-2xl"
                                >
                                    We believe that:
                                </Text>

                                <Inline>
                                    <Image src={ASSETS.HOME.BULLET_DIAMOND} alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        Learning is stronger in community.
                                    </Text>
                                </Inline>

                                <Inline>
                                    <Image src={ASSETS.HOME.BULLET_DIAMOND} alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        Growth happens through action.
                                    </Text>
                                </Inline>

                                <Inline>
                                    <Image src={ASSETS.HOME.BULLET_DIAMOND} alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        Technology should create meaningful impact.
                                    </Text>
                                </Inline>

                                <Inline>
                                    <Image src={ASSETS.HOME.BULLET_DIAMOND} alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        Curiosity matters more than credentials.
                                    </Text>
                                </Inline>

                            </Stack>
                        </FrostedContentContainer>
                                <Text
                                    align="left"
                                    variant="body"
                                    weight="normal"
                                    color="on-primary"
                                    className="text-xl"
                                >
                                    GDG PUP is inclusive and open to all students — beginners, advanced developers, tech majors, and non-tech majors alike. 
                                    <br />
                                    <br />
                                    No gatekeeping. No elitism. Just shared ambition and continuous learning.
                                </Text>
                    </Stack>
                </motion.div>
            </Container>
        </section>
    );
}
