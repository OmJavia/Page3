"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Expense {
  id: string;
  category: "rent" | "electricity" | "salary" | "inventory" | "maintenance" | "marketing" | "other";
  description: string;
  amount: number;
  date: string;
  payment_method: string;
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    category: "rent",
    description: "Salon Commercial Space Rent",
    amount: 35000,
    date: "2024-11-01",
    payment_method: "Bank Transfer",
  },
  {
    id: "exp-2",
    category: "electricity",
    description: "Commercial Electricity & AC Bill",
    amount: 11200,
    date: "2024-11-05",
    payment_method: "UPI",
  },
  {
    id: "exp-3",
    category: "salary",
    description: "Staff Base Salaries & Tips",
    amount: 45000,
    date: "2024-11-07",
    payment_method: "Bank Transfer",
  },
  {
    id: "exp-4",
    category: "inventory",
    description: "L'Oreal Colour Tubes & Developers Batch 88",
    amount: 14500,
    date: "2024-11-12",
    payment_method: "Card",
  },
];

const PERIOD_METRICS = {
  today: {
    sales: 18450,
    expenses: 2800,
    appointments: 24,
    utilization: "78%",
    hairPercent: 62,
    skinPercent: 24,
    retailPercent: 14,
  },
  week: {
    sales: 118400,
    expenses: 28500,
    appointments: 146,
    utilization: "81%",
    hairPercent: 59,
    skinPercent: 26,
    retailPercent: 15,
  },
  month: {
    sales: 458400,
    expenses: 105700,
    appointments: 582,
    utilization: "84%",
    hairPercent: 58,
    skinPercent: 25,
    retailPercent: 17,
  },
};

const STYLIST_REPORT = [
  { name: "Rahul Sharma", role: "Master Hair Specialist", services: 54, sales: 46800, commission: 9360, util: "84%" },
  { name: "Priya Patel", role: "Senior Colour & Balayage", services: 42, sales: 52400, commission: 13100, util: "79%" },
  { name: "Amit Verma", role: "Aesthetic Skin & Spa", services: 38, sales: 34200, commission: 6840, util: "72%" },
  { name: "Sunita Rao", role: "Texture & Bridal Care", services: 28, sales: 25000, commission: 5000, util: "68%" },
];

