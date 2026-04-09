"use client";

import Image from "next/image";
import { useState } from "react";
import { Text } from "@packages/spark-ui";
import type { TextVariants } from "@packages/spark-ui";
import type { TeamContentEntry } from "../data/team-content";

type TeamTitleGradient = NonNullable<TextVariants["gradient"]>;

interface TeamDropdownsProps {
  titleGradient?: TeamTitleGradient;
  hideSupportGroup?: boolean;
  memberLevels?: TeamContentEntry[];
  memberLevelTitle?: string;
  memberLevelDescription?: string;
  memberLevelSecondaryTitle?: string;
  memberLevelSecondaryDescription?: string;
  memberLevelTertiaryTitle?: string;
  memberLevelTertiaryDescription?: string;
  memberLevelQuaternaryTitle?: string;
  memberLevelQuaternaryDescription?: string;
  memberLevelQuinaryTitle?: string;
  memberLevelQuinaryDescription?: string;
  memberLevelSenaryTitle?: string;
  memberLevelSenaryDescription?: string;
  supportGroups?: TeamContentEntry[];
  supportGroupTitle?: string;
  supportGroupDescription?: string;
  supportGroupSecondaryTitle?: string;
  supportGroupSecondaryDescription?: string;
  supportGroupTertiaryTitle?: string;
  supportGroupTertiaryDescription?: string;
  supportGroupQuaternaryTitle?: string;
  supportGroupQuaternaryDescription?: string;
}

const DEFAULT_MEMBER_LEVEL_TITLE = "Member Level";
const DEFAULT_MEMBER_LEVEL_DESCRIPTION = "";
const DEFAULT_MEMBER_LEVEL_SECONDARY_TITLE = "";
const DEFAULT_MEMBER_LEVEL_SECONDARY_DESCRIPTION = "";
const DEFAULT_MEMBER_LEVEL_TERTIARY_TITLE = "";
const DEFAULT_MEMBER_LEVEL_TERTIARY_DESCRIPTION = "";
const DEFAULT_MEMBER_LEVEL_QUATERNARY_TITLE = "";
const DEFAULT_MEMBER_LEVEL_QUATERNARY_DESCRIPTION = "";
const DEFAULT_MEMBER_LEVEL_QUINARY_TITLE = "";
const DEFAULT_MEMBER_LEVEL_QUINARY_DESCRIPTION = "";
const DEFAULT_MEMBER_LEVEL_SENARY_TITLE = "";
const DEFAULT_MEMBER_LEVEL_SENARY_DESCRIPTION = "";
const DEFAULT_SUPPORT_GROUP_TITLE = "Compliance Analyst";
const DEFAULT_SUPPORT_GROUP_DESCRIPTION = "";
const DEFAULT_SUPPORT_GROUP_SECONDARY_TITLE = "Curriculum Analyst";
const DEFAULT_SUPPORT_GROUP_SECONDARY_DESCRIPTION = "";
const DEFAULT_SUPPORT_GROUP_TERTIARY_TITLE = "";
const DEFAULT_SUPPORT_GROUP_TERTIARY_DESCRIPTION = "";
const DEFAULT_SUPPORT_GROUP_QUATERNARY_TITLE = "";
const DEFAULT_SUPPORT_GROUP_QUATERNARY_DESCRIPTION = "";
const DEFAULT_TITLE_GRADIENT: TeamTitleGradient = "white-yellow";

function normalizeDropdownItems(
  items?: TeamContentEntry[],
  fallbackItems: TeamContentEntry[] = [],
) {
  if (items?.length) {
    return items;
  }

  return fallbackItems.filter(
    (item) =>
      item.title.trim().length > 0 || item.description.trim().length > 0,
  );
}

