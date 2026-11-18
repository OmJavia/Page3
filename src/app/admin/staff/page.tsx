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
  const [staffList, setStaffList] = useState<StaffWithMetrics[]>(INITIAL_STAFF_METRICS);

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Staff & Stylist Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage salon team, working schedules, attendance, individual sales, and commission payouts.
          </p>
        </div>

        <button
          onClick={() => alert("Add Staff Modal")}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-amber-500/20"
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
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  {st.full_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{st.full_name}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                      {st.attendance_status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">+91 {st.phone}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                {st.commission_rate}% Comm.
              </span>
            </div>

            {/* Specialties */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Stylist Specializations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {st.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 capitalize"
                  >
                    {spec.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800 text-center">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 uppercase">Jobs Done</span>
                <p className="text-base font-bold text-white mt-0.5">{st.completed_services}</p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 uppercase">Sales Volume</span>
                <p className="text-base font-bold text-amber-400 mt-0.5">
                  {formatCurrency(st.revenue_generated)}
                </p>
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 uppercase">Commission</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(st.commission_earned)}
                </p>
              </div>
            </div>

            {/* Working Hours Summary */}
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs flex justify-between items-center text-zinc-400">
              <span>Roster: Mon–Sat (10:00 AM – 08:00 PM)</span>
              <span className="text-emerald-400 font-semibold">Available for Booking</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

