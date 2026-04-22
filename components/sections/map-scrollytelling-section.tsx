"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Mexico from "@svg-maps/mexico";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { InlineCounter } from "@/components/death-counter";
import { X, MapPin, Skull, Users, AlertTriangle, ChevronDown } from "lucide-react";

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

// 2012 Hotspot states during Calderón era
const hotspotStates2012 = ["Michoacán", "Sinaloa", "Chihuahua", "Tamaulipas", "Guerrero", "Jalisco", "Nuevo León", "Durango"];

// Story segments for scrollytelling
const storySegments = [
  {
    id: "war-intro",
    phase: "2012",
    title: "December 11, 2006",
    subtitle: "THE WAR BEGINS",
    content: "Ten days after taking office, President Felipe Calderón deployed 6,500 troops to his home state of Michoacán. He called it 'Operation Michoacán.'",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calderon_war-0udAEf3UZs3C0WkStkbX2hCZu30uPg.avif",
    imageAlt: "Mexican military deployment during Calderón's drug war",
  },
  {
    id: "war-strategy",
    phase: "2012",
    title: "The Kingpin Strategy",
    subtitle: "A FLAWED APPROACH",
    content: "The plan was simple: kill or capture cartel leaders, break up the organizations, and watch the violence end. It backfired spectacularly. Cutting off the heads created power vacuums. Cartels broke into smaller, more violent factions.",
    stats: [
      { label: "2006 Homicides", value: "11,806" },
      { label: "2011 Homicides", value: "27,213", highlight: true },
      { label: "Increase", value: "+130%", danger: true },
    ],
  },
  {
    id: "war-hotspots",
    phase: "2012",
    title: "Violence Hotspots by 2012",
    subtitle: "STATES IN CRISIS",
    content: "By the end of Calderón's term, eight states had become war zones. Michoacán, Sinaloa, Chihuahua, Tamaulipas, Guerrero, Jalisco, Nuevo León, and Durango saw the highest levels of cartel violence.",
    highlightStates: hotspotStates2012,
  },
  {
    id: "war-cost",
    phase: "2012",
    title: "The Cost of the Calderón Era",
    subtitle: "121,000 LIVES LOST",
    content: "More than double the previous administration. The militarized approach did not defeat the cartels. It multiplied them.",
    quote: {
      text: "We will not rest until we restore peace and security to Mexican families.",
      author: "Felipe Calderón, 2006",
    },
  },
  {
    id: "transition",
    phase: "transition",
    title: "The Violence Continued",
    subtitle: "2012 TO PRESENT",
    content: "Each administration that followed inherited the chaos. The cartels adapted, expanded, and grew more powerful. CJNG rose from the ashes of the Milenio Cartel to become the dominant force.",
  },
  {
    id: "data-intro",
    phase: "2024",
    title: "State-Level Violence Analysis",
    subtitle: "THE NUMBERS TODAY",
    content: "Click on any state to explore detailed homicide rates, cartel presence, and documented stories from INEGI 2023-2024 data.",
    interactive: true,
  },
  {
    id: "data-colima",
    phase: "2024",
    title: "Colima: Ground Zero",
    subtitle: "HIGHEST MURDER RATE",
    content: "With 98.3 homicides per 100,000 people, Colima has the highest murder rate in Mexico. The tiny state is ground zero for the war between CJNG and Sinaloa Cartel over the strategic port of Manzanillo.",
    focusState: "Colima",
  },
  {
    id: "data-guanajuato",
    phase: "2024",
    title: "Guanajuato: The Fuel War",
    subtitle: "MOST TOTAL DEATHS",
    content: "The war between CJNG and Santa Rosa de Lima Cartel over fuel theft has made Guanajuato Mexico's deadliest state by total homicides. Over 4,200 people were killed in 2023 alone.",
    focusState: "Guanajuato",
  },
  {
    id: "data-conclusion",
    phase: "2024",
    title: "No State is Untouched",
    subtitle: "CJNG IN 28 STATES",
    content: "Only Yucatán remains relatively peaceful with a homicide rate of 2.8 per 100,000. Every other state has felt the impact of cartel violence.",
    interactive: true,
  },
];

