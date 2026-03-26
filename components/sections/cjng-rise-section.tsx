"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { InlineCounter } from "@/components/death-counter";
import { cartels } from "@/lib/data";

export function CJNGRiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const cjng = cartels.find((c) => c.name === "CJNG")!;

  return (
    <section ref={ref} className="relative min-h-screen bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            2010-2024
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            The Rise of CJNG
          </h2>
          <p className="text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
            From the ashes of the Milenio Cartel, a new monster emerged—one that would 
            surpass even the legendary Sinaloa Cartel in reach and brutality.
          </p>
        </motion.div>

        {/* CJNG Stats Grid with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-video bg-muted border border-border overflow-hidden photo-frame">
              <Image
                src="/images/cartel-infographic.jpg"
                alt="CJNG cartel network and organizational structure"
                fill
                className="object-cover w-full h-full"
                quality={75}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              CJNG's sophisticated network spans 35 Mexican states and 50+ countries worldwide,
              making it the most powerful criminal organization in the Western Hemisphere.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card border border-primary/50 p-8 text-center">
              <p className="font-mono text-5xl md:text-6xl text-primary font-bold">
                <InlineCounter value={35} suffix="+" />
              </p>
              <p className="text-foreground mt-2">Mexican States</p>
              <p className="text-muted-foreground text-sm">Active presence</p>
            </div>
            <div className="bg-card border border-border p-8 text-center">
              <p className="font-mono text-5xl md:text-6xl text-primary font-bold">
                <InlineCounter value={50} suffix="+" />
              </p>
              <p className="text-foreground mt-2">Countries</p>
              <p className="text-muted-foreground text-sm">Global operations</p>
            </div>
            <div className="bg-card border border-border p-8 text-center">
              <p className="font-mono text-5xl md:text-6xl text-foreground font-bold">
                $10M
              </p>
              <p className="text-foreground mt-2">DEA Bounty</p>
              <p className="text-muted-foreground text-sm">For El Mencho</p>
            </div>
          </motion.div>
        </div>

        {/* Timeline of CJNG Rise */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-card border border-border p-8 md:p-12"
        >
          <h3 className="font-serif text-2xl text-foreground mb-8">
            How CJNG Became the Most Powerful Cartel
          </h3>

          <div className="space-y-8">
            {[
              {
                year: "2010",
                title: "Birth from Chaos",
                description:
                  "When the Milenio Cartel fractured, El Mencho and his allies formed CJNG. They started as a vigilante group claiming to protect Jalisco from Los Zetas.",
              },
              {
                year: "2011",
                title: "Rapid Expansion",
                description:
                  "El Mencho takes full control. CJNG begins aggressive territorial expansion, challenging Sinaloa and Knights Templar cartels.",
              },
              {
                year: "2015",
                title: "Show of Force",
                description:
                  "CJNG shoots down a military helicopter—the first time a cartel has done so. They demonstrate military-grade capabilities.",
              },
              {
                year: "2016-2018",
                title: "Power Vacuum",
                description:
                  "El Chapo's final capture and extradition weakens Sinaloa. CJNG fills the void, becoming the dominant force in Mexican drug trafficking.",
              },
              {
                year: "2019-2024",
                title: "Fentanyl Empire",
                description:
                  "CJNG becomes the primary supplier of fentanyl to the United States. Deaths from fentanyl overdoses in the US skyrocket.",
              },
            ].map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <span className="font-mono text-primary font-bold">
                    {event.year}
                  </span>
                </div>
                <div className="border-l-2 border-border pl-6 pb-2">
                  <h4 className="font-serif text-xl text-foreground">
                    {event.title}
                  </h4>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <blockquote className="max-w-3xl mx-auto">
            <p className="font-serif text-2xl md:text-3xl text-foreground italic leading-relaxed">
              &ldquo;CJNG is not just a cartel. It is a parallel state with its own 
              army, its own territory, and its own economy.&rdquo;
            </p>
            <cite className="text-muted-foreground mt-4 block">
              — Security analyst, 2023
            </cite>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
