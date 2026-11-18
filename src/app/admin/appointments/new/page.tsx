"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_STAFF, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { formatCurrency, generateAppointmentCode } from "@/lib/utils";

export default function AdminNewAppointmentPage() {
  const router = useRouter();

  const [customerType, setCustomerType] = useState<"existing" | "new">("new");
  const [selectedCustomerId, setSelectedCustomerId] = useState(DEMO_CUSTOMERS[0].id);

  // New customer fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Booking fields
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([DEMO_SERVICES[0].id]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(DEMO_STAFF[0].id);
  const [date, setDate] = useState("2024-11-18");
  const [time, setTime] = useState("14:30");
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");

  const totalAmount = selectedServiceIds.reduce((sum, id) => {
    const s = DEMO_SERVICES.find((serv) => serv.id === id);
    return sum + (s?.price || 0);
  }, 0);

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateAppointmentCode();
    alert(`Appointment ${code} created successfully for ${customerType === "existing" ? "existing customer" : name}! Added to schedule.`);
    router.push("/admin/appointments");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/appointments"
          className="p-2 rounded-xl border border-black/[0.08] bg-white text-neutral-600 hover:text-neutral-900 shadow-xs transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            New Appointment / Walk-in
          </h1>
          <p className="text-xs text-neutral-500">
            Schedule an in-salon walk-in guest or advance booking.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
        {/* Walk-in or Reservation Toggle */}
        <div className="flex gap-2 p-1 bg-neutral-100/80 rounded-xl border border-black/[0.06]">
          <button
            type="button"
            onClick={() => setIsWalkIn(true)}
            className={`flex-1 py-2 text-xs font-[510] rounded-lg transition-all duration-150 ${
              isWalkIn ? "bg-neutral-900 text-white shadow-xs font-semibold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            ⚡ Walk-in Guest (Immediate Service)
          </button>
          <button
            type="button"
            onClick={() => setIsWalkIn(false)}
            className={`flex-1 py-2 text-xs font-[510] rounded-lg transition-all duration-150 ${
              !isWalkIn ? "bg-neutral-900 text-white shadow-xs font-semibold" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            📅 Advance Booking
          </button>
        </div>

        {/* Existing vs New Customer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-[510] uppercase tracking-wider text-neutral-500">
              Customer Identification
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCustomerType("new")}
                className={`text-xs px-3 py-1 rounded-lg font-[510] transition-all ${
                  customerType === "new"
                    ? "bg-neutral-900 text-white font-semibold shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                + New Customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("existing")}
                className={`text-xs px-3 py-1 rounded-lg font-[510] transition-all ${
                  customerType === "existing"
                    ? "bg-neutral-900 text-white font-semibold shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Existing Customer
              </button>
            </div>
          </div>

          {customerType === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Select from Registered Customers
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              >
                {DEMO_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} (+91 {c.phone}) — {c.total_visits} visits
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Full Name (Mandatory)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">
                  Phone Number (Mandatory)
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Services Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-[510] uppercase tracking-wider text-neutral-500">
            Select Services (Multi-select)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 bg-neutral-50/60 rounded-xl border border-black/[0.06]">
            {DEMO_SERVICES.map((s) => {
              const selected = selectedServiceIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleService(s.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                    selected
                      ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                      : "bg-white border-black/[0.06] text-neutral-700 hover:border-black/[0.12]"
                  }`}
                >
                  <span>
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span className={`font-semibold ${selected ? "text-white" : "text-neutral-900"}`}>
                    {formatCurrency(s.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stylist & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Assign Stylist</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            >
              {DEMO_STAFF.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            />
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/[0.06]">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Payment Method (Optional Advance or In-salon)
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            >
              <option value="cash">Cash Payment</option>
              <option value="upi">UPI / QR Code</option>
              <option value="card">Credit / Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Owner / Stylist Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Skin fade with razor clean edges"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Total Payable:</span>
            <p className="text-xl font-[510] text-neutral-900">{formatCurrency(totalAmount)}</p>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-neutral-900 hover:bg-black text-white font-[510] rounded-xl text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
          >
            Create Appointment ✓
          </button>
        </div>
      </form>
    </div>
  );
}
