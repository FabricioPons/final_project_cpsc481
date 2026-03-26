"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { President } from "@/lib/data";

interface PresidentCardProps {
  president: President;
  index: number;
}

export function PresidentCard({ president, index }: PresidentCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const partyColors: Record<string, string> = {
    PRI: "border-red-800 bg-red-950/30",
    PAN: "border-blue-800 bg-blue-950/30",
    MORENA: "border-amber-800 bg-amber-950/30",
  };

  const partyTextColors: Record<string, string> = {
    PRI: "text-red-500",
    PAN: "text-blue-500",
    MORENA: "text-amber-500",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`border ${partyColors[president.party]} p-6 md:p-8`}
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Photo */}
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="aspect-[3/4] bg-muted relative overflow-hidden border border-border photo-frame">
            <Image
              src={president.imageUrl}
              alt={`${president.name} - President of Mexico (${president.years})`}
              fill
              className="object-cover w-full h-full"
              quality={75}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div>
            <p className="font-mono text-primary text-sm tracking-wider">
              {president.years}
            </p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mt-1">
              {president.name}
            </h3>
            <p className={`text-sm ${partyTextColors[president.party]} font-medium`}>
              {president.party}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Deaths
              </p>
              <p className="font-mono text-xl text-primary font-bold">
                {president.totalHomicides.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Avg/Year
              </p>
              <p className="font-mono text-xl text-foreground">
                {president.avgPerYear.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Peak Year
              </p>
              <p className="font-mono text-xl text-foreground">
                {president.peakYear}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Change
              </p>
              <p
                className={`font-mono text-xl font-bold ${
                  president.changeFromPrevious.startsWith("+")
                    ? "text-red-500"
                    : president.changeFromPrevious.startsWith("-")
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              >
                {president.changeFromPrevious}
              </p>
            </div>
          </div>

          {/* Key info */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Key Policy
              </p>
              <p className="text-foreground">{president.keyPolicy}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Key Event
              </p>
              <p className="text-foreground">{president.keyEvent}</p>
            </div>
            {president.quote && (
              <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground mt-4">
                &ldquo;{president.quote}&rdquo;
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
