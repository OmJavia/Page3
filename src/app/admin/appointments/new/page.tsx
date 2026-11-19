"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_STAFF, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { Customer, Service } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  createAndPersistAppointment,
  getStoredCustomers,
  getStoredAppointments,
} from "@/lib/appointments-store";

export default function AdminNewAppointmentPage() {
  const router = useRouter();

  const [customerType, setCustomerType] = useState<"existing" | "new">("new");
  const [customersList, setCustomersList] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState(DEMO_CUSTOMERS[0].id);

  // New customer fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Booking fields
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([DEMO_SERVICES[0].id]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(DEMO_STAFF[0].id);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("14:30");
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash");

  useEffect(() => {
    const list = getStoredCustomers();
    setCustomersList(list);
    if (list.length > 0) {
      setSelectedCustomerId(list[0].id);
    }
  }, []);

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

    const chosenServices = selectedServiceIds
      .map((id) => DEMO_SERVICES.find((s) => s.id === id))
      .filter(Boolean) as Service[];

    const chosenStaff = DEMO_STAFF.find((st) => st.id === selectedStaffId) || null;

    let custName = name.trim();
    let custPhone = phone.trim();

    if (customerType === "existing") {
      const existing = customersList.find((c) => c.id === selectedCustomerId);
      if (existing) {
        custName = existing.full_name;
        custPhone = existing.phone;
      }
    }

    if (!custName || custPhone.length < 10) {
      alert("Please ensure a customer name and valid 10-digit phone number are provided.");
      return;
    }

    const { appointment } = createAndPersistAppointment({
      customerName: custName,
      customerPhone: custPhone,
      customerNotes: notes,
      services: chosenServices,
      staff: chosenStaff,
      date: date,
      slot: { start: time, end: `${time.slice(0, 2)}:45` },
      totalAmount: totalAmount,
    });

    // If walk-in, mark is_walk_in and in_progress
    if (isWalkIn) {
      const allApts = getStoredAppointments();
      const updated = allApts.map((a) =>
        a.id === appointment.id
          ? {
              ...a,
              is_walk_in: true,
              status: "in_progress" as const,
              payment_status: paymentMethod === "cash" ? ("pending" as const) : ("paid" as const),
            }
          : a
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("page3_appointments_v1", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("page3_appointment_update"));
      }
    }

    alert(
      `Appointment ${appointment.appointment_code} created successfully for ${custName}! Added to salon schedule.`
    );
    router.push("/admin/appointments");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/appointments"
          className="p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-xs transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5]">
            New Appointment / Walk-in
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Schedule an in-salon walk-in guest or advance booking with live seat allocation.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs"
      >
        {/* Walk-in or Reservation Toggle */}
        <div className="flex gap-2 p-1 bg-neutral-100/80 dark:bg-white/[0.04] rounded-xl border border-black/[0.06] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => setIsWalkIn(true)}
            className={`flex-1 py-2 text-xs font-[510] rounded-lg transition-all duration-150 ${
              isWalkIn
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            ⚡ Walk-in Guest (Immediate Service)
          </button>
          <button
            type="button"
            onClick={() => setIsWalkIn(false)}
            className={`flex-1 py-2 text-xs font-[510] rounded-lg transition-all duration-150 ${
              !isWalkIn
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-xs font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            📅 Advance Booking
          </button>
        </div>

        {/* Existing vs New Customer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Customer Identification
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setCustomerType("new")}
                className={`text-xs px-3 py-1 rounded-lg font-[510] transition-all ${
                  customerType === "new"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs"
                    : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.1]"
                }`}
              >
                + New Customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerType("existing")}
                className={`text-xs px-3 py-1 rounded-lg font-[510] transition-all ${
                  customerType === "existing"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs"
                    : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.1]"
                }`}
              >
                Existing Customer
              </button>
            </div>
          </div>

          {customerType === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Select from Registered Customers
              </label>
              <select
                aria-label="Select from Registered Customers"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              >
                {customersList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} (+91 {c.phone}) — {c.total_visits} visits
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  Full Name (Mandatory) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  Phone Number (Mandatory) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Services Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Select Services (Multi-select)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 bg-neutral-50/60 dark:bg-white/[0.02] rounded-xl border border-black/[0.06] dark:border-white/[0.06]">
            {DEMO_SERVICES.map((s) => {
              const selected = selectedServiceIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleService(s.id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex justify-between items-center transition-all ${
                    selected
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-semibold shadow-xs"
                      : "bg-white dark:bg-[#18191c] border-black/[0.06] dark:border-white/[0.06] text-neutral-700 dark:text-neutral-300 hover:border-black/[0.14] dark:hover:border-white/[0.14]"
                  }`}
                >
                  <span>
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span
                    className={`font-semibold ${
                      selected ? "text-white dark:text-neutral-950" : "text-neutral-900 dark:text-white"
                    }`}
                  >
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
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Assign Stylist
            </label>
            <select
              aria-label="Assign Stylist"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            >
              {DEMO_STAFF.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            />
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Payment Method
            </label>
            <select
              aria-label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            >
              <option value="cash">Cash Payment</option>
              <option value="upi">UPI / QR Code</option>
              <option value="card">Credit / Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Owner / Stylist Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Skin fade with razor clean edges"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Payable:</span>
            <p className="text-xl font-[510] text-neutral-900 dark:text-white font-mono">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] rounded-xl text-sm transition-all shadow-xs hover:scale-[1.01]"
          >
            Create Appointment ✓
          </button>
        </div>
      </form>
    </div>
  );
}
