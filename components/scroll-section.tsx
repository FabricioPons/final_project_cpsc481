"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ScrollSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
  bgColor?: string;
  fullHeight?: boolean;
  sticky?: boolean;
  parallax?: boolean;
}

export function ScrollSection({
  children,
  id,
  className = "",
  bgColor = "bg-background",
  fullHeight = true,
  sticky = false,
  parallax = false,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], parallax ? ["0%", "20%"] : ["0%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`
        relative w-full overflow-hidden
        ${fullHeight ? "min-h-screen" : ""}
        ${sticky ? "sticky top-0" : ""}
        ${bgColor}
        ${className}
      `}
      style={{ y }}
    >
      <motion.div
        className="relative z-10 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

// Fade-in content wrapper with scroll trigger
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "" 
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const directionVariants = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directionVariants[direction] }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Sticky scroll container for scrollytelling
interface StickyScrollProps {
  children: ReactNode;
  contentHeight?: string;
  className?: string;
}

export function StickyScroll({ 
  children, 
  contentHeight = "300vh",
  className = "" 
}: StickyScrollProps) {
  return (
    <div className={`relative ${className}`} style={{ height: contentHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// Reveal text word by word
interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function RevealText({ text, className = "", delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: delay + i * 0.05, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// Counter animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isInView ? (
          <CountUp end={value} duration={duration} />
        ) : (
          "0"
        )}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// Simple count up animation
function CountUp({ end, duration }: { end: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const current = Math.floor(easeProgress * end);
      
      if (ref.current) {
        ref.current.textContent = current.toLocaleString();
      }
      
      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else if (ref.current) {
        ref.current.textContent = end.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [end, duration]);
  
  return <span ref={ref}>0</span>;
}

import { useEffect } from "react";
