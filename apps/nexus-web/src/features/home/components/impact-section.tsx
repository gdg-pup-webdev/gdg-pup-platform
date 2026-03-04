"use client";

import { Container, Text } from "@packages/spark-ui";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function ImpactSection() {
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
                    <Text
                        as="h2"
                        align="center"
                        gradient="red"
                        variant="heading-2"
                        weight="bold"
                    >
                        The Impact
                    </Text>
                </motion.div>
            </Container>

            {/* Space for future content */}
            <div className="h-64" />
        </section>
    );
}
