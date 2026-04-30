"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Dynamically import WorldMap to avoid SSR issues
const WorldMap = dynamic(
  () => import("react-svg-worldmap").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse rounded-lg" /> }
);

// World homicide rates per 100,000 (2023 data from UNODC)
const worldHomicideData = [
  { country: "mx", value: 28.0 }, // Mexico
  { country: "br", value: 22.5 }, // Brazil
  { country: "co", value: 12.5 }, // Colombia
  { country: "ve", value: 36.7 }, // Venezuela
  { country: "hn", value: 38.9 }, // Honduras
  { country: "sv", value: 7.8 },  // El Salvador (after crackdown)
  { country: "gt", value: 17.3 }, // Guatemala
  { country: "jm", value: 53.3 }, // Jamaica
  { country: "za", value: 45.0 }, // South Africa
  { country: "us", value: 6.4 },  // United States
  { country: "ca", value: 2.0 },  // Canada
  { country: "de", value: 0.8 },  // Germany
  { country: "fr", value: 1.2 },  // France
  { country: "gb", value: 1.1 },  // United Kingdom
  { country: "es", value: 0.7 },  // Spain
  { country: "it", value: 0.5 },  // Italy
  { country: "jp", value: 0.3 },  // Japan
  { country: "au", value: 0.9 },  // Australia
  { country: "ru", value: 7.3 },  // Russia
  { country: "in", value: 3.0 },  // India
  { country: "cn", value: 0.5 },  // China
  { country: "ng", value: 10.0 }, // Nigeria
  { country: "ph", value: 6.4 },  // Philippines
  { country: "ec", value: 25.9 }, // Ecuador
  { country: "pe", value: 7.8 },  // Peru
  { country: "ar", value: 4.6 },  // Argentina
  { country: "cl", value: 4.4 },  // Chile
  { country: "py", value: 7.1 },  // Paraguay
  { country: "bo", value: 6.1 },  // Bolivia
  { country: "pa", value: 9.4 },  // Panama
  { country: "cr", value: 11.3 }, // Costa Rica
  { country: "ni", value: 8.0 },  // Nicaragua
  { country: "do", value: 11.0 }, // Dominican Republic
  { country: "ht", value: 26.7 }, // Haiti
  { country: "cu", value: 5.0 },  // Cuba
  { country: "pr", value: 11.2 }, // Puerto Rico
  { country: "tt", value: 38.0 }, // Trinidad and Tobago
];

// Top 10 most violent countries for comparison
const topViolentCountries = [
  { name: "Jamaica", rate: 53.3, flag: "JM" },
  { name: "South Africa", rate: 45.0, flag: "ZA" },
  { name: "Honduras", rate: 38.9, flag: "HN" },
  { name: "Trinidad & Tobago", rate: 38.0, flag: "TT" },
  { name: "Venezuela", rate: 36.7, flag: "VE" },
  { name: "Mexico", rate: 28.0, flag: "MX" },
  { name: "Haiti", rate: 26.7, flag: "HT" },
  { name: "Ecuador", rate: 25.9, flag: "EC" },
  { name: "Brazil", rate: 22.5, flag: "BR" },
  { name: "Guatemala", rate: 17.3, flag: "GT" },
];

interface WorldComparisonMapProps {
  title?: string;
  subtitle?: string;
}

export function WorldComparisonMap({ 
  title = "Global Homicide Rates",
  subtitle = "Homicides per 100,000 population (2023)"
}: WorldComparisonMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* World Map */}
            <div className="lg:col-span-2">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <WorldMap
                  color="#c9a84c"
                  valueSuffix="per 100k"
                  size="responsive"
                  data={worldHomicideData}
                  backgroundColor="transparent"
                  borderColor="#333"
                  styleFunction={(context: { countryValue?: number; countryCode?: string; minValue?: number; maxValue?: number; color?: string }) => {
                    const value = context.countryValue;
                    if (!value) return { fill: "#1a1a1a", stroke: "#333", strokeWidth: 0.5 };
                    
                    // Color scale based on violence level
                    let fillColor = "#1a2e1a"; // Low - dark green
                    if (value > 5) fillColor = "#4a3728"; // Medium - brown
                    if (value > 15) fillColor = "#7d4e2e"; // High - orange-brown
                    if (value > 30) fillColor = "#8b2500"; // Extreme - deep red
                    
                    return {
                      fill: fillColor,
                      stroke: "#333",
                      strokeWidth: 0.5,
                      cursor: "pointer",
                    };
                  }}
                />
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {[
                  { label: "Low (<5)", color: "#1a2e1a" },
                  { label: "Medium (5-15)", color: "#4a3728" },
                  { label: "High (15-30)", color: "#7d4e2e" },
                  { label: "Extreme (>30)", color: "#8b2500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Violent Countries Ranking */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Top 10 Most Violent Countries</h4>
              <div className="space-y-2">
                {topViolentCountries.map((country, index) => (
                  <motion.div
                    key={country.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      country.name === "Mexico" 
                        ? "bg-primary/10 border-primary" 
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className={`font-medium ${
                        country.name === "Mexico" ? "text-primary" : "text-foreground"
                      }`}>
                        {country.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {country.rate.toFixed(1)}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Context */}
              <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">Mexico ranks #6</span> globally 
                  in homicide rate. Despite billions spent on security, Mexico&apos;s murder rate 
                  remains 28x higher than Japan and 23x higher than Germany.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
