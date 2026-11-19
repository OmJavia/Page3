"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_APPOINTMENTS, DEMO_STAFF } from "@/lib/mock-data";
import { formatCurrency, formatTime, formatDate } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus, Appointment } from "@/lib/types";

// Hours to display in the day timeline grid
const TIMELINE_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(DEMO_APPOINTMENTS);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar"); // default to calendar timeline view!
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

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
    if (selectedApt && selectedApt.id === id) {
      setSelectedApt((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // 4 primary active stylists for the resource columns
  const activeStylists = DEMO_STAFF.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              FRONT DESK · RESOURCE SCHEDULING
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 font-mono font-semibold">
              4 Stylists On Shift
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Appointments &amp; Timeline Calendar
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Resource-aware schedule grid, double-booking prevention, walk-in management, and live chair allocation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-neutral-100 dark:bg-white/[0.06] p-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-[510] flex items-center gap-1.5 transition-all ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <span>📅</span>
              <span>Stylist Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-[510] flex items-center gap-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <span>📋</span>
              <span>List View</span>
            </button>
          </div>

          <Link
            href="/admin/appointments/new"
            className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
          >
            <span>+</span>
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto bg-neutral-100/90 dark:bg-white/[0.04] p-1 rounded-xl border border-black/[0.06] dark:border-white/[0.06] shadow-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap transition-all duration-150 ${
              statusFilter === "all"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.06]"
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
            ] as const
          ).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap capitalize transition-all duration-150 ${
                statusFilter === st
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.06]"
              }`}
            >
              {APPOINTMENT_STATUSES[st].label} (
              {appointments.filter((a) => a.status === st).length})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search customer, phone, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-3.5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
        />
      </div>

      {/* VIEW 1: MULTI-STYLIST DAY CALENDAR TIMELINE GRID (Inspired by Karrio) */}
      {viewMode === "calendar" && (
        <div className="space-y-4">
          <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs">
            {/* Calendar Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06] gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🗓️</span>
                <div>
                  <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
                    Today · Resource Schedule
                  </h2>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Live stylist occupancy, buffer times &amp; chair availability
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Confirmed
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> In Service
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending
                </span>
              </div>
            </div>

            {/* Timeline Matrix */}
            <div className="overflow-x-auto mt-4">
              <div className="min-w-[760px]">
                {/* Header row: Stylist Columns */}
                <div className="grid grid-cols-5 border-b border-black/[0.08] dark:border-white/[0.08] pb-3 text-xs">
                  <div className="text-neutral-400 dark:text-neutral-500 font-mono text-center flex items-center justify-center font-bold">
                    TIME
                  </div>
                  {activeStylists.map((st) => (
                    <div key={st.id} className="px-3 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold flex items-center justify-center shadow-xs">
                        {st.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-[510] text-neutral-900 dark:text-white truncate">
                          {st.full_name}
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                          {st.specializations[0] || "Stylist"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slot Rows */}
                <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                  {TIMELINE_HOURS.map((hour) => {
                    return (
                      <div key={hour} className="grid grid-cols-5 min-h-[68px] items-stretch">
                        {/* Time label */}
                        <div className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500 flex items-center justify-center border-r border-black/[0.05] dark:border-white/[0.05] bg-neutral-50/50 dark:bg-white/[0.01]">
                          {hour}
                        </div>

                        {/* Stylist cell slots */}
                        {activeStylists.map((st, sIdx) => {
                          // Find appointment assigned to this stylist at this hour
                          const apt = appointments.find((a) => {
                            const startsWithHour = a.start_time.startsWith(hour.slice(0, 2));
                            const matchesStylist = a.staff_id === st.id || (!a.staff_id && sIdx === 0);
                            return startsWithHour && matchesStylist;
                          });

                          return (
                            <div
                              key={st.id}
                              className="p-1.5 border-r border-black/[0.05] dark:border-white/[0.05] relative group"
                            >
                              {apt ? (
                                <div
                                  onClick={() => setSelectedApt(apt)}
                                  className={`h-full w-full rounded-xl p-2 cursor-pointer transition-all border text-left shadow-xs flex flex-col justify-between ${
                                    apt.status === "in_progress"
                                      ? "bg-blue-50/90 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 hover:border-blue-400"
                                      : apt.status === "completed"
                                      ? "bg-neutral-100 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-400 hover:border-black/[0.14]"
                                      : apt.status === "checked_in"
                                      ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 hover:border-amber-400"
                                      : "bg-white dark:bg-[#1a1b1e] border-black/[0.08] dark:border-white/[0.08] text-neutral-900 dark:text-white hover:border-black/[0.2] dark:hover:border-white/[0.2]"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="font-semibold text-xs truncate">
                                        {apt.customer?.full_name || "Guest Client"}
                                      </span>
                                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                                        {formatCurrency(apt.total_amount)}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                                      {apt.services?.[0]?.service?.name || "Service Session"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
                                    <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">
                                      {apt.status}
                                    </span>
                                    <span className="text-[9px] text-neutral-400">
                                      {apt.start_time} - {apt.end_time}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full w-full rounded-lg border border-dashed border-transparent hover:border-black/[0.1] dark:hover:border-white/[0.1] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Link
                                    href={`/admin/appointments/new?staff=${st.id}&time=${hour}`}
                                    className="text-[10px] font-medium text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                  >
                                    + Book Slot
                                  </Link>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
              <span>Interactive calendar timeline preview · Click any booking card to manage or update its status.</span>
              <span>Showing 4 resource chairs</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LIST / TABLE VIEW */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filtered.map((apt) => {
            const cfg = APPOINTMENT_STATUSES[apt.status as AppointmentStatus];
            return (
              <div
                key={apt.id}
                className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all duration-200"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] px-2.5 py-0.5 rounded-md">
                      {apt.appointment_code}
                    </span>
                    <h3 className="text-sm font-[510] text-neutral-900 dark:text-white">
                      {apt.customer?.full_name}
                    </h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        apt.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : apt.status === "in_progress"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950"
                          : apt.status === "checked_in"
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold"
                          : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]"
                      }`}
                    >
                      {cfg.label}
                    </span>
                    {apt.is_walk_in && (
                      <span className="text-[10px] bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md font-medium border border-black/[0.06] dark:border-white/[0.08]">
                        Walk-In
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Date &amp; Time</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                        {formatDate(apt.appointment_date)} at {formatTime(apt.start_time)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Stylist Assigned</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                        {apt.staff?.full_name || "Any Stylist"}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Phone Contact</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium">+91 {apt.customer?.phone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block text-[11px]">Payment Status</span>
                      <span
                        className={`font-semibold ${
                          apt.payment_status === "paid" ? "text-emerald-700 dark:text-emerald-400" : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {formatCurrency(apt.total_amount)} ({apt.payment_status})
                      </span>
                    </div>
                  </div>

                  {apt.customer?.notes && (
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-lg p-2.5">
                      💡 Customer Memory: &quot;{apt.customer.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Status transition controls */}
                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-black/[0.06] dark:border-white/[0.06]">
                  <a
                    href={`tel:${apt.customer?.phone}`}
                    className="px-3 py-2 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-white/[0.04] rounded-xl text-xs font-[510] text-neutral-800 dark:text-neutral-200 shadow-xs transition-all"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/91${apt.customer?.phone}`}
                    target="_blank"
                    className="px-3 py-2 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-white/[0.04] rounded-xl text-xs font-[510] text-neutral-800 dark:text-neutral-200 shadow-xs transition-all"
                  >
                    💬 WhatsApp
                  </a>

                  {apt.status === "pending" && (
                    <button
                      onClick={() => updateStatus(apt.id, "confirmed")}
                      className="px-3 py-2 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl text-xs font-[510] shadow-xs transition-all"
                    >
                      Confirm
                    </button>
                  )}

                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(apt.id, "checked_in")}
                      className="px-3 py-2 bg-white dark:bg-[#161719] border border-black/[0.12] dark:border-white/[0.12] hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-900 dark:text-white rounded-xl text-xs font-[510] shadow-xs transition-all"
                    >
                      Check In Guest
                    </button>
                  )}

                  {apt.status === "checked_in" && (
                    <button
                      onClick={() => updateStatus(apt.id, "in_progress")}
                      className="px-3 py-2 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl text-xs font-[510] shadow-xs transition-all"
                    >
                      In Progress
                    </button>
                  )}

                  {apt.status === "in_progress" && (
                    <button
                      onClick={() => {
                        updateStatus(apt.id, "completed");
                        alert("Service completed! Sent to Checkout & POS for payment.");
                      }}
                      className="px-4 py-2 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl text-xs font-semibold shadow-xs transition-all"
                    >
                      ✓ Complete
                    </button>
                  )}

                  {apt.status !== "completed" && apt.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(apt.id, "cancelled")}
                      className="px-3 py-2 bg-white dark:bg-[#161719] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl text-xs font-[510] transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl shadow-xs">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">No matching appointments found.</p>
            </div>
          )}
        </div>
      )}

      {/* Appointment Detail / Status Modal */}
      {selectedApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#161719] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6 shadow-2xl text-neutral-900 dark:text-white space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  APPOINTMENT DETAILS
                </span>
                <h3 className="text-base font-[510] text-neutral-900 dark:text-white">
                  {selectedApt.customer?.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApt(null)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-neutral-500 dark:text-neutral-400">Code:</span>
                <span className="font-mono font-bold">{selectedApt.appointment_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-neutral-500 dark:text-neutral-400">Service:</span>
                <span className="font-medium">{selectedApt.services?.[0]?.service?.name || "Service Session"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-neutral-500 dark:text-neutral-400">Scheduled Time:</span>
                <span className="font-mono">{selectedApt.start_time} - {selectedApt.end_time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-neutral-500 dark:text-neutral-400">Stylist:</span>
                <span className="font-medium">{selectedApt.staff?.full_name || "Any Stylist"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-neutral-500 dark:text-neutral-400">Total Billable:</span>
                <span className="font-mono font-bold">{formatCurrency(selectedApt.total_amount)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500 dark:text-neutral-400">Current Status:</span>
                <span className="uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedApt.status}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-[510]">
              <button
                onClick={() => {
                  updateStatus(selectedApt.id, "in_progress");
                  setSelectedApt(null);
                }}
                className="py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs"
              >
                Mark In Progress ✂️
              </button>
              <button
                onClick={() => {
                  updateStatus(selectedApt.id, "completed");
                  setSelectedApt(null);
                }}
                className="py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
              >
                ✓ Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
