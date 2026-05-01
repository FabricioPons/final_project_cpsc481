"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Mexico from "@svg-maps/mexico";
import { stateHomicideData, getViolenceLevelColor } from "@/lib/data";
import { InlineCounter } from "@/components/death-counter";
import { X, MapPin, Skull, Users, AlertTriangle } from "lucide-react";

/* ─── id → display name ──────────────────────────────────────────────── */
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

/* ─── 2012 hotspot states ─────────────────────────────────────────────── */
const hotspotStates2012 = [
  "Michoacán", "Sinaloa", "Chihuahua", "Tamaulipas",
  "Guerrero", "Jalisco", "Nuevo León", "Durango",
];

/* ─── Story segments (each = one full-height scroll step) ─────────────── */
const storySegments = [
  {
    id: "war-intro",
    phase: "2012" as const,
    title: "December 11, 2006",
    subtitle: "THE WAR BEGINS",
    content: "Ten days after taking office, President Felipe Calderón deployed 6,500 troops to his home state of Michoacán. He called it 'Operation Michoacán.' Nobody knew it would last for decades.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calderon_war-0udAEf3UZs3C0WkStkbX2hCZu30uPg.avif",
    imageAlt: "Mexican military deployment during Calderón's drug war",
    highlightStates: [] as string[],
  },
  {
    id: "war-strategy",
    phase: "2012" as const,
    title: "The Kingpin Strategy",
    subtitle: "A FLAWED APPROACH",
    content: "Kill or capture cartel leaders, break up the organizations, and watch the violence end. It backfired spectacularly. Cutting off the heads created power vacuums. Cartels broke into smaller, more violent factions that fought each other — and civilians — for control.",
    stats: [
      { label: "2006 Homicides", value: "11,806" },
      { label: "2011 Homicides", value: "27,213", highlight: true },
      { label: "Increase", value: "+130%", danger: true },
    ],
    highlightStates: [] as string[],
  },
  {
    id: "war-hotspots",
    phase: "2012" as const,
    title: "Violence Hotspots by 2012",
    subtitle: "STATES IN CRISIS",
    content: "By the end of Calderón's term, eight states had become war zones. Each highlighted in red tells a story of a community overwhelmed. Click any state to read what happened there.",
    highlightStates: hotspotStates2012,
  },
  {
    id: "war-cost",
    phase: "2012" as const,
    title: "The Cost of the Calderón Era",
    subtitle: "121,000 LIVES LOST",
    content: "More than double the previous administration. The militarized approach did not defeat the cartels — it multiplied them. And the killing did not stop when Calderón left office.",
    quote: {
      text: "We will not rest until we restore peace and security to Mexican families.",
      author: "Felipe Calderón, 2006",
    },
    highlightStates: hotspotStates2012,
  },
  {
    id: "transition",
    phase: "transition" as const,
    title: "The Violence Never Stopped",
    subtitle: "2012 TO PRESENT",
    content: "Each administration that followed inherited the chaos. The cartels adapted, expanded, and grew more powerful. What began in eight states spread to nearly all of Mexico.",
    highlightStates: hotspotStates2012,
  },
  {
    id: "data-intro",
    phase: "2024" as const,
    title: "State-Level Violence Today",
    subtitle: "THE NUMBERS NOW",
    content: "The map has transformed. What were eight hotspots in 2012 are now 24 states classified as high or extreme violence. Click on any state to explore its story.",
    highlightStates: [] as string[],
  },
  {
    id: "data-colima",
    phase: "2024" as const,
    title: "Colima: Ground Zero",
    subtitle: "98.3 DEATHS PER 100K",
    content: "The highest murder rate in the world for a Mexican state. CJNG and Sinaloa Cartel are fighting for control of the port of Manzanillo. Click Colima on the map.",
    focusState: "Colima",
    highlightStates: [] as string[],
  },
  {
    id: "data-guanajuato",
    phase: "2024" as const,
    title: "Guanajuato: The Fuel War",
    subtitle: "4,234 KILLED IN 2023",
    content: "The most deaths of any state. CJNG and the Santa Rosa de Lima Cartel are fighting over PEMEX fuel theft. A state once known for mining and colonial architecture is now Mexico's deadliest. Click Guanajuato.",
    focusState: "Guanajuato",
    highlightStates: [] as string[],
  },
  {
    id: "data-conclusion",
    phase: "2024" as const,
    title: "No State Is Untouched",
    subtitle: "CJNG IN 28 STATES",
    content: "Only Yucatán remains relatively peaceful. Every other state has felt the weight of this war. Behind every number is a person who did not come home. Explore the map.",
    highlightStates: [] as string[],
  },
] as const;

