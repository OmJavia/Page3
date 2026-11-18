"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_CUSTOMERS, DEMO_APPOINTMENTS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getDaysSince } from "@/lib/utils";
import { CUSTOMER_CATEGORIES } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ProfilePage() {
  const [customer] = useState(DEMO_CUSTOMERS[0]);
  const cat = CUSTOMER_CATEGORIES[customer.customer_category as keyof typeof CUSTOMER_CATEGORIES];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-24 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-bold">
            ← Back
          </Link>
          <h1 className="text-sm font-[510] tracking-tight text-neutral-950 dark:text-white">Client Portal</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <Link
            href="/book"
            className="text-xs bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-[510] px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-2xl flex items-center justify-center shadow-xs">
              {customer.full_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-[510] text-neutral-900 dark:text-white truncate">{customer.full_name}</h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    customer.customer_category === "loyal"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950"
                      : "bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]"
                  }`}
                >
                  {cat.label}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">+91 {customer.phone}</p>
              <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                ID: {customer.customer_code}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
            <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Visits</span>
              <p className="text-base font-[510] text-neutral-900 dark:text-white mt-0.5">{customer.total_visits}</p>
            </div>
            <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Spent</span>
              <p className="text-base font-[510] text-neutral-900 dark:text-white mt-0.5">
                {formatCurrency(customer.total_spent)}
              </p>
            </div>
            <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Loyalty Pts</span>
              <p className="text-base font-[510] text-emerald-700 dark:text-emerald-400 mt-0.5">
                {customer.loyalty_points}
              </p>
            </div>
          </div>
        </div>

        {/* CRM Memory Highlight */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
            <span>✨</span> Your Personal Salon Memory
          </div>
          <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">First Visit:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                {customer.first_visit_date ? formatDate(customer.first_visit_date) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">Last Visited:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                {customer.last_visit_date
                  ? `${formatDate(customer.last_visit_date)} (${getDaysSince(
                      customer.last_visit_date
                    )} days ago)`
                  : "First Visit Pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">Recorded Preferences:</span>
              <span className="text-neutral-900 dark:text-white font-medium">
                {customer.notes || "None recorded"}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming or Active Appointments */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-[510] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Recent &amp; Upcoming Visits
            </h3>
            <Link
              href="/profile/history"
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
            >
              Full History →
            </Link>
          </div>

          <div className="space-y-2.5">
            {DEMO_APPOINTMENTS.map((apt) => (
              <div
                key={apt.id}
                className="p-3 bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">{apt.appointment_code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 font-medium border border-black/[0.06] dark:border-white/[0.08]">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    {apt.appointment_date} at {apt.start_time} • {apt.staff?.full_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-[510] text-neutral-900 dark:text-white">
                    {formatCurrency(apt.total_amount)}
                  </span>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Pay at Salon</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty & Rewards Perk */}
        <div className="rf-card bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-[510] text-neutral-900 dark:text-white">Earn Free Grooming</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                You have {customer.loyalty_points} points. 500 points = ₹250 instant discount.
              </p>
            </div>
            <span className="text-2xl">🎁</span>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] pb-safe z-50 transition-colors duration-200">
        <div className="grid grid-cols-4 py-2 max-w-lg mx-auto">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/services", label: "Services", icon: "✂️" },
            { href: "/book", label: "Book", icon: "📅", highlight: true },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1"
            >
              {item.highlight ? (
                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-base w-9 h-9 rounded-full flex items-center justify-center -mt-5 shadow-lg border-2 border-white dark:border-[#121214]">
                  {item.icon}
                </span>
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              <span
                className={`text-[10px] font-medium ${
                  item.href === "/profile"
                    ? "text-neutral-950 dark:text-white font-bold"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
