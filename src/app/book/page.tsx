"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES, DEMO_STAFF, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { Service, Staff, Customer } from "@/lib/types";
import { formatCurrency, formatTime, generateAppointmentCode } from "@/lib/utils";

function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = ["Services", "Stylist", "Date & Time", "Confirm"];
  return (
    <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isCurrent = stepNum === current;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      stepNum <= current ? "bg-amber-500" : "bg-zinc-800"
                    }`}
                  />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-amber-500 text-zinc-950 ring-2 ring-amber-500/30 font-extrabold"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      stepNum < current ? "bg-amber-500" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isCurrent ? "text-amber-400" : isDone ? "text-emerald-400" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  // Customer form fields
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerGender, setCustomerGender] = useState<"male" | "female" | "other">("male");
  const [customerNotes, setCustomerNotes] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [notificationConsent, setNotificationConsent] = useState(true);

  // Existing customer recognition
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    services: Service[];
    staff: Staff | null;
    date: string;
    slot: { start: string; end: string };
    total: number;
    phone: string;
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (preselectedServiceId) {
      const found = DEMO_SERVICES.find((s) => s.id === preselectedServiceId);
      if (found) setSelectedServices([found]);
    }
  }, [preselectedServiceId]);

  // Check if customer exists when 10 digits entered
  useEffect(() => {
    if (customerPhone.length === 10) {
      const match = DEMO_CUSTOMERS.find((c) => c.phone.includes(customerPhone));
      if (match) {
        setExistingCustomer(match);
        setCustomerName(match.full_name);
        setCustomerGender(match.gender);
      } else {
        setExistingCustomer(null);
      }
    } else {
      setExistingCustomer(null);
    }
  }, [customerPhone]);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const filteredServices = DEMO_SERVICES.filter(
    (s) => s.is_active && (activeCategory === "all" || s.category_id === activeCategory)
  );

  // Available dates for next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2024-11-18T10:00:00Z");
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${dayName}, ${dayNum} ${month}`;
    return { iso, label, dayName, dayNum };
  });

  // Calculate dynamic slots
  const timeSlots = [
    { start: "10:00", end: "10:30", label: "10:00 AM" },
    { start: "10:30", end: "11:00", label: "10:30 AM" },
    { start: "11:00", end: "11:30", label: "11:00 AM" },
    { start: "11:30", end: "12:00", label: "11:30 AM" },
    { start: "12:00", end: "12:30", label: "12:00 PM" },
    { start: "12:30", end: "13:00", label: "12:30 PM" },
    { start: "14:00", end: "14:30", label: "02:00 PM" },
    { start: "14:30", end: "15:00", label: "02:30 PM" },
    { start: "15:00", end: "15:30", label: "03:00 PM" },
    { start: "15:30", end: "16:00", label: "03:30 PM" },
    { start: "16:00", end: "16:30", label: "04:00 PM" },
    { start: "16:30", end: "17:00", label: "04:30 PM" },
    { start: "17:00", end: "17:30", label: "05:00 PM" },
    { start: "17:30", end: "18:00", label: "05:30 PM" },
    { start: "18:00", end: "18:30", label: "06:00 PM" },
    { start: "18:30", end: "19:00", label: "06:30 PM" },
    { start: "19:00", end: "19:30", label: "07:00 PM" },
    { start: "19:30", end: "20:00", label: "07:30 PM" },
  ];

  const handleSendOtp = () => {
    if (customerPhone.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === "1234" || otp.length === 4) {
      setOtpVerified(true);
    } else {
      alert("Please enter a 4-digit code (Use demo code 1234)");
    }
  };

  const handleFinalBooking = () => {
    const code = generateAppointmentCode();
    setConfirmedBooking({
      code,
      services: selectedServices,
      staff: selectedStaff,
      date: selectedDate,
      slot: selectedSlot!,
      total: totalPrice,
      phone: customerPhone,
    });
  };

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-5 max-w-lg mx-auto">
        <div className="pt-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
            ✓
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Appointment Confirmed
          </span>
          <h1 className="text-2xl font-bold mt-1 text-white">We look forward to styling you!</h1>
          <p className="text-sm text-zinc-400 mt-2">
            A confirmation message has been queued to your WhatsApp & SMS (+91 {confirmedBooking.phone}).
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mt-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-xs text-zinc-400">Booking Reference</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {confirmedBooking.code}
              </span>
            </div>

            <div>
              <p className="text-xs text-zinc-400 mb-1">Services Booked</p>
              {confirmedBooking.services.map((s) => (
                <div key={s.id} className="flex justify-between text-sm py-1">
                  <span className="text-zinc-200">
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span className="font-semibold text-white">{formatCurrency(s.price)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800 text-xs">
              <div>
                <p className="text-zinc-500">Date & Time</p>
                <p className="font-semibold text-zinc-200 mt-0.5">
                  {confirmedBooking.date} at {confirmedBooking.slot.start}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Stylist</p>
                <p className="font-semibold text-zinc-200 mt-0.5">
                  {confirmedBooking.staff?.full_name || "Any Available Stylist"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
              <span className="text-sm font-medium text-zinc-300">Total Payable at Salon</span>
              <span className="text-lg font-bold text-amber-400">
                {formatCurrency(confirmedBooking.total)}
              </span>
            </div>
          </div>

          <div className="mt-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 text-left space-y-2">
            <p className="font-medium text-zinc-200 flex items-center gap-1.5">
              <span>🔔</span> Automated Reminders Scheduled:
            </p>
            <p>• Reminder 24 hours prior via WhatsApp</p>
            <p>• Reminder 1 hour prior with instant directions</p>
          </div>
        </div>

        <div className="pt-8 space-y-3">
          <Link
            href="/"
            className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3.5 rounded-xl block text-center transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/profile"
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3 rounded-xl block text-center text-sm transition-colors"
          >
            View in My Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
              >
                ←
              </button>
            ) : (
              <Link
                href="/"
                className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
              >
                ✕
              </Link>
            )}
            <div>
              <h1 className="text-sm font-bold text-white">Book Your Visit</h1>
              <p className="text-[11px] text-zinc-400">Page 3 Luxury Salon</p>
            </div>
          </div>
          {selectedServices.length > 0 && (
            <div className="text-right">
              <span className="text-xs font-bold text-amber-400">{formatCurrency(totalPrice)}</span>
              <p className="text-[10px] text-zinc-400">{totalDuration} mins</p>
            </div>
          )}
        </header>

        <StepIndicator current={step} total={4} />

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Select Services</h2>
              <p className="text-xs text-zinc-400">
                You can select multiple services for a complete pampering session.
              </p>
            </div>

            {/* Categories scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                }`}
              >
                All Services
              </button>
              {DEMO_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeCategory === c.id
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="space-y-2.5">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/5"
                        : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {service.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                          {service.duration_minutes}m
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {service.description}
                      </p>
                      <span className="text-xs font-bold text-amber-400 mt-1 inline-block">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-zinc-950"
                          : "border-zinc-700 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* STEP 2: STYLIST SELECTION */}
        {step === 2 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Select Stylist</h2>
              <p className="text-xs text-zinc-400">
                Choose your favorite expert or let us assign the best available artist.
              </p>
            </div>

            <div className="space-y-3">
              {/* Any Stylist Option */}
              <div
                onClick={() => setSelectedStaff(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedStaff === null
                    ? "bg-amber-500/10 border-amber-500 shadow-md"
                    : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">Any Available Stylist</h3>
                  <p className="text-xs text-zinc-400">Maximum flexibility & quickest availability</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedStaff === null
                      ? "bg-amber-500 border-amber-500 text-zinc-950"
                      : "border-zinc-700 text-transparent"
                  }`}
                >
                  ✓
                </div>
              </div>

              {DEMO_STAFF.map((staff) => {
                const isSelected = selectedStaff?.id === staff.id;
                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 shadow-md"
                        : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-black text-lg flex items-center justify-center">
                      {staff.full_name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{staff.full_name}</h3>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 capitalize mt-0.5">
                        {staff.specializations.join(" • ")}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-zinc-950"
                          : "border-zinc-700 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Choose Date & Slot</h2>
              <p className="text-xs text-zinc-400">
                Salon hours: 10:00 AM – 08:00 PM. Duration: {totalDuration} mins.
              </p>
            </div>

            {/* Date Picker Horizontal Bar */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-zinc-400 mb-2.5">Available Dates</p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      onClick={() => setSelectedDate(item.iso)}
                      className={`flex flex-col items-center justify-center min-w-[72px] py-3 px-2 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-lg shadow-amber-500/20"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider">{item.dayName}</span>
                      <span className="text-lg font-bold my-0.5">{item.dayNum}</span>
                      <span className="text-[9px] opacity-80">{item.label.split(",")[1] || "Today"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-2.5">Available Time Slots</p>
              {!selectedDate ? (
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xs text-zinc-500">
                  Please pick a date first to view slots.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot?.start === slot.start;
                    return (
                      <button
                        key={slot.start}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-amber-500 text-zinc-950 border-amber-500 shadow-md"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        )}

        {/* STEP 4: CUSTOMER DETAILS & OTP */}
        {step === 4 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Confirm & Contact</h2>
              <p className="text-xs text-zinc-400">
                Enter your mobile number for booking confirmation and reminders.
              </p>
            </div>

            {/* Existing Customer CRM Memory Banner */}
            {existingCustomer && (
              <div className="mb-4 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <span>👑</span> Welcome Back, {existingCustomer.full_name}!
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  We remembered you! You have visited us <span className="text-amber-400 font-bold">{existingCustomer.total_visits} times</span>.
                </p>
                {existingCustomer.notes && (
                  <p className="text-[11px] text-zinc-400 mt-1 italic">
                    Saved preference: &quot;{existingCustomer.notes}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Registration Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Mobile Number (Mandatory)
                </label>
                <div className="flex gap-2">
                  <span className="h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center text-xs font-mono text-zinc-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                  {!otpVerified && customerPhone.length === 10 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg hover:bg-amber-400"
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="p-3 bg-zinc-950 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300">Enter Verification Code:</span>
                    <span className="text-amber-400 font-mono text-[11px]">Demo: Use 1234</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="flex-1 h-10 px-3 bg-zinc-900 border border-zinc-700 rounded-lg text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-400"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {otpVerified && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-xs text-emerald-400">
                  <span>✓</span> Phone number verified via OTP
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Full Name (Mandatory)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Gender (Mandatory)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setCustomerGender(g)}
                      className={`h-9 rounded-lg text-xs font-medium capitalize border transition-all ${
                        customerGender === g
                          ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Styling Notes / Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Low skin fade, sensitive scalp, beard trim only with scissors"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Consents */}
              <div className="pt-2 border-t border-zinc-800 space-y-2 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationConsent}
                    onChange={(e) => setNotificationConsent(e.target.checked)}
                    className="mt-0.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-zinc-300">
                    Receive appointment reminders and updates on WhatsApp & SMS (Essential)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-zinc-400">
                    Receive exclusive birthday offers, festival perks & discounts (Optional)
                  </span>
                </label>
              </div>
            </div>

            {/* Booking Summary Card */}
            <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-zinc-400">
                <span>Date & Slot</span>
                <span className="text-zinc-200 font-medium">
                  {selectedDate} at {selectedSlot?.start}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Stylist</span>
                <span className="text-zinc-200 font-medium">
                  {selectedStaff?.full_name || "Any Available Stylist"}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Duration</span>
                <span className="text-zinc-200 font-medium">{totalDuration} minutes</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span className="text-amber-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Persistent Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3.5 z-20">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-white">{formatCurrency(totalPrice)}</div>
            <div className="text-[11px] text-zinc-400">
              {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} • {totalDuration}m
            </div>
          </div>

          {step === 1 && (
            <button
              disabled={selectedServices.length === 0}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs transition-colors"
            >
              Select Stylist →
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => {
                if (!selectedDate) setSelectedDate(availableDates[0].iso);
                setStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-colors"
            >
              Choose Slot →
            </button>
          )}

          {step === 3 && (
            <button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs transition-colors"
            >
              Continue to Details →
            </button>
          )}

          {step === 4 && (
            <button
              disabled={!customerName || customerPhone.length !== 10}
              onClick={handleFinalBooking}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              Confirm Appointment ✓
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          Loading booking engine...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