type Segment = typeof storySegments[number];
type Phase = Segment["phase"];

/* ─── Color logic ─────────────────────────────────────────────────────── */
function getStateColor(
  name: string,
  phase: Phase,
  highlightStates: readonly string[],
  focusState: string | undefined,
  selectedState: string | null
): string {
  const data = stateHomicideData.find((s) => s.name === name);
  if (!data) return "#1a1a1a";

  if (phase === "2012" || phase === "transition") {
    const isHot = hotspotStates2012.includes(name);
    const isHighlighted = highlightStates.includes(name);
    if (isHighlighted) return "#8b2500";
    if (isHot) return "#5a2200";
    return "#1a2e1a";
  }

  // 2024 phase — full violence-level colors
  if (selectedState && selectedState !== name) return "#151515";
  if (focusState === name) return "#c9a84c";
  return getViolenceLevelColor(data.homicideRate);
}

/* ─── Legend items ────────────────────────────────────────────────────── */
const legend2012 = [
  { label: "War Zone (2012)", color: "#8b2500" },
  { label: "Rising Violence", color: "#5a2200" },
  { label: "Lower Violence", color: "#1a2e1a" },
];
const legend2024 = [
  { label: "Low (<10)", color: "#1a2e1a" },
  { label: "Medium (10–25)", color: "#4a3728" },
  { label: "High (25–45)", color: "#7d4e2e" },
  { label: "Extreme (>45)", color: "#8b2500" },
];

