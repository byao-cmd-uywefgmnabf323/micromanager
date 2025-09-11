"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function CelebrationOverlay({ visible = false, onDone }: { visible?: boolean; onDone?: () => void }) {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: rand(0, 100),
      y: rand(20, 60),
      size: rand(6, 10),
      hue: rand(0, 360),
      dx: rand(-40, 40),
      dy: rand(-60, -20),
      delay: rand(0, 0.2),
      duration: rand(0.8, 1.4),
    }));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onDone?.(), 1600);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-start justify-center">
      <div className="relative mt-24 h-0 w-full max-w-[1200px]">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 1, scale: 1 }}
            animate={{
              x: [`${p.x}%`, `${p.x + p.dx}%`],
              y: [`${p.y}%`, `${p.y + p.dy}%`],
              opacity: [1, 0],
              scale: [1, 0.8],
            }}
            transition={{
              duration: p.duration,
              ease: "easeOut",
              delay: p.delay,
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: 9999,
              background: `hsl(${p.hue} 80% 60%)`,
              boxShadow: `0 0 8px hsl(${p.hue} 80% 60% / 0.6)`,
            }}
          />)
        )}
      </div>
    </div>
  );
}
