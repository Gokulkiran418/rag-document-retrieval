"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function AboutPage() {
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: "200% 200%",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "linear",
      });
    }
    if (contentRef.current) {
      gsap.fromTo(
        Array.from(contentRef.current.children),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
      );
    }
  }, []);

  const gradientClass =
    theme === "light"
      ? "from-blue-500 via-pink-500 to-gray-500"
      : "from-gray-800 via-indigo-900 to-black";

  return (
    <div className={`relative flex flex-col items-center justify-center px-6 py-16 min-h-screen text-center overflow-hidden ${theme === "light" ? 'bg-bg-light' : 'bg-bg-dark'}`}>
      <div
        ref={bgRef}
        className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-20`}
        style={{ backgroundSize: "200% 200%", zIndex: -1 }}
      />
      <div ref={contentRef} className={`relative z-10 max-w-4xl space-y-8 ${theme === "light" ? 'text-text-light' : 'text-text-dark'}`}>
        <h1 className="text-4xl font-bold">About RAG Knowledge Base</h1>
        <p className="text-lg">
          RAG (Retrieval-Augmented Generation) combines vector search with LLMs, letting you build a knowledge base by uploading documents and then querying them with near-real-time, context-aware answers.
        </p>
        {/* Rest of your content */}
      </div>
    </div>
  );
}