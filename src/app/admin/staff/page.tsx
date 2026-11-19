"use client";

import { useState } from "react";
import { DEMO_STAFF } from "@/lib/mock-data";
import { Staff } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface StaffWithMetrics extends Staff {
  completed_services: number;
  revenue_generated: number;
  commission_earned: number;
  attendance_status: "Present" | "On Leave" | "Half Day";
}

const INITIAL_STAFF_METRICS: StaffWithMetrics[] = [
  {
    ...DEMO_STAFF[0],
    completed_services: 48,
    revenue_generated: 41200,
    commission_earned: 12360,
    attendance_status: "Present",
  },
  {
    ...DEMO_STAFF[1],
    completed_services: 36,
    revenue_generated: 52400,
    commission_earned: 18340,
    attendance_status: "Present",
  },
];

export default function AdminStaffPage() {
  const [staffList] = useState<StaffWithMetrics[]>(INITIAL_STAFF_METRICS);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              OPERATIONS · STYLISTS &amp; ATTENDANCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
              Live Shifts
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Staff &amp; Stylist Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage salon team, working schedules, attendance, individual sales, and commission payouts.
          </p>
        </div>

        <button
          onClick={() => alert("Add Staff Modal")}
          className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs transition-all hover:scale-[1.01]"
        >
          <span>+</span>
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xl flex items-center justify-center shadow-xs">
                  {st.full_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-[510] text-neutral-900 dark:text-white">{st.full_name}</h3>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">
                      {st.attendance_status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">+91 {st.phone}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg border border-black/[0.06] dark:border-white/[0.08] font-semibold">
                {st.commission_rate}% Comm.
              </span>
            </div>

            {/* Specialties */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
                Stylist Specializations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {st.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-lg text-xs text-neutral-700 dark:text-neutral-300 capitalize"
                  >
                    {spec.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
              <div className="bg-neutral-50/70 dark:bg-white/[0.02] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Jobs Done</span>
                <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-0.5">{st.completed_services}</p>
              </div>
              <div className="bg-neutral-50/70 dark:bg-white/[0.02] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Sales Volume</span>
                <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-0.5">
                  {formatCurrency(st.revenue_generated)}
                </p>
              </div>
              <div className="bg-neutral-50/70 dark:bg-white/[0.02] p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Commission</span>
                <p className="text-base font-[510] font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {formatCurrency(st.commission_earned)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
