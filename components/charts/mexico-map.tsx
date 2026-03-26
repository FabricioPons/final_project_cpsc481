"use client";

import { useState, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";

interface MexicoMapProps {
  title?: string;
  subtitle?: string;
  highlightStates?: string[];
  showLegend?: boolean;
}

// Simplified state coordinates for D3-style visualization
interface StateCoord {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  region: string;
}

const stateCoordinates: StateCoord[] = [
  // Northern Border states
  { name: "Baja California", x: 20, y: 40, width: 50, height: 60, region: "NW" },
  { name: "Sonora", x: 80, y: 35, width: 70, height: 80, region: "NW" },
  { name: "Chihuahua", x: 90, y: 130, width: 80, height: 90, region: "N" },
  { name: "Coahuila", x: 160, y: 120, width: 90, height: 100, region: "N" },
  { name: "Nuevo León", x: 210, y: 110, width: 60, height: 80, region: "NE" },
  { name: "Tamaulipas", x: 240, y: 80, width: 50, height: 100, region: "NE" },

  // Central-North states
  { name: "Durango", x: 110, y: 220, width: 60, height: 90, region: "NC" },
  { name: "Zacatecas", x: 160, y: 240, width: 50, height: 60, region: "NC" },
  { name: "San Luis Potosí", x: 200, y: 240, width: 60, height: 80, region: "NC" },

  // West states
  { name: "Sinaloa", x: 60, y: 150, width: 50, height: 90, region: "W" },
  { name: "Nayarit", x: 70, y: 250, width: 40, height: 50, region: "W" },
  { name: "Jalisco", x: 100, y: 310, width: 60, height: 70, region: "W" },
  { name: "Colima", x: 90, y: 380, width: 30, height: 40, region: "W" },
  { name: "Michoacán", x: 140, y: 340, width: 60, height: 70, region: "W" },

  // Central states
  { name: "Guanajuato", x: 160, y: 310, width: 50, height: 60, region: "C" },
  { name: "Querétaro", x: 180, y: 280, width: 40, height: 50, region: "C" },
  { name: "Hidalgo", x: 210, y: 290, width: 40, height: 60, region: "C" },
  { name: "México", x: 220, y: 350, width: 40, height: 50, region: "C" },
  { name: "Ciudad de México", x: 235, y: 375, width: 25, height: 25, region: "C" },
  { name: "Tlaxcala", x: 250, y: 360, width: 25, height: 30, region: "C" },
  { name: "Morelos", x: 230, y: 395, width: 30, height: 35, region: "C" },

  // Eastern states
  { name: "Veracruz", x: 250, y: 310, width: 55, height: 120, region: "E" },
  { name: "Puebla", x: 240, y: 340, width: 50, height: 70, region: "E" },

  // Southern states
  { name: "Oaxaca", x: 220, y: 420, width: 70, height: 90, region: "S" },
  { name: "Guerrero", x: 160, y: 420, width: 60, height: 80, region: "S" },
  { name: "Chiapas", x: 230, y: 500, width: 70, height: 80, region: "S" },
  { name: "Tabasco", x: 280, y: 450, width: 50, height: 60, region: "S" },

  // Peninsula states
  { name: "Yucatán", x: 340, y: 420, width: 50, height: 60, region: "P" },
  { name: "Campeche", x: 300, y: 470, width: 60, height: 80, region: "P" },
  { name: "Quintana Roo", x: 350, y: 480, width: 50, height: 80, region: "P" },

  // Baja California Sur (isolated)
  { name: "Baja California Sur", x: 30, y: 280, width: 40, height: 100, region: "NW" },
];

function MexicoMapComponent({
  title = "Violence Across Mexico",
  subtitle = "Homicide rates per 100,000 population (2023)",
  highlightStates = [],
  showLegend = true,
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const highlightCodeToName: Record<string, string> = {
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

  const getStateData = (stateName: string) => {
    return stateHomicideData.find((s) => s.name === stateName);
  };

  const getStateColor = (stateName: string) => {
    const data = getStateData(stateName);
    if (!data) return "#1a1a1a";

    if (highlightStates.length > 0) {
      const isHighlighted = highlightStates.some((code) => {
        const mappedName = highlightCodeToName[code];
        return mappedName === stateName || code === stateName;
      });
      if (!isHighlighted) return "#151515";
    }

    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>

      {/* Map container */}
      <div
        className="relative bg-card border border-border rounded-lg p-2 md:p-4 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* SVG Map Grid */}
        <svg
          viewBox="0 0 400 600"
          className="w-full h-auto"
          style={{ maxHeight: "550px", minHeight: "350px" }}
        >
          {/* Background */}
          <rect x="0" y="0" width="400" height="600" fill="#0a0a0a" />

          {/* Water effect */}
          <defs>
            <pattern
              id="water"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="1" fill="#0d1117" opacity="0.3" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="400" height="600" fill="url(#water)" />

          {/* State boxes */}
          {stateCoordinates.map((state, index) => {
            const data = getStateData(state.name);
            const isHovered = hoveredState === state.name;
            const fillColor = getStateColor(state.name);

            return (
              <motion.g key={state.name}>
                {/* State rectangle */}
                <motion.rect
                  x={state.x}
                  y={state.y}
                  width={state.width}
                  height={state.height}
                  fill={fillColor}
                  stroke={isHovered ? "#c9a84c" : "#333"}
                  strokeWidth={isHovered ? 2 : 1}
                  rx={2}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.02,
                  }}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ cursor: "pointer" }}
                />

                {/* State label */}
                {state.width > 35 && (
                  <text
                    x={state.x + state.width / 2}
                    y={state.y + state.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-foreground/60 pointer-events-none"
                    fontSize="8"
                  >
                    {state.name.split(" ")[0]}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 15, 400 - 220),
              top: Math.max(tooltipPos.y - 10, 10),
            }}
          >
            <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl min-w-[200px]">
              {(() => {
                const data = getStateData(hoveredState);
                if (!data)
                  return (
                    <p className="text-foreground font-serif">{hoveredState}</p>
                  );
                return (
                  <>
                    <p className="font-serif text-lg text-foreground font-semibold">
                      {data.name}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          Homicide Rate:
                        </span>{" "}
                        <span className="text-primary font-mono font-bold">
                          {data.homicideRate}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {" "}
                          /100k
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          Total Homicides:
                        </span>{" "}
                        <span className="text-foreground font-mono">
                          {data.totalHomicides.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          Violence Level:
                        </span>{" "}
                        <span
                          className={`font-semibold ${
                            data.violenceLevel === "extreme"
                              ? "text-red-500"
                              : data.violenceLevel === "high"
                                ? "text-orange-500"
                                : data.violenceLevel === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                          }`}
                        >
                          {data.violenceLevel.charAt(0).toUpperCase() +
                            data.violenceLevel.slice(1)}
                        </span>
                      </p>
                      {data.cartelPresence.length > 0 && (
                        <div className="pt-1 border-t border-border mt-2">
                          <p className="text-xs text-muted-foreground">
                            Cartel Presence:
                          </p>
                          <p className="text-xs text-foreground">
                            {data.cartelPresence.join(", ")}
                          </p>
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
        {showLegend && (
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">
              Homicides per 100k
            </p>
            <div className="space-y-1.5">
              {legendItems.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-5 h-3 rounded-sm border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source label */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-mono">
          Data: INEGI 2023
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <p className="font-mono text-2xl md:text-3xl text-primary font-bold">
            {
              stateHomicideData.filter((s) => s.violenceLevel === "extreme")
                .length
            }
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1 tracking-wide">
            Extreme Violence
          </p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <p className="font-mono text-2xl md:text-3xl text-foreground font-bold">
            {Math.round(
              stateHomicideData.reduce((sum, s) => sum + s.homicideRate, 0) /
                stateHomicideData.length
            )}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1 tracking-wide">
            Avg Rate /100k
          </p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <p className="font-mono text-2xl md:text-3xl text-foreground font-bold">
            {stateHomicideData
              .reduce((sum, s) => sum + s.totalHomicides, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1 tracking-wide">
            Total 2023
          </p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <p className="font-mono text-2xl md:text-3xl text-primary font-bold">
            {
              stateHomicideData.filter((s) =>
                s.cartelPresence.includes("CJNG")
              ).length
            }
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1 tracking-wide">
            CJNG States
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const MexicoMap = memo(MexicoMapComponent);
