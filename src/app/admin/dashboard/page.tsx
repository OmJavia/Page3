"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_DASHBOARD_STATS, DEMO_APPOINTMENTS, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency, formatTime, getDaysSince } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus } from "@/lib/types";

export default function AdminDashboardPage() {
  const [dateFilter, setDateFilter] = useState("Today");
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);

  const stats = DEMO_DASHBOARD_STATS;

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Salon Daily Operations</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time business performance, customer memory, and appointment pipeline.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          {["Today", "Yesterday", "Last 7 Days", "This Month", "Last Month"].map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                dateFilter === f
                  ? "bg-amber-500 text-zinc-950 font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400">Total Sales</span>
            <span className="text-lg">💰</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {formatCurrency(stats.today_sales)}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            ↑ 14% vs yesterday
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400">Customer Footfall</span>
            <span className="text-lg">👥</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {stats.today_customers} clients
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            <span className="text-amber-400 font-bold">{stats.new_customers} new</span> • {stats.repeat_customers} repeat
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400">Upcoming Today</span>
            <span className="text-lg">⏳</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {stats.upcoming_bookings} slots
          </div>
          <span className="text-[11px] text-blue-400 font-medium mt-1 inline-block">
            {stats.completed_today} completed
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400">Est. Monthly Profit</span>
            <span className="text-lg">📈</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {formatCurrency(stats.estimated_profit)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Rev: {formatCurrency(stats.monthly_revenue)} | Exp: {formatCurrency(stats.monthly_expenses)}
          </p>
        </div>
      </div>

      {/* CRM Reminder Alert: Rahul Sharma or Returning Customers */}
      <div className="bg-gradient-to-r from-blue-900/30 via-zinc-900 to-zinc-900 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-lg flex-shrink-0">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Customer Memory System
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20">
                VIP Alert
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              Rahul Sharma visited us previously for Haircut + Beard (Stylist: Ravi).
            </p>
            <p className="text-xs text-zinc-300 mt-0.5 italic">
              &quot;Rahul visited us previously for Haircut + Beard. Ask how he liked his last service & whether he wants the same low fade haircut.&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Link
            href="/admin/customers"
            className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold border border-blue-500/30"
          >
            View Customer History
          </Link>
        </div>
      </div>

      {/* Today's Appointments Table & Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Today&apos;s Appointments Pipeline</h2>
            <p className="text-xs text-zinc-400">
              Check in guests, initiate service, and trigger auto material consumption.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300"
          >
            View Full Calendar →
          </Link>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => {
            const statusCfg = APPOINTMENT_STATUSES[apt.status as AppointmentStatus];
            return (
              <div
                key={apt.id}
                className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {apt.appointment_code}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {apt.customer?.full_name}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusCfg.color}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span>⏰ {formatTime(apt.start_time)} – {formatTime(apt.end_time)}</span>
                    <span>•</span>
                    <span>👤 Stylist: {apt.staff?.full_name}</span>
                    <span>•</span>
                    <span>📞 +91 {apt.customer?.phone}</span>
                  </div>

                  {apt.customer?.notes && (
                    <p className="text-[11px] text-zinc-400 italic">
                      Client Note: &quot;{apt.customer.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  <div className="text-left md:text-right mr-2">
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(apt.total_amount)}
                    </span>
                    <p className="text-[10px] text-zinc-400">
                      {apt.payment_status === "paid" ? "✓ Paid" : "⏳ Due at salon"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${apt.customer?.phone}`}
                      className="p-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 rounded-lg text-xs"
                      title="Direct Call"
                    >
                      📞
                    </a>
                    <a
                      href={`https://wa.me/91${apt.customer?.phone}`}
                      target="_blank"
                      className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs"
                      title="Direct WhatsApp"
                    >
                      💬
                    </a>

                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(apt.id, "checked_in")}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === "checked_in" && (
                      <button
                        onClick={() => updateStatus(apt.id, "in_progress")}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-300 hover:bg-orange-500/30 text-xs font-semibold"
                      >
                        Start Service
                      </button>
                    )}

                    {apt.status === "in_progress" && (
                      <button
                        onClick={() => {
                          updateStatus(apt.id, "completed");
                          alert("Appointment completed! Revenue recorded and inventory materials automatically deducted from stock.");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                      >
                        ✓ Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retention & Inventory Quick Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Retention warning */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔄</span> Inactive Customers (Follow-up Needed)
            </h3>
            <Link href="/admin/retention" className="text-xs text-amber-400 font-semibold">
              Manage →
            </Link>
          </div>
          <p className="text-xs text-zinc-400">
            2 clients haven&apos;t visited in over 30 days. Send personalized WhatsApp reactivation perks.
          </p>
          <div className="space-y-2">
            {DEMO_CUSTOMERS.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{c.full_name}</span>
                  <span className="text-zinc-500 text-[11px] block">
                    Last visit: {c.last_visit_date} ({getDaysSince(c.last_visit_date || "")}d ago)
                  </span>
                </div>
                <a
                  href={`https://wa.me/91${c.phone}?text=Hi%20${c.full_name},%20we%20miss%20you%20at%20Page%203%20Salon!%20Enjoy%20a%20special%2020%%20off%20on%20your%20next%20haircut.`}
                  target="_blank"
                  className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium text-[11px]"
                >
                  WhatsApp Offer
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Low inventory alert */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚠️</span> Minimum Stock Alerts
            </h3>
            <Link href="/admin/inventory" className="text-xs text-amber-400 font-semibold">
              Reorder List →
            </Link>
          </div>
          <p className="text-xs text-zinc-400">
            Products falling below minimum threshold based on completed service recipe deductions.
          </p>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-red-300">
              <span>L&apos;Oreal Professional Black 1.0</span>
              <span>450 ml / Min 700 ml</span>
            </div>
            <p className="text-[11px] text-red-400/80">
              Black Colour is below minimum stock requirement. Suggested reorder: 3 Tubes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

