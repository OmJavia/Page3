"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_CUSTOMERS } from "@/lib/mock-data";
import { CUSTOMER_CATEGORIES } from "@/lib/constants";
import { CustomerCategory, Customer } from "@/lib/types";
import { formatCurrency, formatDate, getDaysSince } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CustomerCategory | "all">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(DEMO_CUSTOMERS[0]);
  const [ownerNote, setOwnerNote] = useState("");

  const filtered = customers.filter((c) => {
    const matchCat = categoryFilter === "all" || c.customer_category === categoryFilter;
    const matchSearch =
      !search ||
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.customer_code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddNote = () => {
    if (!ownerNote || !selectedCustomer) return;
    const updated = {
      ...selectedCustomer,
      notes: selectedCustomer.notes ? `${selectedCustomer.notes} • ${ownerNote}` : ownerNote,
    };
    setSelectedCustomer(updated);
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setOwnerNote("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            Customer Memory &amp; CRM
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Every client remembered: visit history, preferences, spending tier, and personalized reminders.
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="bg-neutral-900 hover:bg-black text-white font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
        >
          <span>+</span>
          <span>Register New Customer</span>
        </Link>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto bg-neutral-100/90 p-1 rounded-xl border border-black/[0.06] shadow-xs">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap transition-all duration-150 ${
              categoryFilter === "all"
                ? "bg-neutral-900 text-white shadow-xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-white/80"
            }`}
          >
            All Clients ({customers.length})
          </button>
          {(["new", "regular", "loyal", "at_risk", "inactive", "lost"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-[510] whitespace-nowrap capitalize transition-all duration-150 ${
                categoryFilter === cat
                  ? "bg-neutral-900 text-white shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-white/80"
              }`}
            >
              {CUSTOMER_CATEGORIES[cat].label} (
              {customers.filter((c) => c.customer_category === cat).length})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, phone, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 px-3.5 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-xs"
        />
      </div>

      {/* Two Column Layout: List and Detailed CRM Memory View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Directory */}
        <div className="lg:col-span-5 space-y-2.5">
          {filtered.map((c) => {
            const isSelected = selectedCustomer?.id === c.id;
            const catCfg = CUSTOMER_CATEGORIES[c.customer_category];
            const daysSince = getDaysSince(c.last_visit_date || c.created_at);
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-white border-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    : "bg-white border-black/[0.08] hover:border-black/[0.14] shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {c.full_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-[510] text-neutral-900">{c.full_name}</h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            c.customer_category === "loyal"
                              ? "bg-neutral-900 text-white"
                              : "bg-neutral-100 text-neutral-700 border border-black/[0.06]"
                          }`}
                        >
                          {catCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        +91 {c.phone} • {c.customer_code}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-[510] text-neutral-900">
                      {formatCurrency(c.total_spent)}
                    </span>
                    <p className="text-[10px] text-neutral-400">{c.total_visits} visits</p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    Last visited:{" "}
                    <strong className="text-neutral-800 font-medium">
                      {c.last_visit_date ? formatDate(c.last_visit_date) : "Never"}
                    </strong>
                  </span>
                  <span
                    className={
                      daysSince > 45 ? "text-red-600 font-semibold" : "text-emerald-700"
                    }
                  >
                    {daysSince} days ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Customer 360 Memory Dossier */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                    {selectedCustomer.full_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-[510] text-neutral-900">
                        {selectedCustomer.full_name}
                      </h2>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          selectedCustomer.customer_category === "loyal"
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-700 border border-black/[0.06]"
                        }`}
                      >
                        {CUSTOMER_CATEGORIES[selectedCustomer.customer_category].label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Phone: +91 {selectedCustomer.phone} • ID: {selectedCustomer.customer_code}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Registered on: {formatDate(selectedCustomer.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="px-3 py-2 bg-white border border-black/[0.08] hover:bg-neutral-50 text-xs font-[510] rounded-xl text-neutral-800 shadow-xs transition-all"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/91${selectedCustomer.phone}`}
                    target="_blank"
                    className="px-3 py-2 bg-white border border-black/[0.08] hover:bg-neutral-50 text-xs font-[510] rounded-xl text-neutral-800 shadow-xs transition-all"
                  >
                    💬 WhatsApp
                  </a>
                  <Link
                    href={`/admin/appointments/new?customer=${selectedCustomer.id}`}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-[510] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
                  >
                    + Book Visit
                  </Link>
                </div>
              </div>

              {/* CRM Friendly Owner Suggestion Prompt */}
              <div className="bg-neutral-50 border border-black/[0.06] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-900">
                  <span>💡</span> Stylist &amp; Owner Conversation Guide
                </div>
                <p className="text-xs text-neutral-700 font-medium">
                  &quot;{selectedCustomer.full_name} visited us previously for Haircut + Beard with Ravi. Ask how he liked his last service and if he&apos;d like his usual low fade haircut today.&quot;
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-neutral-50/60 rounded-xl p-3 border border-black/[0.06]">
                  <span className="text-[11px] text-neutral-500">Total Visits</span>
                  <p className="text-lg font-[510] text-neutral-900 mt-1">
                    {selectedCustomer.total_visits}
                  </p>
                </div>
                <div className="bg-neutral-50/60 rounded-xl p-3 border border-black/[0.06]">
                  <span className="text-[11px] text-neutral-500">Total Spending</span>
                  <p className="text-lg font-[510] text-neutral-900 mt-1">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </p>
                </div>
                <div className="bg-neutral-50/60 rounded-xl p-3 border border-black/[0.06]">
                  <span className="text-[11px] text-neutral-500">Loyalty Balance</span>
                  <p className="text-lg font-[510] text-neutral-900 mt-1">
                    {selectedCustomer.loyalty_points} pts
                  </p>
                </div>
                <div className="bg-neutral-50/60 rounded-xl p-3 border border-black/[0.06]">
                  <span className="text-[11px] text-neutral-500">Last Visit Gap</span>
                  <p className="text-lg font-[510] text-neutral-900 mt-1">
                    {getDaysSince(selectedCustomer.last_visit_date || "")} days
                  </p>
                </div>
              </div>

              {/* Customer Preferences & Notes */}
              <div className="space-y-3">
                <h3 className="text-xs font-[510] uppercase tracking-wider text-neutral-500">
                  Customer Styling Preferences &amp; History
                </h3>
                <div className="bg-neutral-50/70 border border-black/[0.06] rounded-xl p-3.5 text-xs text-neutral-700">
                  <p className="font-semibold text-neutral-900 mb-1">Permanent Client Notes:</p>
                  <p>{selectedCustomer.notes || "No notes recorded yet."}</p>
                </div>

                {/* Add new post-visit note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add post-visit note (e.g. used 20vol developer, prefers scissors on top)..."
                    value={ownerNote}
                    onChange={(e) => setOwnerNote(e.target.value)}
                    className="flex-1 h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 bg-neutral-900 hover:bg-black text-white font-[510] text-xs rounded-xl shadow-xs transition-all"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Service History Details */}
              <div className="space-y-2.5 pt-2 border-t border-black/[0.06]">
                <h3 className="text-xs font-[510] uppercase tracking-wider text-neutral-500">
                  Previous Service Breakdown
                </h3>
                <div className="bg-neutral-50/70 border border-black/[0.06] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-neutral-800">
                    <span className="font-semibold">Haircut + Beard Trim</span>
                    <span className="font-bold text-neutral-900">₹500</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>Date: 10 Nov 2024 • Stylist: Ravi Kumar</span>
                    <span className="text-emerald-700 font-medium">Completed ✓</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-12 text-center text-neutral-500 text-sm shadow-xs">
              Select a customer to view their complete CRM history dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
