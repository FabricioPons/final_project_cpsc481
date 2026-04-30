"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Yearly homicide data 1990-2024
const yearlyHomicides = [
  { year: 1990, homicides: 14500, rate: 17.8 },
  { year: 1991, homicides: 15200, rate: 18.2 },
  { year: 1992, homicides: 16100, rate: 18.9 },
  { year: 1993, homicides: 15800, rate: 18.1 },
  { year: 1994, homicides: 15600, rate: 17.5 },
  { year: 1995, homicides: 15900, rate: 17.4 },
  { year: 1996, homicides: 14800, rate: 15.9 },
  { year: 1997, homicides: 13600, rate: 14.3 },
  { year: 1998, homicides: 13700, rate: 14.1 },
  { year: 1999, homicides: 12500, rate: 12.6 },
  { year: 2000, homicides: 10700, rate: 10.6 },
  { year: 2001, homicides: 10300, rate: 10.1 },
  { year: 2002, homicides: 10100, rate: 9.7 },
  { year: 2003, homicides: 10100, rate: 9.6 },
  { year: 2004, homicides: 9300, rate: 8.7 },
  { year: 2005, homicides: 9900, rate: 9.1 },
  { year: 2006, homicides: 10500, rate: 9.5 },
  { year: 2007, homicides: 8900, rate: 8.0 },
  { year: 2008, homicides: 14000, rate: 12.5 },
  { year: 2009, homicides: 19800, rate: 17.5 },
  { year: 2010, homicides: 25700, rate: 22.5 },
  { year: 2011, homicides: 27200, rate: 23.5 },
  { year: 2012, homicides: 25900, rate: 22.1 },
  { year: 2013, homicides: 23100, rate: 19.5 },
  { year: 2014, homicides: 20000, rate: 16.7 },
  { year: 2015, homicides: 20500, rate: 16.9 },
  { year: 2016, homicides: 24600, rate: 20.1 },
  { year: 2017, homicides: 32000, rate: 25.8 },
  { year: 2018, homicides: 36700, rate: 29.3 },
  { year: 2019, homicides: 36600, rate: 28.9 },
  { year: 2020, homicides: 36500, rate: 28.6 },
  { year: 2021, homicides: 35600, rate: 27.6 },
  { year: 2022, homicides: 32200, rate: 24.8 },
  { year: 2023, homicides: 31000, rate: 23.6 },
  { year: 2024, homicides: 30500, rate: 23.0 },
];

// Presidential era comparison
const presidentialData = [
  { name: "Salinas\n(1988-94)", deaths: 75000, avgYear: 12500, color: "#4a5568" },
  { name: "Zedillo\n(1994-00)", deaths: 78000, avgYear: 13000, color: "#5a6578" },
  { name: "Fox\n(2000-06)", deaths: 60000, avgYear: 10000, color: "#2d6a4f" },
  { name: "Calderón\n(2006-12)", deaths: 121000, avgYear: 20167, color: "#b91c1c" },
  { name: "Peña\n(2012-18)", deaths: 157000, avgYear: 26167, color: "#dc2626" },
  { name: "AMLO\n(2018-24)", deaths: 195000, avgYear: 32500, color: "#991b1b" },
];

// Cartel market share data
const cartelData = [
  { name: "CJNG", value: 35, color: "#c9a84c" },
  { name: "Sinaloa", value: 28, color: "#a8723a" },
  { name: "Gulf Cartel", value: 12, color: "#8b5a2b" },
  { name: "Los Zetas/CDN", value: 10, color: "#6b4423" },
  { name: "Others", value: 15, color: "#4a3520" },
];

// International comparison
const internationalComparison = [
  { country: "Japan", rate: 0.3 },
  { country: "Germany", rate: 0.8 },
  { country: "UK", rate: 1.1 },
  { country: "France", rate: 1.2 },
  { country: "Canada", rate: 2.0 },
  { country: "USA", rate: 6.4 },
  { country: "Russia", rate: 7.3 },
  { country: "Brazil", rate: 22.5 },
  { country: "Mexico", rate: 28.0 },
  { country: "Honduras", rate: 38.9 },
  { country: "Jamaica", rate: 53.3 },
];

