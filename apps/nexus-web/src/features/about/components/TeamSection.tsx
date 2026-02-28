// To be improved pa initial designs only

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  Container,
  Stack,
  Text,
  Sidebar,
  SidebarItem,
  SidebarGroup,
} from "@packages/spark-ui";
import Image from "next/image";

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

const TOP_LEVEL_ITEMS = [
  { href: "/about/team/administrative", label: "Administrative" },
  { href: "/about/team/marketing", label: "Marketing" },
  { href: "/about/team/creatives", label: "Creatives" },
  { href: "/about/team/operation", label: "Operation" },
  { href: "/about/team/community-relation", label: "Community Relation" },
  { href: "/about/team/partnership", label: "Partnership" },
];

const TECH_ITEMS = [
  { href: "/about/team/tech-executives", label: "Tech Executives" },
  { href: "/about/team/project-management", label: "Project Management" },
  { href: "/about/team/web-development", label: "Web Development" },
  { href: "/about/team/ui-ux", label: "UI/UX" },
  { href: "/about/team/cybersecurity", label: "Cybersecurity" },
  { href: "/about/team/cloud-solution", label: "Cloud Solution" },
  { href: "/about/team/data-ml", label: "Data and ML" },
  { href: "/about/team/internet-of-things", label: "Internet of Things" },
];

export function TeamSection({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative overflow-hidden pt-60 pb-48 px-4 md:px-8 lg:px-16">
      {/* Decorative Image - Upper ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ top: "10rem", width: "47vw", height: "30vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src="/pages/team/ellipse-upper.png"
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      {/* Decorative Image - Lower ellipse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ top: "24rem", width: "32vw", height: "20vh", zIndex: 0 }}
        aria-hidden
      >
        <Image
          src="/pages/team/ellipse-lower.png"
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      <Container
        maxWidth="7xl"
        padding="lg"
        className="relative flex flex-col flex-1 min-h-0"
      >
        <Stack gap="2xl" className="flex flex-col flex-1 min-h-0">
          {/* Hero Header */}
          <FadeInSection className="mb-8">
            <Stack gap="md" align="center">
              <Image
                src="/pages/team/hero-icon.png"
                width={128}
                height={128}
                alt="GDG Logo"
              />
              <Text
                as="h1"
                variant="heading-1"
                weight="bold"
                gradient="white-blue"
                align="center"
              >
                Built by Spark.
              </Text>
              <Text
                as="h2"
                variant="heading-2"
                weight="bold"
                gradient="white-green"
                align="center"
              >
                Meet the team behind GDG PUP.
              </Text>
            </Stack>
          </FadeInSection>

          {/* Sidebar + Content */}
          {/* overflow-visible here so 3D-tilted cards are not clipped by the flex container */}
          <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0 pb-8">
            {/* Sidebar */}
            <div className="w-full lg:w-auto lg:sticky lg:top-24">
              <Sidebar>
                {TOP_LEVEL_ITEMS.map(({ href, label }) => (
                  <SidebarItem
                    key={href}
                    href={href}
                    active={pathname === href}
                    linkComponent={Link}
                  >
                    {label}
                  </SidebarItem>
                ))}
                <SidebarGroup label="Tech Department" defaultOpen>
                  {TECH_ITEMS.map(({ href, label }) => (
                    <SidebarItem
                      key={href}
                      nested
                      href={href}
                      active={pathname === href}
                      linkComponent={Link}
                    >
                      {label}
                    </SidebarItem>
                  ))}
                </SidebarGroup>
              </Sidebar>
            </div>

            {/* Main content */}
            {/* overflow-y-auto for vertical scroll; overflow-x-clip prevents horizontal
                scrollbar from tilt transforms without creating a new scroll context */}
            <div className="flex-1 min-w-0 overflow-y-auto overflow-x-clip">{children}</div>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
