"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    } else {
      // Default to dark mode if nothing is set
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 border-[1px] border-border hover:border-primary hover:text-primary transition-colors uppercase tracking-widest text-xs font-bold"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