/* ══════════════════════════════════════════════════════════════════════ */
export function MapScrollytellingSection() {
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Intersection observer — update active segment as story scrolls */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    segmentRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSegmentIdx(idx);
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const currentSegment = storySegments[activeSegmentIdx];
  const currentPhase: Phase = currentSegment.phase;
  const focusState = "focusState" in currentSegment ? currentSegment.focusState : undefined;
  const highlightStates = currentSegment.highlightStates ?? [];
  const legendItems = currentPhase === "2024" ? legend2024 : legend2012;

  const getStateData = (name: string) =>
    stateHomicideData.find((s) => s.name === name);
  const selectedData = selectedState ? getStateData(selectedState) : null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  const handleStateClick = useCallback((name: string) => {
    setSelectedState((prev) => (prev === name ? null : name));
  }, []);

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <section className="relative bg-background">
      {/* Sticky wrapper — only the left map is sticky */}
      <div className="relative lg:flex">

        {/* ── LEFT: sticky map panel ─────────────────────────────────── */}
        <div className="hidden lg:block sticky top-0 w-1/2 h-screen shrink-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">

          {/* Phase header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
              className="absolute top-6 inset-x-0 text-center z-10 px-4"
            >
              <p className="font-mono text-primary text-xs tracking-widest uppercase">
                {currentPhase === "2024" ? "Current Data" : "Calderón Era"}
              </p>
              <h3 className="font-serif text-xl text-foreground mt-1">
                {currentPhase === "2024"
                  ? "State-Level Violence Analysis"
                  : "Violence Hotspots by 2012"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-primary" />
                Click any state to read its story
              </p>
            </motion.div>
          </AnimatePresence>

          {/* SVG map */}
          <div className="absolute inset-0 flex items-center justify-center pt-24 pb-24 px-6">
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={Mexico.viewBox}
                className="w-full h-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
                aria-label="Interactive map of Mexico"
                onMouseMove={handleMouseMove}
              >
                <defs>
                  <linearGradient id="ms-ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c1222" />
                    <stop offset="100%" stopColor="#0a0f1a" />
                  </linearGradient>
                </defs>
                <rect x="-50" y="-50" width="1200" height="900" fill="url(#ms-ocean)" />

                {Mexico.locations.map((loc: { id: string; name: string; path: string }) => {
                  const name = idToStateName[loc.id] ?? loc.name;
                  const isHovered = hoveredState === name;
                  const isSelected = selectedState === name;
                  const isFocused = focusState === name;
                  const fill = getStateColor(
                    name, currentPhase, highlightStates, focusState, selectedState
                  );

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
                      strokeWidth={
                        isSelected || isFocused ? 2.5 : isHovered ? 1.5 : 0.5
                      }
                      style={{
                        cursor: "pointer",
                        transition: "fill 0.6s ease, stroke 0.15s ease",
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
                    left: Math.min(tooltipPos.x + 15, 260),
                    top: Math.max(tooltipPos.y - 10, 80),
                  }}
                >
                  <div className="bg-background/95 backdrop-blur border border-primary/30 rounded-lg p-3 shadow-xl min-w-[160px]">
                    {(() => {
                      const d = getStateData(hoveredState);
                      if (!d)
                        return (
                          <p className="text-foreground font-serif text-sm">
                            {hoveredState}
                          </p>
                        );
                      return (
                        <>
                          <p className="font-serif font-semibold text-foreground text-sm">
                            {d.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Rate:{" "}
                            <span className="text-primary font-mono">
                              {d.homicideRate}
                            </span>
                            /100k
                          </p>
                          {d.story && (
                            <p className="text-xs text-primary mt-1">
                              Click to read story
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase + "-legend"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-6 left-6 bg-background/90 backdrop-blur border border-border rounded-lg p-3 z-10"
            >
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-mono">
                {currentPhase === "2024" ? "Homicides / 100k" : "2012 Status"}
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
            </motion.div>
          </AnimatePresence>

          <p className="absolute bottom-6 right-6 text-xs text-muted-foreground/40 font-mono z-10">
            Source: INEGI 2023
          </p>

          {/* Story drawer — slides up when a state is clicked */}
          <AnimatePresence>
            {selectedData && (
              <motion.div
                key={selectedData.name}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 280 }}
                className="absolute bottom-0 inset-x-0 bg-background/97 backdrop-blur-xl border-t border-primary/20 rounded-t-2xl p-6 max-h-[58%] overflow-y-auto z-30"
              >
                {/* Handle */}
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
                    This state has lower levels of cartel-related violence with no
                    major documented incidents.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: scrolling story content ─────────────────────────── */}
        <div className="w-full lg:w-1/2">

          {storySegments.map((segment, index) => (
            <div
              key={segment.id}
              ref={(el) => { segmentRefs.current[index] = el; }}
              className="min-h-screen flex items-center px-8 lg:px-14 py-24"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-15%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-lg"
              >
                {/* Kicker */}
                <p className="font-mono text-primary text-xs tracking-widest uppercase mb-3">
                  {segment.subtitle}
                </p>

                {/* Title */}
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-5">
                  {segment.title}
                </h2>

                {/* Body text */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {segment.content}
                </p>

                {/* Image */}
                {"image" in segment && segment.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-8 relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-2xl"
                  >
                    <Image
                      src={segment.image}
                      alt={"imageAlt" in segment ? segment.imageAlt : ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Stats grid */}
                {"stats" in segment && segment.stats && (
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {segment.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className={`rounded-xl border p-4 text-center ${
                          "danger" in stat && stat.danger
                            ? "border-red-500/30 bg-red-500/10"
                            : "highlight" in stat && stat.highlight
                            ? "border-primary/30 bg-primary/10"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <p
                          className={`font-mono text-xl font-bold ${
                            "danger" in stat && stat.danger
                              ? "text-red-400"
                              : "highlight" in stat && stat.highlight
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote */}
                {"quote" in segment && segment.quote && (
                  <blockquote className="mt-8 border-l-4 border-primary/50 pl-6 py-2">
                    <p className="font-serif text-lg text-foreground/80 italic leading-relaxed">
                      &ldquo;{segment.quote.text}&rdquo;
                    </p>
                    <footer className="mt-3 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {segment.quote.author}
                    </footer>
                  </blockquote>
                )}

                {/* Focus state callout */}
                {"focusState" in segment && segment.focusState && (
                  <div className="mt-8 flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-5 py-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm text-foreground">
                      <span className="text-primary font-semibold">
                        {segment.focusState}
                      </span>{" "}
                      is highlighted gold on the map. Click it to read the full
                      story.
                    </p>
                  </div>
                )}

                {/* Scroll nudge on first segment */}
                {index === 0 && (
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="mt-10 flex items-center gap-2 text-muted-foreground/50"
                  >
                    <div className="w-5 h-8 border border-muted-foreground/30 rounded-full flex items-start justify-center pt-1.5">
                      <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider">
                      Scroll to continue
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-only: show map once between sections */}
      <div className="lg:hidden px-4 py-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <p className="font-mono text-primary text-xs tracking-widest text-center mb-3 uppercase">
          Interactive Map
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={Mexico.viewBox}
          className="w-full h-auto"
          aria-label="Mexico violence map"
        >
          <rect x="-50" y="-50" width="1200" height="900" fill="#0a0f1a" />
          {Mexico.locations.map((loc: { id: string; name: string; path: string }) => {
            const name = idToStateName[loc.id] ?? loc.name;
            const data = getStateData(name);
            return (
              <path
                key={loc.id}
                d={loc.path}
                fill={data ? getViolenceLevelColor(data.homicideRate) : "#1a1a1a"}
                stroke="#3a3a3a"
                strokeWidth={0.5}
                onClick={() => handleStateClick(name)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}
