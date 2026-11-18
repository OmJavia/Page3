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
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Financial & Expense Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track daily gross revenue, payment method distribution, operating expenses, and net profit.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading Monthly Profit & Loss Statement (CSV/PDF)...")}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-amber-500/20"
        >
          <span>📥</span>
          <span>Download Financial Report</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-zinc-400">Monthly Gross Revenue</span>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(grossRevenue)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Completed bookings & retail</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-zinc-400">Total Operating Expenses</span>
          <p className="text-2xl font-bold text-red-400 mt-1">{formatCurrency(totalExpenses)}</p>
          <span className="text-[11px] text-zinc-400">Rent, power, salaries & stock</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-zinc-400">Estimated Net Profit</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(netProfit)}</p>
          <span className="text-[11px] text-emerald-400 font-medium">
            Profit margin: {((netProfit / grossRevenue) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white">Payment Method Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">UPI / QR Code</span>
            <p className="text-lg font-bold text-white mt-1">
              {formatCurrency(paymentBreakdown.upi)}
            </p>
            <span className="text-[10px] text-zinc-500">53.1% of transactions</span>
          </div>
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Cash in Hand</span>
            <p className="text-lg font-bold text-white mt-1">
              {formatCurrency(paymentBreakdown.cash)}
            </p>
            <span className="text-[10px] text-zinc-500">26.6% of transactions</span>
          </div>
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Credit / Debit Card</span>
            <p className="text-lg font-bold text-white mt-1">
              {formatCurrency(paymentBreakdown.card)}
            </p>
            <span className="text-[10px] text-zinc-500">16.5% of transactions</span>
          </div>
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Online Advance (Razorpay)</span>
            <p className="text-lg font-bold text-white mt-1">
              {formatCurrency(paymentBreakdown.online)}
            </p>
            <span className="text-[10px] text-zinc-500">3.8% of transactions</span>
          </div>
        </div>
      </div>

      {/* Expenses Management & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Record Expense Form */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white">Record Salon Expense</h2>
          <form onSubmit={handleAddExpense} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Expense Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as any)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                <option value="rent">Commercial Rent</option>
                <option value="electricity">Electricity / Utility Bills</option>
                <option value="salary">Staff Salary & Commission</option>
                <option value="inventory">Inventory / Product Purchases</option>
                <option value="maintenance">Equipment Repair & Maintenance</option>
                <option value="marketing">Local Ads & Promotions</option>
                <option value="other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. L'Oreal developer order invoice #229"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Payment Method</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Card">Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Expense Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl transition-colors shadow-md shadow-amber-500/20"
            >
              Add Expense Record ✓
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">Expense Ledger</h2>
            <span className="text-xs text-zinc-400">{expenses.length} Records</span>
          </div>

          <div className="divide-y divide-zinc-800 text-xs">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{exp.description}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {exp.category}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    {formatDate(exp.date)} • Paid via {exp.payment_method}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-400">
                    -{formatCurrency(exp.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
