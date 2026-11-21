"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { DEMO_SERVICES, DEMO_STAFF, DEMO_CUSTOMERS } from "@/lib/mock-data";

interface BillLineItem {
  id: string;
  type: "service" | "product";
  name: string;
  price: number;
  duration?: number;
  staffName: string;
  staffId?: string;
  commissionRate: number; // e.g. 0.20 (20%)
}

const INITIAL_LINES: BillLineItem[] = [
  {
    id: "item-1",
    type: "service",
    name: "Precision Haircut & Styling",
    price: 650,
    duration: 45,
    staffName: "Rahul Sharma",
    commissionRate: 0.2,
  },
  {
    id: "item-2",
    type: "service",
    name: "Signature Glow Facial",
    price: 1200,
    duration: 60,
    staffName: "Priya Patel",
    commissionRate: 0.25,
  },
  {
    id: "item-3",
    type: "service",
    name: "Nourishing Hair Spa & Mask",
    price: 850,
    duration: 45,
    staffName: "Amit Verma",
    commissionRate: 0.2,
  },
  {
    id: "item-4",
    type: "product",
    name: "Botanical Restorative Shampoo 250ml",
    price: 420,
    staffName: "Front Desk (Retail)",
    commissionRate: 0.1,
  },
];

export default function AdminCheckoutPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]); // Ananya Sharma
  const [lineItems, setLineItems] = useState<BillLineItem[]>(INITIAL_LINES);
  const [discountPercent, setDiscountPercent] = useState<number>(5); // 5% gold member discount
  const [paymentMode, setPaymentMode] = useState<"upi" | "cash" | "card" | "split">("upi");
  
  // Split payment amounts
  const [splitCash, setSplitCash] = useState<number>(1000);
  
  // Modal / status state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attributionTab, setAttributionTab] = useState<"split" | "commission" | "group">("split");

  // Calculations
  const servicesSubtotal = lineItems
    .filter((i) => i.type === "service")
    .reduce((sum, i) => sum + i.price, 0);

  const retailSubtotal = lineItems
    .filter((i) => i.type === "product")
    .reduce((sum, i) => sum + i.price, 0);

  const subtotal = servicesSubtotal + retailSubtotal;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.05); // 5% salon GST
  const grandTotal = taxableAmount + gstAmount;
  const splitUpi = Math.max(0, grandTotal - splitCash);

  // Quick add sample service
  const handleAddService = () => {
    const s = DEMO_SERVICES[Math.floor(Math.random() * DEMO_SERVICES.length)];
    const staff = DEMO_STAFF[Math.floor(Math.random() * DEMO_STAFF.length)];
    const newItem: BillLineItem = {
      id: `item-${Date.now()}`,
      type: "service",
      name: s.name,
      price: s.price,
      duration: s.duration_minutes,
      staffName: staff.full_name,
      commissionRate: 0.2,
    };
    setLineItems([...lineItems, newItem]);
  };

  // Quick add sample retail product
  const handleAddProduct = () => {
    const products = [
      { name: "Moroccan Argan Hair Oil 100ml", price: 850 },
      { name: "Keratin Smooth Leave-in Conditioner", price: 620 },
      { name: "Matte Hair Styling Wax 75g", price: 380 },
    ];
    const p = products[Math.floor(Math.random() * products.length)];
    const newItem: BillLineItem = {
      id: `item-${Date.now()}`,
      type: "product",
      name: p.name,
      price: p.price,
      staffName: "Front Desk (Retail)",
      commissionRate: 0.1,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(lineItems.filter((i) => i.id !== id));
  };

  const handleCompletePayment = () => {
    setIsCompleted(true);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              POS · MULTI-STYLIST FRONT DESK
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold">
              Live Billing
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Reception Checkout &amp; POS
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            One single customer invoice with multiple stylist line attribution, retail stock deduction, and split payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="rf-card px-3.5 py-2 rounded-xl text-xs font-[510] border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all flex items-center gap-2"
          >
            <span>🧾</span>
            <span>Receipt Preview</span>
          </button>
          <button
            onClick={handleAddService}
            className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
          >
            <span>+</span>
            <span>Add Service</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Client Details + Itemized Lines (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Client Info Header Card */}
          <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedCustomer.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
                      {selectedCustomer.full_name}
                    </h2>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                      ★ Gold Member
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    +91 {selectedCustomer.phone} · Visit #SV-089 · {selectedCustomer.loyalty_points} Points Available
                  </p>
                </div>
              </div>

              <select
                aria-label="Select Customer"
                value={selectedCustomer.id}
                onChange={(e) => {
                  const c = DEMO_CUSTOMERS.find((cust) => cust.id === e.target.value);
                  if (c) setSelectedCustomer(c);
                }}
                className="text-xs bg-neutral-100 dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-3 py-1.5 text-neutral-800 dark:text-neutral-200 outline-none"
              >
                {DEMO_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.phone.slice(-4)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Items Card */}
          <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-[510] text-neutral-900 dark:text-white">
                  Billed Services &amp; Products
                </h3>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  {lineItems.length} items on this customer bill
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddService}
                  className="px-2.5 py-1 text-[11px] rounded-lg font-medium border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.08]"
                >
                  + Service
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-2.5 py-1 text-[11px] rounded-lg font-medium border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.08]"
                >
                  + Retail Product
                </button>
              </div>
            </div>

            {/* List of items */}
            <div className="space-y-2.5">
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-black/[0.05] dark:border-white/[0.05] bg-neutral-50/70 dark:bg-white/[0.02] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base shrink-0">
                      {item.type === "service" ? "✂️" : "🧴"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-[510] text-neutral-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        {item.type === "product" && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 font-semibold">
                            Retail
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {item.duration ? `${item.duration} min · ` : "Over-the-counter · "}
                        Attributed to: <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.staffName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-xs font-[510] font-mono text-neutral-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400 text-xs p-1"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Attribution Breakdown Box inspired by Karrio */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-[510] text-neutral-800 dark:text-neutral-200">
                  Staff Attribution &amp; Commissions
                </span>
                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-white/[0.06] p-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={() => setAttributionTab("split")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      attributionTab === "split"
                        ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    By Stylist
                  </button>
                  <button
                    onClick={() => setAttributionTab("commission")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      attributionTab === "commission"
                        ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Commissions
                  </button>
                  <button
                    onClick={() => setAttributionTab("group")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      attributionTab === "group"
                        ? "bg-white dark:bg-[#18191c] text-neutral-900 dark:text-white shadow-xs"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    Group Bill
                  </button>
                </div>
              </div>

              {attributionTab === "split" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Array.from(new Set(lineItems.map((i) => i.staffName))).map((stylist) => {
                    const totalForStylist = lineItems
                      .filter((i) => i.staffName === stylist)
                      .reduce((sum, i) => sum + i.price, 0);
                    return (
                      <div
                        key={stylist}
                        className="p-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-neutral-50 dark:bg-white/[0.02]"
                      >
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate">
                          {stylist}
                        </span>
                        <span className="text-xs font-[510] font-mono text-neutral-900 dark:text-white">
                          {formatCurrency(totalForStylist)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {attributionTab === "commission" && (
                <div className="space-y-1.5 text-xs">
                  {lineItems
                    .filter((i) => i.type === "service")
                    .map((item) => {
                      const comm = Math.round(item.price * item.commissionRate);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-neutral-600 dark:text-neutral-400"
                        >
                          <span>{item.staffName} · {item.name}</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                            +{formatCurrency(comm)} ({item.commissionRate * 100}%)
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}

              {attributionTab === "group" && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Single-payer group mode active: The invoice is consolidated under {selectedCustomer.full_name}, but service histories will be individually preserved under each guest dossier.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Calculation & Tender (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
              <h2 className="text-sm font-[510] text-neutral-900 dark:text-white">
                Payment &amp; Tender Settlement
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                isCompleted
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300"
              }`}>
                {isCompleted ? "✓ Paid & Settled" : "Draft Order"}
              </span>
            </div>

            {/* Subtotal breakdowns */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Services Subtotal ({lineItems.filter((i) => i.type === "service").length})</span>
                <span className="font-mono text-neutral-900 dark:text-white">{formatCurrency(servicesSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Retail Products ({lineItems.filter((i) => i.type === "product").length})</span>
                <span className="font-mono text-neutral-900 dark:text-white">{formatCurrency(retailSubtotal)}</span>
              </div>

              {/* Loyalty Discount */}
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <span>Loyalty Discount ({discountPercent}%)</span>
                  <button
                    onClick={() => setDiscountPercent(discountPercent === 5 ? 10 : 5)}
                    className="text-[10px] underline text-neutral-400 hover:text-neutral-600"
                  >
                    Adjust
                  </button>
                </div>
                <span className="font-mono font-semibold">−{formatCurrency(discountAmount)}</span>
              </div>

              {/* GST 5% */}
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Salon GST (5%)</span>
                <span className="font-mono text-neutral-900 dark:text-white">{formatCurrency(gstAmount)}</span>
              </div>
            </div>

            {/* Total Display */}
            <div className="pt-3 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs font-[510] text-neutral-500 dark:text-neutral-400 block">
                  Total Amount to Collect
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  Inclusive of all taxes &amp; discounts
                </span>
              </div>
              <span className="text-2xl font-[510] font-mono tracking-tight text-neutral-900 dark:text-white">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-[510] text-neutral-700 dark:text-neutral-300">
                Payment Tender Method
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(["upi", "cash", "card", "split"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 text-xs font-[510] rounded-xl border capitalize transition-all ${
                      paymentMode === mode
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold"
                        : "bg-neutral-50 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    {mode === "split" ? "Split ✂️" : mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Breakdown Input if Split Mode selected */}
            {paymentMode === "split" && (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2.5 text-xs animate-in fade-in duration-200">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                  Split Payment Breakdown
                </span>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-neutral-500 dark:text-neutral-400">Cash Portion (₹):</label>
                  <input
                    type="number"
                    value={splitCash}
                    onChange={(e) => setSplitCash(Number(e.target.value) || 0)}
                    className="w-28 h-8 px-2.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#161719] text-right font-mono text-xs text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 pt-1 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <span>Remaining by UPI / Card:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(splitUpi)}
                  </span>
                </div>
              </div>
            )}

            {/* Collect Payment Action Button */}
            <button
              onClick={handleCompletePayment}
              className="w-full py-3 rounded-xl text-xs font-[510] bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <span>💳</span>
              <span>
                {isCompleted ? "Re-print Receipt" : `Settle & Collect ${formatCurrency(grandTotal)}`}
              </span>
            </button>
          </div>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <p className="font-medium text-neutral-800 dark:text-neutral-200">
              ⚡ POS Automation Active
            </p>
            <p>
              Upon settlement, stock quantities for retail products will automatically decrease, staff service commissions will be credited, and a WhatsApp digital receipt link will be dispatched to +91 {selectedCustomer.phone}.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {showReceiptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            id="printable-invoice"
            className="w-full max-w-sm bg-white dark:bg-[#161719] border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-6 shadow-2xl text-neutral-900 dark:text-white space-y-4 font-mono text-xs animate-in zoom-in-95 duration-150 print:border-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Salon Header */}
            <div className="text-center space-y-1 border-b border-black/[0.08] dark:border-white/[0.08] pb-4">
              <h3 className="font-bold text-base tracking-wider font-sans">PAGE 3 SALON</h3>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Luxury Hair, Skin &amp; Spa Care Studio
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Helpline / WhatsApp: +91 9111198911
              </p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 font-mono mt-1">
                INV-2026-0894
              </span>
            </div>

            {/* Customer & Timestamp */}
            <div className="space-y-0.5 text-[11px] text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Guest:</span>
                <span className="font-bold text-neutral-900 dark:text-white print:text-black">{selectedCustomer.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="print:text-black">+91 {selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="print:text-black">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="border-t border-b border-dashed border-black/[0.15] dark:border-white/[0.15] py-2 space-y-1.5 text-[11px]">
              {lineItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <span className="block font-medium text-neutral-900 dark:text-white print:text-black">{item.name}</span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 print:text-neutral-600">
                      By {item.staffName}
                    </span>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white print:text-black">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
                <span>Subtotal:</span>
                <span className="print:text-black">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 print:text-emerald-800">
                <span>Discount ({discountPercent}%):</span>
                <span>−{formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400 print:text-neutral-600">
                <span>GST (5%):</span>
                <span className="print:text-black">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white print:text-black pt-1 border-t border-black/[0.08] dark:border-white/[0.08]">
                <span>Total Paid:</span>
                <span className="print:text-black">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500 print:text-neutral-600 pt-0.5">
                <span>Tender Mode:</span>
                <span className="uppercase font-semibold text-neutral-700 dark:text-neutral-300 print:text-black">
                  {paymentMode === "split" ? `Cash ${formatCurrency(splitCash)} + UPI ${formatCurrency(splitUpi)}` : paymentMode}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-sans font-[510] text-xs text-center shadow-xs cursor-pointer hover:bg-black dark:hover:bg-neutral-100 transition-all"
              >
                🖨️ Print Receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Digital bill sent to WhatsApp (+91 ${selectedCustomer.phone})!`);
                  setShowReceiptModal(false);
                }}
                className="px-3 py-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] font-sans text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] cursor-pointer"
              >
                WhatsApp 📲
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
