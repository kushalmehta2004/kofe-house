"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ProductTextOverlays from "./ProductTextOverlays";
import { Product } from "../data/products";

interface Props {
  product: Product;
}

const getAdaptiveFrameCount = () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) return 192;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const reducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;

  if (reducedData || memory <= 2) return 48;
  if (memory <= 4) return 72;
  return 96;
};

const getAdaptiveDpr = () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const baseDpr = window.devicePixelRatio || 1;
  if (!isMobile) return Math.min(baseDpr, 2);
  return Math.min(baseDpr, 1.5);
};

export default function ProductBottleScroll({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [mounted, setMounted] = useState(false);
  const [totalFrames, setTotalFrames] = useState(192);
  const canvasMetricsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const lastFrameIndexRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    setMounted(true);
    const frameCount = getAdaptiveFrameCount();
    setTotalFrames(frameCount);

    const setupCanvasDimensions = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = getAdaptiveDpr();

      canvasMetricsRef.current = { width: rect.width, height: rect.height, dpr };
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `${product.folderPath}/${i}.png`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 1) {
              // Draw the first frame immediately when it loads if we are at top
              setupCanvasDimensions();
              drawFrame(img);
            }
        };
        loadedImages.push(img);
    }
    setImages(loadedImages);

    // Initial Resize handling
    const resizeCanvas = () => {
      if (canvasRef.current && loadedImages[0]) {
        setupCanvasDimensions();
        drawFrame(loadedImages[0]);
      }
    };

    setupCanvasDimensions();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [product.folderPath]);

  const drawFrame = (img: HTMLImageElement) => {
    if (!canvasRef.current || !img.complete) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, dpr } = canvasMetricsRef.current;
    if (!width || !height) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Cover fit logic
    const hRatio = width / img.width;
    const vRatio = height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (width - img.width * ratio) / 2;
    const centerShift_y = (height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!images.length) return;
    
    // Map progress to frame index 0-119
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(latest * totalFrames))
    );

    if (frameIndex === lastFrameIndexRef.current) return;
    lastFrameIndexRef.current = frameIndex;
    
    requestAnimationFrame(() => {
      if (images[frameIndex]) {
        drawFrame(images[frameIndex]);
      }
    });
  });

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {mounted && (
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover absolute inset-0 z-0 pointer-events-none"
            style={{ 
              // We'll constrain max-height visually if needed, but absolute inset-0 fills viewport
            }}
          />
        )}
        
        <ProductTextOverlays product={product} scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