// Drug seizure data
const drugSeizures = [
  { year: 2018, fentanyl: 150, meth: 52000, cocaine: 32000 },
  { year: 2019, fentanyl: 450, meth: 68000, cocaine: 38000 },
  { year: 2020, fentanyl: 980, meth: 75000, cocaine: 41000 },
  { year: 2021, fentanyl: 2100, meth: 92000, cocaine: 45000 },
  { year: 2022, fentanyl: 4500, meth: 98000, cocaine: 52000 },
  { year: 2023, fentanyl: 6800, meth: 105000, cocaine: 58000 },
  { year: 2024, fentanyl: 8200, meth: 112000, cocaine: 62000 },
];

export function AnalyticsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Row 1: Timeline and Presidential Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Homicide Timeline */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Homicide Trend (1990-2024)</CardTitle>
            <CardDescription>Annual intentional homicides in Mexico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyHomicides}>
                  <defs>
                    <linearGradient id="homicideGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    labelStyle={{ color: '#c9a84c' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Homicides']}
                  />
                  <Area type="monotone" dataKey="homicides" stroke="#c9a84c" strokeWidth={2} fill="url(#homicideGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Peak Year</p>
                <p className="font-mono text-lg text-primary font-bold">2018</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Peak Deaths</p>
                <p className="font-mono text-lg text-red-400 font-bold">36,700</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Since 2006</p>
                <p className="font-mono text-lg text-foreground font-bold">+248%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presidential Comparison */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Deaths by Administration</CardTitle>
            <CardDescription>Total homicides during each presidency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={presidentialData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} width={70} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Deaths']}
                  />
                  <Bar dataKey="deaths" radius={[0, 4, 4, 0]}>
                    {presidentialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              AMLO&apos;s administration recorded <span className="text-primary font-semibold">195,000+ deaths</span> — more than any previous president.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: International Comparison and Cartel Market Share */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* International Comparison */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Global Context</CardTitle>
            <CardDescription>Homicide rate per 100,000 population (2023)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={internationalComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="country" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    formatter={(value: number) => [value.toFixed(1), 'per 100k']}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {internationalComparison.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.country === "Mexico" ? "#c9a84c" : entry.rate > 20 ? "#a02c2c" : entry.rate > 5 ? "#8b5a2b" : "#1a3d1a"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cartel Market Share */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Cartel Territory Control</CardTitle>
            <CardDescription>Estimated market share by organization (2024)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="h-[250px] w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cartelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cartelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#1a1a1a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                      formatter={(value: number) => [`${value}%`, 'Control']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {cartelData.map((cartel) => (
                  <div key={cartel.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: cartel.color }} />
                      <span className="text-sm text-foreground">{cartel.name}</span>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{cartel.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              CJNG now controls <span className="text-primary font-semibold">35%</span> of Mexico&apos;s drug trade after El Mencho&apos;s death.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Drug Seizures */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Drug Seizures by DEA (2018-2024)</CardTitle>
          <CardDescription>Fentanyl (kg), Methamphetamine (kg), Cocaine (kg) seized at US-Mexico border</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={drugSeizures}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  formatter={(value: number, name: string) => [value.toLocaleString() + ' kg', name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend />
                <Line type="monotone" dataKey="fentanyl" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} name="Fentanyl" />
                <Line type="monotone" dataKey="meth" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c' }} name="Meth" />
                <Line type="monotone" dataKey="cocaine" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Cocaine" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-red-950/30 border border-red-900/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Fentanyl +</p>
              <p className="font-mono text-lg text-red-400 font-bold">5,367%</p>
              <p className="text-xs text-muted-foreground">since 2018</p>
            </div>
            <div className="p-3 bg-amber-950/30 border border-amber-900/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Meth +</p>
              <p className="font-mono text-lg text-amber-400 font-bold">115%</p>
              <p className="text-xs text-muted-foreground">since 2018</p>
            </div>
            <div className="p-3 bg-green-950/30 border border-green-900/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Cocaine +</p>
              <p className="font-mono text-lg text-green-400 font-bold">94%</p>
              <p className="text-xs text-muted-foreground">since 2018</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
