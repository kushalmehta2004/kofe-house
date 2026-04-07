"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ProductTextOverlays from "./ProductTextOverlays";
import { Product } from "../data/products";

interface Props {
  product: Product;
}

export default function ProductBottleScroll({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const totalFrames = 192;

  useEffect(() => {
    setMounted(true);
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `${product.folderPath}/${i}.png`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 1) {
              // Draw the first frame immediately when it loads if we are at top
              drawFrame(img);
            }
        };
        loadedImages.push(img);
    }
    setImages(loadedImages);

    // Initial Resize handling
    const resizeCanvas = () => {
      if (canvasRef.current && loadedImages[0]) {
        drawFrame(loadedImages[0]);
      }
    };
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [product.folderPath]);

  const drawFrame = (img: HTMLImageElement) => {
    if (!canvasRef.current || !img.complete) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Cover fit logic
    const hRatio = rect.width / img.width;
    const vRatio = rect.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (rect.width - img.width * ratio) / 2;
    const centerShift_y = (rect.height - img.height * ratio) / 2;

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
