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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              GROWTH STUDIO · CHURN DEFENSE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
              Automated Follow-ups
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Customer Retention &amp; Reactivation
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Identify inactive clients, prevent churn with automated WhatsApp offers, and monitor retention rate.
          </p>
        </div>

        <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 px-4 py-2 rounded-xl text-xs font-[510] shadow-xs">
          Retention Rate: 78.4% this month
        </div>
      </div>

      {/* Monthly Retention KPI Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Repeat Customers</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">142</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">↑ 12% vs last month</span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Did Not Return</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">39</p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Needs proactive follow-up</span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Reactivated This Month</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">28 clients</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Generated ₹19,600</span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Client Retention %</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">78.4%</p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Goal: 80%+</span>
        </div>
      </div>

      {/* Configurable Inactivity Rules by Service Type */}
      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-xs">
        <div>
          <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">Inactivity Threshold Configurations</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Customize days elapsed before triggering customer follow-up alerts (different intervals for haircuts vs keratin).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
            <label className="block font-[510] text-neutral-900 dark:text-white mb-1">
              &quot;At Risk&quot; Threshold (Haircuts)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={atRiskDays}
                onChange={(e) => setAtRiskDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-neutral-900 dark:text-white font-mono font-bold shadow-xs"
              />
              <span className="text-neutral-500 dark:text-neutral-400">Days since visit</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
            <label className="block font-[510] text-neutral-900 dark:text-white mb-1">
              &quot;Inactive&quot; Threshold (Spa/Color)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={inactiveDays}
                onChange={(e) => setInactiveDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-neutral-900 dark:text-white font-mono font-bold shadow-xs"
              />
              <span className="text-neutral-500 dark:text-neutral-400">Days since visit</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
            <label className="block font-[510] text-neutral-900 dark:text-white mb-1">
              &quot;Lost Customer&quot; Alert
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lostDays}
                onChange={(e) => setLostDays(Number(e.target.value))}
                className="w-20 h-9 px-2.5 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-neutral-900 dark:text-white font-mono font-bold shadow-xs"
              />
              <span className="text-neutral-500 dark:text-neutral-400">Days since visit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Customer Action Table */}
      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] flex justify-between items-center">
          <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">Reactivation Action Table</h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Direct 1-Click Outreach via WhatsApp &amp; Phone</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.06] dark:border-white/[0.06] uppercase text-[10px] font-semibold font-mono">
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
            <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-neutral-700 dark:text-neutral-300">
              {DEMO_CUSTOMERS.map((c) => {
                const days = getDaysSince(c.last_visit_date || "");
                const dynCategory = getDynamicCategory(days);
                const cfg = CUSTOMER_CATEGORIES[dynCategory];

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/70 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-medium text-neutral-900 dark:text-white">
                      <div>{c.full_name}</div>
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500">{c.customer_code}</div>
                    </td>
                    <td className="p-3.5 font-mono text-neutral-600 dark:text-neutral-400">+91 {c.phone}</td>
                    <td className="p-3.5">{c.last_visit_date ? formatDate(c.last_visit_date) : "N/A"}</td>
                    <td className="p-3.5 font-bold font-mono text-neutral-900 dark:text-white">{days} days</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[9px] ${
                          dynCategory === "lost"
                            ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                            : dynCategory === "at_risk"
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/40"
                            : "bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium font-mono text-neutral-900 dark:text-white">
                      {formatCurrency(c.total_spent)}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {followUpStatus[c.id] || "No contact yet"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <a
                        href={`tel:${c.phone}`}
                        className="px-2.5 py-1 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] hover:bg-neutral-50 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200 rounded-lg text-xs shadow-xs"
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
                        className="px-3 py-1 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] rounded-lg text-xs shadow-xs transition-all"
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
    </div>
  );
}