function DropdownRow({
  iconSrc,
  iconAlt,
  label,
  isOpen,
  onToggle,
  items,
  titleGradient,
}: {
  iconSrc: string;
  iconAlt: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: TeamContentEntry[];
  titleGradient: TeamTitleGradient;
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
        className="relative rounded-xl px-4 md:px-7.5 py-4 md:py-5"
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
            <span className="truncate text-xl font-semibold text-white md:text-2xl">
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
            {items.map((item, index) => (
              <div key={`${item.title}-${index}`}>
                <Text
                  align="left"
                  gradient={titleGradient}
                  variant="heading-4"
                  weight="bold"
                  className={`${index > 0 ? "mt-6 md:mt-8" : ""} text-xl leading-7 md:text-[2.5rem] md:leading-[1.3]`}
                >
                  {item.title}
                </Text>
                <p className="mt-3 self-stretch text-justify text-sm font-normal leading-6 text-white/95 md:mt-4 md:text-xl md:leading-8 lg:text-2xl">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamDropdowns({
  titleGradient = DEFAULT_TITLE_GRADIENT,
  hideSupportGroup = false,
  memberLevels,
  memberLevelTitle = DEFAULT_MEMBER_LEVEL_TITLE,
  memberLevelDescription = DEFAULT_MEMBER_LEVEL_DESCRIPTION,
  memberLevelSecondaryTitle = DEFAULT_MEMBER_LEVEL_SECONDARY_TITLE,
  memberLevelSecondaryDescription = DEFAULT_MEMBER_LEVEL_SECONDARY_DESCRIPTION,
  memberLevelTertiaryTitle = DEFAULT_MEMBER_LEVEL_TERTIARY_TITLE,
  memberLevelTertiaryDescription = DEFAULT_MEMBER_LEVEL_TERTIARY_DESCRIPTION,
  memberLevelQuaternaryTitle = DEFAULT_MEMBER_LEVEL_QUATERNARY_TITLE,
  memberLevelQuaternaryDescription = DEFAULT_MEMBER_LEVEL_QUATERNARY_DESCRIPTION,
  memberLevelQuinaryTitle = DEFAULT_MEMBER_LEVEL_QUINARY_TITLE,
  memberLevelQuinaryDescription = DEFAULT_MEMBER_LEVEL_QUINARY_DESCRIPTION,
  memberLevelSenaryTitle = DEFAULT_MEMBER_LEVEL_SENARY_TITLE,
  memberLevelSenaryDescription = DEFAULT_MEMBER_LEVEL_SENARY_DESCRIPTION,
  supportGroups,
  supportGroupTitle = DEFAULT_SUPPORT_GROUP_TITLE,
  supportGroupDescription = DEFAULT_SUPPORT_GROUP_DESCRIPTION,
  supportGroupSecondaryTitle = DEFAULT_SUPPORT_GROUP_SECONDARY_TITLE,
  supportGroupSecondaryDescription = DEFAULT_SUPPORT_GROUP_SECONDARY_DESCRIPTION,
  supportGroupTertiaryTitle = DEFAULT_SUPPORT_GROUP_TERTIARY_TITLE,
  supportGroupTertiaryDescription = DEFAULT_SUPPORT_GROUP_TERTIARY_DESCRIPTION,
  supportGroupQuaternaryTitle = DEFAULT_SUPPORT_GROUP_QUATERNARY_TITLE,
  supportGroupQuaternaryDescription = DEFAULT_SUPPORT_GROUP_QUATERNARY_DESCRIPTION,
}: TeamDropdownsProps) {
  const [openRow, setOpenRow] = useState<
    "member-level" | "support-group" | null
  >(null);
  const memberLevelItems = normalizeDropdownItems(memberLevels, [
    {
      title: memberLevelTitle,
      description: memberLevelDescription,
    },
    {
      title: memberLevelSecondaryTitle,
      description: memberLevelSecondaryDescription,
    },
    {
      title: memberLevelTertiaryTitle,
      description: memberLevelTertiaryDescription,
    },
    {
      title: memberLevelQuaternaryTitle,
      description: memberLevelQuaternaryDescription,
    },
    {
      title: memberLevelQuinaryTitle,
      description: memberLevelQuinaryDescription,
    },
    {
      title: memberLevelSenaryTitle,
      description: memberLevelSenaryDescription,
    },
  ]);
  const supportGroupItems = normalizeDropdownItems(supportGroups, [
    {
      title: supportGroupTitle,
      description: supportGroupDescription,
    },
    {
      title: supportGroupSecondaryTitle,
      description: supportGroupSecondaryDescription,
    },
    {
      title: supportGroupTertiaryTitle,
      description: supportGroupTertiaryDescription,
    },
    {
      title: supportGroupQuaternaryTitle,
      description: supportGroupQuaternaryDescription,
    },
  ]);

  const toggleRow = (row: "member-level" | "support-group") => {
    setOpenRow((prev) => (prev === row ? null : row));
  };

  return (
    <div className="w-full flex flex-col gap-3.25">
      <DropdownRow
        iconSrc="/sparkmates/sparkmates-sparky.webp"
        iconAlt="Sparky"
        label="Member Level"
        isOpen={openRow === "member-level"}
        onToggle={() => toggleRow("member-level")}
        items={memberLevelItems}
        titleGradient={titleGradient}
      />
      {!hideSupportGroup && (
        <DropdownRow
          iconSrc="/id/id-cirby.webp"
          iconAlt="Cirby"
          label="Support Group"
          isOpen={openRow === "support-group"}
          onToggle={() => toggleRow("support-group")}
          items={supportGroupItems}
          titleGradient={titleGradient}
        />
      )}
    </div>
  );
}
