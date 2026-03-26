"use client";

import { motion } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function MarqueeText({
  text,
  speed = 20,
  pauseOnHover = true,
  className = "",
}: MarqueeTextProps) {
  const displayText = text.repeat(3);

  return (
    <div className={`overflow-hidden bg-background ${className}`}>
      <motion.div
        className="whitespace-nowrap flex"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        <span className="text-2xl md:text-4xl font-serif text-primary/40 mr-12">
          {displayText}
        </span>
      </motion.div>
    </div>
  );
}
