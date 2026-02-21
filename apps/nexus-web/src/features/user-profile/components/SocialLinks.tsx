/**
 * Social links component
 *
 * Displays the user's social media links with icons.
 * Supports common platforms like GitHub, LinkedIn, Twitter, etc.
 */

import React from "react";
import { Stack, Inline, Text } from "@packages/spark-ui";
import { SocialLink } from "../types";

interface SocialLinksProps {
  // Array of social media links
  links?: SocialLink[];

  // URL to the user's portfolio website
  portfolioUrl?: string;
}

/**
 * Renders a list of social media links with icons
 */
export function SocialLinks({ links, portfolioUrl }: SocialLinksProps) {
  // Don't render anything if there are no links
  if (!links?.length && !portfolioUrl) {
    return null;
  }

  return (
    <Stack gap="md" className="border-t border-white/10 pt-8">
      <Text variant="heading-3" className="text-white text-center">
        Connect With Me
      </Text>

      <Inline gap="md" justify="center" className="flex-wrap">
        {/* Portfolio link (if provided) */}
        {portfolioUrl && (
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span className="text-white font-medium">Portfolio</span>
          </a>
        )}

        {/* Social media links */}
        {links?.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            {/* Icon placeholder - you can add specific icons for each platform */}
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-400 to-pink-400" />

            <span className="text-white font-medium capitalize">
              {link.platform}
            </span>
          </a>
        ))}
      </Inline>
    </Stack>
  );
}
