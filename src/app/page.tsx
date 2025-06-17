"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

type Tween = gsap.core.Tween;

export default function HomePage() {
  const { theme, gradientColors } = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<Tween | null>(null);
  useEffect(() => {
  if (!bgRef.current) return;

  // Kill any existing tween
  tweenRef.current?.kill();

  // Set up the background gradient
  bgRef.current.style.background = `linear-gradient(135deg, ${gradientColors.join(", ")})`;
  bgRef.current.style.backgroundSize = "400% 400%";
  bgRef.current.style.backgroundPosition = "0% 0%";

  // Start the tween and save its reference
  tweenRef.current = gsap.to(bgRef.current, {
    backgroundPosition: "200% 200%",
    duration: 15,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    overwrite: "auto",
  });

  // ✅ Clean up on unmount or theme change
  return () => {
    tweenRef.current?.kill();
  };
}, [gradientColors]);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16">
      <div ref={bgRef} className="absolute inset-0 -z-10 rounded-lg" />
      <div
        ref={contentRef}
        className={`relative z-10 max-w-4xl text-center ${
          theme === "light" ? "text-gray-800" : "text-gray-100"
        } space-y-6`}
      >
        <h1 className="text-5xl font-bold">Welcome to the RAG Knowledge Base</h1>
        <p className="text-lg">
          Upload documents and query your custom knowledge base with RAG.
        </p>
      </div>
    </div>
  );
}
