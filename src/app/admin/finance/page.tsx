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
    description: "Staff Advance & Base Salaries",
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

export default function AdminFinancePage() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [newCat, setNewCat] = useState<Expense["category"]>("inventory");
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("2024-11-18");
  const [newMethod, setNewMethod] = useState("UPI");

  // Calculations
  const grossRevenue = 158400; // Total sales this month
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossRevenue - totalExpenses;

  const paymentBreakdown = {
    upi: 84200,
    cash: 42100,
    card: 26100,
    online: 6000,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            Financial &amp; Expense Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track daily gross revenue, payment method distribution, operating expenses, and net profit.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading Monthly Profit & Loss Statement (CSV/PDF)...")}
          className="bg-neutral-900 hover:bg-black text-white font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
        >
          <span>📥</span>
          <span>Download Financial Report</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:border-black/[0.14] hover:-translate-y-0.5 transition-all duration-200">
          <span className="text-xs font-[510] text-neutral-500">Monthly Gross Revenue</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 mt-1">{formatCurrency(grossRevenue)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Completed bookings &amp; retail</span>
        </div>

        <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:border-black/[0.14] hover:-translate-y-0.5 transition-all duration-200">
          <span className="text-xs font-[510] text-neutral-500">Total Operating Expenses</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 mt-1">{formatCurrency(totalExpenses)}</p>
          <span className="text-[11px] text-neutral-500">Rent, power, salaries &amp; stock</span>
        </div>

        <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:border-black/[0.14] hover:-translate-y-0.5 transition-all duration-200">
          <span className="text-xs font-[510] text-neutral-500">Estimated Net Profit</span>
          <p className="text-2xl font-[510] tracking-tight text-neutral-900 mt-1">{formatCurrency(netProfit)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">
            Profit margin: {((netProfit / grossRevenue) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-[510] text-neutral-900">Payment Method Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-black/[0.06]">
            <span className="text-neutral-500">UPI / QR Code</span>
            <p className="text-lg font-[510] text-neutral-900 mt-1">
              {formatCurrency(paymentBreakdown.upi)}
            </p>
            <span className="text-[10px] text-neutral-400">53.1% of transactions</span>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-black/[0.06]">
            <span className="text-neutral-500">Cash in Hand</span>
            <p className="text-lg font-[510] text-neutral-900 mt-1">
              {formatCurrency(paymentBreakdown.cash)}
            </p>
            <span className="text-[10px] text-neutral-400">26.6% of transactions</span>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-black/[0.06]">
            <span className="text-neutral-500">Credit / Debit Card</span>
            <p className="text-lg font-[510] text-neutral-900 mt-1">
              {formatCurrency(paymentBreakdown.card)}
            </p>
            <span className="text-[10px] text-neutral-400">16.5% of transactions</span>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-black/[0.06]">
            <span className="text-neutral-500">Online Advance (Razorpay)</span>
            <p className="text-lg font-[510] text-neutral-900 mt-1">
              {formatCurrency(paymentBreakdown.online)}
            </p>
            <span className="text-[10px] text-neutral-400">3.8% of transactions</span>
          </div>
        </div>
      </div>

      {/* Expenses Management & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Record Expense Form */}
        <div className="lg:col-span-5 rf-card bg-white border border-black/[0.08] rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-[510] text-neutral-900">Record Salon Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-500 mb-1">Expense Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as any)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
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
              <label className="block text-neutral-500 mb-1">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. November electricity bill for AC units"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Paid Via</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-neutral-900 hover:bg-black text-white font-[510] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01]"
            >
              Add Expense Record ✓
            </button>
          </form>
        </div>

        {/* Expense History Table */}
        <div className="lg:col-span-7 rf-card bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <div className="p-4 border-b border-black/[0.06]">
            <h2 className="text-sm font-[510] text-neutral-900">Recent Operational Expenses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-black/[0.06] uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06] text-neutral-700">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-semibold uppercase tracking-wider border border-black/[0.06]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-neutral-900">{exp.description}</td>
                    <td className="p-3.5 text-neutral-500">{formatDate(exp.date)}</td>
                    <td className="p-3.5 text-neutral-500">{exp.payment_method}</td>
                    <td className="p-3.5 text-right font-[510] text-neutral-900">
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
