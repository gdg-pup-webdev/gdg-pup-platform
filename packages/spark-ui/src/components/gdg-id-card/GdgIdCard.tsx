"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { ShineBorder } from "../shine-border";
import {
    GDG_ID_CARD_BORDER_WIDTH,
    GDG_ID_CARD_PERSPECTIVE,
    GDG_ID_CARD_SHINE_COLORS,
    GDG_ID_CARD_SHINE_DURATION,
    GDG_ID_CARD_SHINE_DURATION_HOVER,
    GDG_ID_CARD_TILT_MAX,
    GDG_ID_CARD_BG_PADDING_X,
    GDG_ID_CARD_BG_PADDING_Y,
    GDG_ID_CARD_UPPER_FLEX,
    GDG_ID_CARD_SPARKY_OFFSET_Y,
    GDG_ID_CARD_NAME_OFFSET_Y,
    GDG_ID_CARD_INFO_OFFSET_Y,
    GDG_ID_CARD_NAME_FRAME_WIDTH,
    GDG_ID_CARD_BG_OFFSET_Y,
    GDG_ID_CARD_INFO_SCALE,
} from "./GdgIdCard.tokens";
import type { GdgIdCardProps } from "./GdgIdCard.types";

/**
 * GdgIdCard
 *
 * Layer order (back → front):
 *  1. Card body gradient (#54729F → #1E2939 → rgba(36,22,49,0.92))
 *  2. front-card-texture.jpg — 10% opacity, covers entire card
 *  3. ShineBorder animated gradient ring
 *  4. Background.png — 100% wide, 75% of card height (upper zone)
 *  5. front-card-sparky.png — centered in upper zone
 *  6. front-card-name-frame.png — pill below sparky, with name + GDG ID overlaid
 *  7. Bottom 25%: Name / Email / Course info rows on the gradient bg
 */
export const GdgIdCard = React.forwardRef<HTMLDivElement, GdgIdCardProps>(
    (
        {
            name = "Arky",
            gdgId = "GDG-PUP-26-001",
            fullName,
            email,
            course,
            shineColor = GDG_ID_CARD_SHINE_COLORS as unknown as string[],
            shineDuration = GDG_ID_CARD_SHINE_DURATION,
            tiltMax = GDG_ID_CARD_TILT_MAX,
            tiltEnabled = true,
            className,
            style,
            onMouseMove,
            onMouseLeave,
            ...props
        },
        ref
    ) => {
        const cardRef = React.useRef<HTMLDivElement>(null);
        const shineRef = React.useRef<HTMLDivElement>(null);

        const setRef = React.useCallback(
            (node: HTMLDivElement | null) => {
                (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                if (typeof ref === "function") ref(node);
                else if (ref)
                    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            },
            [ref]
        );

        // ── 3D tilt (direct DOM mutation — same pattern as TeamCard) ─────────────
        const handleMouseMove = React.useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                onMouseMove?.(e);
                if (!tiltEnabled || !cardRef.current) return;
                const rect = cardRef.current.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                Object.assign(cardRef.current.style, {
                    transform: `perspective(${GDG_ID_CARD_PERSPECTIVE}px) rotateX(${-ny * tiltMax}deg) rotateY(${nx * tiltMax}deg)`,
                    transition: "transform 0.1s ease",
                    zIndex: "10",
                });
                if (shineRef.current)
                    shineRef.current.style.setProperty("--duration", `${GDG_ID_CARD_SHINE_DURATION_HOVER}s`);
            },
            [tiltEnabled, tiltMax, onMouseMove]
        );

        const handleMouseLeave = React.useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                onMouseLeave?.(e);
                if (!cardRef.current) return;
                Object.assign(cardRef.current.style, {
                    transform: `perspective(${GDG_ID_CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
                    transition: "transform 0.4s ease",
                    zIndex: "",
                });
                if (shineRef.current)
                    shineRef.current.style.setProperty("--duration", `${shineDuration}s`);
            },
            [onMouseLeave, shineDuration]
        );

        const cardStyleVars = {
            ...style,
            "--gdg-id-bg-pad-x": GDG_ID_CARD_BG_PADDING_X,
            "--gdg-id-bg-pad-y": GDG_ID_CARD_BG_PADDING_Y,
            "--gdg-id-upper-flex": GDG_ID_CARD_UPPER_FLEX,
            "--gdg-id-lower-flex": 100 - GDG_ID_CARD_UPPER_FLEX,
            "--gdg-id-sparky-offset": GDG_ID_CARD_SPARKY_OFFSET_Y,
            "--gdg-id-name-offset": GDG_ID_CARD_NAME_OFFSET_Y,
            "--gdg-id-info-offset": GDG_ID_CARD_INFO_OFFSET_Y,
            "--gdg-id-name-width": GDG_ID_CARD_NAME_FRAME_WIDTH,
            "--gdg-id-bg-offset-y": GDG_ID_CARD_BG_OFFSET_Y,
            "--gdg-id-info-scale": GDG_ID_CARD_INFO_SCALE,
        } as React.CSSProperties;

        return (
            <div
                ref={setRef}
                className={cn("gdg-id-card-base", className)}
                style={cardStyleVars}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                {/* ── Layer 1: card body gradient (via CSS background on .gdg-id-card-base) */}

                {/* ── Layer 2: front-card-texture.jpg @ 10% opacity — covers full card */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/pages/id/front-card-texture.jpg"
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="gdg-id-card-texture"
                />

                {/* ── Layer 3: animated ShineBorder gradient ring */}
                <ShineBorder
                    ref={shineRef}
                    borderWidth={GDG_ID_CARD_BORDER_WIDTH}
                    duration={shineDuration}
                    shineColor={shineColor}
                />

                {/* ── Upper zone (75%) — Background.png + sparky + name frame ── */}
                <div className="gdg-id-card-upper">

                    {/* Layer 4: Background.png — wrapped in a padded div to prevent cutoff */}
                    <div className="gdg-id-card-bg-wrapper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/pages/id/Background.png"
                            alt=""
                            aria-hidden
                            draggable={false}
                            className="gdg-id-card-bg-img"
                        />
                    </div>

                    {/* Layers 5 & 6: sparky + name frame — relative to upper zone */}
                    <div className="gdg-id-card-upper-content">

                        {/* Sparky mascot */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/pages/id/front-card-sparky.png"
                            alt="GDG Sparky"
                            draggable={false}
                            className="gdg-id-card-sparky pointer-events-none select-none"
                        />

                        {/* Name frame — image as pill background, text overlaid */}
                        <div className="gdg-id-card-name-frame-wrapper">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/pages/id/front-card-name-frame.png"
                                alt=""
                                aria-hidden
                                draggable={false}
                                className="gdg-id-card-name-frame-img pointer-events-none select-none"
                            />
                            <div className="gdg-id-card-name-frame-text">
                                <span className="gdg-id-card-name-text">{name}</span>
                                <span className="gdg-id-card-gdgid-text">{gdgId}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Lower zone (25%) — Name / Email / Course ── */}
                <div className="gdg-id-card-lower">
                    <div className="gdg-id-card-info-container">
                        <InfoRow label="Name" value={fullName ?? name} />
                        <InfoRow label="Email" value={email ?? "—"} />
                        <InfoRow label="Course" value={course ?? "—"} />
                    </div>
                </div>
            </div>
        );
    }
);

GdgIdCard.displayName = "GdgIdCard";

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="gdg-id-card-info-row">
            <span className="gdg-id-card-info-label">{label}:</span>
            <span className="gdg-id-card-info-value">{value}</span>
        </div>
    );
}
