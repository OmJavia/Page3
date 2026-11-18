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
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Customer Memory & CRM</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Every client remembered: visit history, preferences, spending tier, and personalized reminders.
          </p>
        </div>

        <Link
          href="/admin/customers/new"
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-amber-500/20"
        >
          <span>+</span>
          <span>Register New Customer</span>
        </Link>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto bg-zinc-900 p-1 rounded-xl border border-zinc-800 scrollbar-none">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === "all"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Clients ({customers.length})
          </button>
          {(["new", "regular", "loyal", "at_risk", "inactive", "lost"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                categoryFilter === cat
                  ? "bg-amber-500 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
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
          className="h-10 px-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
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
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center">
                      {c.full_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{c.full_name}</h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${catCfg.color}`}
                        >
                          {catCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        +91 {c.phone} • {c.customer_code}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400">
                      {formatCurrency(c.total_spent)}
                    </span>
                    <p className="text-[10px] text-zinc-500">{c.total_visits} visits</p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>
                    Last visited:{" "}
                    <strong className="text-zinc-300">
                      {c.last_visit_date ? formatDate(c.last_visit_date) : "Never"}
                    </strong>
                  </span>
                  <span
                    className={
                      daysSince > 45 ? "text-red-400 font-semibold" : "text-emerald-400"
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
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    {selectedCustomer.full_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">
                        {selectedCustomer.full_name}
                      </h2>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          CUSTOMER_CATEGORIES[selectedCustomer.customer_category].color
                        }`}
                      >
                        {CUSTOMER_CATEGORIES[selectedCustomer.customer_category].label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Phone: +91 {selectedCustomer.phone} • ID: {selectedCustomer.customer_code}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Registered on: {formatDate(selectedCustomer.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-xl text-zinc-200"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/91${selectedCustomer.phone}`}
                    target="_blank"
                    className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold rounded-xl"
                  >
                    💬 WhatsApp
                  </a>
                  <Link
                    href={`/admin/appointments/new?customer=${selectedCustomer.id}`}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold rounded-xl"
                  >
                    + Book Visit
                  </Link>
                </div>
              </div>

              {/* CRM Friendly Owner Suggestion Prompt */}
              <div className="bg-gradient-to-r from-blue-950/40 via-zinc-950 to-zinc-950 border border-blue-500/30 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <span>💡</span> Stylist & Owner Conversation Guide
                </div>
                <p className="text-xs text-zinc-200 font-medium">
                  &quot;{selectedCustomer.full_name} visited us previously for Haircut + Beard with Ravi. Ask how he liked his last service and if he&apos;d like his usual low fade haircut today.&quot;
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Total Visits</span>
                  <p className="text-lg font-bold text-white mt-1">
                    {selectedCustomer.total_visits}
                  </p>
                </div>
                <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Total Spending</span>
                  <p className="text-lg font-bold text-amber-400 mt-1">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </p>
                </div>
                <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Loyalty Balance</span>
                  <p className="text-lg font-bold text-emerald-400 mt-1">
                    {selectedCustomer.loyalty_points} pts
                  </p>
                </div>
                <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Last Visit Gap</span>
                  <p className="text-lg font-bold text-zinc-200 mt-1">
                    {getDaysSince(selectedCustomer.last_visit_date || "")} days
                  </p>
                </div>
              </div>

              {/* Customer Preferences & Notes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Customer Styling Preferences & History
                </h3>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-300">
                  <p className="font-semibold text-amber-400 mb-1">Permanent Client Notes:</p>
                  <p>{selectedCustomer.notes || "No notes recorded yet."}</p>
                </div>

                {/* Add new post-visit note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add post-visit note (e.g. used 20vol developer, prefers scissors on top)..."
                    value={ownerNote}
                    onChange={(e) => setOwnerNote(e.target.value)}
                    className="flex-1 h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Service History Details */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Previous Service Breakdown
                </h3>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="font-semibold">Haircut + Beard Trim</span>
                    <span className="font-bold text-white">₹500</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[11px]">
                    <span>Date: 10 Nov 2024 • Stylist: Ravi Kumar</span>
                    <span>Completed ✓</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 text-sm">
              Select a customer to view their complete CRM history dossier.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
