"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_CUSTOMERS, DEMO_APPOINTMENTS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getDaysSince } from "@/lib/utils";
import { CUSTOMER_CATEGORIES } from "@/lib/constants";

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [phoneInput, setPhoneInput] = useState("9876500001");
  const [customer, setCustomer] = useState(DEMO_CUSTOMERS[0]);

  const cat = CUSTOMER_CATEGORIES[customer.customer_category as keyof typeof CUSTOMER_CATEGORIES];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24">
      {/* Top Navbar */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-white">
            ←
          </Link>
          <h1 className="text-sm font-bold text-white">Client Portal</h1>
        </div>
        <Link
          href="/book"
          className="text-xs bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-3 py-1.5 rounded-lg transition-colors"
        >
          Book Now
        </Link>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              {customer.full_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white truncate">{customer.full_name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cat.color}`}
                >
                  {cat.label}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">+91 {customer.phone}</p>
              <p className="text-[11px] font-mono text-amber-400/80 mt-0.5">
                ID: {customer.customer_code}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-zinc-800 text-center">
            <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/80">
              <span className="text-xs text-zinc-400">Total Visits</span>
              <p className="text-base font-bold text-white mt-0.5">{customer.total_visits}</p>
            </div>
            <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/80">
              <span className="text-xs text-zinc-400">Total Spent</span>
              <p className="text-base font-bold text-amber-400 mt-0.5">
                {formatCurrency(customer.total_spent)}
              </p>
            </div>
            <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/80">
              <span className="text-xs text-zinc-400">Loyalty Pts</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {customer.loyalty_points}
              </p>
            </div>
          </div>
        </div>

        {/* CRM Memory Highlight */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>✨</span> Your Personal Salon Memory
          </div>
          <div className="text-xs space-y-2 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">First Visit:</span>
              <span className="text-zinc-200">
                {customer.first_visit_date ? formatDate(customer.first_visit_date) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Last Visited:</span>
              <span className="text-zinc-200">
                {customer.last_visit_date
                  ? `${formatDate(customer.last_visit_date)} (${getDaysSince(
                      customer.last_visit_date
                    )} days ago)`
                  : "First Visit Pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Recorded Preferences:</span>
              <span className="text-amber-400 font-medium">
                {customer.notes || "None recorded"}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming or Active Appointments */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Recent & Upcoming Visits
            </h3>
            <Link
              href="/profile/history"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Full History →
            </Link>
          </div>

          <div className="space-y-2.5">
            {DEMO_APPOINTMENTS.map((apt) => (
              <div
                key={apt.id}
                className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{apt.appointment_code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {apt.appointment_date} at {apt.start_time} • {apt.staff?.full_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">
                    {formatCurrency(apt.total_amount)}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Pay at Salon</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty & Rewards Perk */}
        <div className="bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Earn Free Grooming</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                You have {customer.loyalty_points} points. 500 points = ₹250 instant discount.
              </p>
            </div>
            <span className="text-2xl">🎁</span>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 pb-safe z-50">
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
                <span className="bg-amber-500 text-zinc-950 font-bold text-base w-9 h-9 rounded-full flex items-center justify-center -mt-5 shadow-lg border-2 border-zinc-900">
                  {item.icon}
                </span>
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              <span
                className={`text-[10px] font-medium ${
                  item.href === "/profile" ? "text-amber-400 font-bold" : "text-zinc-400"
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

