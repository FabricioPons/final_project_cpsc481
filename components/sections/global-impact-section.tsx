"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Three.js
const GlobalSupplyChainGlobe = dynamic(
  () => import("@/components/charts/global-supply-chain-globe").then(mod => mod.GlobalSupplyChainGlobe),
  { ssr: false, loading: () => <GlobeLoadingState /> }
);

function GlobeLoadingState() {
  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-card/50 border border-border flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D Globe...</p>
      </div>
    </div>
  );
}

// Supply chain actors data
const ACTORS = [
  {
    title: "Chinese Chemical Companies",
    role: "Precursor Suppliers",
    description: "Sell fentanyl precursor chemicals legally in China. $440 buys enough to make 750,000 pills. Shipped via mail in small packages among the 600+ million parcels entering the US annually from China.",
    source: "Reuters Investigation",
    color: "border-blue-500",
  },
  {
    title: "Mexican Cartels",
    role: "Production & Distribution",
    description: "CJNG and Sinaloa Cartel synthesize fentanyl in super-labs and coordinate distribution to 60+ countries. They control production, but they are middlemen in a larger system.",
    source: "DEA",
    color: "border-red-500",
  },
  {
    title: "US Gun Dealers",
    role: "Arms Suppliers",
    description: "74% of crime guns recovered in Mexico originated in the US. Gun stores in Texas, Arizona, California, and New Mexico are the primary sources. 4,359 firearms seized in 2026 alone.",
    source: "ATF",
    color: "border-orange-500",
  },
  {
    title: "Global Banking System",
    role: "Money Laundering",
    description: "$312 billion in suspicious transactions flowed through US banks via Chinese money laundering networks. Real estate purchases totaling $53.7 billion have been linked to cartel money.",
    source: "FinCEN",
    color: "border-green-500",
  },
  {
    title: "American Consumers",
    role: "Demand Drivers",
    description: "The US drug market is worth over $150 billion annually. 73,000 Americans died from synthetic opioid overdoses in 2023. Demand fuels the entire supply chain.",
    source: "CDC / DEA",
    color: "border-purple-500",
  },
];

// Key insight cards
const INSIGHTS = [
  {
    stat: "$440",
    context: "Cost to buy enough fentanyl precursors from China to produce 750,000 lethal doses",
  },
  {
    stat: "73,000",
    context: "Americans killed by synthetic opioids in 2023. More than car accidents and gun deaths combined.",
  },
  {
    stat: "$312B",
    context: "Suspicious transactions through US banks linked to Chinese money laundering networks",
  },
  {
    stat: "74%",
    context: "Of crime guns recovered in Mexico traced back to US gun dealers",
  },
];

export function GlobalImpactSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative py-24 bg-background">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-primary text-sm tracking-widest mb-4"
        >
          BEYOND BORDERS
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance"
        >
          A Global Machine
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed"
        >
          The drug trade is not just Mexican. It is a multinational enterprise with suppliers 
          in China, distributors across six continents, bankers in Dubai, and customers in 
          every American city. Blaming &ldquo;drug lords&rdquo; ignores the system that creates them.
        </motion.p>
      </div>

      {/* Key stats row */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {INSIGHTS.map((insight, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5 text-center">
              <p className="text-3xl md:text-4xl font-mono font-bold text-primary">{insight.stat}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-snug">{insight.context}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3D Globe */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            The Global Supply Chain
          </h3>
          <p className="text-muted-foreground mb-6">
            Trace the flow of chemicals, drugs, weapons, and money across borders. Click the filters to isolate each flow.
          </p>
          <GlobalSupplyChainGlobe />
        </motion.div>
      </div>

      {/* The actors */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            The Players Nobody Talks About
          </h3>
          <p className="text-muted-foreground mb-8">
            Every drug that reaches American streets passes through dozens of hands. Cartels are just one link in the chain.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTORS.map((actor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className={`bg-card border-l-4 ${actor.color} border border-border rounded-r-lg p-6`}
              >
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  {actor.role}
                </p>
                <h4 className="font-serif text-xl text-foreground mb-3">{actor.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {actor.description}
                </p>
                <p className="text-xs text-primary">Source: {actor.source}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* The weapons problem */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-8"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            The Iron River: US Guns Flowing South
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While drugs flow north, weapons flow south. Between 2017-2021, <span className="text-orange-500 font-bold">74%</span> of 
                crime guns recovered in Mexico were traced back to US gun dealers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In February 2026, the ATF seized <span className="text-orange-500 font-bold">4,359 illegal firearms</span> destined 
                for cartels in Mexico. These weapons arm the sicarios who terrorize Mexican communities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The top sources are gun dealers in <span className="text-foreground font-medium">Texas, Arizona, California, 
                and New Mexico</span>. Weak US gun laws make trafficking easy and profitable.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-orange-500">74%</div>
                  <div className="text-sm text-muted-foreground">of Mexican crime guns<br/>traced to US dealers</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-orange-500">4,359</div>
                  <div className="text-sm text-muted-foreground">firearms seized in<br/>single 2026 operation</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-mono font-bold text-orange-500">200K+</div>
                  <div className="text-sm text-muted-foreground">guns trafficked to Mexico<br/>annually (estimated)</div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-6">Sources: ATF, Department of Justice, Stop US Arms to Mexico</p>
        </motion.div>
      </div>

      {/* The money */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-8"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Following the Money
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Drug money does not stay in Mexico. It flows through a sophisticated global network of banks, 
            shell companies, and real estate investments. In June 2025, the US Treasury sanctioned three 
            major Mexican banks for facilitating cartel money laundering.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-green-500">$1.4B</p>
              <p className="text-sm text-muted-foreground">Suspicious transactions<br/>flagged by FinCEN (2024)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-green-500">$312B</p>
              <p className="text-sm text-muted-foreground">Flowed through US banks<br/>via Chinese networks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-mono font-bold text-green-500">$53.7B</p>
              <p className="text-sm text-muted-foreground">Linked to real estate<br/>and human trafficking</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground italic">
            &ldquo;A Chinese American gangster pioneered a new system that revolutionized money laundering for 
            drug cartels, enabling them to convert illicit earnings into legitimate fortunes.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-2">Source: ProPublica, FinCEN, Reuters</p>
        </motion.div>
      </div>

      {/* The point */}
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center py-12 border-t border-border"
        >
          <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            The Point
          </h3>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Killing El Mencho does not stop Chinese chemical companies. It does not close 
            American gun shops. It does not shut down the banks that launder billions.
          </p>
          <p className="text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
            <span className="text-primary font-semibold">The drug trade is not a Mexican problem.</span> It is a 
            global system with American demand at its center, and until that changes, 
            there will always be another El Mencho.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
