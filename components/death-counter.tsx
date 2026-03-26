"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { statistics } from "@/lib/data";

interface DeathCounterProps {
  value?: number;
  label?: string;
  sublabel?: string;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showPulse?: boolean;
}

export function DeathCounter({
  value = statistics.totalDeathsSince1990,
  label = "Lives Lost",
  sublabel = "Since 1990",
  duration = 3,
  size = "lg",
  showPulse = true,
}: DeathCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  const sizeClasses = {
    sm: "text-3xl md:text-4xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-7xl",
    xl: "text-6xl md:text-8xl lg:text-9xl",
  };

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative inline-block"
      >
        {/* Glow effect behind number */}
        {showPulse && (
          <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse-red" />
        )}
        
        <span
          className={`
            relative font-mono font-bold text-primary tabular-nums
            ${sizeClasses[size]}
            text-cinematic
          `}
        >
          {displayValue.toLocaleString()}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-xl md:text-2xl font-serif text-foreground mt-4"
      >
        {label}
      </motion.p>

      {sublabel && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-muted-foreground mt-2"
        >
          {sublabel}
        </motion.p>
      )}
    </div>
  );
}

// Smaller inline counter for use in text
export function InlineCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <span ref={ref} className="font-mono text-primary font-bold">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
