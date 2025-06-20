"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";

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
    duration: 8,
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
    <div className="relative min-h-screen overflow-hidden px-6 py-16">
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-300 via-green-200 to-blue-200 rounded-lg"
        style={{ backgroundSize: '200% 200%' }}
      />

      <div
        ref={contentRef}
        className={`relative z-10 max-w-5xl mx-auto space-y-8 text-${theme === 'light' ? 'gray-800' : 'gray-100'} `}
      >
        <h1 className="text-5xl font-bold text-center">RAG Knowledge Base</h1>
        <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        className="flex justify-center"
      >
        <Link href="/rag">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-3 bg-white dark:bg-black back drop-blur-md text-black dark:text-white font-semibold rounded-xl border border-white/20 shadow-lg transition duration-300 hover:bg-white/20"
          >
            🔍 Try the RAG Chat Now
          </motion.button>
        </Link>
      </motion.div>
        {/* Full-width Project Explanation Card */}
       <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="p-6 bg-cardcolor-light dark:bg-card-glass-dark dark:backdrop-blur-md rounded-lg shadow-md space-y-4 text-text-light dark:text-white dark:border dark:border-[#1e2a3a]/60 dark:shadow-[0_0_12px_2px_rgba(149,1,1,0.2)]"
        >
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Upload PDF or text; server extracts text, chunks it, and generates embeddings via OpenAI.</li>
            <li>Embeddings stored in Pinecone; metadata saved in Neon PostgreSQL using Drizzle ORM.</li>
            <li>User queries are embedded, matched in Pinecone, then combined with relevant chunks to generate answers.</li>
            <li>Responses include context-aware answers with source citations; all operations via Next.js API routes.</li>
          </ul>
        </motion.div>
          

        {/* Two Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left Card */}
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 4, ease: "easeOut" }}
    className="p-6 bg-cardcolor-light dark:bg-card-glass-dark dark:backdrop-blur-md rounded-lg shadow-md space-y-4 text-text-light dark:text-white dark:border dark:border-[#1e2a3a]/60 dark:shadow-[0_0_12px_2px_rgba(149,1,1,0.2)]"
  >
    <h2 className="text-xl font-semibold">Technologies Used</h2>
    <ul className="list-disc list-inside space-y-1 text-sm">
      <li>Next.js (SSR/SSG, API routes)</li>
      <li>Tailwind CSS (utility-first, dark mode)</li>
      <li>Pinecone (vector DB for semantic search)</li>
      <li>Neon PostgreSQL + Drizzle ORM (metadata storage)</li>
      <li>OpenAI Embeddings & Chat API (text-embedding-3-large)</li>
      <li>Formidable & pdf-parse (file upload & parsing)</li>
      <li>GSAP (background and card animations)</li>
    </ul>
  </motion.div>

  {/* Right Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="p-6 bg-cardcolor-light dark:bg-card-glass-dark dark:backdrop-blur-md rounded-lg shadow-md space-y-4 text-text-light dark:text-white dark:border dark:border-[#1e2a3a]/60 dark:shadow-[0_0_12px_2px_rgba(149,1,1,0.2)]"
      >
        <h2 className="text-xl font-semibold mb-4">Workflow Diagram</h2>
        
        <div className="w-full h-48 border-secondary flex items-center justify-center text-secondary relative">
          <Image
            src="/images/workflow.png"
            alt="Workflow Diagram"
            fill
            className="object-contain"
            priority // optional: helps with LCP optimization
          />
        </div>
      </motion.div>
      </div>

        </div>
      </div>
    
  );
}
