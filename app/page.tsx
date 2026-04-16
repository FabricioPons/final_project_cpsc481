"use client";

// El Precio del Poder - Mexico Drug War Scrollytelling Project

import { useState, useEffect } from "react";
import { ScrollProvider } from "@/components/scroll-provider";
import { SectionNav } from "@/components/section-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { ElMenchoSection } from "@/components/sections/el-mencho-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { WarBeginsSection } from "@/components/sections/war-begins-section";
import { CJNGRiseSection } from "@/components/sections/cjng-rise-section";
import { DataExplorationSection } from "@/components/sections/data-exploration-section";
import { ConclusionSection } from "@/components/sections/conclusion-section";

const SECTIONS = [
  { id: "hero", title: "The Death" },
  { id: "mencho", title: "El Mencho" },
  { id: "timeline", title: "Six Presidents" },
  { id: "war", title: "War Begins" },
  { id: "cjng", title: "CJNG Rises" },
  { id: "data", title: "The Numbers" },
  { id: "conclusion", title: "The Question" },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => s.id);
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(sectionId);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ScrollProvider totalSections={7}>
      <SectionNav
        sections={SECTIONS}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />
      <main className="relative w-full">
        {/* Section 0: The Hook - El Mencho's Death */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* Section 1: Who was El Mencho */}
        <div id="mencho">
          <ElMenchoSection />
        </div>

        {/* Section 2: The Timeline - Six Presidents */}
        <div id="timeline">
          <TimelineSection />
        </div>

        {/* Section 3: When the War Began - Calderón */}
        <div id="war">
          <WarBeginsSection />
        </div>

        {/* Section 4: The Rise of CJNG */}
        <div id="cjng">
          <CJNGRiseSection />
        </div>

        {/* Section 5: Interactive Data Exploration */}
        <div id="data">
          <DataExplorationSection />
        </div>

        {/* Section 6: The Conclusion - Where We Are Now */}
        <div id="conclusion">
          <ConclusionSection />
        </div>
      </main>
    </ScrollProvider>
  );
}
