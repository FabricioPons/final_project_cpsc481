"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import Mexico from "@svg-maps/mexico";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { InlineCounter } from "@/components/death-counter";
import { X, MapPin, Skull, Users, AlertTriangle, ChevronDown } from "lucide-react";

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

const hotspotStates2012 = [
  "Michoacán", "Sinaloa", "Chihuahua", "Tamaulipas",
  "Guerrero", "Jalisco", "Nuevo León", "Durango",
];

const storySegments = [
  {
    id: "war-intro",
    phase: "2012" as const,
    title: "December 11, 2006",
    subtitle: "THE WAR BEGINS",
    content: "Ten days after taking office, President Felipe Calderón deployed 6,500 troops to his home state of Michoacán. He called it 'Operation Michoacán.' Nobody knew it would last for decades.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calderon_war-0udAEf3UZs3C0WkStkbX2hCZu30uPg.avif",
    imageAlt: "Mexican military deployment during Calderón's drug war",
  },
  {
    id: "war-strategy",
    phase: "2012" as const,
    title: "The Kingpin Strategy",
    subtitle: "A FLAWED APPROACH",
    content: "Kill or capture cartel leaders, break up the organizations, and watch the violence end. It backfired spectacularly. Cutting off the heads created power vacuums. Cartels broke into smaller, more violent factions. They fought each other for territory. Civilians got caught in the crossfire.",
    stats: [
      { label: "2006 Homicides", value: "11,806" },
      { label: "2011 Homicides", value: "27,213", highlight: true },
      { label: "Increase", value: "+130%", danger: true },
    ],
  },
  {
    id: "war-hotspots",
    phase: "2012" as const,
    title: "Violence Hotspots by 2012",
    subtitle: "STATES IN CRISIS",
    content: "By the end of Calderón's term, eight states had become war zones. Each glowing red on the map tells a story of a community overwhelmed. Click any state to read what happened there.",
    highlightStates: hotspotStates2012,
  },
  {
    id: "war-cost",
    phase: "2012" as const,
    title: "The Cost of the Calderón Era",
    subtitle: "121,000 LIVES LOST",
    content: "More than double the previous administration. The militarized approach did not defeat the cartels. It multiplied them. And the killing did not stop when Calderón left office.",
    quote: {
      text: "We will not rest until we restore peace and security to Mexican families.",
      author: "Felipe Calderón, 2006",
    },
  },
  {
    id: "transition",
    phase: "transition" as const,
    title: "The Violence Never Stopped",
    subtitle: "2012 TO PRESENT",
    content: "Each administration that followed inherited the chaos. The cartels adapted, expanded, and grew more powerful. What began in eight states spread to nearly all of Mexico.",
  },
  {
    id: "data-intro",
    phase: "2024" as const,
    title: "State-Level Violence Today",
    subtitle: "THE NUMBERS NOW",
    content: "The map has transformed. What were eight hotspots in 2012 are now 24 states classified as high or extreme violence. Click on any state to explore its story.",
  },
  {
    id: "data-colima",
    phase: "2024" as const,
    title: "Colima: Ground Zero",
    subtitle: "98.3 DEATHS PER 100K",
    content: "The highest murder rate in the world for a Mexican state. CJNG and Sinaloa Cartel are fighting for control of the port of Manzanillo. Click Colima on the map.",
    focusState: "Colima",
  },
  {
    id: "data-guanajuato",
    phase: "2024" as const,
    title: "Guanajuato: The Fuel War",
    subtitle: "4,234 KILLED IN 2023",
    content: "The most deaths of any state. CJNG and the Santa Rosa de Lima Cartel are fighting over PEMEX fuel theft. A state once known for mining and colonial architecture is now Mexico's deadliest. Click Guanajuato.",
    focusState: "Guanajuato",
  },
  {
    id: "data-conclusion",
    phase: "2024" as const,
    title: "No State Is Untouched",
    subtitle: "CJNG IN 28 STATES",
    content: "Only Yucatán remains relatively peaceful. Every other state has felt the weight of this war. Behind every number is a person who did not come home. Explore the map.",
  },
];

