"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  gradientColors: string[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const gradientColors =
    theme === "light"
      ? ["#93C5FD", "#F472B6", "#D1D5DB"]
      : ["#1E293B", "#4C51BF", "#0F172A"];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, gradientColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
