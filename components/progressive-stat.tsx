"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ProgressiveStatProps {
  initialStat: {
    label: string;
    value: string | number;
    description: string;
  };
  revealSteps: Array<{
    label: string;
    value: string | number;
    description: string;
  }>;
}

export function ProgressiveStat({ initialStat, revealSteps }: ProgressiveStatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const allSteps = [initialStat, ...revealSteps];

  return (
    <div ref={ref} className="space-y-8">
      {allSteps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.3, duration: 0.6 }}
          className="bg-card border border-border p-8 rounded-lg"
        >
          <motion.div
            className="space-y-4"
            initial={{ scale: 0.9 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.3 + 0.1, duration: 0.4 }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{step.label}</p>
            <motion.div
              className="text-4xl md:text-5xl font-bold font-mono text-primary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.3 + 0.2, duration: 0.4 }}
            >
              {typeof step.value === "number" ? step.value.toLocaleString() : step.value}
            </motion.div>
            <p className="text-foreground leading-relaxed max-w-2xl">{step.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
