"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_APPOINTMENTS, DEMO_CUSTOMERS } from "@/lib/mock-data";
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
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Appointments Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Full appointment calendar, double-booking prevention, walk-in scheduling & status pipeline.
          </p>
        </div>

        <Link
          href="/admin/appointments/new"
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-amber-500/20"
        >
          <span>+</span>
          <span>Book Walk-in / Appointment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto bg-zinc-900 p-1 rounded-xl border border-zinc-800 scrollbar-none">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === "all"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-white"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
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
          className="h-10 px-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Appointments Grid / List */}
      <div className="space-y-3">
        {filtered.map((apt) => {
          const cfg = APPOINTMENT_STATUSES[apt.status as AppointmentStatus];
          return (
            <div
              key={apt.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                    {apt.appointment_code}
                  </span>
                  <h3 className="text-sm font-bold text-white">{apt.customer?.full_name}</h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                  {apt.is_walk_in && (
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                      Walk-In
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-zinc-400">
                  <div>
                    <span className="text-zinc-500 block">Date & Time</span>
                    <span className="text-zinc-200 font-medium">
                      {formatDate(apt.appointment_date)} at {formatTime(apt.start_time)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Stylist Assigned</span>
                    <span className="text-zinc-200 font-medium">
                      {apt.staff?.full_name || "Any Stylist"}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Phone Contact</span>
                    <span className="text-zinc-200 font-medium">+91 {apt.customer?.phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Payment Status</span>
                    <span
                      className={`font-semibold ${
                        apt.payment_status === "paid" ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {formatCurrency(apt.total_amount)} ({apt.payment_status})
                    </span>
                  </div>
                </div>

                {apt.customer?.notes && (
                  <p className="text-xs text-blue-400/90 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
                    💡 Customer Memory: &quot;{apt.customer.notes}&quot;
                  </p>
                )}
              </div>

              {/* Status transition controls */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                <a
                  href={`tel:${apt.customer?.phone}`}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/91${apt.customer?.phone}`}
                  target="_blank"
                  className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-semibold"
                >
                  💬 WhatsApp
                </a>

                {apt.status === "pending" && (
                  <button
                    onClick={() => updateStatus(apt.id, "confirmed")}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Confirm
                  </button>
                )}

                {apt.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(apt.id, "checked_in")}
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold"
                  >
                    Check In Guest
                  </button>
                )}

                {apt.status === "checked_in" && (
                  <button
                    onClick={() => updateStatus(apt.id, "in_progress")}
                    className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold"
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
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-xs font-bold"
                  >
                    ✓ Complete
                  </button>
                )}

                {apt.status !== "completed" && apt.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(apt.id, "cancelled")}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 text-sm">No matching appointments found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
