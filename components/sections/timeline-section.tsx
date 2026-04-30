"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { presidents } from "@/lib/data";
import { PresidentCard } from "@/components/president-card";
import { HomicideTimeline } from "@/components/charts/homicide-timeline";
import { DeathCounter } from "@/components/death-counter";
import { ProgressiveStat } from "@/components/progressive-stat";

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
            What Each President Left Behind
          </h2>
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Between 1988 and 2024, six Mexican presidents made decisions that changed the course 
            of the country. Each one left behind a different kind of legacy, counted in lives lost.
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

      {/* Progressive stat reveals */}
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-3xl text-foreground text-center"
        >
          The Toll of Inaction
        </motion.h3>
        <ProgressiveStat
          initialStat={{
            label: "Every 15 minutes in Mexico",
            value: "1 person",
            description: "Someone is killed. Right now, at this exact moment, the violence continues.",
          }}
          revealSteps={[
            {
              label: "Each day",
              value: "96 people",
              description: "Almost one hundred lives lost every single day for the past 34 years.",
            },
            {
              label: "Each year",
              value: "35,000+",
              description: "The scale is almost incomprehensible. That's larger than most cities.",
            },
            {
              label: "Since 1990",
              value: "517,589",
              description: "Over half a million confirmed homicides. The actual number may be higher when accounting for missing persons.",
            },
          ]}
        />
      </div>

      {/* Death counter highlight */}
      <div className="py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <DeathCounter
          label="People Killed Since 1990"
          sublabel="Homicides recorded in Mexico"
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
