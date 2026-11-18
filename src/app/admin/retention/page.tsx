"use client";

import { useState } from "react";
import { DEMO_CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getDaysSince } from "@/lib/utils";
import { CUSTOMER_CATEGORIES } from "@/lib/constants";

export default function AdminRetentionPage() {
  const [atRiskDays, setAtRiskDays] = useState(30);
  const [inactiveDays, setInactiveDays] = useState(60);
  const [lostDays, setLostDays] = useState(90);

  // Status logs
  const [followUpStatus, setFollowUpStatus] = useState<Record<string, string>>({
    "cust-1": "Reactivation Message Sent",
    "cust-2": "Pending Follow-up",
  });

  const getDynamicCategory = (days: number) => {
    if (days >= lostDays) return "lost";
    if (days >= inactiveDays) return "inactive";
    if (days >= atRiskDays) return "at_risk";
    return "regular";
  };

  const handleSendWhatsApp = (c: typeof DEMO_CUSTOMERS[0], template: string) => {
    const text = encodeURIComponent(
      template
        .replace("{name}", c.full_name)
        .replace("{days}", String(getDaysSince(c.last_visit_date || "")))
    );
    window.open(`https://wa.me/91${c.phone}?text=${text}`, "_blank");
    setFollowUpStatus((prev) => ({ ...prev, [c.id]: `Contacted on ${new Date().toLocaleDateString("en-IN")}` }));
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Customer Retention & Reactivation
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Identify inactive clients, prevent churn with automated WhatsApp offers, and monitor retention rate.
          </p>
        </div>

        <div className="bg-amber-500/15 border border-amber-500/30 px-4 py-2 rounded-xl text-xs text-amber-300 font-bold">
          Retention Rate: 78.4% this month
        </div>
      </div>

      {/* Monthly Retention KPI Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-semibold text-zinc-400">Repeat Customers</span>
          <p className="text-2xl font-bold text-white mt-1">142</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ 12% vs last month</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-semibold text-zinc-400">Did Not Return</span>
          <p className="text-2xl font-bold text-red-400 mt-1">39</p>
          <span className="text-[11px] text-zinc-400">Needs proactive follow-up</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-semibold text-zinc-400">Reactivated This Month</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">28 clients</p>
          <span className="text-[11px] text-emerald-400 font-medium">Generated ₹19,600</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <span className="text-xs font-semibold text-zinc-400">Client Retention %</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">78.4%</p>
          <span className="text-[11px] text-zinc-400">Goal: 80%+</span>
        </div>
      </div>

      {/* Configurable Inactivity Rules by Service Type */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">Inactivity Threshold Configurations</h2>
            <p className="text-xs text-zinc-400">
              Customize days elapsed before triggering customer follow-up alerts (different intervals for haircuts vs keratin).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-zinc-950 rounded-xl border border-yellow-500/30">
            <label className="block font-semibold text-yellow-400 mb-1">
              &quot;At Risk&quot; Threshold (Haircuts)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={atRiskDays}
                onChange={(e) => setAtRiskDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono font-bold"
              />
              <span className="text-zinc-400">Days since visit</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-orange-500/30">
            <label className="block font-semibold text-orange-400 mb-1">
              &quot;Inactive&quot; Threshold (Spa/Color)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inactiveDays}
                onChange={(e) => setInactiveDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono font-bold"
              />
              <span className="text-zinc-400">Days since visit</span>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-red-500/30">
            <label className="block font-semibold text-red-400 mb-1">
              &quot;Lost Customer&quot; Alert
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lostDays}
                onChange={(e) => setLostDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono font-bold"
              />
              <span className="text-zinc-400">Days since visit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Customer Action Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-white">Reactivation Action Table</h2>
          <span className="text-xs text-zinc-400">Direct 1-Click Outreach via WhatsApp & Phone</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Last Visit Date</th>
                <th className="p-3.5">Days Elapsed</th>
                <th className="p-3.5">Dynamic Tier</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5">Follow-up Status</th>
                <th className="p-3.5 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {DEMO_CUSTOMERS.map((c) => {
                const days = getDaysSince(c.last_visit_date || "");
                const dynCategory = getDynamicCategory(days);
                const cfg = CUSTOMER_CATEGORIES[dynCategory];

                return (
                  <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      <div>{c.full_name}</div>
                      <div className="text-[10px] text-zinc-500">{c.customer_code}</div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-400">+91 {c.phone}</td>
                    <td className="p-3.5">{c.last_visit_date ? formatDate(c.last_visit_date) : "N/A"}</td>
                    <td className="p-3.5 font-bold font-mono text-amber-400">{days} days</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-zinc-200">
                      {formatCurrency(c.total_spent)}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] text-zinc-400">
                        {followUpStatus[c.id] || "No contact yet"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <a
                        href={`tel:${c.phone}`}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs"
                      >
                        📞
                      </a>
                      <button
                        onClick={() =>
                          handleSendWhatsApp(
                            c,
                            "Hi {name}, we miss seeing you at Page 3 Salon! It has been {days} days since your last haircut. Book this week and enjoy a complimentary Hair Spa on us! 💇✨"
                          )
                        }
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-lg text-xs shadow"
                      >
                        💬 WhatsApp Offer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

