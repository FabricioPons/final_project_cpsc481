"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
      style={{ opacity, scale }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Blood drip effect at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y }}
      >
        {/* Date stamp */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-mono text-primary text-sm md:text-base tracking-widest mb-8"
        >
          FEBRUARY 22, 2026
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance"
        >
          <span className="text-primary">&ldquo;El Mencho&rdquo;</span> is dead.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-serif text-2xl md:text-3xl lg:text-4xl text-muted-foreground mt-6 leading-relaxed"
        >
          Mexico&apos;s most wanted drug lord.<br />
          The end of an era.
        </motion.p>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-24 h-[2px] bg-primary mx-auto mt-12"
        />

        {/* The hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-12 space-y-6"
        >
          <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed max-w-3xl mx-auto">
            But his death is not the end of the story.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            It is merely the latest chapter in a war that has claimed{" "}
            <span className="text-primary font-mono font-bold">over 500,000 lives</span>.
          </p>
        </motion.div>

        {/* The question */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-16"
        >
          <p className="font-serif text-3xl md:text-4xl text-foreground italic">
            How did we get here?
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-muted-foreground tracking-widest uppercase">
          Scroll to begin
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
