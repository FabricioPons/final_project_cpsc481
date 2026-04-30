"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Section {
  id: string;
  title: string;
  icon?: string;
}

interface SectionNavProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}

export function SectionNav({ sections, activeSection, onSectionClick }: SectionNavProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;
        return (
          <motion.button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className="relative group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-primary w-4 h-4 shadow-lg shadow-primary/50"
                  : "bg-primary/40 hover:bg-primary/60"
              }`}
            />
            <motion.div
              className="absolute right-6 whitespace-nowrap text-sm font-medium"
              initial={{ opacity: 0, x: 10 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-foreground">{section.title}</span>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(((index + 1) / sections.length) * 100)}%
              </div>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
