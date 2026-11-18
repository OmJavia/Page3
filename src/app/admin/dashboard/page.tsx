"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DEMO_APPOINTMENTS, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency, formatTime, getDaysSince } from "@/lib/utils";
import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";

type DateRangeOption =
  | "Today"
  | "Yesterday"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month"
  | "Last Quarter"
  | "Last Year"
  | "All Time";

interface PeriodMetrics {
  total_sales: number;
  customer_footfall: number;
  new_customers: number;
  repeat_customers: number;
  upcoming_bookings: number;
  completed_today: number;
  estimated_profit: number;
  revenue: number;
  expenses: number;
  growth_label: string;
}

const PERIOD_DATA: Record<DateRangeOption, PeriodMetrics> = {
  Today: {
    total_sales: 4200,
    customer_footfall: 8,
    new_customers: 2,
    repeat_customers: 6,
    upcoming_bookings: 3,
    completed_today: 7,
    estimated_profit: 53000,
    revenue: 85000,
    expenses: 32000,
    growth_label: "↑ 14% vs yesterday",
  },
  Yesterday: {
    total_sales: 6850,
    customer_footfall: 14,
    new_customers: 4,
    repeat_customers: 10,
    upcoming_bookings: 0,
    completed_today: 14,
    estimated_profit: 53000,
    revenue: 85000,
    expenses: 32000,
    growth_label: "↑ 8% vs daily average",
  },
  "Last 7 Days": {
    total_sales: 38400,
    customer_footfall: 74,
    new_customers: 21,
    repeat_customers: 53,
    upcoming_bookings: 18,
    completed_today: 56,
    estimated_profit: 58000,
    revenue: 96000,
    expenses: 38000,
    growth_label: "↑ 19% vs previous 7d",
  },
  "Last 30 Days": {
    total_sales: 158400,
    customer_footfall: 298,
    new_customers: 82,
    repeat_customers: 216,
    upcoming_bookings: 45,
    completed_today: 253,
    estimated_profit: 64200,
    revenue: 168000,
    expenses: 103800,
    growth_label: "↑ 23% vs prev 30d",
  },
  "This Month": {
    total_sales: 124600,
    customer_footfall: 240,
    new_customers: 68,
    repeat_customers: 172,
    upcoming_bookings: 32,
    completed_today: 208,
    estimated_profit: 53000,
    revenue: 124600,
    expenses: 71600,
    growth_label: "↑ 16% month on-track",
  },
  "Last Month": {
    total_sales: 182300,
    customer_footfall: 345,
    new_customers: 94,
    repeat_customers: 251,
    upcoming_bookings: 0,
    completed_today: 345,
    estimated_profit: 72500,
    revenue: 195000,
    expenses: 122500,
    growth_label: "100% closed period",
  },
  "Last Quarter": {
    total_sales: 512000,
    customer_footfall: 980,
    new_customers: 260,
    repeat_customers: 720,
    upcoming_bookings: 0,
    completed_today: 980,
    estimated_profit: 198000,
    revenue: 560000,
    expenses: 362000,
    growth_label: "↑ 28% YoY growth",
  },
  "Last Year": {
    total_sales: 1860000,
    customer_footfall: 3820,
    new_customers: 1040,
    repeat_customers: 2780,
    upcoming_bookings: 0,
    completed_today: 3820,
    estimated_profit: 745000,
    revenue: 2120000,
    expenses: 1375000,
    growth_label: "Annual best benchmark",
  },
  "All Time": {
    total_sales: 3450000,
    customer_footfall: 6950,
    new_customers: 1920,
    repeat_customers: 5030,
    upcoming_bookings: 0,
    completed_today: 6950,
    estimated_profit: 1420000,
    revenue: 3890000,
    expenses: 2470000,
    growth_label: "Lifetime salon total",
  },
};

const DATE_OPTIONS: DateRangeOption[] = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Last Quarter",
  "Last Year",
  "All Time",
];

