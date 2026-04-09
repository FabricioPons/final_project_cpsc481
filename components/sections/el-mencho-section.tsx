"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { elMenchoTimeline } from "@/lib/data";

export function ElMenchoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen bg-background py-24 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4">
            THE END
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
            Nemesio Oseguera Cervantes
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mt-4">
            &ldquo;El Mencho&rdquo; — 1966-2026
          </p>
        </motion.div>

        {/* Photo placeholder and bio */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Photo area */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-muted border border-border relative overflow-hidden photo-frame">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/el-mencho-3koIiTFsSCWlOkODgWbuoz1DgHUjMR.png"
                alt="El Mencho - Nemesio Oseguera Cervantes - DEA Wanted Photo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top w-full h-full"
                priority
              />
              {/* Border accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </div>
            
            {/* Caption */}
            <p className="text-sm text-muted-foreground mt-4 italic">
              Nemesio Oseguera Cervantes (1966-2026). El Mencho evaded capture for over a decade. 
              He died from kidney failure while on the run.
            </p>
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground leading-relaxed">
              He built the <span className="text-primary font-semibold">Jalisco New Generation Cartel (CJNG)</span> into 
              the most powerful criminal organization in the Western Hemisphere.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Under his leadership, CJNG expanded to <span className="text-primary font-mono">35 Mexican states</span> and{" "}
              <span className="text-primary font-mono">50+ countries</span> worldwide.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              His cartel was responsible for thousands of deaths, mass disappearances, 
              and the flooding of fentanyl into the United States.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              But El Mencho was not the cause of Mexico&apos;s violence. He was a symptom—
              the inevitable product of decades of failed policy.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          <h3 className="font-serif text-2xl text-foreground mb-8 text-center">
            The Rise and Fall
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-border transform md:-translate-x-1/2" />
            
            {/* Timeline events */}
            <div className="space-y-8">
              {elMenchoTimeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className={`relative pl-8 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"
                  }`}
                >
                  {/* Dot */}
                  <div
                    className={`absolute w-3 h-3 bg-primary rounded-full top-1.5 left-0 md:left-1/2 transform md:-translate-x-1/2 ${
                      item.year === 2026 ? "ring-4 ring-primary/30" : ""
                    }`}
                  />
                  
                  {/* Content */}
                  <div className={`${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <span className="font-mono text-primary text-sm">
                      {item.year}
                    </span>
                    <p className="text-foreground mt-1">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transition text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-24 text-center"
        >
          <p className="text-2xl md:text-3xl text-foreground font-serif leading-relaxed max-w-2xl mx-auto">
            To understand how a man from rural Michoacán became the world&apos;s most 
            dangerous drug lord, we must go back to the beginning.
          </p>
          <p className="text-xl text-muted-foreground mt-8">
            Back to the decisions that created this war.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