type Segment = typeof storySegments[number];

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

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const idx = Math.min(
        Math.floor(value * storySegments.length),
        storySegments.length - 1
      );
      setActiveSegment(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const currentSegment: Segment = storySegments[activeSegment];
  const currentPhase = currentSegment?.phase ?? "2012";

  const getStateData = (name: string) =>
    stateHomicideData.find((s) => s.name === name);
  const selectedData = selectedState ? getStateData(selectedState) : null;

  const getStateColor = (name: string) => {
    const data = getStateData(name);
    if (!data) return "#1a1a1a";

    if (currentPhase === "2012" || currentPhase === "transition") {
      const seg = currentSegment as Extract<Segment, { phase: "2012" }>;
      const highlightList = "highlightStates" in seg ? seg.highlightStates : undefined;
      if (highlightList?.includes(name)) return "#8b2500";
      if (hotspotStates2012.includes(name) && activeSegment >= 2) return "#7d4e2e";
      return "#1a2e1a";
    }

    // 2024 phase
    const seg = currentSegment as Extract<Segment, { phase: "2024" }>;
    const focusState = "focusState" in seg ? seg.focusState : undefined;
    if (selectedState === name) return getViolenceLevelColor(data.homicideRate);
    if (focusState === name) return "#c9a84c";
    if (selectedState && selectedState !== name) return "#151515";
    return getViolenceLevelColor(data.homicideRate);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleStateClick = (stateName: string) => {
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  };

  const legendItems =
    currentPhase === "2012" || currentPhase === "transition"
      ? [
          { label: "War Zone", color: "#8b2500" },
          { label: "High Violence", color: "#7d4e2e" },
          { label: "Lower Violence", color: "#1a2e1a" },
        ]
      : [
          { label: "Low (<10)", color: "#1a2e1a" },
          { label: "Medium (10–25)", color: "#4a3728" },
          { label: "High (25–45)", color: "#7d4e2e" },
          { label: "Extreme (>45)", color: "#8b2500" },
        ];

  return (
    <section ref={containerRef} className="relative bg-background">
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen flex overflow-hidden">

        {/* LEFT: fixed map */}
        <div className="hidden lg:flex w-1/2 h-full flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">

          {/* Phase label + title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4 }}
              className="absolute top-6 left-0 right-0 text-center px-6 z-10"
            >
              <p className="font-mono text-primary text-xs tracking-widest">
                {currentPhase === "2024" ? "CURRENT DATA" : "CALDERÓN ERA"}
              </p>
              <h3 className="font-serif text-xl text-foreground mt-1">
                {currentPhase === "2024"
                  ? "State-Level Violence Analysis"
                  : "Violence Hotspots by 2012"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                Click any state to read its story
              </p>
            </motion.div>
          </AnimatePresence>

          {/* SVG map */}
          <div className="relative w-full px-8 mt-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={Mexico.viewBox}
              className="w-full h-auto"
              style={{ maxHeight: "calc(100vh - 220px)" }}
              aria-label="Interactive map of Mexico"
              onMouseMove={handleMouseMove}
            >
              <defs>
                <linearGradient id="ocean-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0c1222" />
                  <stop offset="100%" stopColor="#0a0f1a" />
                </linearGradient>
              </defs>
              <rect x="-50" y="-50" width="1200" height="900" fill="url(#ocean-bg)" />

              {Mexico.locations.map((loc) => {
                const name = idToStateName[loc.id] ?? loc.name;
                const isHovered = hoveredState === name;
                const isSelected = selectedState === name;
                const seg = currentSegment as Extract<Segment, { phase: "2024" }>;
                const isFocused = "focusState" in seg && seg.focusState === name;
                const fill = getStateColor(name);

                return (
                  <path
                    key={loc.id}
                    d={loc.path}
                    fill={fill}
                    stroke={
                      isSelected || isFocused
                        ? "#c9a84c"
                        : isHovered
                        ? "rgba(201,168,76,0.5)"
                        : "#3a3a3a"
                    }
                    strokeWidth={isSelected || isFocused ? 2.5 : isHovered ? 1.5 : 0.5}
                    style={{
                      cursor: "pointer",
                      transition: "fill 0.3s ease, stroke 0.15s ease",
                    }}
                    onMouseEnter={() => setHoveredState(name)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(name)}
                  />
                );
              })}
            </svg>

            {/* Hover tooltip */}
            {hoveredState && !selectedState && (
              <div
                className="absolute z-50 pointer-events-none"
                style={{
                  left: Math.min(tooltipPos.x + 15, 280),
                  top: Math.max(tooltipPos.y - 10, 80),
                }}
              >
                <div className="bg-background/95 backdrop-blur border border-primary/30 rounded-lg p-3 shadow-2xl min-w-[160px]">
                  {(() => {
                    const d = getStateData(hoveredState);
                    if (!d) return <p className="text-foreground font-serif text-sm">{hoveredState}</p>;
                    return (
                      <>
                        <p className="font-serif font-semibold text-foreground text-sm">{d.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Rate:{" "}
                          <span className="text-primary font-mono">{d.homicideRate}</span>
                          /100k
                        </p>
                        {d.story && (
                          <p className="text-xs text-primary mt-1">Click to read story</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase + "-legend"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 left-6 bg-background/90 backdrop-blur border border-border rounded-lg p-3"
            >
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                {currentPhase === "2024" ? "Homicides/100k" : "2012 Status"}
              </p>
              <div className="space-y-1.5">
                {legendItems.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded border border-white/10" style={{ backgroundColor: color }} />
                    <span className="text-xs text-foreground/80">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Source */}
          <p className="absolute bottom-6 right-6 text-xs text-muted-foreground/40 font-mono">
            Source: INEGI 2023
          </p>

          {/* State story drawer — slides up from bottom of the map panel */}
          <AnimatePresence>
            {selectedData && (
              <motion.div
                key={selectedData.name}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                className="absolute bottom-0 left-0 right-0 bg-background/97 backdrop-blur-xl border-t border-primary/20 rounded-t-2xl p-6 max-h-[55%] overflow-y-auto z-30"
              >
                {/* Drag handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

                <button
                  onClick={() => setSelectedState(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="flex-1 pr-8">
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {selectedData.name}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        selectedData.violenceLevel === "extreme"
                          ? "bg-red-500/20 text-red-400"
                          : selectedData.violenceLevel === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : selectedData.violenceLevel === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {selectedData.violenceLevel} violence
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center shrink-0">
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <Skull className="w-3 h-3 mx-auto text-primary mb-0.5" />
                      <p className="font-mono text-base font-bold text-primary leading-none">
                        {selectedData.homicideRate}
                      </p>
                      <p className="text-[10px] text-muted-foreground">per 100k</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <Users className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
                      <p className="font-mono text-base font-bold text-foreground leading-none">
                        {selectedData.totalHomicides.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">deaths</p>
                    </div>
                  </div>
                </div>

                {selectedData.cartelPresence.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Active Cartels
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedData.cartelPresence.map((c) => (
                        <span
                          key={c}
                          className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedData.story ? (
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="font-mono text-xs text-primary uppercase tracking-wider mb-1">
                      {selectedData.story.date}
                    </p>
                    <h4 className="font-serif text-base font-semibold text-foreground leading-snug">
                      {selectedData.story.headline}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {selectedData.story.description}
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-3 italic">
                      Source: {selectedData.story.source}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic mt-5 pt-5 border-t border-border">
                    This state has lower levels of cartel-related violence with no major documented incidents.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: scrolling story cards */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto scrollbar-hide">
          {/* spacer so first card doesn't start at very top */}
          <div className="h-[10vh]" />

          {storySegments.map((segment, index) => (
            <div
              key={segment.id}
              className="min-h-screen flex items-center px-8 lg:px-14 py-16"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-25%" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="max-w-lg w-full"
              >
                <p className="font-mono text-primary text-xs tracking-widest mb-3">
                  {segment.subtitle}
                </p>

                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight text-balance">
                  {segment.title}
                </h2>

                <p className="text-lg text-muted-foreground mt-5 leading-relaxed">
                  {segment.content}
                </p>

                {/* Image */}
                {"image" in segment && segment.image && (
                  <div className="relative aspect-video mt-8 rounded-xl overflow-hidden border border-border shadow-2xl">
                    <Image
                      src={segment.image}
                      alt={"imageAlt" in segment ? (segment.imageAlt ?? "") : ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  </div>
                )}

                {/* Stats grid */}
                {"stats" in segment && segment.stats && (
                  <div className="grid grid-cols-3 gap-3 mt-8">
                    {segment.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-muted/30 border border-border p-4 rounded-lg text-center"
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {stat.label}
                        </p>
                        <p
                          className={`font-mono text-2xl font-bold ${
                            stat.danger
                              ? "text-red-500"
                              : stat.highlight
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote */}
                {"quote" in segment && segment.quote && (
                  <blockquote className="border-l-4 border-primary pl-6 py-2 mt-8">
                    <p className="text-xl italic text-foreground">
                      &ldquo;{segment.quote.text}&rdquo;
                    </p>
                    <cite className="text-muted-foreground mt-2 block not-italic text-sm">
                      — {segment.quote.author}
                    </cite>
                  </blockquote>
                )}

                {/* Interactive cue */}
                {"focusState" in segment && segment.focusState && (
                  <div className="flex items-center gap-2 mt-6 text-sm text-primary">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>{segment.focusState}</strong> is highlighted on the map. Click it to read the full story.
                    </span>
                  </div>
                )}

                {/* Scroll nudge */}
                {index < storySegments.length - 1 && (
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex justify-start mt-10"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}

          {/* bottom padding */}
          <div className="h-[20vh]" />
        </div>
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="lg:hidden py-8 px-4 space-y-8">
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl p-4">
          <p className="text-center font-mono text-primary text-xs tracking-widest mb-3">
            MEXICO VIOLENCE MAP
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={Mexico.viewBox}
            className="w-full h-auto"
          >
            <rect x="-50" y="-50" width="1200" height="900" fill="#0c1222" />
            {Mexico.locations.map((loc) => {
              const name = idToStateName[loc.id] ?? loc.name;
              const d = getStateData(name);
              const fill = d ? getViolenceLevelColor(d.homicideRate) : "#1a1a1a";
              return (
                <path
                  key={loc.id}
                  d={loc.path}
                  fill={fill}
                  stroke="#3a3a3a"
                  strokeWidth={0.5}
                />
              );
            })}
          </svg>
        </div>

        {storySegments.slice(0, 4).map((segment) => (
          <div key={segment.id} className="space-y-3">
            <p className="font-mono text-primary text-xs tracking-widest">{segment.subtitle}</p>
            <h3 className="font-serif text-2xl font-bold text-foreground">{segment.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{segment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
