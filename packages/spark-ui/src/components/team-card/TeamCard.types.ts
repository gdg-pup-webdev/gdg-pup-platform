import * as React from "react";

import type { ShineBorderProps } from "../shine-border";

/** Optional social link object for the card footer. */
export interface TeamCardSocials {
  /** Full LinkedIn profile URL, e.g. `https://linkedin.com/in/username` */
  linkedin?: string;
  /** Full Twitter / X profile URL, e.g. `https://x.com/username` */
  twitter?: string;
  /** Full Instagram profile URL, e.g. `https://instagram.com/username` */
  instagram?: string;
  /** Full Facebook profile URL, e.g. `https://facebook.com/username` */
  facebook?: string;
}

export interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Member's display name. */
  name: string;

  /** Role / position title shown beneath the name. */
  role: string;

  /**
   * Absolute or relative path to the team member's photo.
   * Rendered as a full-width rectangular image with border-radius 16px.
   */
  imageSrc: string;

  /** Alt text for the image. Defaults to the member's name. */
  imageAlt?: string;

  /**
   * Path to the mascot/character image overlaid at the bottom-center of the photo.
   * e.g. "/pages/team/hero-icon.png"
   */
  mascotSrc?: string;

  /** Optional social links rendered as icon anchors at the card bottom. */
  socials?: TeamCardSocials;

  /**
   * Colour(s) passed to ShineBorder's `shineColor` prop.
   * Defaults to the 4-colour Google gradient array.
   */
  shineColor?: ShineBorderProps["shineColor"];

  /**
   * Duration (seconds) of one ShineBorder animation cycle.
   * @default 10
   */
  shineDuration?: number;

  /**
   * Maximum 3D tilt rotation in degrees.
   * @default 10
   */
  tiltMax?: number;

  /**
   * Whether the 3D tilt-on-hover is enabled.
   * @default true
   */
  tiltEnabled?: boolean;
}
