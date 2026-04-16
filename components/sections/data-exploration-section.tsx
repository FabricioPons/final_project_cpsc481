"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MexicoMap } from "@/components/charts/mexico-map";
import { WorldComparisonMap } from "@/components/charts/world-map";
import { AnalyticsDashboard } from "@/components/charts/analytics-dashboard";

export function DataExplorationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-muted/10 to-background py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            DATA ANALYSIS
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            The Numbers Tell a Story
          </h2>
          <p className="text-muted-foreground mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
            Explore comprehensive data visualizations that reveal the patterns, 
            trends, and human cost of Mexico&apos;s drug war across three decades.
          </p>
        </motion.div>

        {/* Interactive Mexico Map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <MexicoMap 
            title="State-Level Violence Analysis"
            subtitle="Hover over any state to explore homicide rates, cartel presence, and regional trends (2023-2024 INEGI data)"
          />
        </motion.div>

        {/* World Comparison Map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <WorldComparisonMap />
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnalyticsDashboard />
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          <div className="bg-card/50 backdrop-blur border border-border p-6 rounded-xl">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY FINDING
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              The Calderón Inflection
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Violence more than doubled during Calderón&apos;s militarized approach, 
              setting a baseline that subsequent administrations struggled to reduce.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur border border-border p-6 rounded-xl">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY FINDING
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              Fentanyl Explosion
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DEA fentanyl seizures increased 5,367% from 2018-2024, showing how 
              cartels shifted to deadlier and more profitable synthetic drugs.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur border border-border p-6 rounded-xl">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY FINDING
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              CJNG Dominance
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CJNG now controls 35% of territory and operates in 50+ countries, 
              surpassing even El Chapo&apos;s Sinaloa Cartel at its peak.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
