"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Text } from "@react-three/drei";
import * as THREE from "three";

// Geographic coordinates for key locations
const LOCATIONS = {
  // Drug production & transit
  mexico: { lat: 23.6345, lng: -102.5528, name: "Mexico", role: "Production & Transit Hub" },
  china: { lat: 35.8617, lng: 104.1954, name: "China", role: "Precursor Chemicals" },
  colombia: { lat: 4.5709, lng: -74.2973, name: "Colombia", role: "Cocaine Production" },
  peru: { lat: -9.19, lng: -75.0152, name: "Peru", role: "Coca Cultivation" },
  bolivia: { lat: -16.2902, lng: -63.5887, name: "Bolivia", role: "Coca Cultivation" },
  
  // Major consumer markets
  usa: { lat: 37.0902, lng: -95.7129, name: "United States", role: "Primary Market ($150B+)" },
  canada: { lat: 56.1304, lng: -106.3468, name: "Canada", role: "Secondary Market" },
  uk: { lat: 55.3781, lng: -3.436, name: "United Kingdom", role: "European Market" },
  spain: { lat: 40.4637, lng: -3.7492, name: "Spain", role: "European Gateway" },
  netherlands: { lat: 52.1326, lng: 5.2913, name: "Netherlands", role: "European Distribution" },
  australia: { lat: -25.2744, lng: 133.7751, name: "Australia", role: "Pacific Market" },
  
  // Money laundering hubs
  panama: { lat: 8.538, lng: -80.7821, name: "Panama", role: "Money Laundering" },
  cayman: { lat: 19.3133, lng: -81.2546, name: "Cayman Islands", role: "Offshore Banking" },
  switzerland: { lat: 46.8182, lng: 8.2275, name: "Switzerland", role: "Banking Services" },
  dubai: { lat: 25.2048, lng: 55.2708, name: "UAE", role: "Money Laundering" },
  
  // Arms source
  arizona: { lat: 34.0489, lng: -111.0937, name: "Arizona", role: "Weapons Source" },
  texas: { lat: 31.9686, lng: -99.9018, name: "Texas", role: "Weapons Source" },
};

// Supply chain connections with real data
const CONNECTIONS = [
  // Precursor chemicals from China to Mexico
  { from: "china", to: "mexico", type: "chemicals", label: "Fentanyl Precursors", value: "$440 = 750K pills" },
  
  // Cocaine from South America
  { from: "colombia", to: "mexico", type: "drugs", label: "Cocaine", value: "90% of US supply" },
  { from: "peru", to: "mexico", type: "drugs", label: "Coca Base", value: "" },
  { from: "bolivia", to: "mexico", type: "drugs", label: "Coca Base", value: "" },
  
  // Drugs to consumer markets
  { from: "mexico", to: "usa", type: "drugs", label: "Fentanyl & Meth", value: "73,000 deaths/year" },
  { from: "mexico", to: "canada", type: "drugs", label: "Fentanyl", value: "" },
  { from: "mexico", to: "spain", type: "drugs", label: "Cocaine", value: "" },
  { from: "mexico", to: "australia", type: "drugs", label: "Meth", value: "" },
  { from: "netherlands", to: "uk", type: "drugs", label: "Distribution", value: "" },
  
  // Weapons flowing INTO Mexico
  { from: "arizona", to: "mexico", type: "weapons", label: "Firearms", value: "74% of crime guns" },
  { from: "texas", to: "mexico", type: "weapons", label: "Firearms", value: "4,359 seized (2026)" },
  
  // Money laundering routes
  { from: "usa", to: "mexico", type: "money", label: "Cash", value: "$1.4B suspicious" },
  { from: "mexico", to: "panama", type: "money", label: "Laundering", value: "" },
  { from: "mexico", to: "cayman", type: "money", label: "Offshore", value: "" },
  { from: "mexico", to: "dubai", type: "money", label: "Real Estate", value: "$53.7B linked" },
  { from: "china", to: "usa", type: "money", label: "Mirror Trades", value: "$312B through US banks" },
];

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

