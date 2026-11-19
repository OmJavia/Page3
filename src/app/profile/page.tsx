"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, getDaysSince } from "@/lib/utils";
import { CUSTOMER_CATEGORIES, SALON_INFO } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  getStoredAppointments,
  getStoredCustomers,
  rescheduleStoredAppointment,
  cancelStoredAppointment,
  isSlotBooked,
  STORE_PHONE,
} from "@/lib/appointments-store";
import { Customer, Appointment } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [activePhone, setActivePhone] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Reschedule modal state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState<{ start: string; end: string } | null>(null);
  const [rescheduleMsg, setRescheduleMsg] = useState("");

  // Dates for rescheduling (next 10 days)
  const availableDates = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNum: d.getDate(),
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    };
  });

  const timeSlots = [
    { start: "10:00", end: "10:30", label: "10:00 AM" },
    { start: "10:30", end: "11:00", label: "10:30 AM" },
    { start: "11:00", end: "11:30", label: "11:00 AM" },
    { start: "11:30", end: "12:00", label: "11:30 AM" },
    { start: "12:00", end: "12:30", label: "12:00 PM" },
    { start: "14:00", end: "14:30", label: "02:00 PM" },
    { start: "15:00", end: "15:30", label: "03:00 PM" },
    { start: "16:00", end: "16:30", label: "04:00 PM" },
    { start: "17:00", end: "17:30", label: "05:00 PM" },
    { start: "18:00", end: "18:30", label: "06:00 PM" },
    { start: "19:00", end: "19:30", label: "07:00 PM" },
  ];

  const loadDataForPhone = (phoneNum: string) => {
    const clean = phoneNum.replace(/\D/g, "").slice(-10);
    if (clean.length !== 10) return;

    setActivePhone(clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("p3_client_phone", clean);
    }

    const allCustomers = getStoredCustomers();
    const allAppointments = getStoredAppointments();

    const matchedCust = allCustomers.find(
      (c) => c.phone.replace(/\D/g, "").slice(-10) === clean
    );
    const matchedApts = allAppointments.filter(
      (a) => a.customer?.phone?.replace(/\D/g, "").slice(-10) === clean
    );

    if (matchedCust) {
      setCustomer(matchedCust);
    } else if (matchedApts.length > 0 && matchedApts[0].customer) {
      setCustomer(matchedApts[0].customer);
    } else {
      // Default placeholder customer
      setCustomer({
        id: `cust-${Date.now()}`,
        customer_code: `CKT-${Math.floor(10000 + Math.random() * 90000)}`,
        full_name: "Valued Client",
        phone: clean,
        gender: "male",
        marketing_consent: true,
        notification_consent: true,
        total_visits: matchedApts.length,
        total_spent: matchedApts.reduce((s, a) => s + a.total_amount, 0),
        customer_category: matchedApts.length > 5 ? "loyal" : "regular",
        loyalty_points: matchedApts.length * 50,
        created_at: new Date().toISOString(),
      });
    }

    setAppointments(matchedApts);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedPhone = localStorage.getItem("p3_client_phone");
    if (storedPhone && storedPhone.length >= 10) {
      setPhoneInput(storedPhone.slice(-10));
      loadDataForPhone(storedPhone.slice(-10));
    } else {
      // Seed with demo customer 1
      loadDataForPhone("9876500001");
    }

    const handler = () => {
      const current = localStorage.getItem("p3_client_phone") || "9876500001";
      loadDataForPhone(current);
    };

    window.addEventListener("page3_appointment_update", handler);
    return () => window.removeEventListener("page3_appointment_update", handler);
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length === 10) {
      loadDataForPhone(phoneInput);
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const handleCancel = (apt: Appointment) => {
    if (confirm(`Cancel appointment ${apt.appointment_code} on ${apt.appointment_date} at ${apt.start_time}?`)) {
      cancelStoredAppointment(apt.id, "Cancelled by customer via profile portal");
      loadDataForPhone(activePhone);
      alert("Appointment has been cancelled.");
    }
  };

  const handleRescheduleSubmit = () => {
    if (!reschedulingApt || !rescheduleDate || !rescheduleSlot) {
      setRescheduleMsg("Please select both a date and time slot.");
      return;
    }

    const res = rescheduleStoredAppointment(reschedulingApt.id, rescheduleDate, rescheduleSlot);
    if (!res.success) {
      setRescheduleMsg(res.message || "Failed to reschedule.");
    } else {
      alert(`Appointment successfully moved to ${rescheduleDate} at ${rescheduleSlot.start}!`);
      setReschedulingApt(null);
      setRescheduleMsg("");
      loadDataForPhone(activePhone);
    }
  };

  const upcomingApts = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "pending" || a.status === "checked_in"
  );
  const pastApts = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled" || a.status === "no_show"
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-28 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-bold"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-sm font-[510] tracking-tight text-neutral-950 dark:text-white">
              Client Portal
            </h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
              Page 3 – The Family Salon, Dewas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          <Link
            href="/book"
            className="text-xs bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-[510] px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Quick Phone Switcher / Search */}
        <form
          onSubmit={handleLookup}
          className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-3 flex items-center gap-2"
        >
          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 pl-1">+91</span>
          <input
            type="tel"
            placeholder="Enter mobile number"
            maxLength={10}
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
            className="flex-1 text-xs bg-transparent border-none outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <Button type="submit" variant="default" size="sm" className="h-8 text-xs px-3">
            Switch
          </Button>
        </form>

        {/* Profile Card */}
        {customer && (
          <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-2xl flex items-center justify-center shadow-xs">
                {customer.full_name ? customer.full_name[0] : "C"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-[510] text-neutral-900 dark:text-white truncate">
                    {customer.full_name}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]">
                    {customer.customer_category || "Client"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  +91 {customer.phone}
                </p>
                <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                  ID: {customer.customer_code}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
              <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Visits</span>
                <p className="text-base font-[510] text-neutral-900 dark:text-white mt-0.5">
                  {customer.total_visits || appointments.length}
                </p>
              </div>
              <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Spent</span>
                <p className="text-base font-[510] text-neutral-900 dark:text-white mt-0.5">
                  {formatCurrency(customer.total_spent || 0)}
                </p>
              </div>
              <div className="bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl p-2.5 border border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Loyalty Pts</span>
                <p className="text-base font-[510] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {customer.loyalty_points || 50}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CRM Style Memory Highlight */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
            <span>✨</span> Your Personal Style Memory
          </div>
          <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">First Visit:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                {customer?.first_visit_date ? formatDate(customer.first_visit_date) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">Last Visited:</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                {customer?.last_visit_date ? formatDate(customer.last_visit_date) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 dark:text-neutral-500">Saved Preferences:</span>
              <span className="text-neutral-900 dark:text-white font-medium">
                {customer?.notes || "Low fade • Natural hairline taper • Sensitive scalp"}
              </span>
            </div>
          </div>
        </div>

        {/* UPCOMING APPOINTMENTS SECTION */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Upcoming Appointments ({upcomingApts.length})
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Live Real-Time
            </span>
          </div>

          {upcomingApts.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-black/[0.08] dark:border-white/[0.08] rounded-xl">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">No active upcoming appointments.</p>
              <Link href="/book" className="mt-2 inline-block">
                <Button variant="rightfit" size="sm" className="text-xs">
                  Book an Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 bg-neutral-50/80 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                        {apt.appointment_code}
                      </span>
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                        {apt.appointment_date} at {apt.start_time}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <p>
                      <strong>Services:</strong>{" "}
                      {apt.services?.map((s) => s.service?.name).join(", ") || "Hair Styling"}
                    </p>
                    <p className="mt-0.5">
                      <strong>Stylist:</strong> {apt.staff?.full_name || "Any Master Stylist"}
                    </p>
                    <p className="mt-0.5">
                      <strong>Total:</strong> {formatCurrency(apt.total_amount)}
                    </p>
                  </div>

                  {/* Reschedule & Cancel Controls */}
                  <div className="flex items-center gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => {
                        setReschedulingApt(apt);
                        setRescheduleDate(apt.appointment_date);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#18191c] text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 transition-colors text-center"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(apt)}
                      className="py-1.5 px-3 rounded-lg border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INLINE RESCHEDULE MODAL / DRAWER */}
        {reschedulingApt && (
          <div className="rf-card bg-neutral-900 text-white dark:bg-[#18191c] border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Reschedule {reschedulingApt.appointment_code}
                </h4>
                <p className="text-[11px] text-neutral-400">Choose a new date and available slot</p>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingApt(null)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {availableDates.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setRescheduleDate(d.iso)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border ${
                    rescheduleDate === d.iso
                      ? "bg-white text-neutral-950 font-bold border-white"
                      : "border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10"
                  }`}
                >
                  {d.dayName} {d.dayNum}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {timeSlots.map((slot) => {
                const targetDate = rescheduleDate || availableDates[0].iso;
                const booked = isSlotBooked(targetDate, slot.start, reschedulingApt.staff_id);
                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={booked}
                    onClick={() => !booked && setRescheduleSlot(slot)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] border text-center ${
                      booked
                        ? "opacity-30 cursor-not-allowed border-dashed border-white/20 text-neutral-500"
                        : rescheduleSlot?.start === slot.start
                        ? "bg-white text-neutral-950 font-bold border-white"
                        : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {rescheduleMsg && (
              <p className="text-xs text-rose-400 font-medium text-center">{rescheduleMsg}</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs"
                onClick={handleRescheduleSubmit}
              >
                Confirm Move Slot
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white text-xs"
                onClick={() => setReschedulingApt(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* PAST VISITS & ONE-CLICK REBOOK */}
        <div className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Past Salon Visits ({pastApts.length})
          </h3>

          {pastApts.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-4">
              No previous visit records found.
            </p>
          ) : (
            <div className="space-y-2.5">
              {pastApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-neutral-50/70 dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {apt.appointment_code}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold uppercase ${
                          apt.status === "cancelled"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-neutral-100 text-neutral-700 dark:bg-white/[0.08] dark:text-neutral-300"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {apt.appointment_date} • {apt.services?.[0]?.service?.name || "Service"}
                    </p>
                  </div>

                  <Link
                    href={`/book${
                      apt.services && apt.services[0]
                        ? `?service=${apt.services[0].service_id}`
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="px-2.5 py-1 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-lg text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
                    >
                      ⚡ Rebook
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WhatsApp Support Box */}
        <div className="rf-card bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Need Salon Assistance?</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Contact Page 3 Dewas directly via WhatsApp at +91 {STORE_PHONE}.
            </p>
          </div>
          <a
            href={`https://wa.me/91${STORE_PHONE}?text=${encodeURIComponent(
              "Hi Page 3 Salon, I need help with my appointment."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
          >
            Chat 💬
          </a>
        </div>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] pb-safe z-50 transition-colors duration-200">
        <div className="grid grid-cols-4 py-2 max-w-lg mx-auto">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/services", label: "Services", icon: "✂️" },
            { href: "/book", label: "Book", icon: "📅", highlight: true },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1"
            >
              {item.highlight ? (
                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-base w-9 h-9 rounded-full flex items-center justify-center -mt-5 shadow-lg border-2 border-white dark:border-[#121214]">
                  {item.icon}
                </span>
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              <span
                className={`text-[10px] font-medium ${
                  item.href === "/profile"
                    ? "text-neutral-950 dark:text-white font-bold"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
