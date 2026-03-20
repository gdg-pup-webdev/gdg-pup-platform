"use client";

import Image from "next/image";
import { useState } from "react";
import { Text } from "@packages/spark-ui";

interface TeamDropdownsProps {
  memberLevelTitle?: string;
  memberLevelDescription?: string;
  supportGroupTitle?: string;
  supportGroupDescription?: string;
  supportGroupSecondaryTitle?: string;
  supportGroupSecondaryDescription?: string;
}

const DEFAULT_MEMBER_LEVEL_TITLE = "IoT Cadet";
const DEFAULT_MEMBER_LEVEL_DESCRIPTION =
  "The IoT Cadets are members of the Technology Department who learn and contribute to turning creative ideas into real, functional prototypes. By combining electronics, coding, and mechanical design, cadets gain hands-on experience building smart systems and automated solutions that connect the digital and physical worlds. This is a space for cadets who love to tinker, experiment, and solve problems through practical engineering.";
const DEFAULT_SUPPORT_GROUP_TITLE = "Compliance Analyst";
const DEFAULT_SUPPORT_GROUP_DESCRIPTION =
  "Maintains ethical standards and documentation integrity. Oversees governance, ensures compliance with policies, and promotes transparency across all projects.";
const DEFAULT_SUPPORT_GROUP_SECONDARY_TITLE = "Curriculum Analyst";
const DEFAULT_SUPPORT_GROUP_SECONDARY_DESCRIPTION =
  "Designs the team's learning roadmap, lessons, and progress tracking. Curates resources that build solid technical foundations and structured skill growth.";

function DropdownRow({
  iconSrc,
  iconAlt,
  label,
  isOpen,
  onToggle,
  title,
  description,
  secondaryTitle,
  secondaryDescription,
}: {
  iconSrc: string;
  iconAlt: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  secondaryTitle?: string;
  secondaryDescription?: string;
}) {
  return (
    <div className="relative w-full rounded-xl">
      <div
        className="absolute inset-0 z-3 rounded-xl pointer-events-none"
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        className="relative rounded-xl px-7.5 py-5"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(70px) saturate(180%)",
          WebkitBackdropFilter: "blur(70px) saturate(180%)",
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`Toggle ${label}`}
          className="w-full flex items-center justify-between gap-4 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-white text-2xl font-semibold truncate">
              {label}
            </span>
          </div>

          <span className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-200 hover:scale-105">
            <Image
              src="/products/Dropdown%20Button.svg"
              alt=""
              width={36}
              height={36}
              className={`h-9 w-9 object-contain pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
              aria-hidden
            />
          </span>
        </button>

        {isOpen && (
          <div className="pt-7 pb-1">
            <Text
              align="left"
              gradient="white-red"
              variant="heading-5"
              weight="bold"
            >
              {title}
            </Text>
            <p className="mt-4 text-white/95 text-base font-normal leading-8">
              {description}
            </p>

            {secondaryTitle && secondaryDescription && (
              <>
                <Text
                  align="left"
                  gradient="white-red"
                  variant="heading-5"
                  weight="bold"
                  className="mt-8"
                >
                  {secondaryTitle}
                </Text>
                <p className="mt-4 text-white/95 text-base font-normal leading-8">
                  {secondaryDescription}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamDropdowns({
  memberLevelTitle = DEFAULT_MEMBER_LEVEL_TITLE,
  memberLevelDescription = DEFAULT_MEMBER_LEVEL_DESCRIPTION,
  supportGroupTitle = DEFAULT_SUPPORT_GROUP_TITLE,
  supportGroupDescription = DEFAULT_SUPPORT_GROUP_DESCRIPTION,
  supportGroupSecondaryTitle = DEFAULT_SUPPORT_GROUP_SECONDARY_TITLE,
  supportGroupSecondaryDescription = DEFAULT_SUPPORT_GROUP_SECONDARY_DESCRIPTION,
}: TeamDropdownsProps) {
  const [openRow, setOpenRow] = useState<
    "member-level" | "support-group" | null
  >(null);

  const toggleRow = (row: "member-level" | "support-group") => {
    setOpenRow((prev) => (prev === row ? null : row));
  };

  return (
    <div className="w-full flex flex-col gap-3.25">
      <DropdownRow
        iconSrc="/sparkmates/sparkmates-sparky.png"
        iconAlt="Sparky"
        label="Member Level"
        isOpen={openRow === "member-level"}
        onToggle={() => toggleRow("member-level")}
        title={memberLevelTitle}
        description={memberLevelDescription}
      />
      <DropdownRow
        iconSrc="/id/id-cirby.webp"
        iconAlt="Cirby"
        label="Support Group"
        isOpen={openRow === "support-group"}
        onToggle={() => toggleRow("support-group")}
        title={supportGroupTitle}
        description={supportGroupDescription}
        secondaryTitle={supportGroupSecondaryTitle}
        secondaryDescription={supportGroupSecondaryDescription}
      />
    </div>
  );
}