export default function AdminFinancePage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [newCat, setNewCat] = useState<Expense["category"]>("inventory");
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("2024-11-18");
  const [newMethod, setNewMethod] = useState("UPI");

  const metrics = PERIOD_METRICS[period];
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = metrics.sales - totalExpenses;

  const paymentBreakdown = {
    upi: Math.round(metrics.sales * 0.53),
    cash: Math.round(metrics.sales * 0.27),
    card: Math.round(metrics.sales * 0.16),
    online: Math.round(metrics.sales * 0.04),
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0 || !newDesc) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category: newCat,
      description: newDesc,
      amount: amt,
      date: newDate,
      payment_method: newMethod,
    };

    setExpenses([newExp, ...expenses]);
    setNewDesc("");
    setNewAmount("");
    alert("Expense recorded successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              FINANCIAL AUDIT · REVENUE &amp; EXPENSES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
              GST Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Financial &amp; Reports Analytics
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time profit reconciliation, service category contribution, tender split, and staff commissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period Segmented Switcher (Karrio style) */}
          <div className="flex items-center bg-neutral-100 dark:bg-white/[0.06] p-1 rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
            {(["today", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-[510] capitalize transition-all ${
                  period === p
                    ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs font-semibold"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {p === "today" ? "Today" : p === "week" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert("Downloading Monthly Profit & Loss Statement (CSV/PDF)...")}
            className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Gross Sales</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">
            {formatCurrency(metrics.sales)}
          </p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            ↗ +14.2% vs previous period
          </span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Total Expenses</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">
            {formatCurrency(totalExpenses)}
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Rent, staff, utilities &amp; back-bar
          </span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Estimated Net Profit</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">
            {formatCurrency(netProfit)}
          </p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Margin: {((netProfit / metrics.sales) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] transition-all">
          <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400">Stylist Utilization</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 dark:text-white mt-1">
            {metrics.utilization}
          </p>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {metrics.appointments} appointments served
          </span>
        </div>
      </div>

      {/* Karrio Feature: Service Category Revenue Contribution Bars & Payment Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Contribution Bars (7 cols) */}
        <div className="lg:col-span-7 rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <div>
              <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
                Revenue Distribution by Category
              </h2>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Service categories vs retail sales volume for selected period
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 capitalize">
              {period}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Hair services */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-[510]">
                <span className="text-neutral-800 dark:text-neutral-200">Hair Cutting, Styling &amp; Chemical</span>
                <span className="font-mono text-neutral-900 dark:text-white">{metrics.hairPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-500"
                  style={{ width: `${metrics.hairPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Skin & Facial */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-[510]">
                <span className="text-neutral-800 dark:text-neutral-200">Skin, Facials &amp; Med-Spa Care</span>
                <span className="font-mono text-neutral-900 dark:text-white">{metrics.skinPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-600 dark:bg-neutral-300 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.skinPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Retail products */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-[510]">
                <span className="text-neutral-800 dark:text-neutral-200">Retail Shampoos, Serums &amp; Products</span>
                <span className="font-mono text-neutral-900 dark:text-white">{metrics.retailPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-400 dark:bg-neutral-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.retailPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>High retail conversion: 22.5% of visiting clients purchase take-home products.</span>
          </div>
        </div>

        {/* Payment Tender Distribution (5 cols) */}
        <div className="lg:col-span-5 rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
              Payment Settlement Methods
            </h2>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Audit breakdown across bank tenders
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400">UPI / QR Code</span>
              <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-1">
                {formatCurrency(paymentBreakdown.upi)}
              </p>
              <span className="text-[10px] text-neutral-400">53% of tender</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400">Cash in Hand</span>
              <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-1">
                {formatCurrency(paymentBreakdown.cash)}
              </p>
              <span className="text-[10px] text-neutral-400">27% of tender</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400">Credit / Debit Card</span>
              <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-1">
                {formatCurrency(paymentBreakdown.card)}
              </p>
              <span className="text-[10px] text-neutral-400">16% of tender</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400">Advance Online</span>
              <p className="text-base font-[510] font-mono text-neutral-900 dark:text-white mt-1">
                {formatCurrency(paymentBreakdown.online)}
              </p>
              <span className="text-[10px] text-neutral-400">4% of tender</span>
            </div>
          </div>
        </div>
      </div>

      {/* Karrio Feature: Stylist Performance & Commissions Table */}
      <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
              Stylist Performance &amp; Commission Ledger
            </h2>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Attributed line item earnings, service counts, and seat occupancy
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
            Auto-calculated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.06] dark:border-white/[0.06] uppercase text-[10px] font-semibold font-mono">
              <tr>
                <th className="p-3.5">Stylist</th>
                <th className="p-3.5">Specialization</th>
                <th className="p-3.5 text-center">Services Done</th>
                <th className="p-3.5 text-right">Gross Sales</th>
                <th className="p-3.5 text-right">Commission Earned</th>
                <th className="p-3.5 text-center">Seat Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.05] text-neutral-700 dark:text-neutral-300">
              {STYLIST_REPORT.map((st) => (
                <tr key={st.name} className="hover:bg-neutral-50/70 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-semibold text-neutral-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                      {st.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{st.name}</span>
                  </td>
                  <td className="p-3.5 text-neutral-500 dark:text-neutral-400">{st.role}</td>
                  <td className="p-3.5 text-center font-mono">{st.services}</td>
                  <td className="p-3.5 text-right font-mono font-medium text-neutral-900 dark:text-white">
                    {formatCurrency(st.sales)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    +{formatCurrency(st.commission)}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 font-mono text-[10px] font-semibold">
                      {st.util}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Management & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Record Expense Form */}
        <div className="lg:col-span-5 rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">Record Salon Operating Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Expense Category</label>
              <select
                aria-label="Expense Category"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as any)}
                className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              >
                <option value="rent">Commercial Rent</option>
                <option value="electricity">Electricity / Power</option>
                <option value="salary">Staff Salary / Incentive</option>
                <option value="inventory">Salon Product Stock</option>
                <option value="maintenance">Equipment Maintenance</option>
                <option value="marketing">Local Ads &amp; Marketing</option>
                <option value="other">Other Operational</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. November electricity bill for AC units"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Paid Via</label>
                <select
                  aria-label="Paid Via"
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] rounded-xl shadow-xs transition-all hover:scale-[1.01]"
            >
              Add Expense Record ✓
            </button>
          </form>
        </div>

        {/* Expense History Table */}
        <div className="lg:col-span-7 rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">Recent Operating Expenses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-white/[0.03] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.06] dark:border-white/[0.06] uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-neutral-700 dark:text-neutral-300">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-50/70 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 text-[10px] font-semibold uppercase tracking-wider border border-black/[0.06] dark:border-white/[0.08]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-neutral-900 dark:text-white">{exp.description}</td>
                    <td className="p-3.5 text-neutral-500 dark:text-neutral-400">{formatDate(exp.date)}</td>
                    <td className="p-3.5 text-neutral-500 dark:text-neutral-400">{exp.payment_method}</td>
                    <td className="p-3.5 text-right font-[510] font-mono text-neutral-900 dark:text-white">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