export function MapScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState(0);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Determine active segment based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const segmentIndex = Math.min(
        Math.floor(value * storySegments.length),
        storySegments.length - 1
      );
      setActiveSegment(segmentIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const currentSegment = storySegments[activeSegment];
  const currentPhase = currentSegment?.phase || "2012";

  const getStateData = (name: string) => stateHomicideData.find(s => s.name === name);
  const selectedData = selectedState ? getStateData(selectedState) : null;

  // Get state color based on current phase
  const getStateColor = (name: string) => {
    const data = getStateData(name);
    if (!data) return "#1a1a1a";

    if (currentPhase === "2012") {
      // Highlight only 2012 hotspot states
      if (currentSegment?.highlightStates?.includes(name)) {
        return "#8b2500"; // Red for hotspots
      }
      if (hotspotStates2012.includes(name) && activeSegment >= 2) {
        return "#7d4e2e"; // Orange for known hotspots
      }
      return "#1a2e1a"; // Dim green for others
    }

    // 2024 phase - show current violence levels
    if (selectedState && selectedState !== name) return "#151515";
    if (currentSegment?.focusState === name) {
      return "#c9a84c"; // Gold highlight for focused state
    }
    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleStateClick = (stateName: string) => {
    if (currentSegment?.interactive) {
      setSelectedState(selectedState === stateName ? null : stateName);
    }
  };

  const legendItems = currentPhase === "2012"
    ? [
        { label: "War Zone", color: "#8b2500" },
        { label: "High Violence", color: "#7d4e2e" },
        { label: "Lower Violence", color: "#1a2e1a" },
      ]
    : [
        { label: "Low (<10)", color: "#1a2e1a" },
        { label: "Medium (10-25)", color: "#4a3728" },
        { label: "High (25-45)", color: "#7d4e2e" },
        { label: "Extreme (>45)", color: "#8b2500" },
      ];

  return (
    <section ref={containerRef} className="relative bg-background">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex">
        {/* Left: Sticky Map */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="relative w-full max-w-2xl" onMouseMove={handleMouseMove}>
            {/* Map Title */}
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-0 left-0 right-0 text-center z-10"
            >
              <p className="font-mono text-primary text-xs tracking-widest mb-1">
                {currentPhase === "2012" ? "CALDERÓN ERA" : "CURRENT DATA"}
              </p>
              <h3 className="font-serif text-xl text-foreground">
                {currentPhase === "2012" ? "Violence Hotspots by 2012" : "State-Level Violence Analysis"}
              </h3>
            </motion.div>

            {/* Mexico SVG Map */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={Mexico.viewBox}
              className="w-full h-auto mt-16"
              style={{ minHeight: "400px" }}
              aria-label={Mexico.label}
            >
              <defs>
                <linearGradient id="oceanGradScroll" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c1222" />
                  <stop offset="100%" stopColor="#0a0f1a" />
                </linearGradient>
                <filter id="stateGlowScroll" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect x="-50" y="-50" width="1200" height="900" fill="url(#oceanGradScroll)" />

              {Mexico.locations.map((location) => {
                const stateName = idToStateName[location.id] || location.name;
                const isHovered = hoveredState === stateName;
                const isSelected = selectedState === stateName;
                const isFocused = currentSegment?.focusState === stateName;
                const fillColor = getStateColor(stateName);
                const data = getStateData(stateName);

                return (
                  <motion.path
                    key={location.id}
                    d={location.path}
                    fill={fillColor}
                    stroke={isSelected || isFocused ? "#c9a84c" : isHovered ? "#c9a84c80" : "#3a3a3a"}
                    strokeWidth={isSelected || isFocused ? 2.5 : isHovered ? 1.5 : 0.5}
                    animate={{
                      scale: isFocused ? 1.03 : 1,
                      filter: isFocused ? "url(#stateGlowScroll)" : "none",
                    }}
                    transition={{ duration: 0.4 }}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(stateName)}
                    style={{
                      cursor: currentSegment?.interactive ? "pointer" : "default",
                      transformOrigin: "center",
                    }}
                    className="transition-colors duration-300"
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredState && !selectedState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute z-50 pointer-events-none"
                style={{
                  left: Math.min(tooltipPos.x + 15, 300),
                  top: Math.max(tooltipPos.y - 10, 80)
                }}
              >
                <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg p-3 shadow-2xl min-w-[160px]">
                  {(() => {
                    const data = getStateData(hoveredState);
                    if (!data) return <p className="text-foreground font-serif">{hoveredState}</p>;
                    return (
                      <>
                        <p className="font-serif font-semibold text-foreground text-sm">{data.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Rate: <span className="text-primary font-mono">{data.homicideRate}</span>/100k
                        </p>
                        {currentSegment?.interactive && data.story && (
                          <p className="text-xs text-primary mt-1">Click for story</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                {currentPhase === "2012" ? "2012 Status" : "Homicides/100k"}
              </p>
              <div className="space-y-1">
                {legendItems.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-2 rounded" style={{ backgroundColor: color }} />
                    <span className="text-xs text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected State Panel (when interactive) */}
        <AnimatePresence>
          {selectedData && currentSegment?.interactive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 top-0 w-96 h-full bg-background/95 backdrop-blur border-l border-border p-6 overflow-y-auto z-20"
            >
              <button
                onClick={() => setSelectedState(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-muted hover:bg-muted/80"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-foreground pr-8">
                {selectedData.name}
              </h3>

              <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded text-xs font-semibold uppercase ${
                selectedData.violenceLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                selectedData.violenceLevel === "high" ? "bg-orange-500/20 text-orange-400" :
                selectedData.violenceLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-green-500/20 text-green-400"
              }`}>
                <AlertTriangle className="w-3 h-3" />
                {selectedData.violenceLevel} violence
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Skull className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="font-mono text-xl font-bold text-primary">{selectedData.homicideRate}</p>
                  <p className="text-xs text-muted-foreground">per 100k</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <Users className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="font-mono text-xl font-bold text-foreground">{selectedData.totalHomicides.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total deaths</p>
                </div>
              </div>

              {selectedData.cartelPresence.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Active Cartels</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedData.cartelPresence.map(cartel => (
                      <span key={cartel} className="text-xs bg-primary/15 text-primary px-2 py-1 rounded">
                        {cartel}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrolling story content */}
      <div className="relative">
        {storySegments.map((segment, index) => (
          <div
            key={segment.id}
            className="min-h-screen flex items-center lg:justify-end"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-30%" }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 p-8 lg:p-16"
            >
              <div className="max-w-lg ml-auto">
                {/* Subtitle */}
                <p className="font-mono text-primary text-sm tracking-widest mb-3">
                  {segment.subtitle}
                </p>

                {/* Title */}
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {segment.title}
                </h2>

                {/* Content */}
                <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                  {segment.content}
                </p>

                {/* Image */}
                {segment.image && (
                  <div className="relative aspect-video mt-8 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={segment.image}
                      alt={segment.imageAlt || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* Stats */}
                {segment.stats && (
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {segment.stats.map((stat) => (
                      <div key={stat.label} className="bg-muted/30 border border-border p-4 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {stat.label}
                        </p>
                        <p className={`font-mono text-2xl font-bold ${
                          stat.danger ? "text-red-500" :
                          stat.highlight ? "text-primary" :
                          "text-foreground"
                        }`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote */}
                {segment.quote && (
                  <blockquote className="border-l-4 border-primary pl-6 py-2 mt-8">
                    <p className="text-xl italic text-foreground">
                      &ldquo;{segment.quote.text}&rdquo;
                    </p>
                    <cite className="text-muted-foreground mt-2 block">
                      — {segment.quote.author}
                    </cite>
                  </blockquote>
                )}

                {/* Interactive hint */}
                {segment.interactive && (
                  <div className="flex items-center gap-2 mt-8 text-primary">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">Click states on the map to explore stories</p>
                  </div>
                )}

                {/* Scroll indicator */}
                {index < storySegments.length - 1 && (
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex justify-center mt-12"
                  >
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile: Full-width map shown between sections */}
      <div className="lg:hidden">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
          <p className="text-center font-mono text-primary text-xs tracking-widest mb-2">
            {currentPhase === "2012" ? "CALDERÓN ERA" : "CURRENT DATA"}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={Mexico.viewBox}
            className="w-full h-auto"
            style={{ minHeight: "250px" }}
          >
            <rect x="-50" y="-50" width="1200" height="900" fill="#0c1222" />
            {Mexico.locations.map((location) => {
              const stateName = idToStateName[location.id] || location.name;
              const fillColor = getStateColor(stateName);
              return (
                <path
                  key={location.id}
                  d={location.path}
                  fill={fillColor}
                  stroke="#3a3a3a"
                  strokeWidth={0.5}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
