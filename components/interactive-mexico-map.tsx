"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stateHomicideData } from "@/lib/data";
import { X } from "lucide-react";

export function InteractiveMexicoMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const selected = selectedState
    ? stateHomicideData.find((s) => s.code === selectedState)
    : null;

  const getColorByRate = (rate: number) => {
    if (rate < 10) return "#2d5016"; // Low - dark green
    if (rate < 20) return "#6b8e23"; // Medium - olive
    if (rate < 40) return "#c9a84c"; // High - amber
    return "#8b0000"; // Extreme - dark red
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <motion.div className="md:col-span-2 space-y-4">
        <svg
          viewBox="0 0 600 400"
          className="w-full border border-primary/20 rounded-lg bg-card p-4"
        >
          {/* Simplified Mexico map with clickable regions */}
          {stateHomicideData.map((state) => (
            <g key={state.code}>
              <motion.circle
                cx={Math.random() * 550 + 25}
                cy={Math.random() * 350 + 25}
                r="18"
                fill={getColorByRate(state.homicideRate)}
                stroke={hoveredState === state.code ? "#c9a84c" : "#fff"}
                strokeWidth={hoveredState === state.code ? "2" : "1"}
                onMouseEnter={() => setHoveredState(state.code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => setSelectedState(state.code)}
                className="cursor-pointer transition-all"
                whileHover={{ scale: 1.3, filter: "drop-shadow(0 0 8px #c9a84c)" }}
                whileTap={{ scale: 0.95 }}
              />
              <text
                x={Math.random() * 550 + 25}
                y={Math.random() * 350 + 30}
                textAnchor="middle"
                className="text-xs font-bold fill-foreground pointer-events-none"
              >
                {state.code}
              </text>
            </g>
          ))}
        </svg>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2d5016" }} />
            <span className="text-muted-foreground">Low (0-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6b8e23" }} />
            <span className="text-muted-foreground">Medium (10-20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#c9a84c" }} />
            <span className="text-muted-foreground">High (20-40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8b0000" }} />
            <span className="text-muted-foreground">Extreme (40+)</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Click on a state to see details. Each bubble represents a state colored by homicide rate per 100,000 population.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.code}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-card border border-border p-6 rounded-lg space-y-6 h-fit sticky top-32"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl text-foreground">{selected.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">State {selected.code}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedState(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Homicide Rate</p>
                <p className="text-3xl font-bold font-mono text-primary mt-1">
                  {selected.homicideRate.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per 100,000 population</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Deaths</p>
                <p className="text-2xl font-bold font-mono text-primary mt-1">
                  {selected.totalHomicides.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Violence Level</p>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{
                  backgroundColor: getColorByRate(selected.homicideRate) + "30",
                  color: getColorByRate(selected.homicideRate),
                  border: `1px solid ${getColorByRate(selected.homicideRate)}`
                }}>
                  {selected.violenceLevel.toUpperCase()}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Cartel Presence</p>
                <div className="flex flex-wrap gap-2">
                  {selected.cartelPresence.length > 0 ? (
                    selected.cartelPresence.map((cartel) => (
                      <span key={cartel} className="text-xs bg-primary/10 border border-primary/20 px-2 py-1 rounded">
                        {cartel}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Minimal cartel presence</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border/50 p-6 rounded-lg h-fit sticky top-32 text-center"
          >
            <p className="text-muted-foreground italic">
              Click on a state bubble to explore detailed statistics and cartel presence information.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
