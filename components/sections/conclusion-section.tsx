"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { DeathCounter, InlineCounter } from "@/components/death-counter";
import { VictimProfile } from "@/components/victim-profile";
import { statistics } from "@/lib/data";
import { PresidentComparison } from "@/components/charts/president-comparison";

export function ConclusionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="relative bg-background py-24">
      {/* Final death counter - full impact */}
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="text-center px-6"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-8">
            THE TOTAL COST
          </p>
          <DeathCounter
            value={statistics.totalDeathsSince1990}
            label="Documented Homicides"
            sublabel="1990-2026 | Mexico"
            size="xl"
            duration={5}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-muted-foreground mt-8 max-w-xl mx-auto"
          >
            Every number is a person who was killed. A family torn apart. A neighborhood that will never feel safe again.
          </motion.p>
        </motion.div>
      </div>

      {/* Comparison chart */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-card border border-border p-6 md:p-8"
        >
          <h3 className="font-serif text-2xl text-foreground mb-2">
            Deaths by Presidential Administration
          </h3>
          <p className="text-muted-foreground mb-6">
            Total homicides during each six-year term
          </p>
          <PresidentComparison height={400} metric="total" />
        </motion.div>
      </div>

      {/* The question with memorial image */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-video bg-muted border border-border overflow-hidden photo-frame">
              <Image
                src="/images/memorial-candles.jpg"
                alt="Memorial vigil for victims of Mexico's drug war"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full"
                quality={75}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Vigils across Mexico remember those killed. Each candle is someone who won&apos;t come home.
            </p>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8">
              El Mencho is dead.<br />
              But the war continues.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Victim Profile - Make it personal */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12"
        >
          <p className="font-mono text-primary text-sm tracking-widest mb-4 text-center">
            BEHIND THE NUMBERS
          </p>
          <h3 className="font-serif text-3xl text-center text-foreground mb-12">
            One Face, Half a Million Stories
          </h3>
        </motion.div>
        
        <VictimProfile
          name="Javier Morales"
          age={28}
          location="Monterrey, Nuevo León"
          date="March 2018"
          story="He was a teacher. He had a wife and two kids. He drove a taxi at night to pay for his daughter's schooling. He was shot three times in the back of his car. They never found out why. They never found who did it."
          impact="His family never got justice. His children grew up without a father. His death is one number in thousands. But to them, he was everything."
        />
      </div>

      {/* What comes next */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-8"
        >
          <p className="text-xl text-foreground leading-relaxed">
            If history is any guide, killing El Mencho won&apos;t stop anything. 
            When a leader dies, the organization breaks apart and the fighting gets worse.
          </p>
          <p className="text-xl text-foreground leading-relaxed">
            His sons are still out there. So are his lieutenants. CJNG operates in dozens of countries. 
            Americans keep buying fentanyl.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The real question isn&apos;t whether the violence will stop. It&apos;s: 
            what choices will the next generation of leaders make?
          </p>
        </motion.div>
      </div>

      {/* Additional statistics */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-card border border-border">
            <p className="font-mono text-4xl text-primary font-bold">
              <InlineCounter value={115000} suffix="+" />
            </p>
            <p className="text-foreground mt-2">Missing Persons</p>
            <p className="text-muted-foreground text-sm">Officially registered</p>
          </div>
          <div className="text-center p-6 bg-card border border-border">
            <p className="font-mono text-4xl text-foreground font-bold">
              <InlineCounter value={2000} suffix="+" />
            </p>
            <p className="text-foreground mt-2">Clandestine Graves</p>
            <p className="text-muted-foreground text-sm">Discovered since 2006</p>
          </div>
          <div className="text-center p-6 bg-card border border-border">
            <p className="font-mono text-4xl text-foreground font-bold">99%</p>
            <p className="text-foreground mt-2">Impunity Rate</p>
            <p className="text-muted-foreground text-sm">Crimes unsolved</p>
          </div>
        </motion.div>
      </div>

      {/* Sources and methodology */}
      <div className="max-w-4xl mx-auto px-6 py-16 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h3 className="font-serif text-xl text-foreground mb-4">
            Sources & Methodology
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Primary data source:</strong> INEGI (Instituto Nacional de 
              Estadística y Geografía) - Official Mexican government statistics
            </p>
            <p>
              <strong>Supplementary sources:</strong> World Bank, RNPED (Registro 
              Nacional de Personas Desaparecidas), academic research
            </p>
            <p>
              <strong>Note:</strong> Actual death tolls are likely higher due to 
              unreported deaths, undiscovered mass graves, and missing persons 
              never found.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-serif text-xl text-foreground">
              El Precio del Poder
            </p>
            <p className="text-sm text-muted-foreground">
              A data journalism project | CPSC 481
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Data visualization and interactive storytelling
          </p>
        </div>
      </footer>
    </section>
  );
}
