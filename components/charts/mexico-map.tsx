"use client";

import { useState, useRef, useEffect, memo, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";

// TopoJSON URL for Mexico states (official INEGI data)
const MEXICO_TOPOJSON_URL =
  "https://raw.githubusercontent.com/angelnmara/geojson/master/mexicoHigh.json";

// State name mapping from GeoJSON properties to our data
const stateNameMapping: Record<string, string> = {
  Aguascalientes: "Aguascalientes",
  "Baja California": "Baja California",
  "Baja California Sur": "Baja California Sur",
  Campeche: "Campeche",
  Chiapas: "Chiapas",
  Chihuahua: "Chihuahua",
  "Coahuila de Zaragoza": "Coahuila",
  Coahuila: "Coahuila",
  Colima: "Colima",
  "Ciudad de México": "Ciudad de México",
  "Distrito Federal": "Ciudad de México",
  Durango: "Durango",
  Guanajuato: "Guanajuato",
  Guerrero: "Guerrero",
  Hidalgo: "Hidalgo",
  Jalisco: "Jalisco",
  México: "México",
  Mexico: "México",
  "Estado de México": "México",
  "Michoacán de Ocampo": "Michoacán",
  Michoacán: "Michoacán",
  Morelos: "Morelos",
  Nayarit: "Nayarit",
  "Nuevo León": "Nuevo León",
  Oaxaca: "Oaxaca",
  Puebla: "Puebla",
  Querétaro: "Querétaro",
  Queretaro: "Querétaro",
  "Quintana Roo": "Quintana Roo",
  "San Luis Potosí": "San Luis Potosí",
  "San Luis Potosi": "San Luis Potosí",
  Sinaloa: "Sinaloa",
  Sonora: "Sonora",
  Tabasco: "Tabasco",
  Tamaulipas: "Tamaulipas",
  Tlaxcala: "Tlaxcala",
  "Veracruz de Ignacio de la Llave": "Veracruz",
  Veracruz: "Veracruz",
  Yucatán: "Yucatán",
  Yucatan: "Yucatán",
  Zacatecas: "Zacatecas",
};

interface GeoFeature {
  type: string;
  properties: {
    name?: string;
    NAME?: string;
    ESTADO?: string;
    state_name?: string;
    NOM_ENT?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

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
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [geoData, setGeoData] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map dimensions
  const width = 800;
  const height = 600;

  // Fetch GeoJSON data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(MEXICO_TOPOJSON_URL);
        if (!response.ok) throw new Error("Failed to fetch map data");

        const data = await response.json();

        // Handle both GeoJSON and TopoJSON formats
        let features: GeoFeature[];
        if (data.type === "Topology") {
          // TopoJSON format
          const objectKey = Object.keys(data.objects)[0];
          features = topojson.feature(data, data.objects[objectKey])
            .features as GeoFeature[];
        } else if (data.type === "FeatureCollection") {
          // GeoJSON format
          features = data.features as GeoFeature[];
        } else {
          throw new Error("Unknown data format");
        }

        setGeoData(features);
        setError(null);
      } catch (err) {
        console.error("Error loading map:", err);
        setError("Failed to load map data");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  // D3 projection for Mexico
  const projection = useMemo(() => {
    return d3Geo
      .geoMercator()
      .center([-102, 23.5]) // Center on Mexico
      .scale(1400)
      .translate([width / 2, height / 2]);
  }, []);

  // Path generator
  const pathGenerator = useMemo(() => {
    return d3Geo.geoPath().projection(projection);
  }, [projection]);

  // Get state name from feature properties
  const getStateName = (feature: GeoFeature): string => {
    const props = feature.properties;
    const rawName =
      props.name ||
      props.NAME ||
      props.ESTADO ||
      props.state_name ||
      props.NOM_ENT ||
      "Unknown";
    return stateNameMapping[rawName] || rawName;
  };

  // Get state data
  const getStateData = (stateName: string) => {
    return stateHomicideData.find((s) => s.name === stateName);
  };

  // Highlight codes mapping
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
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
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

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading map data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
      <div className="relative bg-card border border-border rounded-lg p-2 md:p-4 overflow-hidden">
        {/* SVG Map */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: "550px" }}
          onMouseMove={handleMouseMove}
        >
          {/* Background */}
          <rect x="0" y="0" width={width} height={height} fill="#0a0a0a" />

          {/* Water/Ocean effect */}
          <rect x="0" y="0" width={width} height={height} fill="#050508" />

          {/* States */}
          <g>
            {geoData.map((feature, index) => {
              const stateName = getStateName(feature);
              const isHovered = hoveredState === stateName;
              const pathD = pathGenerator(
                feature as d3Geo.GeoPermissibleObjects
              );

              if (!pathD) return null;

              return (
                <motion.path
                  key={`${stateName}-${index}`}
                  d={pathD}
                  fill={getStateColor(stateName)}
                  stroke={isHovered ? "#c9a84c" : "#333"}
                  strokeWidth={isHovered ? 2 : 0.5}
                  initial={{ opacity: 0 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          fill: getStateColor(stateName),
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: index * 0.015,
                  }}
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </g>

          {/* Country outline */}
          {geoData.length > 0 && (
            <path
              d={
                pathGenerator({
                  type: "FeatureCollection",
                  features: geoData,
                } as d3Geo.GeoPermissibleObjects) || ""
              }
              fill="none"
              stroke="#444"
              strokeWidth={1.5}
              pointerEvents="none"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 15, width - 220),
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
