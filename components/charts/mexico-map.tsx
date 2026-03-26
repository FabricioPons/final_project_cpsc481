"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Simplified Mexico state paths (key states for violence visualization)
const mexicoStates = [
  { id: "BCN", name: "Baja California", path: "M45,80 L80,60 L95,90 L75,120 L45,110 Z", violence: "high" },
  { id: "SON", name: "Sonora", path: "M95,60 L160,50 L180,100 L140,130 L95,100 Z", violence: "high" },
  { id: "CHH", name: "Chihuahua", path: "M160,50 L230,45 L250,120 L180,130 L160,80 Z", violence: "extreme" },
  { id: "COA", name: "Coahuila", path: "M230,70 L290,60 L300,120 L250,130 L230,100 Z", violence: "high" },
  { id: "NLE", name: "Nuevo León", path: "M290,80 L330,75 L340,130 L300,135 L290,100 Z", violence: "high" },
  { id: "TAM", name: "Tamaulipas", path: "M330,75 L370,90 L365,170 L320,155 L320,100 Z", violence: "extreme" },
  { id: "SIN", name: "Sinaloa", path: "M95,130 L140,125 L150,200 L110,210 L85,170 Z", violence: "extreme" },
  { id: "DUR", name: "Durango", path: "M150,130 L200,125 L210,200 L160,210 L150,165 Z", violence: "high" },
  { id: "ZAC", name: "Zacatecas", path: "M200,150 L250,145 L260,210 L210,220 L200,180 Z", violence: "extreme" },
  { id: "SLP", name: "San Luis Potosí", path: "M260,150 L310,145 L315,210 L265,220 L260,180 Z", violence: "medium" },
  { id: "JAL", name: "Jalisco", path: "M140,210 L200,200 L210,280 L150,290 L130,250 Z", violence: "extreme" },
  { id: "AGU", name: "Aguascalientes", path: "M200,200 L220,198 L225,220 L205,222 Z", violence: "medium" },
  { id: "GUA", name: "Guanajuato", path: "M220,200 L270,195 L280,250 L230,255 Z", violence: "extreme" },
  { id: "QUE", name: "Querétaro", path: "M270,200 L300,198 L305,240 L275,245 Z", violence: "medium" },
  { id: "HID", name: "Hidalgo", path: "M300,200 L340,195 L345,245 L305,250 Z", violence: "medium" },
  { id: "MIC", name: "Michoacán", path: "M150,280 L220,270 L230,340 L160,350 L140,310 Z", violence: "extreme" },
  { id: "MEX", name: "Estado de México", path: "M260,260 L310,255 L315,310 L265,315 Z", violence: "high" },
  { id: "CDMX", name: "Ciudad de México", path: "M280,280 L295,278 L298,298 L283,300 Z", violence: "medium" },
  { id: "MOR", name: "Morelos", path: "M270,310 L300,308 L305,335 L275,338 Z", violence: "high" },
  { id: "GRO", name: "Guerrero", path: "M180,340 L260,330 L270,400 L200,410 L170,380 Z", violence: "extreme" },
  { id: "OAX", name: "Oaxaca", path: "M270,350 L350,340 L360,420 L280,430 L260,390 Z", violence: "high" },
  { id: "VER", name: "Veracruz", path: "M330,250 L380,240 L395,380 L345,390 L330,300 Z", violence: "high" },
  { id: "PUE", name: "Puebla", path: "M300,300 L345,295 L350,360 L305,365 Z", violence: "medium" },
  { id: "TAB", name: "Tabasco", path: "M380,340 L420,335 L425,380 L385,385 Z", violence: "medium" },
  { id: "CHP", name: "Chiapas", path: "M380,400 L440,390 L450,470 L400,480 L375,440 Z", violence: "medium" },
  { id: "CAM", name: "Campeche", path: "M420,340 L470,330 L475,400 L430,410 Z", violence: "low" },
  { id: "YUC", name: "Yucatán", path: "M450,290 L510,280 L515,340 L460,350 Z", violence: "low" },
  { id: "ROO", name: "Quintana Roo", path: "M510,300 L550,290 L555,400 L515,410 L510,350 Z", violence: "high" },
  { id: "NAY", name: "Nayarit", path: "M110,200 L145,195 L150,250 L115,255 Z", violence: "high" },
  { id: "COL", name: "Colima", path: "M130,290 L155,288 L158,315 L133,318 Z", violence: "high" },
  { id: "BCS", name: "Baja California Sur", path: "M30,150 L70,140 L85,230 L50,240 L25,190 Z", violence: "medium" },
];

const violenceColors: Record<string, string> = {
  low: "#1a1a1a",
  medium: "#7f1d1d",
  high: "#b91c1c",
  extreme: "#dc2626",
};

interface MexicoMapProps {
  highlightStates?: string[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
}

export function MexicoMap({
  highlightStates = [],
  title,
  subtitle,
  showLegend = true,
}: MexicoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto">
      {title && (
        <h3 className="font-serif text-2xl text-foreground mb-2 text-center">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-muted-foreground text-center mb-6">{subtitle}</p>
      )}

      <div className="relative">
        <svg
          viewBox="0 0 580 500"
          className="w-full h-auto"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 1s ease-out" }}
        >
          {/* Background */}
          <rect x="0" y="0" width="580" height="500" fill="#0a0a0a" />

          {/* States */}
          {mexicoStates.map((state, index) => (
            <motion.path
              key={state.id}
              d={state.path}
              fill={
                highlightStates.includes(state.id)
                  ? "#dc2626"
                  : violenceColors[state.violence]
              }
              stroke="#262626"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.02, duration: 0.5 }}
              onMouseEnter={() => setHoveredState(state.name)}
              onMouseLeave={() => setHoveredState(null)}
              className="cursor-pointer transition-all duration-300 hover:brightness-125"
              style={{
                filter: hoveredState === state.name ? "brightness(1.3)" : "none",
              }}
            />
          ))}

          {/* Cartel territory labels */}
          <text x="120" y="180" fill="#e8e8e8" fontSize="10" fontWeight="bold" opacity="0.7">
            SINALOA
          </text>
          <text x="180" y="300" fill="#e8e8e8" fontSize="10" fontWeight="bold" opacity="0.7">
            CJNG
          </text>
          <text x="340" y="140" fill="#e8e8e8" fontSize="10" fontWeight="bold" opacity="0.7">
            GULF/ZETAS
          </text>
        </svg>

        {/* Tooltip */}
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-card border border-border px-3 py-2 rounded">
            <p className="font-medium text-foreground">{hoveredState}</p>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex justify-center gap-6 mt-6">
          {Object.entries(violenceColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground capitalize">
                {level}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
