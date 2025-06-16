"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: "300% 300%",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (contentRef.current) {
      gsap.fromTo(
        Array.from(contentRef.current.children),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.25, ease: "power3.out" }
      );
    }
  }, []);

  const gradientClass =
    theme === "light"
      ? "from-blue-600 via-fuchsia-500 to-indigo-500"
      : "from-gray-800 via-indigo-900 to-black";

  return (
    <div className={`relative overflow-hidden ${theme === "light" ? 'bg-bg-light' : 'bg-bg-dark'}`}>
      <div
        ref={bgRef}
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 blur-sm`}
        style={{ backgroundSize: "400% 400%", zIndex: -1 }}
      />
      <div
        ref={contentRef}
        className={`relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center space-y-10 min-h-screen ${
          theme === "light" ? 'text-text-light' : 'text-text-dark'
        }`}
      >
        <h1 className="text-5xl font-bold">Welcome to RAG Knowledge Base</h1>
        <p className="text-xl max-w-2xl">
          Upload documents and query your custom knowledge base with Retrieval-Augmented Generation (RAG).
        </p>
        <Link
          href="/rag"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transform transition hover:scale-105"
        >
          Go to RAG Page
        </Link>
        {/* Rest of your content */}
      </div>
    </div>
  );
}