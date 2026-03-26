"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface SectionWithImageProps {
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  imageOpacity?: number;
  className?: string;
}

export function SectionWithImage({
  children,
  imageSrc,
  imageAlt = "Section background",
  imagePosition = "right",
  imageOpacity = 0.15,
  className = "",
}: SectionWithImageProps) {
  return (
    <section className={`relative py-24 overflow-hidden ${className}`}>
      {/* Image background */}
      {imageSrc && (
        <motion.div
          className={`absolute inset-0 z-0 ${imagePosition === "left" ? "left-0" : "right-0"}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: imageOpacity }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover w-full h-full"
            quality={50}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
