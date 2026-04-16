"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface VictimProfileProps {
  name: string;
  age: number;
  location: string;
  date: string;
  story: string;
  impact: string;
}

export function VictimProfile({
  name,
  age,
  location,
  date,
  story,
  impact,
}: VictimProfileProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="max-w-3xl mx-auto"
    >
      <div className="border-l-4 border-primary pl-8 space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-2"
        >
          <h3 className="font-serif text-4xl text-foreground">{name}</h3>
          <p className="text-lg text-muted-foreground">
            {age} years old, {location}
          </p>
          <p className="text-sm text-primary font-mono">{date}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg leading-relaxed text-foreground italic"
        >
          "{story}"
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-primary/10 border border-primary/20 p-6 rounded-lg"
        >
          <p className="text-foreground leading-relaxed">{impact}</p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center text-sm text-muted-foreground mt-8 italic"
      >
        One of over 500,000 lost to Mexico's war on drugs.
      </motion.p>
    </motion.div>
  );
}
