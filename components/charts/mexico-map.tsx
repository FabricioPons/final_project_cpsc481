"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Mexico from "@svg-maps/mexico";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

// Highlight state codes mapping
const codeToStateName: Record<string, string> = {
  MIC: "Michoacán",
  SIN: "Sinaloa",
  CHH: "Chihuahua",
  TAM: "Tamaulipas",
  GRO: "Guerrero",
  JAL: "Jalisco",
  COL: "Colima",
  GUA: "Guanajuato",
  ZAC: "Zacatecas",
  BCN: "Baja California",
  SON: "Sonora",
};

export function MexicoMap({
  title = "Violence Across Mexico",
  subtitle = "Homicide rates per 100,000 population (2023)",
  highlightStates = [],
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const highlightNames = highlightStates.map(code => codeToStateName[code] || code);

  const getStateData = (name: string) => stateHomicideData.find(s => s.name === name);

  const getStateColor = (name: string) => {
    const data = getStateData(name);
    if (!data) return "#1a1a1a";
    if (highlightNames.length > 0 && !highlightNames.includes(name)) return "#151515";
    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const legendItems = [
    { label: "Low (<10)", color: "#1a3d1a" },
    { label: "Medium (10-25)", color: "#5c4a28" },
    { label: "High (25-45)", color: "#8b5a2b" },
    { label: "Extreme (>45)", color: "#a02c2c" },
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
          <div
            className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl p-6 overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            {/* Accurate Mexico SVG Map */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={Mexico.viewBox}
              className="w-full h-auto"
              style={{ minHeight: "400px" }}
              aria-label={Mexico.label}
            >
              <defs>
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c1222" />
                  <stop offset="100%" stopColor="#0a0f1a" />
                </linearGradient>
                <filter id="stateGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
                </filter>
              </defs>

              {/* Background */}
              <rect x="-50" y="-50" width="1200" height="900" fill="url(#oceanGrad)" />

              {/* Mexico States from @svg-maps/mexico */}
              {Mexico.locations.map((location, index) => {
                const stateName = idToStateName[location.id] || location.name;
                const isHovered = hoveredState === stateName;
                const fillColor = getStateColor(stateName);

                return (
                  <motion.path
                    key={location.id}
                    id={location.id}
                    name={location.name}
                    d={location.path}
                    fill={fillColor}
                    stroke={isHovered ? "#c9a84c" : "#3a3a3a"}
                    strokeWidth={isHovered ? 2 : 0.5}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.03,
                      ease: "easeOut"
                    }}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      cursor: "pointer",
                      filter: isHovered ? "url(#stateGlow)" : "none",
                      transformOrigin: "center",
                    }}
                    className="transition-colors duration-200"
                  />
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-50 pointer-events-none"
                style={{
                  left: Math.min(tooltipPos.x + 15, 400),
                  top: Math.max(tooltipPos.y - 10, 10)
                }}
              >
                <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg p-4 shadow-2xl min-w-[220px]">
                  {(() => {
                    const data = getStateData(hoveredState);
                    if (!data) return <p className="text-foreground font-serif text-lg">{hoveredState}</p>;
                    return (
                      <>
                        <p className="font-serif text-lg font-semibold border-b border-border pb-2 mb-3 text-foreground">
                          {data.name}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Homicide Rate:</span>
                            <span className="text-primary font-mono font-bold text-lg">{data.homicideRate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Deaths:</span>
                            <span className="font-mono text-foreground">{data.totalHomicides.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Violence Level:</span>
                            <span className={`font-semibold px-2 py-0.5 rounded text-xs uppercase ${
                              data.violenceLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                              data.violenceLevel === "high" ? "bg-orange-500/20 text-orange-400" :
                              data.violenceLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {data.violenceLevel}
                            </span>
                          </div>
                          {data.cartelPresence.length > 0 && (
                            <div className="pt-2 border-t border-border mt-2">
                              <p className="text-xs text-muted-foreground mb-1.5">Active Cartels:</p>
                              <div className="flex flex-wrap gap-1">
                                {data.cartelPresence.map(cartel => (
                                  <span
                                    key={cartel}
                                    className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded"
                                  >
                                    {cartel}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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

            {/* Source Attribution */}
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
              Source: INEGI 2023
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
