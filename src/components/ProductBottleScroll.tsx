"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ProductTextOverlays from "./ProductTextOverlays";
import { Product } from "../data/products";

interface Props {
  product: Product;
}

const TOTAL_FRAMES = 192;
const MOBILE_BREAKPOINT = 768;

const getAdaptiveDpr = () => {
  const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  const baseDpr = window.devicePixelRatio || 1;
  if (!isMobile) return Math.min(baseDpr, 2);
  return Math.min(baseDpr, 1.5);
};

export default function ProductBottleScroll({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array.from({ length: TOTAL_FRAMES }, () => null)
  );
  const loadedRef = useRef<boolean[]>(
    Array.from({ length: TOTAL_FRAMES }, () => false)
  );
  const loadingRef = useRef<Set<number>>(new Set());
  
  const [mounted, setMounted] = useState(false);
  const canvasMetricsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const lastFrameIndexRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const setupCanvasDimensions = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = getAdaptiveDpr();

    canvasMetricsRef.current = { width: rect.width, height: rect.height, dpr };
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  }, []);

  const drawFrame = useCallback((img: HTMLImageElement) => {
    if (!canvasRef.current || !img.complete) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, dpr } = canvasMetricsRef.current;
    if (!width || !height) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

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
  }, []);

  const loadFrame = useCallback(
    (index: number, highPriority = false): Promise<void> => {
      if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve();
      if (loadedRef.current[index]) return Promise.resolve();
      if (loadingRef.current.has(index)) return Promise.resolve();

      loadingRef.current.add(index);
      const img = new Image();
      imagesRef.current[index] = img;

      if ("decoding" in img) {
        img.decoding = "async";
      }
      if (highPriority && "fetchPriority" in img) {
        (img as HTMLImageElement & { fetchPriority?: "high" | "low" | "auto" }).fetchPriority = "high";
      }

      return new Promise((resolve) => {
        img.onload = () => {
          loadedRef.current[index] = true;
          loadingRef.current.delete(index);
          if (index === 0) {
            setupCanvasDimensions();
            drawFrame(img);
          }
          resolve();
        };
        img.onerror = () => {
          loadingRef.current.delete(index);
          resolve();
        };
        img.src = `${product.folderPath}/${index + 1}.png`;
      });
    },
    [drawFrame, product.folderPath, setupCanvasDimensions]
  );

  const findNearestLoadedFrame = useCallback((targetIndex: number) => {
    if (loadedRef.current[targetIndex] && imagesRef.current[targetIndex]) {
      return imagesRef.current[targetIndex];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      const next = targetIndex + offset;

      if (prev >= 0 && loadedRef.current[prev] && imagesRef.current[prev]) {
        return imagesRef.current[prev];
      }
      if (next < TOTAL_FRAMES && loadedRef.current[next] && imagesRef.current[next]) {
        return imagesRef.current[next];
      }
    }

    return null;
  }, []);

  useEffect(() => {
    setMounted(true);
    imagesRef.current = Array.from({ length: TOTAL_FRAMES }, () => null);
    loadedRef.current = Array.from({ length: TOTAL_FRAMES }, () => false);
    loadingRef.current.clear();
    lastFrameIndexRef.current = -1;

    const resizeCanvas = () => {
      setupCanvasDimensions();
      const currentTopFrame =
        (lastFrameIndexRef.current >= 0 && imagesRef.current[lastFrameIndexRef.current]) ||
        imagesRef.current[0];
      if (currentTopFrame) {
        drawFrame(currentTopFrame);
      }
    };

    setupCanvasDimensions();
    void loadFrame(0, true);

    // Controlled concurrent preloading keeps startup responsive on mobile.
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    const workers = isMobile ? 3 : 6;
    const queue = Array.from({ length: TOTAL_FRAMES - 1 }, (_, i) => i + 1);
    let cancelled = false;

    const runWorker = async () => {
      while (!cancelled && queue.length > 0) {
        const next = queue.shift();
        if (typeof next === "number") {
          await loadFrame(next);
        }
      }
    };

    for (let i = 0; i < workers; i++) {
      void runWorker();
    }

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawFrame, loadFrame, setupCanvasDimensions]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
    );

    if (frameIndex === lastFrameIndexRef.current) return;
    lastFrameIndexRef.current = frameIndex;

    if (!loadedRef.current[frameIndex]) {
      void loadFrame(frameIndex, true);
      void loadFrame(frameIndex + 1);
      void loadFrame(frameIndex - 1);
    }

    requestAnimationFrame(() => {
      const image = imagesRef.current[frameIndex];
      if (image && loadedRef.current[frameIndex]) {
        drawFrame(image);
        return;
      }

      const fallback = findNearestLoadedFrame(frameIndex);
      if (fallback) {
        drawFrame(fallback);
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
