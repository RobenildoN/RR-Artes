"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("rr_artes_theme") as Theme;
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolvedTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
      
      setTheme(resolvedTheme);
      
      if (resolvedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (err) {
      console.error("Failed to read theme preference:", err);
    } finally {
      setIsMounted(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    
    try {
      localStorage.setItem("rr_artes_theme", nextTheme);
    } catch (err) {
      console.error("Failed to save theme preference:", err);
    }

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Provider is rendered immediately; ThemeProvider wraps children without early return

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
