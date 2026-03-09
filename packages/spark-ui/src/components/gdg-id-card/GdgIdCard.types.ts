import type * as React from "react";

export interface GdgIdCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Member display name shown inside the name frame. */
    name?: string;
    /** GDG member ID (e.g. "GDG-PUP-26-001") shown below the name. */
    gdgId?: string;
    /** Full name shown in the bottom dark section. */
    fullName?: string;
    /** Email shown in the bottom dark section. */
    email?: string;
    /** Course / program shown in the bottom dark section. */
    course?: string;
    /** Override shine animation colors. */
    shineColor?: string[];
    /** Idle shine animation duration (seconds). */
    shineDuration?: number;
    /** Maximum 3D tilt angle (degrees). */
    tiltMax?: number;
    /** Enable / disable the 3D tilt effect. */
    tiltEnabled?: boolean;
    /** Card texture overlay image path (Layer 2). */
    textureSrc?: string;
    /** Upper-zone background image path (Layer 4). */
    bgSrc?: string;
    /** Sparky mascot image path (Layer 5). */
    sparkySrc?: string;
    /** Name-frame pill image path (Layer 6). */
    nameFrameSrc?: string;
}
