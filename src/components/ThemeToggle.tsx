"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-[34px] w-[64px] items-center rounded-full bg-slate-200 opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-[34px] w-[64px] items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${
        isDark 
          ? "bg-slate-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]" 
          : "bg-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
      }`}
      aria-label="Toggle theme"
    >
      {/* Background Icons (Inactive states) */}
      <div className="absolute inset-0 flex justify-between items-center px-[6px] pointer-events-none">
        <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDark ? "text-slate-400 opacity-100" : "opacity-0"}`} strokeWidth={2.5} />
        <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? "opacity-0" : "text-slate-400 opacity-100"}`} strokeWidth={2.5} />
      </div>

      {/* Thumb */}
      <span
        className={`z-10 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
          isDark ? "translate-x-[33px]" : "translate-x-[3px]"
        }`}
      >
        {isDark ? (
          <Moon className="h-[14px] w-[14px] text-indigo-600 transition-colors duration-300" strokeWidth={2.5} />
        ) : (
          <Sun className="h-[14px] w-[14px] text-amber-500 transition-colors duration-300" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}
