"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";

export default function ServicesPage() {
  const { t, language } = useLanguage();
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
                {t.back}
              </Link>
              <h1 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">{t.servicesMenuTitle}</h1>
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
                {g === "all" ? t.allGenders : g === "male" ? t.gents : t.ladies}
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
            {t.allServicesTab}
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
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {t.noServicesFound}
            </div>
          ) : (
            filtered.map((service) => (
              <div key={service.id} className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] p-4 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/services/${service.id}`} className="hover:underline">
                        <h3 className="font-semibold text-neutral-900 dark:text-white text-sm tracking-tight">{service.name}</h3>
                      </Link>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.1] px-2 py-0.5 rounded-md whitespace-nowrap font-mono">
                        {service.duration_minutes} {t.minuteUnit}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">{service.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-neutral-900 dark:text-white font-mono">₹{service.price}</span>
                      <Link href={`/book?service=${service.id}`}>
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-2xs h-8 px-3.5 transition-all cursor-pointer chroma-text-animate-parent"
                        >
                          <span className="chroma-text-out chroma-text-out-animate">{t.bookNow.split(" ")[0] || "Book"}</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
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

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] p-3 z-40 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <a
            href="tel:9111198911"
            className="h-11 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white flex items-center justify-center text-sm font-semibold transition-colors shrink-0"
            title="Call Salon"
          >
            <span>📞</span>
          </a>

          <a
            href="https://wa.me/919111198911?text=Hi%20Page%203%20Salon%20Dewas,%20I%20have%20a%20query%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-semibold transition-colors shrink-0"
            title="Chat on WhatsApp"
          >
            <span>💬</span>
          </a>

          <Link href="/book" className="flex-1">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl text-xs font-bold tracking-[-0.011em] border border-black/[0.08] dark:border-white/[0.12] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm hover:opacity-95 h-11 px-4 w-full transition-all"
            >
              <span>Book Any Service</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