// Animated arc between two points
function ConnectionArc({ 
  from, 
  to, 
  type, 
  delay = 0,
  isHighlighted = false 
}: { 
  from: { lat: number; lng: number }; 
  to: { lat: number; lng: number }; 
  type: string;
  delay?: number;
  isHighlighted?: boolean;
}) {
  const ref = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  
  const curve = useMemo(() => {
    const start = latLngToVector3(from.lat, from.lng, 2);
    const end = latLngToVector3(to.lat, to.lng, 2);
    
    // Calculate midpoint and lift it above the surface
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(2 + distance * 0.3);
    
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  const color = useMemo(() => {
    switch (type) {
      case "chemicals": return "#3b82f6"; // blue
      case "drugs": return "#ef4444"; // red
      case "weapons": return "#f97316"; // orange
      case "money": return "#22c55e"; // green
      default: return "#ffffff";
    }
  }, [type]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = ((state.clock.elapsedTime * 0.3 + delay) % 1);
      const point = curve.getPoint(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <line ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={isHighlighted ? 0.9 : 0.4} 
          linewidth={2}
        />
      </line>
      
      {/* Animated particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// Location marker
function LocationMarker({ 
  position, 
  name, 
  role, 
  isHighlighted,
  onClick 
}: { 
  position: THREE.Vector3; 
  name: string; 
  role: string;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.scale.setScalar(hovered || isHighlighted ? 1.5 : 1);
    }
  });

  const color = role.includes("Precursor") ? "#3b82f6" : 
                role.includes("Production") || role.includes("Coca") ? "#ef4444" :
                role.includes("Market") ? "#a855f7" :
                role.includes("Weapon") ? "#f97316" :
                role.includes("Money") || role.includes("Banking") || role.includes("Offshore") ? "#22c55e" :
                "#d4a853";

  return (
    <group position={position}>
      <mesh 
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {(hovered || isHighlighted) && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="bg-background/95 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
            <p className="font-bold text-foreground text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Globe with Earth texture
function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial 
        color="#1a1a2e"
        roughness={0.8}
        metalness={0.2}
      />
      {/* Grid lines */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial 
          color="#374151" 
          wireframe 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </mesh>
  );
}

// Main scene
function Scene({ activeFlow, onLocationClick }: { activeFlow: string | null; onLocationClick: (name: string) => void }) {
  const filteredConnections = useMemo(() => {
    if (!activeFlow) return CONNECTIONS;
    return CONNECTIONS.filter(c => c.type === activeFlow);
  }, [activeFlow]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Globe />
      
      {/* Connection arcs */}
      {filteredConnections.map((conn, i) => {
        const fromLoc = LOCATIONS[conn.from as keyof typeof LOCATIONS];
        const toLoc = LOCATIONS[conn.to as keyof typeof LOCATIONS];
        if (!fromLoc || !toLoc) return null;
        
        return (
          <ConnectionArc
            key={`${conn.from}-${conn.to}-${i}`}
            from={fromLoc}
            to={toLoc}
            type={conn.type}
            delay={i * 0.2}
            isHighlighted={activeFlow === conn.type}
          />
        );
      })}
      
      {/* Location markers */}
      {Object.entries(LOCATIONS).map(([key, loc]) => (
        <LocationMarker
          key={key}
          position={latLngToVector3(loc.lat, loc.lng, 2)}
          name={loc.name}
          role={loc.role}
          isHighlighted={false}
          onClick={() => onLocationClick(loc.name)}
        />
      ))}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Flow type selector
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

// Stats cards
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
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Globe container */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-background border border-border">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene activeFlow={activeFlow} onLocationClick={setSelectedLocation} />
        </Canvas>
        
        {/* Flow selector overlay */}
        <div className="absolute top-4 left-4 right-4">
          <FlowSelector activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
          <p className="text-xs font-medium text-foreground mb-2">Supply Chain Legend</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-500" />
              <span className="text-muted-foreground">Precursor Chemicals (China)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-red-500" />
              <span className="text-muted-foreground">Drug Trafficking Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-orange-500" />
              <span className="text-muted-foreground">Arms Flowing to Mexico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-green-500" />
              <span className="text-muted-foreground">Money Laundering Routes</span>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Drag to rotate | Scroll to zoom</p>
        </div>
      </div>

      {/* Stats below globe */}
      <div className="mt-8">
        <StatsGrid />
      </div>
    </div>
  );
}
