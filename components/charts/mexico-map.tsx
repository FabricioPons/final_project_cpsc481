"use client";

import { useState, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";

// Simplified but accurate Mexico state paths
const mexicoStates: Record<string, { path: string; labelPos: [number, number] }> = {
  "Baja California": {
    path: "M32,12 L48,8 L58,22 L52,68 L44,82 L30,72 L24,36 Z",
    labelPos: [38, 45],
  },
  "Baja California Sur": {
    path: "M30,84 L44,82 L50,108 L56,148 L44,164 L28,156 L22,116 Z",
    labelPos: [38, 125],
  },
  "Sonora": {
    path: "M58,22 L112,16 L124,38 L118,86 L86,98 L52,88 L52,68 Z",
    labelPos: [88, 55],
  },
  "Chihuahua": {
    path: "M112,38 L162,32 L174,58 L168,112 L132,124 L118,108 L118,86 L124,38 Z",
    labelPos: [144, 78],
  },
  "Coahuila": {
    path: "M162,58 L208,48 L224,78 L218,122 L182,134 L168,112 L174,58 Z",
    labelPos: [194, 92],
  },
  "Nuevo León": {
    path: "M208,78 L244,72 L256,98 L244,132 L218,138 L218,122 L224,78 Z",
    labelPos: [234, 105],
  },
  "Tamaulipas": {
    path: "M244,72 L276,66 L288,108 L282,162 L254,174 L244,144 L244,132 L256,98 Z",
    labelPos: [264, 120],
  },
  "Sinaloa": {
    path: "M86,98 L118,108 L124,148 L102,168 L76,154 L70,122 Z",
    labelPos: [98, 133],
  },
  "Durango": {
    path: "M118,108 L168,114 L174,154 L152,170 L124,160 L124,148 Z",
    labelPos: [146, 138],
  },
  "Zacatecas": {
    path: "M168,114 L194,120 L204,154 L188,174 L158,168 L152,170 L174,154 Z",
    labelPos: [178, 145],
  },
  "San Luis Potosí": {
    path: "M194,120 L234,126 L240,166 L218,186 L188,180 L188,174 L204,154 Z",
    labelPos: [214, 155],
  },
  "Nayarit": {
    path: "M76,154 L102,168 L108,188 L86,204 L66,188 Z",
    labelPos: [86, 178],
  },
  "Jalisco": {
    path: "M86,188 L108,188 L124,184 L148,194 L142,228 L112,244 L82,228 L76,204 Z",
    labelPos: [112, 215],
  },
  "Aguascalientes": {
    path: "M158,168 L178,168 L178,188 L158,188 Z",
    labelPos: [168, 178],
  },
  "Guanajuato": {
    path: "M158,188 L188,184 L204,200 L194,220 L162,220 L152,204 Z",
    labelPos: [178, 204],
  },
  "Querétaro": {
    path: "M188,184 L208,180 L218,196 L208,212 L194,216 L188,200 Z",
    labelPos: [202, 198],
  },
  "Hidalgo": {
    path: "M208,196 L234,190 L244,210 L234,226 L212,226 L208,212 Z",
    labelPos: [224, 210],
  },
  "Colima": {
    path: "M82,228 L102,228 L102,248 L86,254 L76,244 Z",
    labelPos: [90, 241],
  },
  "Michoacán": {
    path: "M102,228 L142,228 L158,244 L148,274 L112,280 L92,264 L92,248 L102,248 Z",
    labelPos: [125, 254],
  },
  "México": {
    path: "M194,220 L218,216 L234,230 L224,250 L198,250 L188,234 Z",
    labelPos: [210, 235],
  },
  "Ciudad de México": {
    path: "M208,242 L220,242 L220,258 L208,258 Z",
    labelPos: [214, 250],
  },
  "Morelos": {
    path: "M198,250 L214,250 L220,266 L204,272 L192,262 Z",
    labelPos: [206, 261],
  },
  "Tlaxcala": {
    path: "M230,226 L246,226 L246,242 L230,242 Z",
    labelPos: [238, 234],
  },
  "Puebla": {
    path: "M230,242 L262,236 L272,266 L250,288 L218,282 L218,266 L224,250 L234,230 Z",
    labelPos: [244, 262],
  },
  "Veracruz": {
    path: "M244,190 L276,174 L298,194 L292,276 L272,306 L244,292 L250,266 L262,236 L244,210 Z",
    labelPos: [270, 240],
  },
  "Guerrero": {
    path: "M148,274 L194,270 L204,306 L172,338 L132,328 L122,298 Z",
    labelPos: [162, 305],
  },
  "Oaxaca": {
    path: "M194,286 L250,286 L272,306 L256,348 L204,358 L172,338 L178,306 Z",
    labelPos: [224, 322],
  },
  "Chiapas": {
    path: "M256,338 L292,318 L318,338 L308,378 L272,394 L244,374 L250,348 Z",
    labelPos: [280, 358],
  },
  "Tabasco": {
    path: "M272,292 L308,282 L324,302 L308,322 L282,318 Z",
    labelPos: [295, 302],
  },
  "Campeche": {
    path: "M308,282 L338,268 L354,292 L344,334 L318,338 L308,322 L324,302 Z",
    labelPos: [330, 302],
  },
  "Yucatán": {
    path: "M338,248 L378,244 L384,278 L358,294 L338,282 L338,268 Z",
    labelPos: [358, 268],
  },
  "Quintana Roo": {
    path: "M378,258 L398,254 L408,308 L394,358 L368,354 L358,308 L358,294 L384,278 Z",
    labelPos: [382, 305],
  },
};

interface MexicoMapProps {
  title?: string;
  subtitle?: string;
  highlightStates?: string[];
  showLegend?: boolean;
}

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

  const getStateData = (stateName: string) => {
    return stateHomicideData.find((s) => s.name === stateName);
  };

  // Map highlight codes to state names
  const highlightCodeToName: Record<string, string> = {
    MIC: "Michoacán",
    SIN: "Sinaloa", 
    CHH: "Chihuahua",
    TAM: "Tamaulipas",
    GRO: "Guerrero",
    JAL: "Jalisco",
  };

  const getStateColor = (stateName: string) => {
    const data = getStateData(stateName);
    if (!data) return "#1f1f1f";
    
    if (highlightStates.length > 0) {
      const isHighlighted = highlightStates.some((code) => {
        const mappedName = highlightCodeToName[code];
        return mappedName === stateName || code === stateName;
      });
      if (!isHighlighted) return "#1a1a1a";
    }
    
    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
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
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">{title}</h3>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>

      {/* Map container */}
      <div
        className="relative bg-card border border-border rounded-lg p-4 md:p-8 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* SVG Map */}
        <svg
          viewBox="0 0 440 410"
          className="w-full h-auto max-h-[500px]"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))" }}
        >
          {/* Background */}
          <rect x="0" y="0" width="440" height="410" fill="#0d0d0d" />
          
          {/* Ocean labels */}
          <text x="15" y="190" fill="#1a1a1a" fontSize="10" fontFamily="monospace">
            Pacific
          </text>
          <text x="15" y="202" fill="#1a1a1a" fontSize="10" fontFamily="monospace">
            Ocean
          </text>
          <text x="330" y="390" fill="#1a1a1a" fontSize="10" fontFamily="monospace">
            Gulf of Mexico
          </text>

          {/* States */}
          {Object.entries(mexicoStates).map(([name, { path }], index) => {
            const stateData = getStateData(name);
            const isHovered = hoveredState === name;

            return (
              <motion.path
                key={name}
                d={path}
                fill={getStateColor(name)}
                stroke={isHovered ? "#c9a84c" : "#333"}
                strokeWidth={isHovered ? 2 : 0.5}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        scale: isHovered ? 1.02 : 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.02,
                  scale: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredState(name)}
                onMouseLeave={() => setHoveredState(null)}
                style={{
                  cursor: "pointer",
                  transformOrigin: "center",
                }}
              />
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
              left: Math.min(tooltipPos.x + 15, 250),
              top: tooltipPos.y - 10,
            }}
          >
            <div className="bg-background/95 backdrop-blur border border-border rounded-lg p-4 shadow-xl min-w-[200px]">
              {(() => {
                const data = getStateData(hoveredState);
                if (!data) return <p className="text-foreground">{hoveredState}</p>;
                return (
                  <>
                    <p className="font-serif text-lg text-foreground font-semibold">
                      {data.name}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Homicide Rate:</span>{" "}
                        <span className="text-primary font-mono font-bold">
                          {data.homicideRate}
                        </span>
                        <span className="text-muted-foreground text-xs"> per 100k</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Total Homicides:</span>{" "}
                        <span className="text-foreground font-mono">
                          {data.totalHomicides.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Violence Level:</span>{" "}
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
                        <p className="text-sm">
                          <span className="text-muted-foreground">Cartel Presence:</span>{" "}
                          <span className="text-foreground text-xs">
                            {data.cartelPresence.join(", ")}
                          </span>
                        </p>
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
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur border border-border rounded p-3">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
              Violence Level
            </p>
            <div className="space-y-1">
              {legendItems.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source label */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/60">
          Source: INEGI 2023
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-4 bg-card border border-border rounded">
          <p className="font-mono text-2xl text-primary font-bold">
            {stateHomicideData.filter((s) => s.violenceLevel === "extreme").length}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1">Extreme Violence States</p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded">
          <p className="font-mono text-2xl text-foreground font-bold">
            {Math.round(
              stateHomicideData.reduce((sum, s) => sum + s.homicideRate, 0) /
                stateHomicideData.length
            )}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1">Avg Rate per 100k</p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded">
          <p className="font-mono text-2xl text-foreground font-bold">
            {stateHomicideData
              .reduce((sum, s) => sum + s.totalHomicides, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1">Total Homicides 2023</p>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded">
          <p className="font-mono text-2xl text-primary font-bold">
            {stateHomicideData.filter((s) => s.cartelPresence.includes("CJNG")).length}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-1">States with CJNG</p>
        </div>
      </div>
    </motion.div>
  );
}

export const MexicoMap = memo(MexicoMapComponent);
