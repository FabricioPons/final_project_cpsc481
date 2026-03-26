"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cartels } from "@/lib/data";

export function CartelTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Timeline spans 1980-2026
  const startYear = 1980;
  const endYear = 2026;
  const totalYears = endYear - startYear;

  const cartelData = [
    {
      name: "Guadalajara Cartel",
      start: 1980,
      end: 1989,
      color: "#7f1d1d",
      note: "Fragmented into Sinaloa, Tijuana, Juárez",
    },
    {
      name: "Gulf Cartel",
      start: 1984,
      end: 2026,
      color: "#991b1b",
      note: "Weakened after Zetas split",
    },
    {
      name: "Sinaloa Cartel",
      start: 1989,
      end: 2026,
      color: "#8b0000",
      note: "El Chapo era ends 2016",
    },
    {
      name: "Juárez Cartel",
      start: 1989,
      end: 2012,
      color: "#b91c1c",
      note: "Declined after Amado's death",
    },
    {
      name: "Tijuana Cartel",
      start: 1989,
      end: 2008,
      color: "#dc2626",
      note: "Arellano Félix brothers",
    },
    {
      name: "Los Zetas",
      start: 2010,
      end: 2018,
      color: "#450a0a",
      note: "Former Gulf enforcers",
    },
    {
      name: "La Familia Michoacana",
      start: 2006,
      end: 2011,
      color: "#7c2d12",
      note: "Became Knights Templar",
    },
    {
      name: "Knights Templar",
      start: 2011,
      end: 2017,
      color: "#92400e",
      note: "Michoacán-based",
    },
    {
      name: "CJNG",
      start: 2010,
      end: 2026,
      color: "#dc2626",
      note: "Now dominant cartel",
    },
  ];

  const getPosition = (year: number) => {
    return ((year - startYear) / totalYears) * 100;
  };

  const getWidth = (start: number, end: number) => {
    return ((end - start) / totalYears) * 100;
  };

  return (
    <div ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Year axis */}
        <div className="relative h-8 mb-4">
          {[1980, 1990, 2000, 2010, 2020].map((year) => (
            <div
              key={year}
              className="absolute text-xs text-muted-foreground font-mono"
              style={{ left: `${getPosition(year)}%`, transform: "translateX(-50%)" }}
            >
              {year}
            </div>
          ))}
        </div>

        {/* Cartel bars */}
        <div className="space-y-3">
          {cartelData.map((cartel, index) => (
            <motion.div
              key={cartel.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-10 flex items-center"
            >
              {/* Label */}
              <div className="absolute right-full mr-4 w-40 text-right hidden md:block">
                <span className="text-sm text-foreground">{cartel.name}</span>
              </div>

              {/* Bar container */}
              <div className="w-full h-full relative bg-muted/30 rounded">
                {/* Bar */}
                <motion.div
                  className="absolute h-full rounded flex items-center px-2"
                  style={{
                    left: `${getPosition(cartel.start)}%`,
                    width: `${getWidth(cartel.start, cartel.end)}%`,
                    backgroundColor: cartel.color,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-xs text-white truncate md:hidden">
                    {cartel.name}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key events markers */}
        <div className="relative h-12 mt-4 border-t border-border pt-2">
          {[
            { year: 1989, label: "Guadalajara splits" },
            { year: 2006, label: "War begins" },
            { year: 2010, label: "CJNG founded" },
            { year: 2016, label: "El Chapo captured" },
            { year: 2026, label: "El Mencho dies" },
          ].map((event) => (
            <div
              key={event.year}
              className="absolute flex flex-col items-center"
              style={{ left: `${getPosition(event.year)}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-[2px] h-3 bg-primary" />
              <span className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">
                {event.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
