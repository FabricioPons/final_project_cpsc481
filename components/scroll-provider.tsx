"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollContextType {
  scrollProgress: number;
  currentSection: number;
  isScrolling: boolean;
}

const ScrollContext = createContext<ScrollContextType>({
  scrollProgress: 0,
  currentSection: 0,
  isScrolling: false,
});

export const useScrollContext = () => useContext(ScrollContext);

interface ScrollProviderProps {
  children: ReactNode;
  totalSections: number;
}

export function ScrollProvider({ children, totalSections }: ScrollProviderProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest);
      const section = Math.min(
        Math.floor(latest * totalSections),
        totalSections - 1
      );
      setCurrentSection(section);
    });

    return () => unsubscribe();
  }, [smoothProgress, totalSections]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollProgress, currentSection, isScrolling }}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />
      
      {/* Grain Overlay for cinematic effect */}
      <div className="grain-overlay" aria-hidden="true" />
      
      {children}
    </ScrollContext.Provider>
  );
}
