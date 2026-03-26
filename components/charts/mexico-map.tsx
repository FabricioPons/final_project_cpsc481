"use client";

import { useState, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";

// Mexico TopoJSON from INEGI via Diego Valle's processed file
const MEXICO_TOPO_JSON =
  "https://gist.githubusercontent.com/diegovalle/5129746/raw/c1c35e439b1d5e688bca20b79f0e53a1fc12bf9e/mx_tj.json";

interface MexicoMapProps {
  highlightStates?: string[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  era?: "calderon" | "pena-nieto" | "amlo" | "current";
}

// Memoized Geography component for performance
const MemoizedGeography = memo(function MemoizedGeography({
  geo,
  stateData,
  isHighlighted,
  onHover,
  onLeave,
  isHovered,
}: {
  geo: any;
  stateData: (typeof stateHomicideData)[0] | undefined;
  isHighlighted: boolean;
  onHover: (name: string, data: (typeof stateHomicideData)[0] | undefined) => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  const fillColor = stateData
    ? getViolenceLevelColor(stateData.homicideRate)
    : "#1a1a1a";

  return (
    <Geography
      geography={geo}
      onMouseEnter={() => onHover(geo.properties.state_name, stateData)}
      onMouseLeave={onLeave}
      style={{
        default: {
          fill: isHighlighted ? "#c9a84c" : fillColor,
          stroke: "#2a2a2a",
          strokeWidth: 0.5,
          outline: "none",
          transition: "fill 0.3s ease",
        },
        hover: {
          fill: isHighlighted ? "#dbb85c" : "#c9a84c",
          stroke: "#444",
          strokeWidth: 1,
          outline: "none",
          cursor: "pointer",
        },
        pressed: {
          fill: "#a8723a",
          stroke: "#444",
          strokeWidth: 1,
          outline: "none",
        },
      }}
    />
  );
});

export function MexicoMap({
  highlightStates = [],
  title,
  subtitle,
  showLegend = true,
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [tooltipData, setTooltipData] = useState<{
    name: string;
    data: (typeof stateHomicideData)[0] | undefined;
  } | null>(null);

  const handleHover = (
    name: string,
    data: (typeof stateHomicideData)[0] | undefined
  ) => {
    setTooltipData({ name, data });
  };

  const handleLeave = () => {
    setTooltipData(null);
  };

  // Legend data
  const legendItems = [
    { label: "Low (<10)", color: "#1a2e1a" },
    { label: "Medium (10-25)", color: "#4a3728" },
    { label: "High (25-45)", color: "#7d4e2e" },
    { label: "Extreme (>45)", color: "#8b2500" },
  ];

  return (
    <div ref={ref} className="w-full max-w-5xl mx-auto">
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-2xl md:text-3xl text-foreground mb-2 text-center"
        >
          {title}
        </motion.h3>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-center mb-6"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative bg-card border border-border rounded-lg overflow-hidden"
      >
        {/* Map Container */}
        <div className="aspect-[4/3] md:aspect-[16/10]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1400,
              center: [-102, 23],
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <ZoomableGroup>
              <Geographies geography={MEXICO_TOPO_JSON}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => geo.properties.state_name) // Only states, not municipalities
                    .map((geo) => {
                      const stateName = geo.properties.state_name;
                      const stateData = stateHomicideData.find(
                        (s) => s.name === stateName || s.name === geo.properties.state_name
                      );
                      const isHighlighted = highlightStates.some(
                        (h) =>
                          stateName?.toLowerCase().includes(h.toLowerCase()) ||
                          h.toLowerCase().includes(stateName?.toLowerCase() || "")
                      );

                      return (
                        <MemoizedGeography
                          key={geo.rsmKey}
                          geo={geo}
                          stateData={stateData}
                          isHighlighted={isHighlighted}
                          onHover={handleHover}
                          onLeave={handleLeave}
                          isHovered={tooltipData?.name === stateName}
                        />
                      );
                    })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Tooltip */}
        {tooltipData && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border border-border px-4 py-3 rounded-lg shadow-lg max-w-xs">
            <p className="font-serif font-semibold text-foreground text-lg">
              {tooltipData.name}
            </p>
            {tooltipData.data ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Homicide Rate:</span>{" "}
                  <span className="text-primary font-mono font-bold">
                    {tooltipData.data.homicideRate.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-xs"> /100k</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Total (2023):</span>{" "}
                  <span className="text-foreground font-mono">
                    {tooltipData.data.totalHomicides.toLocaleString()}
                  </span>
                </p>
                {tooltipData.data.cartelPresence.length > 0 && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Cartels:</span>{" "}
                    <span className="text-foreground text-xs">
                      {tooltipData.data.cartelPresence.join(", ")}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Data unavailable
              </p>
            )}
          </div>
        )}

        {/* Map Labels */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          <p>Homicide rates per 100,000 population (2023)</p>
          <p className="text-xs opacity-70">Source: INEGI</p>
        </div>
      </motion.div>

      {/* Legend */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6"
        >
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        <div className="bg-card border border-border p-4 text-center rounded">
          <p className="font-mono text-2xl md:text-3xl text-primary font-bold">
            98.3
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Colima (Highest Rate)
          </p>
        </div>
        <div className="bg-card border border-border p-4 text-center rounded">
          <p className="font-mono text-2xl md:text-3xl text-foreground font-bold">
            2.8
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Yucatan (Lowest Rate)
          </p>
        </div>
        <div className="bg-card border border-border p-4 text-center rounded">
          <p className="font-mono text-2xl md:text-3xl text-primary font-bold">
            35+
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            States with CJNG
          </p>
        </div>
        <div className="bg-card border border-border p-4 text-center rounded">
          <p className="font-mono text-2xl md:text-3xl text-foreground font-bold">
            31K+
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total Homicides (2023)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
