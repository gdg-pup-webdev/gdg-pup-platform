"use client";

import { Button, Container, Stack, Text, Inline } from "@packages/spark-ui";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function SparkStartsHereSection() {
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
                    <div className="flex items-start gap-11 w-full">
                        {/* Left column: heading */}
                        <Stack className="w-1/3 gap-11" align="start">
                            <Text
                                as="h2"
                                align="left"
                                color="on-primary"
                                variant="heading-2"
                                weight="bold"
                            >
                                Your Spark Starts Here.
                            </Text>
                            <Button variant="default" size="lg">
                                Spark your Journey
                            </Button>
                        </Stack>

                        {/* Right column: rest of content*/}
                        <Stack align="start" className="w-[65%] gap-11">
                            <Text
                                as="h3"
                                align="left"
                                variant="body"
                                weight="normal"
                                color="on-primary"
                                className="text-2xl"
                            >
                                If you're a student at the Polytechnic University of the Philippines looking to gain real-world tech experience, expand your network, and grow beyond the classroom — GDG PUP is your starting point.
                            </Text>

                            <Stack className="gap-3.5">
                                <Inline>
                                    <Image src="/images/Group 215.svg" alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        From theory to execution.
                                    </Text>
                                </Inline>

                                <Inline>
                                    <Image src="/images/Group 215.svg" alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        From classroom to community.
                                    </Text>
                                </Inline>

                                <Inline>
                                    <Image src="/images/Group 215.svg" alt="bullet point" width={16} height={16} className="pointer-events-none" />
                                    <Text
                                        align="left"
                                        variant="body"
                                        weight="normal"
                                        color="on-primary"
                                        className="text-xl"
                                    >
                                        From student to builder.
                                    </Text>
                                </Inline>
                            </Stack>

                            <Text
                                align="left"
                                variant="body"
                                weight="normal"
                                color="on-primary"
                                className="text-xl"
                            >
                                This is where your chapter begins.
                            </Text>
                        </Stack>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
