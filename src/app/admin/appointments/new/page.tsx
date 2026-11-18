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
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
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
    <main className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/appointments" className="text-zinc-400 hover:text-white">
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">New Appointment / Walk-in</h1>
          <p className="text-xs text-zinc-400">
            Schedule an in-salon walk-in guest or advance booking.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        {/* Walk-in or Reservation Toggle */}
        <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setIsWalkIn(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              isWalkIn ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
            }`}
          >
            ⚡ Walk-in Guest (Immediate Service)
          </button>
          <button
            type="button"
            onClick={() => setIsWalkIn(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              !isWalkIn ? "bg-amber-500 text-zinc-950" : "text-zinc-400 hover:text-white"
            }`}
          >
            📅 Advance Booking
          </button>
        </div>

        {/* Existing vs New Customer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Customer Identification
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomerType("new")}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                  customerType === "new"
                    ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                    : "text-zinc-500"
                }`}
              >
                + New Customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("existing")}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                  customerType === "existing"
                    ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                    : "text-zinc-500"
                }`}
              >
                Existing Customer
              </button>
            </div>
          </div>

          {customerType === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Select from Registered Customers
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
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
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Full Name (Mandatory)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Phone Number (Mandatory)
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Services Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select Services (Multi-select)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            {DEMO_SERVICES.map((s) => {
              const selected = selectedServiceIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleService(s.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                    selected
                      ? "bg-amber-500/10 border-amber-500 text-white font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span className="font-bold text-amber-400">{formatCurrency(s.price)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stylist & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Assign Stylist</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            >
              {DEMO_STAFF.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Payment Method (Optional Advance or In-salon)
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="cash">Cash Payment</option>
              <option value="upi">UPI / QR Code</option>
              <option value="card">Credit / Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Owner / Stylist Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Skin fade with razor clean edges"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">Total Payable:</span>
            <p className="text-xl font-bold text-amber-400">{formatCurrency(totalAmount)}</p>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            Create Appointment ✓
          </button>
        </div>
      </form>
    </main>
  );
}
