"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CartelTimeline } from "@/components/charts/cartel-timeline";
import { PresidentComparison } from "@/components/charts/president-comparison";
import { HomicideTimeline } from "@/components/charts/homicide-timeline";

type ChartView = "timeline" | "comparison" | "cartels";

export function DataExplorationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [activeView, setActiveView] = useState<ChartView>("timeline");

  return (
    <section ref={ref} className="relative bg-muted/20 py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            EXPLORE THE DATA
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            Interactive Analysis
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore different visualizations of the data to understand the 
            patterns and relationships behind the violence.
          </p>
        </motion.div>

        {/* View selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { id: "timeline" as const, label: "Homicide Timeline" },
            { id: "comparison" as const, label: "By President" },
            { id: "cartels" as const, label: "Cartel Evolution" },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-6 py-3 font-mono text-sm transition-all ${
                activeView === view.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {view.label}
            </button>
          ))}
        </motion.div>

        {/* Chart container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card border border-border p-6 md:p-8 min-h-[500px]"
        >
          {activeView === "timeline" && (
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Annual Homicides in Mexico
              </h3>
              <p className="text-muted-foreground mb-6">
                1990-2026 | Hover over the chart for details
              </p>
              <HomicideTimeline height={400} showAnnotations={true} />
            </div>
          )}

          {activeView === "comparison" && (
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Total Deaths by Administration
              </h3>
              <p className="text-muted-foreground mb-6">
                Comparing the human cost of each presidency
              </p>
              <PresidentComparison height={400} metric="total" />
            </div>
          )}

          {activeView === "cartels" && (
            <div>
              <h3 className="font-serif text-2xl text-foreground mb-2">
                Cartel Evolution
              </h3>
              <p className="text-muted-foreground mb-6">
                How criminal organizations have risen, fallen, and transformed
              </p>
              <CartelTimeline />
            </div>
          )}
        </motion.div>

        {/* Insights callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-card border border-border p-6">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY INSIGHT
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              The Calderón Effect
            </h4>
            <p className="text-sm text-muted-foreground">
              Violence more than doubled during Calderón&apos;s militarized approach, 
              setting a baseline that subsequent administrations struggled to reduce.
            </p>
          </div>
          <div className="bg-card border border-border p-6">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY INSIGHT
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              Cartel Fragmentation
            </h4>
            <p className="text-sm text-muted-foreground">
              When major cartels are &ldquo;decapitated,&rdquo; they don&apos;t disappear. 
              They fracture into smaller, often more violent groups competing for territory.
            </p>
          </div>
          <div className="bg-card border border-border p-6">
            <p className="font-mono text-primary text-xs tracking-wider mb-2">
              KEY INSIGHT
            </p>
            <h4 className="font-serif text-lg text-foreground mb-2">
              CJNG Dominance
            </h4>
            <p className="text-sm text-muted-foreground">
              CJNG&apos;s rise coincides with El Chapo&apos;s decline, showing how capturing 
              leaders doesn&apos;t eliminate demand—it just shifts power.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
