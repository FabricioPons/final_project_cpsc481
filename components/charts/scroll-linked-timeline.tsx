"use client";

import { useRef, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useScroll, useTransform, motion } from "framer-motion";
import { yearlyData } from "@/lib/data";

export function ScrollLinkedTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  const dataPointIndex = useTransform(scrollYProgress, [0, 1], [0, yearlyData.length - 1]);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    return dataPointIndex.onChange((latest) => {
      setDisplayIndex(Math.floor(latest));
    });
  }, [dataPointIndex]);

  const displayData = yearlyData.slice(0, Math.min(displayIndex + 1, yearlyData.length));
  const peakData = displayData.reduce((max, d) => (d.homicides > max.homicides ? d : max), displayData[0]);

  return (
    <div ref={containerRef} className="w-full space-y-8">
      <div className="sticky top-32 bg-background/80 backdrop-blur-sm p-8 rounded-lg border border-primary/20">
        <motion.div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-3xl md:text-4xl text-foreground">
              {displayData[displayData.length - 1]?.year || 1990}
            </h3>
            <p className="text-sm text-muted-foreground">Scroll to explore timeline</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-4 rounded">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Deaths This Year</p>
              <p className="text-2xl font-mono font-bold text-primary mt-1">
                {displayData[displayData.length - 1]?.homicides.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-card border border-border p-4 rounded">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Rate per 100k</p>
              <p className="text-2xl font-mono font-bold text-primary mt-1">
                {displayData[displayData.length - 1]?.homicideRate.toFixed(1) || 0}
              </p>
            </div>
            <div className="bg-card border border-border p-4 rounded">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Peak Year</p>
              <p className="text-2xl font-mono font-bold text-primary mt-1">{peakData.year}</p>
            </div>
            <div className="bg-card border border-border p-4 rounded">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Deaths</p>
              <p className="text-2xl font-mono font-bold text-primary mt-1">
                {displayData.reduce((sum, d) => sum + d.homicides, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scrollTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="year" stroke="#666" style={{ fontSize: "12px" }} />
            <YAxis stroke="#666" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #c9a84c",
                borderRadius: "8px",
                color: "#e8e8e8",
              }}
              formatter={(value: any) => [`${value.toLocaleString()} deaths`, "Homicides"]}
              labelStyle={{ color: "#c9a84c" }}
            />
            <Area
              type="monotone"
              dataKey="homicides"
              stroke="#c9a84c"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scrollTimelineGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border p-6 rounded-lg space-y-4">
        <h4 className="font-serif text-lg text-foreground">Context</h4>
        <p className="text-muted-foreground leading-relaxed">
          {displayData[displayData.length - 1]?.president && (
            <>
              <span className="text-primary font-semibold">President: {displayData[displayData.length - 1].president}</span>
              <br />
            </>
          )}
          As you scroll, the timeline reveals data year by year. Notice how violence escalated 
          during certain administrations and the cascading effect of policy decisions.
        </p>
      </div>
    </div>
  );
}
