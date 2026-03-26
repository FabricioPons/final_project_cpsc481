"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { presidents } from "@/lib/data";
import { PresidentCard } from "@/components/president-card";
import { HomicideTimeline } from "@/components/charts/homicide-timeline";
import { DeathCounter } from "@/components/death-counter";

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative bg-background py-24">
      {/* Section intro */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            SIX ADMINISTRATIONS
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            The Cost of Each Decision
          </h2>
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            From 1988 to 2024, six presidents made choices that shaped the trajectory 
            of violence in Mexico. Each administration left its mark—measured in lives.
          </p>
        </motion.div>
      </div>

      {/* Main timeline chart */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card border border-border p-6 md:p-8"
        >
          <h3 className="font-serif text-2xl text-foreground mb-2">
            Annual Homicides in Mexico
          </h3>
          <p className="text-muted-foreground mb-6">
            1990-2026 | Source: INEGI, Mexican Government Statistics
          </p>
          <HomicideTimeline height={450} showAnnotations={true} />
        </motion.div>
      </div>

      {/* Death counter highlight */}
      <div className="py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <DeathCounter
          label="Lives Lost Since 1990"
          sublabel="Intentional homicides recorded in Mexico"
          size="xl"
          duration={4}
        />
      </div>

      {/* Presidential cards */}
      <div className="max-w-4xl mx-auto px-6 mt-24">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-serif text-3xl text-foreground mb-12 text-center"
        >
          The Presidents
        </motion.h3>

        <div className="space-y-8">
          {presidents.slice(0, -1).map((president, index) => (
            <PresidentCard
              key={president.id}
              president={president}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
