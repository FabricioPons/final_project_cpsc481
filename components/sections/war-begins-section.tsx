"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MexicoMap } from "@/components/charts/mexico-map";
import { InlineCounter } from "@/components/death-counter";

export function WarBeginsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-background py-24">
      {/* Background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        style={{ opacity }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            DECEMBER 11, 2006
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            The War Begins
          </h2>
          <p className="text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
            Ten days after taking office, President Felipe Calderón deployed{" "}
            <span className="text-primary font-mono">6,500 troops</span> to his home state 
            of Michoacán. He called it &ldquo;Operation Michoacán.&rdquo;
          </p>
        </motion.div>

        {/* Split content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Military operations image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video bg-muted border border-border overflow-hidden photo-frame">
              <Image
                src="/images/military-silhouette.jpg"
                alt="Mexican military deployment during Calderón's drug war"
                fill
                className="object-cover w-full h-full"
                quality={75}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Mexican military operations expanded dramatically under Calderón&apos;s &ldquo;Kingpin Strategy,&rdquo;
              leading to an unprecedented surge in violence and civilian casualties.
            </p>
          </motion.div>

          {/* Right: The story and map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground leading-relaxed">
              Calderón&apos;s strategy was called the <span className="text-primary font-semibold">
              &ldquo;Kingpin Strategy&rdquo;</span>—target cartel leaders, fragment the 
              organizations, and the violence would end.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              It did the opposite.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              By decapitating cartels, the government created power vacuums. 
              Organizations splintered. New groups formed. And they fought each 
              other—and civilians—for control.
            </p>

            <div className="bg-card border border-border p-6 mt-8">
              <h4 className="font-serif text-xl text-foreground mb-4">
                The Numbers Tell the Story
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    2006 Homicides
                  </p>
                  <p className="font-mono text-2xl text-foreground">11,806</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    2011 Homicides
                  </p>
                  <p className="font-mono text-2xl text-primary">27,213</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Increase
                  </p>
                  <p className="font-mono text-3xl text-red-500 font-bold">+130%</p>
                </div>
              </div>
            </div>

            <blockquote className="border-l-4 border-primary pl-6 py-2 mt-8">
              <p className="text-xl italic text-foreground">
                &ldquo;We will not rest until we restore peace and security to Mexican families.&rdquo;
              </p>
              <cite className="text-muted-foreground mt-2 block">
                — Felipe Calderón, 2006
              </cite>
            </blockquote>
          </motion.div>
        </div>

        {/* Full-width Mexico map below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24"
        >
          <MexicoMap
            title="Violence Hotspots by 2012"
            subtitle="States with highest cartel activity during Calderón era"
            highlightStates={["MIC", "SIN", "CHH", "TAM", "GRO", "JAL"]}
          />
        </motion.div>

        {/* Consequence callout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="bg-destructive/20 border border-destructive p-8 md:p-12 max-w-3xl mx-auto">
            <p className="font-mono text-primary text-sm tracking-widest mb-4">
              THE COST OF THE CALDERÓN ERA
            </p>
            <p className="font-mono text-5xl md:text-6xl text-primary font-bold">
              <InlineCounter value={121000} />
            </p>
            <p className="text-xl text-foreground mt-4">
              lives lost during his six-year term
            </p>
            <p className="text-muted-foreground mt-2">
              More than double the previous administration
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
