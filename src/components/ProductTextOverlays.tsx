"use client";

import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { Product } from "../data/products";

interface Props {
  product: Product;
  scrollYProgress: MotionValue<number>;
}

const sectionForProgress = (progress: number): number => {
  if (progress < 0.2) return 0;
  if (progress < 0.45) return 1;
  if (progress < 0.75) return 2;
  return 3;
};

export default function ProductTextOverlays({ product, scrollYProgress }: Props) {
  const [activeSection, setActiveSection] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextSection = sectionForProgress(latest);
    setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
  });

  const sections = useMemo(
    () => [
      { title: product.section1.title, subtitle: product.section1.subtitle, isHero: true },
      { title: product.section2.title, subtitle: product.section2.subtitle, isHero: false },
      { title: product.section3.title, subtitle: product.section3.subtitle, isHero: false },
      { title: product.section4.title, subtitle: product.section4.subtitle, isHero: true },
    ],
    [product]
  );

  const current = sections[activeSection];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -28 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="max-w-2xl text-[#FFF8F0] drop-shadow-2xl">
            {current.isHero ? (
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">{current.title}</h1>
            ) : (
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">{current.title}</h2>
            )}
            {current.subtitle && (
              <p
                className={
                  current.isHero
                    ? "text-xl md:text-3xl font-light text-[#FFF8F0]/90"
                    : "text-lg md:text-2xl font-light text-[#FFF8F0]/80 leading-relaxed max-w-xl mx-auto"
                }
              >
                {current.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
