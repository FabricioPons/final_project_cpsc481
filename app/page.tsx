"use client";

// El Precio del Poder - Mexico Drug War Scrollytelling Project

import { ScrollProvider } from "@/components/scroll-provider";
import { HeroSection } from "@/components/sections/hero-section";
import { ElMenchoSection } from "@/components/sections/el-mencho-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { WarBeginsSection } from "@/components/sections/war-begins-section";
import { CJNGRiseSection } from "@/components/sections/cjng-rise-section";
import { DataExplorationSection } from "@/components/sections/data-exploration-section";
import { ConclusionSection } from "@/components/sections/conclusion-section";

export default function Home() {
  return (
    <ScrollProvider totalSections={7}>
      <main className="relative w-full">
        {/* Section 0: The Hook - El Mencho's Death */}
        <HeroSection />

        {/* Section 1: Who was El Mencho */}
        <ElMenchoSection />

        {/* Section 2: The Timeline - Six Presidents */}
        <TimelineSection />

        {/* Section 3: When the War Began - Calderón */}
        <WarBeginsSection />

        {/* Section 4: The Rise of CJNG */}
        <CJNGRiseSection />

        {/* Section 5: Interactive Data Exploration */}
        <DataExplorationSection />

        {/* Section 6: The Conclusion - Where We Are Now */}
        <ConclusionSection />
      </main>
    </ScrollProvider>
  );
}
