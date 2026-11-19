"use client";

import { useLanguage } from "@/lib/language-context";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-xl p-0.5 border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] shadow-2xs text-xs font-[510] ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded-lg transition-all duration-150 ${
          language === "en"
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        }`}
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-2 py-1 rounded-lg transition-all duration-150 ${
          language === "hi"
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        }`}
        title="हिन्दी (Hindi)"
      >
        हिं
      </button>
    </div>
  );
}
