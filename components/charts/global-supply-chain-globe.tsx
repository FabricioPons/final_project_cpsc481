'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// Geographic coordinates for key locations
const LOCATIONS: Record<string, { lat: number; lng: number; name: string; role: string }> = {
  mexico: { lat: 23.6345, lng: -102.5528, name: "Mexico", role: "Production & Transit Hub" },
  china: { lat: 35.8617, lng: 104.1954, name: "China", role: "Precursor Chemicals" },
  colombia: { lat: 4.5709, lng: -74.2973, name: "Colombia", role: "Cocaine Production" },
  peru: { lat: -9.19, lng: -75.0152, name: "Peru", role: "Coca Cultivation" },
  bolivia: { lat: -16.2902, lng: -63.5887, name: "Bolivia", role: "Coca Cultivation" },
  usa: { lat: 37.0902, lng: -95.7129, name: "United States", role: "Primary Market ($150B+)" },
  canada: { lat: 56.1304, lng: -106.3468, name: "Canada", role: "Secondary Market" },
  uk: { lat: 55.3781, lng: -3.436, name: "United Kingdom", role: "European Market" },
  spain: { lat: 40.4637, lng: -3.7492, name: "Spain", role: "European Gateway" },
  netherlands: { lat: 52.1326, lng: 5.2913, name: "Netherlands", role: "European Distribution" },
  australia: { lat: -25.2744, lng: 133.7751, name: "Australia", role: "Pacific Market" },
  panama: { lat: 8.538, lng: -80.7821, name: "Panama", role: "Money Laundering" },
  cayman: { lat: 19.3133, lng: -81.2546, name: "Cayman Islands", role: "Offshore Banking" },
  switzerland: { lat: 46.8182, lng: 8.2275, name: "Switzerland", role: "Banking Services" },
  dubai: { lat: 25.2048, lng: 55.2708, name: "UAE", role: "Money Laundering" },
  arizona: { lat: 34.0489, lng: -111.0937, name: "Arizona", role: "Weapons Source" },
  texas: { lat: 31.9686, lng: -99.9018, name: "Texas", role: "Weapons Source" },
};

// Supply chain connections
const CONNECTIONS = [
  { from: "china", to: "mexico", type: "chemicals", label: "Fentanyl Precursors" },
  { from: "colombia", to: "mexico", type: "drugs", label: "Cocaine" },
  { from: "peru", to: "mexico", type: "drugs", label: "Coca Base" },
  { from: "bolivia", to: "mexico", type: "drugs", label: "Coca Base" },
  { from: "mexico", to: "usa", type: "drugs", label: "Fentanyl & Meth" },
  { from: "mexico", to: "canada", type: "drugs", label: "Fentanyl" },
  { from: "mexico", to: "spain", type: "drugs", label: "Cocaine" },
  { from: "mexico", to: "australia", type: "drugs", label: "Meth" },
  { from: "netherlands", to: "uk", type: "drugs", label: "Distribution" },
  { from: "arizona", to: "mexico", type: "weapons", label: "Firearms" },
  { from: "texas", to: "mexico", type: "weapons", label: "Firearms" },
  { from: "usa", to: "mexico", type: "money", label: "Cash" },
  { from: "mexico", to: "panama", type: "money", label: "Laundering" },
  { from: "mexico", to: "cayman", type: "money", label: "Offshore" },
  { from: "mexico", to: "dubai", type: "money", label: "Real Estate" },
  { from: "china", to: "usa", type: "money", label: "Mirror Trades" },
];

const TYPE_COLORS: Record<string, string> = {
  chemicals: "#3b82f6",
  drugs: "#ef4444",
  weapons: "#f97316",
  money: "#22c55e",
};

