"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_SERVICES, DEMO_CATEGORIES, DEMO_STAFF } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();

  const service = DEMO_SERVICES.find((s) => s.id === id);
  if (!service) {
    notFound();
  }

  const category = DEMO_CATEGORIES.find((c) => c.id === service.category_id);
  const recommendedStaff = DEMO_STAFF.filter((staff) =>
    staff.specializations?.some((spec: string) =>
      spec.toLowerCase().includes(service.name.toLowerCase().split(" ")[0]) ||
      spec.toLowerCase().includes(category?.name.toLowerCase() || "")
    )
  ).slice(0, 2);

  // Fallback to top stylists if none matched
  const stylistsToShow = recommendedStaff.length > 0 ? recommendedStaff : DEMO_STAFF.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-28 transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-5 py-3.5 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span>←</span>
            <span>All Services</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-5 pt-6 space-y-6">
        {/* Category & Title */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 font-medium">
              {category?.icon} {category?.name || "Styling"}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-400 font-mono capitalize">
              {service.gender_applicable === "all" ? "Unisex" : `${service.gender_applicable} only`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-[510] tracking-tight text-neutral-950 dark:text-white">
            {service.name}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xl font-bold text-neutral-950 dark:text-white">
              {formatCurrency(service.price)}
            </span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              ⏱ {service.duration_minutes} minutes
            </span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Guaranteed Zero Wait
            </span>
          </div>
        </div>

        {/* First-Time Promo Callout */}
        <div className="p-3.5 rounded-2xl bg-neutral-900 dark:bg-white/[0.08] text-white flex items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              FIRST TIME AT PAGE 3?
            </div>
            <div className="text-xs text-neutral-200 mt-0.5">
              Get this service for only{" "}
              <strong className="text-white">
                {formatCurrency(Math.round(service.price * 0.8))}
              </strong>{" "}
              using code <span className="font-mono text-amber-300 font-bold">FIRST20</span>
            </div>
          </div>
          <Link
            href={`/book?service=${service.id}&promo=FIRST20`}
            className="shrink-0 bg-white text-neutral-950 font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-all shadow-xs"
          >
            Apply Code →
          </Link>
        </div>

        {/* Detailed Description */}
        <div className="rf-card p-5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            About This Service
          </h2>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {service.description}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Every session at Page 3 begins with an in-depth texture analysis and styling consultation. Our master artists tailor technique, angle, and post-service care specifically to your face structure and lifestyle.
          </p>
        </div>

        {/* What's Included */}
        <div className="rf-card p-5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            What&apos;s Included in Your Session
          </h2>
          <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>1-on-1 Personalized Consultation with Master Stylist</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Invigorating Scalp Cleanse &amp; Deep Conditioning Rinse</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Precision Cut / Colour / Grooming with Luxury Haircare Tools</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Hot Towel Refresh &amp; Custom Styling Product Application</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Complimentary Nespresso Coffee or Herbal Tea</span>
            </li>
          </ul>
        </div>

        {/* Recommended Master Stylists */}
        <div className="rf-card p-5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Recommended Stylists for this Service
          </h2>
          <div className="space-y-2.5">
            {stylistsToShow.map((st) => (
              <div
                key={st.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center">
                    {st.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {st.full_name}
                    </div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      {st.specializations?.[0] || "Master Stylist"}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  ★ Available Today
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Booking Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] p-3.5 z-40 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-neutral-950 dark:text-white">
              {formatCurrency(service.price)}
            </div>
            <div className="text-[11px] text-neutral-400">
              {service.duration_minutes} mins duration
            </div>
          </div>

          <Link href={`/book?service=${service.id}`} className="flex-1 max-w-[220px]">
            <button
              type="button"
              className="w-full h-11 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Book This Service</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
