"use client";

import { motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, Text } from "@packages/spark-ui";

interface ImpactCardProps {
  color: string;
  title: string;
  description: string;
  image: string | StaticImageData;
  imageAlt: string;
  className?: string;
}

export function ImpactCard({
  color,
  title,
  description,
  image,
  imageAlt,
  className = "",
}: ImpactCardProps) {
  const [hovered, setHovered] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);

  const T = 5;
  const CORNER = 44;
  const R = 20;
  const SEG = 72;
  const SPEED = 3;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });

    ro.observe(el);
    setDims({ w: el.offsetWidth, h: el.offsetHeight });

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!hovered) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      offsetRef.current -= SPEED;
      setOffset(offsetRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  const { w, h } = dims;
  const perimeter = w > 0 ? 2 * (w + h) - 8 * R + 2 * Math.PI * R : 0;
  const snakes = [0, 0.25, 0.5, 0.75].map((frac) => frac * perimeter);
  const path =
    w > 0
      ? `M ${R},0 H ${w - R} A ${R},${R} 0 0 1 ${w},${R} V ${h - R} A ${R},${R} 0 0 1 ${w - R},${h} H ${R} A ${R},${R} 0 0 1 0,${h - R} V ${R} A ${R},${R} 0 0 1 ${R},0 Z`
      : "";

  return (
    <motion.article
      ref={cardRef}
      className={`relative h-full w-full rounded-[28px] ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {!hovered && (
        <>
          <div
            className="absolute pointer-events-none z-10"
            style={{
              top: -2,
              left: -2,
              width: CORNER,
              height: CORNER,
              borderTop: `${T}px solid ${color}`,
              borderLeft: `${T}px solid ${color}`,
              borderRadius: "20px 0 0 0",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              top: -2,
              right: -2,
              width: CORNER,
              height: CORNER,
              borderTop: `${T}px solid ${color}`,
              borderRight: `${T}px solid ${color}`,
              borderRadius: "0 20px 0 0",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              bottom: -2,
              left: -2,
              width: CORNER,
              height: CORNER,
              borderBottom: `${T}px solid ${color}`,
              borderLeft: `${T}px solid ${color}`,
              borderRadius: "0 0 0 20px",
            }}
          />
          <div
            className="absolute pointer-events-none z-10"
            style={{
              bottom: -2,
              right: -2,
              width: CORNER,
              height: CORNER,
              borderBottom: `${T}px solid ${color}`,
              borderRight: `${T}px solid ${color}`,
              borderRadius: "0 0 20px 0",
            }}
          />
        </>
      )}

      {hovered && w > 0 && (
        <svg
          className="absolute pointer-events-none z-10"
          style={{ top: 0, left: 0, overflow: "visible" }}
          width={w}
          height={h}
        >
          {snakes.map((startOffset, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={T}
              strokeLinecap="round"
              strokeDasharray={`${SEG} ${perimeter - SEG}`}
              strokeDashoffset={-(startOffset + offset)}
            />
          ))}
        </svg>
      )}

      <Card
        className="h-full border bg-[#1a2539]"
        style={{
          borderColor: color,
          boxShadow: hovered ? `0 0 24px 2px ${color}44` : "none",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <CardHeader className="px-5 pt-5 pb-2 text-center">
          <Text variant="heading-6" weight="semibold" align="center" className="text-white">
            {title}
          </Text>
        </CardHeader>

        <CardContent className="px-4 pt-1 pb-2">
          <Text variant="body-sm" align="center" className="text-gray-300">
            {description}
          </Text>
        </CardContent>

        <div className="relative mx-4 mt-auto mb-4 h-[clamp(130px,20vw,170px)] overflow-hidden rounded-[12px]">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              draggable={false}
              className="object-cover pointer-events-none select-none"
            />
          </motion.div>
        </div>
      </Card>
    </motion.article>
  );
}
