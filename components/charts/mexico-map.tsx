"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Mexico from "@svg-maps/mexico";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, MapPin, Skull, Users, AlertTriangle } from "lucide-react";

interface MexicoMapProps {
  title?: string;
  subtitle?: string;
  highlightStates?: string[];
}

// Map SVG-maps IDs to our state names
const idToStateName: Record<string, string> = {
  "aguascalientes": "Aguascalientes",
  "baja-california": "Baja California",
  "baja-california-sur": "Baja California Sur",
  "campeche": "Campeche",
  "chiapas": "Chiapas",
  "chihuahua": "Chihuahua",
  "coahuila": "Coahuila",
  "colima": "Colima",
  "durango": "Durango",
  "guanajuato": "Guanajuato",
  "guerrero": "Guerrero",
  "hidalgo": "Hidalgo",
  "jalisco": "Jalisco",
  "mexico": "México",
  "mexico-city": "Ciudad de México",
  "michoacan": "Michoacán",
  "morelos": "Morelos",
  "nayarit": "Nayarit",
  "nuevo-leon": "Nuevo León",
  "oaxaca": "Oaxaca",
  "puebla": "Puebla",
  "queretaro": "Querétaro",
  "quintana-roo": "Quintana Roo",
  "san-luis-potosi": "San Luis Potosí",
  "sinaloa": "Sinaloa",
  "sonora": "Sonora",
  "tabasco": "Tabasco",
  "tamaulipas": "Tamaulipas",
  "tlaxcala": "Tlaxcala",
  "veracruz": "Veracruz",
  "yucatan": "Yucatán",
  "zacatecas": "Zacatecas",
};

