"use client";

import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";


export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  


  return (
     <nav
      ref={navRef}
      className={`p-4 shadow-md transition-colors duration-300 ${
        theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-800 text-gray-200"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            href="/"
            className={`text-lg font-semibold hover:text-blue-500 transition-colors ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/rag"
            className={`text-lg font-semibold hover:text-blue-500 transition-colors ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            RAG
          </Link>
          <Link
            href="/about"
            className={`text-lg font-semibold hover:text-blue-500 transition-colors ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            About
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-md transform transition-transform hover:scale-105 ${
            theme === "light" ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-200"
          }`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
}
