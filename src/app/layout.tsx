"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import NavBar from "../components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <ThemeProvider >
          <NavBar />
          <main className="relative z-10 overflow-x-hidden">
            {mounted ? children : (
              <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
              </div>
            )}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
