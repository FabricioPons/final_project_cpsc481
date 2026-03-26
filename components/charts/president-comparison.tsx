"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { presidents } from "@/lib/data";

interface PresidentComparisonProps {
  height?: number;
  metric?: "total" | "average";
}

export function PresidentComparison({
  height = 400,
  metric = "total",
}: PresidentComparisonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const data = presidents.slice(0, -1).map((p) => ({
    name: p.shortName,
    value: metric === "total" ? p.totalHomicides : p.avgPerYear,
    party: p.party,
    years: p.years,
    change: p.changeFromPrevious,
  }));

  const getBarColor = (party: string) => {
    switch (party) {
      case "PRI":
        return "#991b1b";
      case "PAN":
        return "#1e40af";
      case "MORENA":
        return "#7c2d12";
      default:
        return "#8b0000";
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded shadow-lg">
          <p className="font-serif text-lg font-bold text-foreground">
            {data.name}
          </p>
          <p className="text-muted-foreground text-sm">{data.years}</p>
          <p className="text-primary font-mono text-xl mt-1">
            {data.value.toLocaleString()}
            <span className="text-sm text-muted-foreground ml-1">
              {metric === "total" ? "total" : "per year"}
            </span>
          </p>
          <p
            className={`text-sm mt-1 ${
              data.change.startsWith("+") ? "text-red-500" : "text-green-500"
            }`}
          >
            {data.change} from previous
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
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke="#a0a0a0"
              tick={{ fill: "#a0a0a0", fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#a0a0a0"
              tick={{ fill: "#e8e8e8", fontSize: 14, fontWeight: 500 }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1a1a1a" }} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
              animationBegin={isInView ? 0 : 99999}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.party)} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill="#a0a0a0"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
