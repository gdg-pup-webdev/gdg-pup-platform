"use client";

import React, { useState } from "react";
import { toast } from "@/lib/nexus-toast";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  Button,
} from "@packages/spark-ui";
import { ChevronDown, Facebook, Instagram, Linkedin, Link } from "lucide-react";

type SharePlatform = "facebook" | "instagram" | "linkedin";

interface ShareDropdownProps {
  gdgId: string;
  disabled?: boolean;
  /** If provided, clicking FB/IG/LI will call this instead of opening a window directly. */
  onShare?: (platform: SharePlatform) => void;
}

const getPortfolioUrl = (gdgId: string): string => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (typeof window !== "undefined" ? window.location.origin : "https://gdgpup.org");
  return `${base}/sparkmates/${gdgId}`;
};

export function ShareDropdown({ gdgId, disabled, onShare }: ShareDropdownProps) {
  const portfolioUrl = getPortfolioUrl(gdgId);

  const handlePlatform = (platform: SharePlatform) => {
    if (onShare) {
      onShare(platform);
      return;
    }

    // Fallback: direct open (used on pages without the share modal)
    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`,
        "_blank",
        "noopener,noreferrer,width=620,height=720",
      );
    } else if (platform === "instagram") {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    } else {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`,
        "_blank",
        "noopener,noreferrer,width=620,height=720",
      );
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      toast.success("Portfolio link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2500,
      });
    } catch {
      toast.error("Failed to copy link. Please copy it manually.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="px-3 py-1 text-white flex items-center gap-1.5"
          disabled={disabled}
          aria-label="Share portfolio"
        >
          Share
          <ChevronDown size={13} className="opacity-70" />
        </Button>
      </DropdownTrigger>

      <DropdownContent position="bottom-end" size="md" animation>
        {/* Facebook */}
        <DropdownItem
          icon={<Facebook size={15} className="text-[#1877F2]" />}
          onClick={() => handlePlatform("facebook")}
        >
          Facebook
        </DropdownItem>

        {/* Instagram */}
        <DropdownItem
          icon={
            <Instagram size={15} className="text-[#E1306C]" />
          }
          onClick={() => handlePlatform("instagram")}
        >
          Instagram
        </DropdownItem>

        {/* LinkedIn */}
        <DropdownItem
          icon={<Linkedin size={15} className="text-[#0A66C2]" />}
          onClick={() => handlePlatform("linkedin")}
        >
          LinkedIn
        </DropdownItem>

        <DropdownSeparator />

        {/* Copy Link */}
        <DropdownItem
          icon={<Link size={15} className="text-zinc-400" />}
          onClick={handleCopyLink}
        >
          Copy Link
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}