export function MexicoMap({
  title = "Violence Across Mexico",
  subtitle = "Click on any state to explore real stories and data",
  highlightStates = [],
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getStateData = (name: string) => stateHomicideData.find(s => s.name === name);
  const selectedData = selectedState ? getStateData(selectedState) : null;

  const getStateColor = (name: string) => {
    const data = getStateData(name);
    if (!data) return "#1a1a1a";
    if (selectedState && selectedState !== name) return "#151515";
    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleStateClick = (stateName: string) => {
    setSelectedState(selectedState === stateName ? null : stateName);
  };

  const legendItems = [
    { label: "Low (<10)", color: "#1a2e1a" },
    { label: "Medium (10-25)", color: "#4a3728" },
    { label: "High (25-45)", color: "#7d4e2e" },
    { label: "Extreme (>45)", color: "#8b2500" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <Card className="bg-card/50 backdrop-blur border-border overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map Container */}
            <div
              className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl p-4 lg:p-6 overflow-hidden"
              onMouseMove={handleMouseMove}
            >
              {/* Instruction overlay */}
              <AnimatePresence>
                {!selectedState && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full"
                  >
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Click any state to read its story
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Accurate Mexico SVG Map */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={Mexico.viewBox}
                className="w-full h-auto"
                style={{ minHeight: "350px" }}
                aria-label={Mexico.label}
              >
                <defs>
                  <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c1222" />
                    <stop offset="100%" stopColor="#0a0f1a" />
                  </linearGradient>
                  <filter id="stateGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background */}
                <rect x="-50" y="-50" width="1200" height="900" fill="url(#oceanGrad)" />

                {/* Mexico States from @svg-maps/mexico */}
                {Mexico.locations.map((location: { id: string; name: string; path: string }, index: number) => {
                  const stateName = idToStateName[location.id] || location.name;
                  const isHovered = hoveredState === stateName;
                  const isSelected = selectedState === stateName;
                  const fillColor = getStateColor(stateName);
                  const data = getStateData(stateName);
                  const hasStory = data?.story;

                  return (
                    <motion.path
                      key={location.id}
                      id={location.id}
                      name={location.name}
                      d={location.path}
                      fill={fillColor}
                      stroke={isSelected ? "#c9a84c" : isHovered ? "#c9a84c80" : "#3a3a3a"}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { 
                        opacity: 1, 
                        scale: isSelected ? 1.02 : 1,
                      } : {}}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.02,
                        ease: "easeOut"
                      }}
                      onMouseEnter={() => setHoveredState(stateName)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(stateName)}
                      style={{
                        cursor: hasStory ? "pointer" : "default",
                        filter: isSelected ? "url(#stateGlow)" : "none",
                        transformOrigin: "center",
                      }}
                      className="transition-colors duration-200"
                    />
                  );
                })}
              </svg>

              {/* Hover Tooltip (only when no state is selected) */}
              {hoveredState && !selectedState && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute z-50 pointer-events-none"
                  style={{
                    left: Math.min(tooltipPos.x + 15, 280),
                    top: Math.max(tooltipPos.y - 10, 10)
                  }}
                >
                  <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg p-3 shadow-2xl min-w-[180px]">
                    {(() => {
                      const data = getStateData(hoveredState);
                      if (!data) return <p className="text-foreground font-serif">{hoveredState}</p>;
                      return (
                        <>
                          <p className="font-serif font-semibold text-foreground">{data.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Rate: <span className="text-primary font-mono">{data.homicideRate}</span> per 100k
                          </p>
                          {data.story && (
                            <p className="text-xs text-primary mt-2">Click to read story</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md border border-border rounded-lg p-3 shadow-lg">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                  Homicides per 100k
                </p>
                <div className="space-y-1.5">
                  {legendItems.map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-4 h-3 rounded border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-foreground/80">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source */}
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
                Source: INEGI 2023
              </div>
            </div>

            {/* Story Panel */}
            <AnimatePresence mode="wait">
              {selectedData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="lg:w-[380px] bg-muted/30 border border-border rounded-xl p-6 relative"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedState(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-background/50 hover:bg-background transition-colors"
                    aria-label="Close panel"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {/* State name */}
                  <h3 className="font-serif text-2xl font-bold text-foreground pr-8">
                    {selectedData.name}
                  </h3>

                  {/* Violence badge */}
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded text-xs font-semibold uppercase ${
                    selectedData.violenceLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                    selectedData.violenceLevel === "high" ? "bg-orange-500/20 text-orange-400" :
                    selectedData.violenceLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    <AlertTriangle className="w-3 h-3" />
                    {selectedData.violenceLevel} violence
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <Skull className="w-4 h-4 mx-auto text-primary mb-1" />
                      <p className="font-mono text-xl font-bold text-primary">{selectedData.homicideRate}</p>
                      <p className="text-xs text-muted-foreground">per 100k</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 text-center">
                      <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                      <p className="font-mono text-xl font-bold text-foreground">{selectedData.totalHomicides.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">total deaths</p>
                    </div>
                  </div>

                  {/* Cartels */}
                  {selectedData.cartelPresence.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Active Cartels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedData.cartelPresence.map(cartel => (
                          <span
                            key={cartel}
                            className="text-xs bg-primary/15 text-primary px-2 py-1 rounded"
                          >
                            {cartel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Story */}
                  {selectedData.story && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="font-mono text-xs text-primary uppercase tracking-wider mb-2">
                        {selectedData.story.date}
                      </p>
                      <h4 className="font-serif text-lg font-semibold text-foreground leading-snug">
                        {selectedData.story.headline}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {selectedData.story.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-3 italic">
                        Source: {selectedData.story.source}
                      </p>
                    </div>
                  )}

                  {!selectedData.story && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground italic">
                        This state has lower levels of cartel-related violence. 
                        No major documented incidents to report.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Grid (shown when no state selected) */}
          <AnimatePresence>
            {!selectedState && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              >
                {[
                  {
                    value: stateHomicideData.filter(s => s.violenceLevel === "extreme").length,
                    label: "Extreme Violence States",
                    color: "text-red-400"
                  },
                  {
                    value: stateHomicideData.reduce((a, b) => a + b.totalHomicides, 0).toLocaleString(),
                    label: "Total Homicides (2023)",
                    color: "text-primary"
                  },
                  {
                    value: Math.max(...stateHomicideData.map(s => s.homicideRate)).toFixed(1),
                    label: "Highest Rate (Colima)",
                    color: "text-orange-400"
                  },
                  {
                    value: stateHomicideData.filter(s => s.cartelPresence.includes("CJNG")).length,
                    label: "States with CJNG",
                    color: "text-amber-400"
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center p-4 bg-muted/30 border border-border rounded-lg"
                  >
                    <p className={`font-mono text-2xl md:text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
