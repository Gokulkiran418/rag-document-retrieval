"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

type Tween = gsap.core.Tween;

export default function AboutPage() {
  const themeContext = useTheme();
  const themeValue = themeContext.theme;
  const colors = themeContext.gradientColors;

  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<Tween | null>(null);
  useEffect(() => {
    if (!bgRef.current) return;

    // Kill any existing tween
    tweenRef.current?.kill();

    // Set up the dynamic gradient background
    bgRef.current.style.background = `linear-gradient(135deg, ${colors.join(
      ", "
    )})`;
    bgRef.current.style.backgroundSize = "400% 400%";
    bgRef.current.style.backgroundPosition = "0% 0%";

    // Animate it
    tweenRef.current = gsap.to(bgRef.current, {
      backgroundPosition: "200% 200%",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      overwrite: "auto",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [colors]);

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
      themeValue === "light" ? "text-gray-800" : "text-gray-100"
    }`}
  >
    <div ref={bgRef} className="absolute inset-0 -z-10 rounded-lg" />

    <div ref={contentRef} className="relative z-10 max-w-4xl space-y-12 w-full">

      {/* Top Card - Bio */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="p-6 bg-cardcolor-light dark:bg-card-glass-dark dark:backdrop-blur-md rounded-lg shadow-md space-y-4 text-text-light dark:text-white dark:border dark:border-[#1e2a3a]/60 dark:shadow-[0_0_12px_2px_rgba(149,1,1,0.2)]"
      >
        <h1 className="text-4xl font-bold">About Me</h1>
        <p className="text-lg">
          I am Gokul Kiran — a self-taught full stack developer with a passion for building fast, scalable, and modern web applications.  
        </p>
        <p className="text-lg">
          I innovate, build, and scale fullstack, cloud, and AI solutions. Your vision, my code. I transform your ideas into reality.
        </p>
      </motion.div>

      {/* Bottom Card - Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="p-6 bg-cardcolor-light dark:bg-card-glass-dark dark:backdrop-blur-md rounded-lg shadow-md space-y-4 text-text-light dark:text-white dark:border dark:border-[#1e2a3a]/60 dark:shadow-[0_0_12px_2px_rgba(149,1,1,0.2)]"
      >
        <h2 className="text-2xl font-semibold">Contact Info</h2>
        <ul className="list-disc list-inside text-left mx-auto w-fit space-y-1">
          <li>Email: umgokulkiran@gmail.com</li>
          <li>Portfolio: <a href="https://gokulkiranportfolio.vercel.app/" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">https://gokulkiranportfolio.vercel.app/</a></li>
        </ul>
      </motion.div>

    </div>
  </div>
);
}
