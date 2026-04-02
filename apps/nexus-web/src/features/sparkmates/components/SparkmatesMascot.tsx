"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const SparkmatesMascot = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-[420px] h-[560px] transition-transform duration-1000 ease-out z-10"
      style={{
        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
      }}
    >
      <div className="absolute inset-0 w-full h-full animate-sparkmates-float">
        <Image
          src="/sparkmates/sparkmates-sparky.png"
          alt="Sparky"
          className="object-contain drop-shadow-[0_0_40px_rgba(66,133,244,0.25)]"
          fill
          priority
        />
      </div>
    </div>
  );
};
