"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../../context/ThemeContext";

type Tween = gsap.core.Tween;

export default function AboutPage() {
  const { theme, gradientColors } = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<Tween | null>(null);
  useEffect(() => {
    if (!bgRef.current) return;

    // Kill any existing tween
    tweenRef.current?.kill();

    // Set up the dynamic gradient background
    bgRef.current.style.background = `linear-gradient(135deg, ${gradientColors.join(
      ", "
    )})`;
    bgRef.current.style.backgroundSize = "400% 400%";
    bgRef.current.style.backgroundPosition = "0% 0%";

    // Animate it
    tweenRef.current = gsap.to(bgRef.current, {
      backgroundPosition: "200% 200%",
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      overwrite: "auto",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [gradientColors]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        Array.from(contentRef.current.children),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      className={`relative flex flex-col items-center justify-center px-6 py-16 min-h-screen text-center overflow-hidden ${
        theme === "light" ? "text-gray-800" : "text-gray-100"
      }`}
    >
      <div ref={bgRef} className="absolute inset-0 -z-10 rounded-lg" />

      <div ref={contentRef} className="relative z-10 max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold">About RAG Knowledge Base</h1>
        <p className="text-lg">
          RAG (Retrieval-Augmented Generation) combines vector search with LLMs,
          letting you build a knowledge base by uploading documents and then
          querying them with near-real-time, context-aware answers.
        </p>
        {/* Rest of your content */}
      </div>
    </div>
  );
}
