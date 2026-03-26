"use client";

import { motion } from "framer-motion";
import { InlineCounter } from "@/components/death-counter";

interface StatisticCardProps {
  label: string;
  value: number;
  sublabel?: string;
  highlight?: boolean;
  delay?: number;
}

export function StatisticCard({
  label,
  value,
  sublabel,
  highlight = false,
  delay = 0,
}: StatisticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`p-6 rounded-sm border ${
        highlight
          ? "bg-primary/10 border-primary"
          : "bg-card border-border"
      }`}
    >
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
        {label}
      </p>
      <p className={`font-mono text-4xl font-bold ${
        highlight ? "text-primary" : "text-foreground"
      } tabular-nums`}>
        <InlineCounter value={value} />
      </p>
      {sublabel && (
        <p className="text-sm text-muted-foreground mt-2">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}
