"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [gender, setGender] = useState<"all" | "male" | "female">("all");

  const filtered = DEMO_SERVICES.filter((s) => {
    const catMatch = activeCategory === "all" || s.category_id === activeCategory;
    const genderMatch = gender === "all" || s.gender_applicable === "all" || s.gender_applicable === gender;
    return catMatch && genderMatch && s.is_active;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-24 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] px-5 pt-8 pb-4 sticky top-0 z-20 transition-colors duration-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-bold">
                ← Back
              </Link>
              <h1 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">Services Menu</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle size="sm" />
            </div>
          </div>
          {/* Gender Filter */}
          <div className="flex gap-2">
            {(["all", "male", "female"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                  gender === g
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold"
                    : "border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06]"
                }`}
              >
                {g === "all" ? "All Genders" : g === "male" ? "👨 Gents" : "👩 Ladies"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 max-w-md mx-auto">
        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === "all"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                : "border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06]"
            }`}
          >
            All Services
          </button>
          {DEMO_CATEGORIES.filter((c) => c.is_active).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                  : "border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filtered.map((service) => (
            <div key={service.id} className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] p-4 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/services/${service.id}`} className="hover:underline">
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-sm tracking-tight">{service.name}</h3>
                    </Link>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.1] px-2 py-0.5 rounded-md whitespace-nowrap font-mono">
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{service.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-base font-bold text-neutral-950 dark:text-white">₹{service.price}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                <Link
                  href={`/services/${service.id}`}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-medium"
                >
                  View Details →
                </Link>
                <Link href={`/book?service=${service.id}`}>
                  <Button variant="default" size="sm" className="h-8 px-4 text-xs font-semibold">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
