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
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            Staff &amp; Stylist Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage salon team, working schedules, attendance, individual sales, and commission payouts.
          </p>
        </div>

        <button
          onClick={() => alert("Add Staff Modal")}
          className="bg-neutral-900 hover:bg-black text-white font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
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
            className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:border-black/[0.14] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                  {st.full_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-[510] text-neutral-900">{st.full_name}</h3>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                      {st.attendance_status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">+91 {st.phone}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-black/[0.06] font-semibold">
                {st.commission_rate}% Comm.
              </span>
            </div>

            {/* Specialties */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Stylist Specializations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {st.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 bg-neutral-50 border border-black/[0.06] rounded-lg text-xs text-neutral-700 capitalize"
                  >
                    {spec.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-black/[0.06] text-center">
              <div className="bg-neutral-50/70 p-3 rounded-xl border border-black/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Jobs Done</span>
                <p className="text-base font-[510] text-neutral-900 mt-0.5">{st.completed_services}</p>
              </div>
              <div className="bg-neutral-50/70 p-3 rounded-xl border border-black/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Sales Volume</span>
                <p className="text-base font-[510] text-neutral-900 mt-0.5">
                  {formatCurrency(st.revenue_generated)}
                </p>
              </div>
              <div className="bg-neutral-50/70 p-3 rounded-xl border border-black/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Commission</span>
                <p className="text-base font-[510] text-emerald-700 mt-0.5">
                  {formatCurrency(st.commission_earned)}
                </p>
              </div>
            </div>

            {/* Working Hours Summary */}
            <div className="bg-neutral-50 p-3 rounded-xl border border-black/[0.06] text-xs flex justify-between items-center text-neutral-600">
              <span>Roster: Mon–Sat (10:00 AM – 08:00 PM)</span>
              <span className="text-emerald-700 font-semibold">Available for Booking</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
