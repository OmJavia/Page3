"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStoredAppointments } from "@/lib/appointments-store";
import { Appointment } from "@/lib/types";

export default function AppointmentHistoryPage() {
  const [historyAppointments, setHistoryAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const all = getStoredAppointments();
    const storedPhone = localStorage.getItem("p3_client_phone");
    if (storedPhone) {
      const clean = storedPhone.replace(/\D/g, "").slice(-10);
      const filtered = all.filter(
        (a) => a.customer?.phone?.replace(/\D/g, "").slice(-10) === clean
      );
      setHistoryAppointments(filtered.length > 0 ? filtered : all.slice(0, 5));
    } else {
      setHistoryAppointments(all.slice(0, 5));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-24 transition-colors duration-200">
      <header className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-bold"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-sm font-[510] tracking-tight text-neutral-950 dark:text-white">
              Visit &amp; Service History
            </h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Page 3 – The Family Salon, Dewas
            </p>
          </div>
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
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Showing all completed salon appointments, styling recipes, and verified reviews.
        </p>

        <div className="space-y-3">
          {historyAppointments.map((item) => (
            <div
              key={item.id}
              className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 space-y-3 shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded-md">
                    {item.appointment_code}
                  </span>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white mt-1.5">
                    {item.services?.map((s) => s.service?.name).join(" + ") || "Hair Styling"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {formatDate(item.appointment_date)} • Stylist: {item.staff?.full_name || "Assigned Artist"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(item.total_amount)}
                  </span>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    ✓ {item.status.toUpperCase()}
                  </p>
                </div>
              </div>

              {item.notes && (
                <div className="bg-neutral-50 dark:bg-white/[0.03] p-2.5 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 border border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-neutral-800 dark:text-neutral-200 font-semibold">Service Notes:</span>{" "}
                  {item.notes}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-xs">
                <Link
                  href={`/reviews?appointment=${item.appointment_code}`}
                  className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1"
                >
                  <span>★</span>
                  <span>Leave a Review (+50 pts)</span>
                </Link>
                <Link
                  href={`/book${item.services && item.services[0] ? `?service=${item.services[0].service_id}` : ""}`}
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white font-medium"
                >
                  Book Same Again →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
