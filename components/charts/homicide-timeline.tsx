"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { yearlyData, presidents } from "@/lib/data";

interface HomicideTimelineProps {
  highlightPresident?: string;
  showAnnotations?: boolean;
  height?: number;
}

export function HomicideTimeline({
  highlightPresident,
  showAnnotations = true,
  height = 400,
}: HomicideTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Presidential term boundaries
  const presidentBoundaries = [
    { year: 1994, label: "Salinas → Zedillo" },
    { year: 2000, label: "Zedillo → Fox" },
    { year: 2006, label: "Fox → Calderón" },
    { year: 2012, label: "Calderón → Peña Nieto" },
    { year: 2018, label: "Peña Nieto → AMLO" },
    { year: 2024, label: "AMLO → Sheinbaum" },
  ];

  const keyEvents = [
    { year: 2006, label: "War Begins", y: 12000 },
    { year: 2019, label: "Peak Violence", y: 37000 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded shadow-lg">
          <p className="font-serif text-lg font-bold text-foreground">{label}</p>
          <p className="text-primary font-mono text-xl">
            {data.homicides.toLocaleString()} homicides
          </p>
          <p className="text-muted-foreground text-sm">
            Rate: {data.homicideRate}/100k
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            President: {data.president}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={ref} className="w-full">
      <div
        className="transition-opacity duration-1000"
        style={{ opacity: isInView ? 1 : 0 }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={yearlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="homicideGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b0000" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b0000" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#a0a0a0"
              tick={{ fill: "#a0a0a0", fontSize: 12 }}
              tickLine={{ stroke: "#262626" }}
            />
            <YAxis
              stroke="#a0a0a0"
              tick={{ fill: "#a0a0a0", fontSize: 12 }}
              tickLine={{ stroke: "#262626" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Presidential term boundaries */}
            {showAnnotations &&
              presidentBoundaries.map((boundary) => (
                <ReferenceLine
                  key={boundary.year}
                  x={boundary.year}
                  stroke="#404040"
                  strokeDasharray="5 5"
                  label={{
                    value: boundary.label,
                    position: "top",
                    fill: "#a0a0a0",
                    fontSize: 10,
                  }}
                />
              ))}

            {/* War on Drugs start marker */}
            {showAnnotations && (
              <ReferenceLine
                x={2006}
                stroke="#dc2626"
                strokeWidth={2}
                label={{
                  value: "War Declared",
                  position: "insideTopRight",
                  fill: "#dc2626",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="homicides"
              stroke="#8b0000"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#homicideGradient)"
              animationDuration={2000}
              animationBegin={isInView ? 0 : 99999}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
