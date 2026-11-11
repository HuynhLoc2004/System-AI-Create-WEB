"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

/**
 * SMOOTH SCROLL PROVIDER CHO NEXT.JS / REACT
 * Hiện thực hóa trải nghiệm cuộn mượt mà 60fps/120fps (Apple & Stripe style)
 * Sử dụng: Bọc ngoài cùng trong layout.tsx
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Khởi tạo Lenis Smooth Scroll Engine
    const lenis = new Lenis({
      duration: 1.2, // Thời gian trôi êm ái
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Đường cong giảm tốc mượt mà
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true, // Cuộn mượt với con lăn chuột
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

