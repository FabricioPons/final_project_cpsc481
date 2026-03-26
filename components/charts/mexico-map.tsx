"use client";

import { useState, memo, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import * as d3Geo from "d3-geo";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";

interface MexicoMapProps {
  title?: string;
  subtitle?: string;
  highlightStates?: string[];
  showLegend?: boolean;
}

// Simplified GeoJSON for Mexico states (simplified coordinates from CONABIO)
// Each state has coordinates in [longitude, latitude] format
const mexicoStatesGeoJSON = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Aguascalientes", code: "01" }, geometry: { type: "Polygon", coordinates: [[[-102.7, 22.3], [-102.1, 22.3], [-102.1, 21.8], [-102.7, 21.8], [-102.7, 22.3]]] }},
    { type: "Feature", properties: { name: "Baja California", code: "02" }, geometry: { type: "Polygon", coordinates: [[[-117.1, 32.5], [-114.7, 32.7], [-114.5, 32.1], [-113.1, 30.5], [-112.8, 28.8], [-114.1, 27.8], [-115.5, 28.3], [-116.1, 29.8], [-117.1, 32.5]]] }},
    { type: "Feature", properties: { name: "Baja California Sur", code: "03" }, geometry: { type: "Polygon", coordinates: [[[-114.1, 27.8], [-112.8, 28.0], [-111.5, 26.5], [-110.3, 24.2], [-109.9, 23.0], [-110.5, 22.9], [-112.1, 24.5], [-113.1, 26.1], [-114.1, 27.8]]] }},
    { type: "Feature", properties: { name: "Campeche", code: "04" }, geometry: { type: "Polygon", coordinates: [[[-90.4, 20.0], [-89.2, 19.8], [-89.1, 18.5], [-89.4, 17.8], [-90.5, 17.8], [-91.4, 18.5], [-90.4, 20.0]]] }},
    { type: "Feature", properties: { name: "Coahuila", code: "05" }, geometry: { type: "Polygon", coordinates: [[[-103.4, 29.8], [-100.1, 29.8], [-100.1, 27.8], [-100.6, 26.8], [-101.4, 25.8], [-102.5, 25.0], [-103.8, 25.5], [-104.1, 27.0], [-103.4, 29.8]]] }},
    { type: "Feature", properties: { name: "Colima", code: "06" }, geometry: { type: "Polygon", coordinates: [[[-104.7, 19.5], [-103.5, 19.5], [-103.5, 18.7], [-104.7, 18.7], [-104.7, 19.5]]] }},
    { type: "Feature", properties: { name: "Chiapas", code: "07" }, geometry: { type: "Polygon", coordinates: [[[-94.1, 17.8], [-92.2, 17.8], [-91.4, 17.2], [-90.5, 16.1], [-91.4, 14.5], [-92.2, 14.5], [-93.5, 15.7], [-94.1, 16.2], [-94.1, 17.8]]] }},
    { type: "Feature", properties: { name: "Chihuahua", code: "08" }, geometry: { type: "Polygon", coordinates: [[[-109.0, 31.8], [-106.5, 32.0], [-106.4, 31.4], [-104.9, 30.6], [-104.0, 29.3], [-104.4, 28.0], [-105.5, 26.7], [-106.5, 25.9], [-107.9, 26.3], [-108.2, 27.5], [-109.0, 29.4], [-109.0, 31.8]]] }},
    { type: "Feature", properties: { name: "Ciudad de México", code: "09" }, geometry: { type: "Polygon", coordinates: [[[-99.4, 19.6], [-98.9, 19.6], [-98.9, 19.1], [-99.4, 19.1], [-99.4, 19.6]]] }},
    { type: "Feature", properties: { name: "Durango", code: "10" }, geometry: { type: "Polygon", coordinates: [[[-107.2, 26.0], [-104.4, 26.0], [-103.5, 25.0], [-103.5, 23.5], [-104.5, 22.8], [-105.5, 23.1], [-106.9, 24.0], [-107.2, 26.0]]] }},
    { type: "Feature", properties: { name: "Guanajuato", code: "11" }, geometry: { type: "Polygon", coordinates: [[[-102.1, 21.8], [-100.0, 21.8], [-100.0, 20.1], [-101.2, 20.0], [-102.1, 20.5], [-102.1, 21.8]]] }},
    { type: "Feature", properties: { name: "Guerrero", code: "12" }, geometry: { type: "Polygon", coordinates: [[[-101.5, 18.5], [-98.5, 18.5], [-98.0, 17.4], [-98.5, 16.3], [-100.0, 16.7], [-101.5, 17.5], [-101.5, 18.5]]] }},
    { type: "Feature", properties: { name: "Hidalgo", code: "13" }, geometry: { type: "Polygon", coordinates: [[[-99.8, 21.4], [-98.1, 21.4], [-98.1, 19.8], [-99.0, 19.8], [-99.8, 20.3], [-99.8, 21.4]]] }},
    { type: "Feature", properties: { name: "Jalisco", code: "14" }, geometry: { type: "Polygon", coordinates: [[[-105.7, 22.5], [-103.5, 22.5], [-102.5, 21.5], [-102.5, 19.5], [-103.5, 19.1], [-105.0, 19.3], [-105.7, 20.5], [-105.7, 22.5]]] }},
    { type: "Feature", properties: { name: "México", code: "15" }, geometry: { type: "Polygon", coordinates: [[[-100.4, 20.2], [-98.6, 20.2], [-98.6, 18.8], [-99.5, 18.6], [-100.4, 19.1], [-100.4, 20.2]]] }},
    { type: "Feature", properties: { name: "Michoacán", code: "16" }, geometry: { type: "Polygon", coordinates: [[[-103.7, 20.4], [-101.0, 20.4], [-100.1, 19.2], [-100.8, 18.1], [-102.0, 17.9], [-103.5, 18.3], [-103.7, 19.4], [-103.7, 20.4]]] }},
    { type: "Feature", properties: { name: "Morelos", code: "17" }, geometry: { type: "Polygon", coordinates: [[[-99.5, 19.1], [-98.6, 19.1], [-98.6, 18.4], [-99.5, 18.4], [-99.5, 19.1]]] }},
    { type: "Feature", properties: { name: "Nayarit", code: "18" }, geometry: { type: "Polygon", coordinates: [[[-106.0, 23.1], [-104.5, 23.1], [-104.3, 21.5], [-105.2, 20.6], [-106.0, 21.5], [-106.0, 23.1]]] }},
    { type: "Feature", properties: { name: "Nuevo León", code: "19" }, geometry: { type: "Polygon", coordinates: [[[-101.2, 27.8], [-99.0, 27.8], [-99.0, 25.8], [-99.7, 24.5], [-100.6, 23.2], [-101.2, 24.0], [-101.2, 27.8]]] }},
    { type: "Feature", properties: { name: "Oaxaca", code: "20" }, geometry: { type: "Polygon", coordinates: [[[-98.5, 18.2], [-95.5, 18.2], [-94.8, 16.5], [-95.5, 15.7], [-97.8, 15.8], [-98.5, 16.5], [-98.5, 18.2]]] }},
    { type: "Feature", properties: { name: "Puebla", code: "21" }, geometry: { type: "Polygon", coordinates: [[[-98.6, 20.2], [-96.8, 20.2], [-96.8, 18.1], [-97.5, 17.9], [-98.6, 18.4], [-98.6, 20.2]]] }},
    { type: "Feature", properties: { name: "Querétaro", code: "22" }, geometry: { type: "Polygon", coordinates: [[[-100.6, 21.6], [-99.5, 21.6], [-99.5, 20.5], [-100.6, 20.5], [-100.6, 21.6]]] }},
    { type: "Feature", properties: { name: "Quintana Roo", code: "23" }, geometry: { type: "Polygon", coordinates: [[[-89.2, 21.5], [-86.7, 21.5], [-86.7, 18.5], [-87.5, 17.9], [-89.2, 17.9], [-89.2, 21.5]]] }},
    { type: "Feature", properties: { name: "San Luis Potosí", code: "24" }, geometry: { type: "Polygon", coordinates: [[[-102.3, 24.5], [-98.8, 24.5], [-98.8, 21.2], [-100.5, 21.2], [-102.3, 22.0], [-102.3, 24.5]]] }},
    { type: "Feature", properties: { name: "Sinaloa", code: "25" }, geometry: { type: "Polygon", coordinates: [[[-109.4, 27.0], [-106.4, 27.0], [-105.5, 25.5], [-105.5, 23.2], [-106.5, 22.5], [-108.5, 23.5], [-109.4, 25.5], [-109.4, 27.0]]] }},
    { type: "Feature", properties: { name: "Sonora", code: "26" }, geometry: { type: "Polygon", coordinates: [[[-114.8, 32.5], [-109.0, 32.0], [-109.0, 29.5], [-108.2, 27.5], [-109.5, 26.3], [-111.0, 26.0], [-113.0, 28.5], [-114.8, 30.5], [-114.8, 32.5]]] }},
    { type: "Feature", properties: { name: "Tabasco", code: "27" }, geometry: { type: "Polygon", coordinates: [[[-94.1, 18.6], [-91.5, 18.6], [-91.5, 17.3], [-93.0, 17.3], [-94.1, 17.8], [-94.1, 18.6]]] }},
    { type: "Feature", properties: { name: "Tamaulipas", code: "28" }, geometry: { type: "Polygon", coordinates: [[[-100.1, 27.8], [-97.1, 26.0], [-97.1, 23.0], [-98.5, 22.2], [-99.7, 22.5], [-100.1, 24.0], [-100.1, 27.8]]] }},
    { type: "Feature", properties: { name: "Tlaxcala", code: "29" }, geometry: { type: "Polygon", coordinates: [[[-98.4, 19.7], [-97.6, 19.7], [-97.6, 19.1], [-98.4, 19.1], [-98.4, 19.7]]] }},
    { type: "Feature", properties: { name: "Veracruz", code: "30" }, geometry: { type: "Polygon", coordinates: [[[-98.5, 22.5], [-96.4, 22.0], [-94.8, 19.5], [-94.5, 18.0], [-95.2, 17.2], [-96.5, 17.5], [-97.5, 18.5], [-98.2, 20.5], [-98.5, 22.5]]] }},
    { type: "Feature", properties: { name: "Yucatán", code: "31" }, geometry: { type: "Polygon", coordinates: [[[-90.4, 21.6], [-87.5, 21.6], [-87.5, 20.5], [-89.2, 19.7], [-90.4, 20.0], [-90.4, 21.6]]] }},
    { type: "Feature", properties: { name: "Zacatecas", code: "32" }, geometry: { type: "Polygon", coordinates: [[[-104.4, 25.1], [-102.0, 25.1], [-101.8, 23.5], [-102.7, 22.0], [-103.5, 21.8], [-104.4, 22.8], [-104.4, 25.1]]] }},
  ]
};