function FlowSelector({ 
  activeFlow, 
  setActiveFlow 
}: { 
  activeFlow: string | null; 
  setActiveFlow: (flow: string | null) => void;
}) {
  const flows = [
    { id: null, label: "All Flows", color: "bg-muted" },
    { id: "chemicals", label: "Precursor Chemicals", color: "bg-blue-500" },
    { id: "drugs", label: "Drug Trafficking", color: "bg-red-500" },
    { id: "weapons", label: "Arms Trafficking", color: "bg-orange-500" },
    { id: "money", label: "Money Laundering", color: "bg-green-500" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {flows.map((flow) => (
        <button
          key={flow.id || "all"}
          onClick={() => setActiveFlow(flow.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeFlow === flow.id 
              ? `${flow.color} text-white` 
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${flow.color}`} />
          {flow.label}
        </button>
      ))}
    </div>
  );
}

function StatsGrid() {
  const stats = [
    { label: "US Overdose Deaths (2023)", value: "73,000+", subtext: "69% from synthetic opioids", color: "text-red-500" },
    { label: "US Guns to Mexico", value: "74%", subtext: "of crime guns traced to US", color: "text-orange-500" },
    { label: "Suspicious Transactions", value: "$1.4B", subtext: "fentanyl-linked (FinCEN)", color: "text-green-500" },
    { label: "CJNG Global Reach", value: "60+", subtext: "countries with presence", color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card/50 border border-border rounded-lg p-4">
          <p className={`text-2xl md:text-3xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-sm text-foreground mt-1">{stat.label}</p>
          <p className="text-xs text-muted-foreground">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}

export function GlobalSupplyChainGlobe() {
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const globeRef = useRef<any>(null);

  // Convert connections to arcs data
  const arcsData = useMemo(() => {
    const filtered = activeFlow 
      ? CONNECTIONS.filter(c => c.type === activeFlow)
      : CONNECTIONS;
    
    return filtered.map((conn) => {
      const fromLoc = LOCATIONS[conn.from];
      const toLoc = LOCATIONS[conn.to];
      return {
        startLat: fromLoc.lat,
        startLng: fromLoc.lng,
        endLat: toLoc.lat,
        endLng: toLoc.lng,
        color: TYPE_COLORS[conn.type],
        label: conn.label,
        type: conn.type,
      };
    });
  }, [activeFlow]);

  // Convert locations to points data
  const pointsData = useMemo(() => {
    return Object.entries(LOCATIONS).map(([key, loc]) => ({
      lat: loc.lat,
      lng: loc.lng,
      name: loc.name,
      role: loc.role,
      color: loc.role.includes("Precursor") ? "#3b82f6" : 
             loc.role.includes("Production") || loc.role.includes("Coca") ? "#ef4444" :
             loc.role.includes("Market") ? "#a855f7" :
             loc.role.includes("Weapon") ? "#f97316" :
             loc.role.includes("Money") || loc.role.includes("Banking") || loc.role.includes("Offshore") ? "#22c55e" :
             "#d4a853",
    }));
  }, []);

  // Auto-rotate and set initial view
  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.controls().autoRotate = isRotating;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ lat: 20, lng: -40, altitude: 2.5 }, 1000);
    }
  }, [globeReady, isRotating]);

  return (
    <div className="w-full">
      <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-[#000510] border border-border">
        <Globe
          ref={globeRef}
          onGlobeReady={() => setGlobeReady(true)}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          
          // Arcs layer - animated supply chain routes
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={0.5}
          arcLabel={(d: any) => `<div class="bg-background/95 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-xl">
            <p class="font-bold text-foreground text-sm">${d.label}</p>
          </div>`}
          
          // Points layer - location markers
          pointsData={pointsData}
          pointColor="color"
          pointAltitude={0.01}
          pointRadius={0.5}
          pointLabel={(d: any) => `<div class="bg-background/95 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-xl">
            <p class="font-bold text-foreground text-sm">${d.name}</p>
            <p class="text-xs text-muted-foreground">${d.role}</p>
          </div>`}
          
          // Rings layer - pulsing rings at key locations
          ringsData={pointsData.filter(p => ["Mexico", "United States", "China"].includes(p.name))}
          ringColor={() => (t: number) => `rgba(212, 168, 83, ${1 - t})`}
          ringMaxRadius={3}
          ringPropagationSpeed={2}
          ringRepeatPeriod={1500}
          
          // Atmosphere
          atmosphereColor="#4a90d9"
          atmosphereAltitude={0.15}
          
          width={typeof window !== 'undefined' ? window.innerWidth : 800}
          height={600}
        />
        
        {/* Flow selector overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <FlowSelector activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
        </div>
        
        {/* Rotation toggle - subtle bottom right */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? "Stop rotation" : "Start rotation"}
          className="absolute bottom-4 right-4 z-10 p-2 rounded-lg transition-all opacity-40 hover:opacity-70 bg-muted/30 hover:bg-muted/60 border border-border/50"
        >
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border z-10">
          <p className="text-xs font-medium text-foreground mb-2">Supply Chain Legend</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-blue-500 rounded-full" />
              <span className="text-muted-foreground">Precursor Chemicals (China)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-red-500 rounded-full" />
              <span className="text-muted-foreground">Drug Trafficking Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-orange-500 rounded-full" />
              <span className="text-muted-foreground">Arms Flowing to Mexico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Money Laundering Routes</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">Drag to rotate | Scroll to zoom</p>
        </div>
      </div>

      {/* Stats below globe */}
      <div className="mt-8">
        <StatsGrid />
      </div>
    </div>
  );
}
