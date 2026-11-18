"use client";

import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ThemeToggle({
  className = "",
  showLabel = false,
  size = "md",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 shadow-2xs hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.2] transition-all duration-200 font-[510] shrink-0 active:scale-95 ${
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-xs"
      } ${className}`}
    >
      <span className="text-sm select-none transition-transform duration-300 transform-gpu">
        {isDark ? "🌙" : "☀️"}
      </span>
      {showLabel && (
        <span className="text-[11px] font-medium tracking-tight">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