export default function AdminDashboardPage() {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("Today");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [appointments, setAppointments] = useState(DEMO_APPOINTMENTS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stats = PERIOD_DATA[selectedRange];

  // Close dropdown on click outside or open via query param
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("dropdown") === "open") {
        setDropdownOpen(true);
      }
    } catch {}

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Title & Filter Header with Date Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5]">
            Salon Daily Operations
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time business performance, customer memory, and appointment pipeline.
          </p>
        </div>

        {/* Header Right Actions: Date Dropdown + Quick Theme Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Theme Toggle Button */}
          <ThemeToggle showLabel size="md" />

          {/* User Requested Date Range Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl text-xs font-[510] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-900 dark:text-neutral-100 shadow-2xs hover:border-black/[0.16] dark:hover:border-white/[0.22] hover:bg-neutral-50/50 dark:hover:bg-white/[0.04] transition-all min-w-[140px]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs">📅</span>
                <span>{selectedRange}</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Popover */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-black/[0.06] dark:border-white/[0.06] mb-1">
                  Time Period Filter
                </div>
                <div className="space-y-0.5">
                  {DATE_OPTIONS.map((opt) => {
                    const isSelected = selectedRange === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedRange(opt);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-[510] transition-colors text-left ${
                          isSelected
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/70 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Level Metric Cards (Dynamic based on selected period) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Total Sales</span>
            <span className="text-base p-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300">
              💰
            </span>
          </div>
          <div className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-2">
            {formatCurrency(stats.total_sales)}
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md font-medium mt-1.5 inline-block border border-emerald-200/60 dark:border-emerald-800/40">
            {stats.growth_label}
          </span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Customer Footfall</span>
            <span className="text-base p-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300">
              👥
            </span>
          </div>
          <div className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-2">
            {stats.customer_footfall} clients
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">{stats.new_customers} new</span> • {stats.repeat_customers} repeat
          </p>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Upcoming Slots</span>
            <span className="text-base p-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300">
              ⏳
            </span>
          </div>
          <div className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-2">
            {stats.upcoming_bookings} slots
          </div>
          <span className="text-[11px] text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/[0.08] px-2 py-0.5 rounded-md font-medium mt-1.5 inline-block border border-neutral-200 dark:border-white/[0.1]">
            {stats.completed_today} completed
          </span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:border-black/[0.14] dark:hover:border-white/[0.16] hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-start">
            <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Est. Net Profit</span>
            <span className="text-base p-1.5 rounded-lg bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300">
              📈
            </span>
          </div>
          <div className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-2">
            {formatCurrency(stats.estimated_profit)}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 truncate">
            Rev: {formatCurrency(stats.revenue)} | Exp: {formatCurrency(stats.expenses)}
          </p>
        </div>
      </div>

      {/* CRM Reminder Alert: Returning Customers / VIP Memory */}
      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center text-lg shrink-0 shadow-xs">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                Customer Memory System
              </span>
              <span className="text-[10px] bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] font-medium">
                VIP Alert
              </span>
            </div>
            <p className="text-sm font-[510] text-neutral-900 dark:text-neutral-100 mt-1.5">
              Rahul Sharma visited us previously for Haircut + Beard (Stylist: Ravi).
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 italic">
              &quot;Rahul visited us previously for Haircut + Beard. Ask how he liked his last service &amp; whether he wants the same low fade haircut.&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <Link
            href="/admin/customers"
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-[510] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
          >
            View Customer History →
          </Link>
        </div>
      </div>

      {/* Today's Appointments Table & Quick Actions */}
      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-[510] text-neutral-900 dark:text-white">Today&apos;s Appointments Pipeline</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Check in guests, initiate service, and trigger auto material consumption.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs font-[510] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View Full Calendar</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        <div className="space-y-2.5">
          {appointments.map((apt) => {
            const statusCfg = APPOINTMENT_STATUSES[apt.status as AppointmentStatus];
            return (
              <div
                key={apt.id}
                className="p-4 bg-white dark:bg-[#18191c] rounded-xl border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.14] hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-white/[0.08] px-2 py-0.5 rounded border border-black/[0.06] dark:border-white/[0.08]">
                      {apt.appointment_code}
                    </span>
                    <span className="text-sm font-[510] text-neutral-900 dark:text-white">
                      {apt.customer?.full_name}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        apt.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          : apt.status === "in_progress"
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950"
                          : apt.status === "checked_in"
                          ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold"
                          : "bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]"
                      }`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>⏰ {formatTime(apt.start_time)} – {formatTime(apt.end_time)}</span>
                    <span>•</span>
                    <span>👤 Stylist: {apt.staff?.full_name}</span>
                    <span>•</span>
                    <span>📞 +91 {apt.customer?.phone}</span>
                  </div>

                  {apt.customer?.notes && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
                      Client Note: &quot;{apt.customer.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-black/[0.06] dark:border-white/[0.06]">
                  <div className="text-left md:text-right mr-2">
                    <span className="text-sm font-[510] text-neutral-900 dark:text-white">
                      {formatCurrency(apt.total_amount)}
                    </span>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      {apt.payment_status === "paid" ? "✓ Paid" : "⏳ Due at salon"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${apt.customer?.phone}`}
                      className="p-2 bg-white dark:bg-[#1a1b1e] border border-black/[0.08] dark:border-white/[0.12] hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-lg text-xs transition-all text-neutral-800 dark:text-neutral-200"
                      title="Direct Call"
                    >
                      📞
                    </a>
                    <a
                      href={`https://wa.me/91${apt.customer?.phone}`}
                      target="_blank"
                      className="p-2 bg-white dark:bg-[#1a1b1e] border border-black/[0.08] dark:border-white/[0.12] hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-lg text-xs transition-all text-neutral-800 dark:text-neutral-200"
                      title="Direct WhatsApp"
                    >
                      💬
                    </a>

                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(apt.id, "checked_in")}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1b1e] border border-black/[0.12] dark:border-white/[0.15] hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-neutral-800 dark:text-neutral-200 text-xs font-[510] shadow-xs transition-all"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === "checked_in" && (
                      <button
                        onClick={() => updateStatus(apt.id, "in_progress")}
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-[510] shadow-xs transition-all"
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
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all"
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
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-[510] text-neutral-900 dark:text-white flex items-center gap-2">
              <span>🔄</span> Inactive Customers (Follow-up Needed)
            </h3>
            <Link href="/admin/retention" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium">
              Manage →
            </Link>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            2 clients haven&apos;t visited in over 30 days. Send personalized WhatsApp reactivation perks.
          </p>
          <div className="space-y-2">
            {DEMO_CUSTOMERS.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="p-2.5 bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-white">{c.full_name}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px] block">
                    Last visit: {c.last_visit_date} ({getDaysSince(c.last_visit_date || "")}d ago)
                  </span>
                </div>
                <a
                  href={`https://wa.me/91${c.phone}?text=Hi%20${c.full_name},%20we%20miss%20you%20at%20Page%203%20Salon!%20Enjoy%20a%20special%2020%%20off%20on%20your%20next%20haircut.`}
                  target="_blank"
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-lg font-medium text-[11px] shadow-xs transition-all"
                >
                  WhatsApp Offer
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Low inventory alert */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-[510] text-neutral-900 dark:text-white flex items-center gap-2">
              <span>⚠️</span> Minimum Stock Alerts
            </h3>
            <Link href="/admin/inventory" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium">
              Reorder List →
            </Link>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Products falling below minimum threshold based on completed service recipe deductions.
          </p>
          <div className="p-3 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/[0.08] rounded-xl space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-neutral-900 dark:text-white">
              <span>L&apos;Oreal Professional Black 1.0</span>
              <span className="text-neutral-600 dark:text-neutral-400">450 ml / Min 700 ml</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Black Colour is below minimum stock requirement. Suggested reorder: 3 Tubes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
