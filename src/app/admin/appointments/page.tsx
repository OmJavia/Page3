"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_APPOINTMENTS } from "@/lib/mock-data";
import { formatCurrency, formatTime, formatDate } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus } from "@/lib/types";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = appointments.filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch =
      !search ||
      a.customer?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.customer?.phone.includes(search) ||
      a.appointment_code.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            Appointments Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Full appointment calendar, double-booking prevention, walk-in scheduling &amp; status pipeline.
          </p>
        </div>

        <Link
          href="/admin/appointments/new"
          className="bg-neutral-900 hover:bg-black text-white font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
        >
          <span>+</span>
          <span>Book Walk-in / Appointment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto bg-neutral-100/90 p-1 rounded-xl border border-black/[0.06] shadow-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap transition-all duration-150 ${
              statusFilter === "all"
                ? "bg-neutral-900 text-white shadow-xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-white/80"
            }`}
          >
            All Slots ({appointments.length})
          </button>
          {(
            [
              "pending",
              "confirmed",
              "checked_in",
              "in_progress",
              "completed",
              "cancelled",
              "no_show",
            ] as const
          ).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap capitalize transition-all duration-150 ${
                statusFilter === st
                  ? "bg-neutral-900 text-white shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/80"
              }`}
            >
              {APPOINTMENT_STATUSES[st].label} (
              {appointments.filter((a) => a.status === st).length})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by customer, phone, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-3.5 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-xs"
        />
      </div>

      {/* Appointments Grid / List */}
      <div className="space-y-3">
        {filtered.map((apt) => {
          const cfg = APPOINTMENT_STATUSES[apt.status as AppointmentStatus];
          return (
            <div
              key={apt.id}
              className="rf-card bg-white border border-black/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:border-black/[0.14] transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 border border-black/[0.06] px-2.5 py-0.5 rounded-md">
                    {apt.appointment_code}
                  </span>
                  <h3 className="text-sm font-[510] text-neutral-900">{apt.customer?.full_name}</h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      apt.status === "completed"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : apt.status === "in_progress"
                        ? "bg-neutral-900 text-white"
                        : apt.status === "checked_in"
                        ? "bg-neutral-200 text-neutral-900 font-bold"
                        : "bg-neutral-100 text-neutral-700 border border-black/[0.06]"
                    }`}
                  >
                    {cfg.label}
                  </span>
                  {apt.is_walk_in && (
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-medium border border-black/[0.06]">
                      Walk-In
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-500">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Date &amp; Time</span>
                    <span className="text-neutral-800 font-medium">
                      {formatDate(apt.appointment_date)} at {formatTime(apt.start_time)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Stylist Assigned</span>
                    <span className="text-neutral-800 font-medium">
                      {apt.staff?.full_name || "Any Stylist"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Phone Contact</span>
                    <span className="text-neutral-800 font-medium">+91 {apt.customer?.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Payment Status</span>
                    <span
                      className={`font-semibold ${
                        apt.payment_status === "paid" ? "text-emerald-700" : "text-neutral-900"
                      }`}
                    >
                      {formatCurrency(apt.total_amount)} ({apt.payment_status})
                    </span>
                  </div>
                </div>

                {apt.customer?.notes && (
                  <p className="text-xs text-neutral-700 bg-neutral-50 border border-black/[0.06] rounded-lg p-2.5">
                    💡 Customer Memory: &quot;{apt.customer.notes}&quot;
                  </p>
                )}
              </div>

              {/* Status transition controls */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-black/[0.06]">
                <a
                  href={`tel:${apt.customer?.phone}`}
                  className="px-3 py-2 bg-white border border-black/[0.08] hover:bg-neutral-50 rounded-xl text-xs font-[510] text-neutral-800 shadow-xs transition-all"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/91${apt.customer?.phone}`}
                  target="_blank"
                  className="px-3 py-2 bg-white border border-black/[0.08] hover:bg-neutral-50 rounded-xl text-xs font-[510] text-neutral-800 shadow-xs transition-all"
                >
                  💬 WhatsApp
                </a>

                {apt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(apt.id, "confirmed")}
                    className="px-3 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-[510] shadow-xs transition-all"
                  >
                    Confirm
                  </button>
                )}

                {apt.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(apt.id, "checked_in")}
                    className="px-3 py-2 bg-white border border-black/[0.12] hover:bg-neutral-900 hover:text-white text-neutral-900 rounded-xl text-xs font-[510] shadow-xs transition-all"
                  >
                    Check In Guest
                  </button>
                )}

                {apt.status === "checked_in" && (
                  <button
                    onClick={() => updateStatus(apt.id, "in_progress")}
                    className="px-3 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-[510] shadow-xs transition-all"
                  >
                    In Progress
                  </button>
                )}

                {apt.status === "in_progress" && (
                  <button
                    onClick={() => {
                      updateStatus(apt.id, "completed");
                      alert("Service completed! Revenue counted & inventory consumed via recipe.");
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                  >
                    ✓ Complete
                  </button>
                )}

                {apt.status !== "completed" && apt.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-[510] transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white border border-black/[0.08] rounded-2xl shadow-xs">
            <p className="text-neutral-500 text-sm">No matching appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
