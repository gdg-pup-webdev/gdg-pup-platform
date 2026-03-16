"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const AuthParallaxMascot = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="relative w-[500px] h-[589px] transition-transform duration-1000 ease-out z-10"
      style={{
        transform: 'translate(' + (mousePosition.x * 25) + 'px, ' + (mousePosition.y * 25) + 'px)'
      }}
    >
       <Image src="/auth/auth-sparky.png" alt="Sparky" className="object-contain" fill priority />
    </div>
  );
};
