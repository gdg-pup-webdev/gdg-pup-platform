"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export const AuthParallaxBackground = () => {
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
    <div className="absolute top-[168px] left-1/2 -translate-x-1/2 w-[1440px] h-[1029px] pointer-events-none z-0">
      <div 
        className="absolute mix-blend-screen opacity-70 transition-transform duration-1000 ease-out"
        style={{
          width: '1956.62px',
          height: '1822.98px',
          left: '1327.81px',
          top: '455.52px',
          transform: 'translate(' + (mousePosition.x * -5) + 'px, ' + (mousePosition.y * -5) + 'px)'
        }}
      >
        <Image src="/auth/auth-rainbow-streak.png" alt="Rainbow Streak" className="object-cover blur-[150px]" fill priority />
      </div>
      
      <div 
        className="absolute pointer-events-none z-0 transition-transform duration-1000 ease-out"
        style={{
          width: '1405px',
          height: '731.953px',
          aspectRatio: '167/87',
          right: '190px',
          top: '-100px',
          transform: 'rotate(42.496deg) translate(' + (mousePosition.x * 12) + 'px, ' + (mousePosition.y * 12) + 'px)'
        }}
      >
         <Image src="/auth/auth-horizon.png" alt="Horizon Effect" className="object-cover" fill priority />
      </div>
    </div>
  );
};
