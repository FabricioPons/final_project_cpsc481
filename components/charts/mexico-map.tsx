"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MexicoMapProps {
  title?: string;
  subtitle?: string;
  highlightStates?: string[];
}

// Pre-calculated SVG paths for Mexican states (simplified outlines)
const mexicoStatePaths: Record<string, { d: string; cx: number; cy: number }> = {
  "Aguascalientes": { d: "M280,240 L295,235 L300,250 L285,255 Z", cx: 288, cy: 245 },
  "Baja California": { d: "M50,60 L90,55 L95,80 L100,110 L90,145 L60,155 L40,130 L35,95 L50,60", cx: 70, cy: 105 },
  "Baja California Sur": { d: "M60,155 L90,145 L110,180 L115,230 L100,265 L75,250 L55,205 L60,155", cx: 85, cy: 205 },
  "Campeche": { d: "M510,340 L550,335 L560,380 L545,410 L505,405 L495,370 L510,340", cx: 525, cy: 370 },
  "Coahuila": { d: "M220,95 L300,90 L305,130 L285,165 L250,185 L215,165 L210,125 L220,95", cx: 255, cy: 135 },
  "Colima": { d: "M210,295 L235,290 L240,310 L220,320 L205,310 Z", cx: 222, cy: 305 },
  "Chiapas": { d: "M450,380 L505,375 L525,420 L505,460 L455,455 L430,415 L450,380", cx: 475, cy: 420 },
  "Chihuahua": { d: "M140,70 L220,75 L230,115 L220,165 L180,185 L135,170 L120,125 L140,70", cx: 175, cy: 125 },
  "Ciudad de México": { d: "M335,295 L350,293 L352,308 L338,310 Z", cx: 343, cy: 302 },
  "Durango": { d: "M170,165 L220,160 L230,195 L215,235 L175,240 L155,205 L170,165", cx: 190, cy: 200 },
  "Guanajuato": { d: "M285,245 L330,240 L340,265 L320,285 L280,280 L275,260 L285,245", cx: 305, cy: 262 },
  "Guerrero": { d: "M275,330 L330,325 L355,365 L330,400 L275,395 L255,360 L275,330", cx: 305, cy: 362 },
  "Hidalgo": { d: "M345,255 L385,250 L390,280 L370,295 L340,290 L345,255", cx: 365, cy: 272 },
  "Jalisco": { d: "M195,245 L250,240 L265,280 L250,320 L200,315 L185,280 L195,245", cx: 225, cy: 280 },
  "México": { d: "M320,285 L355,280 L365,310 L345,330 L310,325 L320,285", cx: 338, cy: 305 },
  "Michoacán": { d: "M235,290 L290,285 L305,325 L280,360 L220,355 L210,315 L235,290", cx: 255, cy: 322 },
  "Morelos": { d: "M325,315 L350,312 L355,335 L332,340 L325,315", cx: 340, cy: 325 },
  "Nayarit": { d: "M175,235 L205,230 L215,265 L195,285 L170,275 L175,235", cx: 190, cy: 258 },
  "Nuevo León": { d: "M305,130 L365,125 L375,175 L355,210 L310,205 L305,165 L305,130", cx: 340, cy: 168 },
  "Oaxaca": { d: "M355,365 L430,360 L450,410 L420,445 L355,440 L340,400 L355,365", cx: 395, cy: 402 },
  "Puebla": { d: "M365,295 L415,290 L430,340 L410,370 L355,365 L360,325 L365,295", cx: 390, cy: 330 },
  "Querétaro": { d: "M310,245 L340,242 L345,270 L325,280 L305,275 L310,245", cx: 325, cy: 260 },
  "Quintana Roo": { d: "M555,310 L595,305 L600,380 L575,410 L545,400 L550,345 L555,310", cx: 572, cy: 355 },
  "San Luis Potosí": { d: "M295,195 L360,190 L370,235 L340,260 L285,255 L280,220 L295,195", cx: 325, cy: 225 },
  "Sinaloa": { d: "M130,175 L175,170 L195,230 L175,275 L135,265 L115,220 L130,175", cx: 155, cy: 220 },
  "Sonora": { d: "M85,70 L145,65 L155,115 L140,165 L95,175 L65,145 L70,100 L85,70", cx: 110, cy: 118 },
  "Tabasco": { d: "M450,340 L495,335 L505,370 L480,385 L445,380 L450,340", cx: 475, cy: 358 },
  "Tamaulipas": { d: "M355,165 L400,160 L415,225 L385,270 L345,265 L340,210 L355,165", cx: 375, cy: 215 },
  "Tlaxcala": { d: "M365,285 L385,283 L388,300 L370,302 Z", cx: 377, cy: 292 },
  "Veracruz": { d: "M385,255 L430,250 L455,320 L445,380 L400,375 L380,310 L385,255", cx: 415, cy: 315 },
  "Yucatán": { d: "M510,295 L560,290 L575,320 L550,350 L505,345 L510,295", cx: 540, cy: 320 },
  "Zacatecas": { d: "M230,195 L285,190 L295,230 L275,260 L225,255 L220,220 L230,195", cx: 255, cy: 225 },
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

  const highlightNames = highlightStates.map(code => {
    const map: Record<string, string> = {
      MIC: "Michoacán", SIN: "Sinaloa", CHH: "Chihuahua",
      TAM: "Tamaulipas", GRO: "Guerrero", JAL: "Jalisco",
      COL: "Colima", GUA: "Guanajuato", ZAC: "Zacatecas",
      BCN: "Baja California", SON: "Sonora",
    };
    return map[code] || code;
  });

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
            className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl p-4 overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            <svg viewBox="0 0 650 500" className="w-full h-auto" style={{ minHeight: "350px" }}>
              <defs>
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c1222" />
                  <stop offset="100%" stopColor="#0a0f1a" />
                </linearGradient>
                <filter id="stateGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect x="0" y="0" width="650" height="500" fill="url(#oceanGrad)" />

              {Object.entries(mexicoStatePaths).map(([name, { d }], index) => {
                const isHovered = hoveredState === name;
                return (
                  <motion.path
                    key={name}
                    d={d}
                    fill={getStateColor(name)}
                    stroke={isHovered ? "#c9a84c" : "#2a2a2a"}
                    strokeWidth={isHovered ? 2 : 0.8}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    onMouseEnter={() => setHoveredState(name)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      cursor: "pointer",
                      filter: isHovered ? "url(#stateGlow)" : "none",
                    }}
                  />
                );
              })}

              <text x="325" y="480" textAnchor="middle" className="fill-muted-foreground/30 text-xs uppercase tracking-widest">
                Mexico
              </text>
            </svg>

            {/* Tooltip */}
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute z-50 pointer-events-none"
                style={{ left: Math.min(tooltipPos.x + 15, 500), top: Math.max(tooltipPos.y - 10, 10) }}
              >
                <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg p-4 shadow-2xl min-w-[200px]">
                  {(() => {
                    const data = getStateData(hoveredState);
                    if (!data) return <p className="text-foreground">{hoveredState}</p>;
                    return (
                      <>
                        <p className="font-serif text-lg font-semibold border-b border-border pb-2 mb-3">{data.name}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rate:</span>
                            <span className="text-primary font-mono font-bold">{data.homicideRate}/100k</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deaths:</span>
                            <span className="font-mono">{data.totalHomicides.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Level:</span>
                            <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                              data.violenceLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                              data.violenceLevel === "high" ? "bg-orange-500/20 text-orange-400" :
                              data.violenceLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {data.violenceLevel.toUpperCase()}
                            </span>
                          </div>
                          {data.cartelPresence.length > 0 && (
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-1">Cartels:</p>
                              <div className="flex flex-wrap gap-1">
                                {data.cartelPresence.map(c => (
                                  <span key={c} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{c}</span>
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
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">Deaths per 100k</p>
              <div className="space-y-1.5">
                {legendItems.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded" style={{ backgroundColor: color }} />
                    <span className="text-xs text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/40 font-mono">
              Source: INEGI 2023
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { value: stateHomicideData.filter(s => s.violenceLevel === "extreme").length, label: "Extreme States", color: "text-red-400" },
              { value: stateHomicideData.reduce((a, b) => a + b.totalHomicides, 0).toLocaleString(), label: "Total Homicides", color: "text-primary" },
              { value: Math.max(...stateHomicideData.map(s => s.homicideRate)).toFixed(1), label: "Highest Rate", color: "text-orange-400" },
              { value: stateHomicideData.filter(s => s.cartelPresence.includes("CJNG")).length, label: "CJNG States", color: "text-amber-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center p-4 bg-muted/30 border border-border rounded-lg"
              >
                <p className={`font-mono text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
