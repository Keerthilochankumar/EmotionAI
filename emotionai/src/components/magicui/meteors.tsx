/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { cn } from "~/lib/utils";
import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  minSpeed?: number;
  maxSpeed?: number;
  angle?: number;
  className?: string;
}

export const Meteors = ({
  number = 500, // Adjusted for a balanced meteor effect
  minSize = 20, // Font size in pixels
  maxSize = 24,
  minOpacity = 0.5,
  maxOpacity = 1,
  minSpeed = 2,
  maxSpeed = 6,
  angle = 225, // Diagonal fall direction
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = Array.from({ length: number }).map(() => {
      const size = Math.random() * (maxSize - minSize) + minSize+100;
      const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      return {
        "--size": `${size}px`,
        "--speed": `${speed}s`,
        "--angle": `${angle}deg`,
        top: `${Math.random() * 100}vh`, // Random start position
        left: `${Math.random() * 100}vw`,
        opacity: `${Math.random() * (maxOpacity - minOpacity) + minOpacity}`,
        animationDuration: `${speed}s`,
        animationDelay: `${Math.random() * 5}s`,
      };
    });

    setMeteorStyles(styles);
  }, [number, minSize, maxSize, minOpacity, maxOpacity, minSpeed, maxSpeed, angle]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn("pointer-events-none absolute font-bold text-white animate-meteor", className)}
        >
          *
        </span>
      ))}
    </>
  );
};