function MexicoMapComponent({
  title = "Violence Across Mexico",
  subtitle = "Homicide rates per 100,000 population (2023)",
  highlightStates = [],
  showLegend = true,
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [paths, setPaths] = useState<{ name: string; d: string; code: string }[]>([]);

  // D3.js projection for Mexico - Conic Conformal projection centered on Mexico
  useEffect(() => {
    const width = 800;
    const height = 600;

    // Create projection centered on Mexico
    const projection = d3Geo.geoConicConformal()
      .rotate([102, 0])
      .center([0, 24])
      .parallels([17.5, 29.5])
      .scale(2000)
      .translate([width / 2, height / 2]);

    // Create path generator
    const pathGenerator = d3Geo.geoPath().projection(projection);

    // Generate paths for each state
    const generatedPaths = mexicoStatesGeoJSON.features.map((feature) => ({
      name: feature.properties.name,
      code: feature.properties.code,
      d: pathGenerator(feature as d3Geo.GeoPermissibleObjects) || "",
    }));

    setPaths(generatedPaths);
  }, []);

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
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>

      {/* Map container */}
      <div
        className="relative bg-gradient-to-b from-card to-background border border-border rounded-xl p-4 md:p-6 overflow-hidden shadow-2xl"
        onMouseMove={handleMouseMove}
      >
        {/* Ocean background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl" />
        
        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox="0 0 800 600"
          className="relative w-full h-auto z-10"
          style={{ maxHeight: "600px", minHeight: "400px" }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1222" />
              <stop offset="100%" stopColor="#0a0f1a" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect x="0" y="0" width="800" height="600" fill="url(#oceanGradient)" />

          {/* State paths */}
          <g filter="url(#shadow)">
            {paths.map((state, index) => {
              const data = getStateData(state.name);
              const isHovered = hoveredState === state.name;
              const fillColor = getStateColor(state.name);

              return (
                <motion.path
                  key={state.name}
                  d={state.d}
                  fill={fillColor}
                  stroke={isHovered ? "#c9a84c" : "#2a2a2a"}
                  strokeWidth={isHovered ? 2.5 : 1}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.03,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ 
                    cursor: "pointer",
                    filter: isHovered ? "url(#glow)" : "none",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "transform 0.2s ease, stroke 0.2s ease"
                  }}
                />
              );
            })}
          </g>

          {/* Country label */}
          <text
            x="400"
            y="560"
            textAnchor="middle"
            className="fill-muted-foreground/30 font-serif text-sm uppercase tracking-[0.3em]"
            fontSize="14"
          >
            Mexico
          </text>
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(Math.max(tooltipPos.x + 15, 10), 600),
              top: Math.max(tooltipPos.y - 10, 10),
            }}
          >
            <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg p-4 shadow-2xl min-w-[220px]">
              {(() => {
                const data = getStateData(hoveredState);
                if (!data)
                  return (
                    <p className="text-foreground font-serif">{hoveredState}</p>
                  );
                return (
                  <>
                    <p className="font-serif text-lg text-foreground font-semibold border-b border-border pb-2 mb-3">
                      {data.name}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Homicide Rate:</span>
                        <span className="text-primary font-mono font-bold text-lg">
                          {data.homicideRate}
                          <span className="text-xs text-muted-foreground ml-1">/100k</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Deaths:</span>
                        <span className="text-foreground font-mono">
                          {data.totalHomicides.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Level:</span>
                        <span
                          className={`font-semibold text-sm px-2 py-0.5 rounded ${
                            data.violenceLevel === "extreme"
                              ? "bg-red-500/20 text-red-400"
                              : data.violenceLevel === "high"
                                ? "bg-orange-500/20 text-orange-400"
                                : data.violenceLevel === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {data.violenceLevel.toUpperCase()}
                        </span>
                      </div>
                      {data.cartelPresence.length > 0 && (
                        <div className="pt-2 border-t border-border mt-2">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            Active Cartels
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {data.cartelPresence.map((cartel) => (
                              <span
                                key={cartel}
                                className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
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
        {showLegend && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-md border border-border rounded-lg p-4 shadow-xl"
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-mono font-semibold">
              Deaths per 100k
            </p>
            <div className="space-y-2">
              {legendItems.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-6 h-4 rounded border border-white/10 shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-foreground/80">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Data source */}
        <div className="absolute bottom-6 right-6 text-xs text-muted-foreground/40 font-mono">
          Source: INEGI 2023
        </div>
      </div>

      {/* Stats grid below map */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center p-5 bg-gradient-to-br from-red-950/30 to-card border border-red-900/30 rounded-xl"
        >
          <p className="font-mono text-3xl md:text-4xl text-red-400 font-bold">
            {stateHomicideData.filter((s) => s.violenceLevel === "extreme").length}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-2 tracking-wide">
            Extreme Violence States
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center p-5 bg-card border border-border rounded-xl"
        >
          <p className="font-mono text-3xl md:text-4xl text-foreground font-bold">
            {Math.round(
              stateHomicideData.reduce((sum, s) => sum + s.homicideRate, 0) /
                stateHomicideData.length
            )}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-2 tracking-wide">
            National Avg Rate
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center p-5 bg-card border border-border rounded-xl"
        >
          <p className="font-mono text-3xl md:text-4xl text-foreground font-bold">
            {stateHomicideData
              .reduce((sum, s) => sum + s.totalHomicides, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-2 tracking-wide">
            Total Deaths 2023
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center p-5 bg-gradient-to-br from-primary/10 to-card border border-primary/30 rounded-xl"
        >
          <p className="font-mono text-3xl md:text-4xl text-primary font-bold">
            {stateHomicideData.filter((s) => s.cartelPresence.includes("CJNG")).length}
          </p>
          <p className="text-xs text-muted-foreground uppercase mt-2 tracking-wide">
            CJNG Presence
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export const MexicoMap = memo(MexicoMapComponent);
