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
    // suppressHydrationWarning lets React ignore the initial class mismatch
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RAG Knowledge Base</title>
        <meta
          name="description"
          content="A portfolio project to showcase RAG using Pinecone, OpenAI, and Next.js."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Inject theme class before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light';
                  }
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  console.error(e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="scroll-smooth">
        <ThemeProvider>
          <NavBar />
          <main className="relative z-10 overflow-x-hidden">
            {mounted ? (
              children
            ) : (
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
