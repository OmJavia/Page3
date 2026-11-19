"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES, DEMO_STAFF, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { Service, Staff, Customer, Appointment } from "@/lib/types";
import { formatCurrency, formatTime, generateAppointmentCode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";
import { isSlotBooked, createAndPersistAppointment, getStoredAppointments, STORE_PHONE } from "@/lib/appointments-store";

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { t } = useLanguage();
  const steps = [t.stepServices, t.stepStylist, t.stepSlot, t.stepDetails];
  return (
    <div className="bg-white dark:bg-[#121214] px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
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
                    className={`h-[1px] flex-1 transition-colors ${
                      stepNum <= current
                        ? "bg-neutral-900 dark:bg-white"
                        : "bg-neutral-200 dark:bg-white/[0.12]"
                    }`}
                  />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950"
                      : isCurrent
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 ring-2 ring-neutral-300 dark:ring-white/40 shadow-xs"
                      : "bg-neutral-100 dark:bg-white/[0.08] text-neutral-400 dark:text-neutral-500"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-[1px] flex-1 transition-colors ${
                      stepNum < current
                        ? "bg-neutral-900 dark:bg-white"
                        : "bg-neutral-200 dark:bg-white/[0.12]"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-[510] ${
                  isCurrent
                    ? "text-neutral-900 dark:text-white font-bold"
                    : isDone
                    ? "text-neutral-700 dark:text-neutral-300"
                    : "text-neutral-400 dark:text-neutral-500"
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  // Promo state (FIRST20 for 20% off)
  const initialPromo = (searchParams.get("promo") || "").toUpperCase();
  const [promoCode, setPromoCode] = useState(initialPromo);
  const [promoApplied, setPromoApplied] = useState(initialPromo === "FIRST20");
  const [promoMessage, setPromoMessage] = useState(
    initialPromo === "FIRST20" ? "20% First-Time discount applied!" : ""
  );

  // One-Click Rebooking State
  const [pastAppointment, setPastAppointment] = useState<Appointment | null>(null);

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
    ownerWhatsAppUrl?: string;
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");

  // Dates for next 7 days
  const availableDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNum: d.getDate(),
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
    };
  });

  useEffect(() => {
    if (preselectedServiceId) {
      const found = DEMO_SERVICES.find((s) => s.id === preselectedServiceId);
      if (found) setSelectedServices([found]);
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].iso);
    }
  }, [availableDates, selectedDate]);

  // Check returning client from phone or stored phone
  useEffect(() => {
    try {
      const storedPhone = localStorage.getItem("p3_client_phone") || "";
      const phoneToCheck = customerPhone.length === 10 ? customerPhone : storedPhone;
      if (phoneToCheck && phoneToCheck.length === 10) {
        const allApts = getStoredAppointments();
        const past = allApts.find(
          (a) => a.customer?.phone?.replace(/\D/g, "").slice(-10) === phoneToCheck.slice(-10)
        );
        if (past) {
          setPastAppointment(past);
          if (!customerPhone && storedPhone) {
            setCustomerPhone(storedPhone);
          }
        }
      }
    } catch {}
  }, [customerPhone]);

  // Phone number lookup for returning customers (CRM Memory)
  useEffect(() => {
    if (customerPhone.length === 10) {
      const found = DEMO_CUSTOMERS.find((c) => c.phone.replace(/\D/g, "").slice(-10) === customerPhone);
      if (found) {
        setExistingCustomer(found);
        setCustomerName(found.full_name);
        if (found.gender) setCustomerGender(found.gender as any);
      } else {
        setExistingCustomer(null);
      }
    } else {
      setExistingCustomer(null);
    }
  }, [customerPhone]);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "FIRST20") {
      setPromoApplied(true);
      setPromoMessage("🎉 20% First-Time discount applied!");
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid promo code. Use code FIRST20 for 20% off");
    }
  };

  const handleOneClickRebook = () => {
    if (!pastAppointment) return;
    if (pastAppointment.services && pastAppointment.services.length > 0) {
      const svcs = pastAppointment.services.map((as) => as.service).filter(Boolean) as Service[];
      if (svcs.length > 0) setSelectedServices(svcs);
    }
    if (pastAppointment.staff) {
      setSelectedStaff(pastAppointment.staff);
    }
    if (pastAppointment.customer) {
      setCustomerName(pastAppointment.customer.full_name);
      setCustomerPhone(pastAppointment.customer.phone);
    }
    setStep(3); // Jump straight to date and slot selection!
  };

  const toggleService = (svc: Service) => {
    if (selectedServices.some((s) => s.id === svc.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== svc.id));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const rawTotalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = promoApplied ? Math.round(rawTotalPrice * 0.2) : 0;
  const totalPrice = Math.max(0, rawTotalPrice - discountAmount);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  const filteredServices =
    activeCategory === "all"
      ? DEMO_SERVICES
      : DEMO_SERVICES.filter((s) => s.category_id === activeCategory);

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

  const handleSendOtp = () => {
    if (customerPhone.length === 10) setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp === "1234" || otp.length === 4) {
      setOtpVerified(true);
    } else {
      alert("Please enter 4-digit code (Use demo 1234)");
    }
  };

  const handleFinalBooking = () => {
    const activeDate = selectedDate || availableDates[0].iso;
    const { appointment, ownerWhatsAppUrl } = createAndPersistAppointment({
      customerName: customerName.trim() || (existingCustomer ? existingCustomer.full_name : "Guest Client"),
      customerPhone,
      customerGender,
      customerNotes,
      services: selectedServices,
      staff: selectedStaff,
      date: activeDate,
      slot: selectedSlot!,
      totalAmount: totalPrice,
    });

    if (typeof window !== "undefined" && customerPhone) {
      localStorage.setItem("p3_client_phone", customerPhone);
    }

    setConfirmedBooking({
      code: appointment.appointment_code,
      services: selectedServices,
      staff: selectedStaff,
      date: activeDate,
      slot: selectedSlot!,
      total: totalPrice,
      phone: customerPhone,
      ownerWhatsAppUrl,
    });
  };

  if (confirmedBooking) {
    const paymentUrl = `/payment?code=${confirmedBooking.code}&amount=${confirmedBooking.total}&name=${encodeURIComponent(
      customerName
    )}&phone=${confirmedBooking.phone}&service=${encodeURIComponent(
      confirmedBooking.services.map((s) => s.name).join(", ")
    )}&stylist=${encodeURIComponent(
      confirmedBooking.staff?.full_name || "Any Stylist"
    )}&date=${encodeURIComponent(confirmedBooking.date)}&slot=${encodeURIComponent(
      confirmedBooking.slot.start
    )}`;

    return (
      <div className="min-h-screen bg-[#fafafa] text-[#1c1d1f] flex flex-col justify-between p-5 max-w-lg mx-auto">
        <div className="pt-6 text-center">
          <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            ✓
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
            Appointment Booked
          </span>
          <h1 className="text-2xl font-[510] tracking-tight mt-3 text-neutral-950">
            We look forward to styling you!
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Instant booking confirmation and reminders are scheduled for WhatsApp & SMS (+91 {confirmedBooking.phone}).
          </p>

          {/* Booking Summary Card */}
          <div className="rf-card p-5 mt-6 text-left space-y-3.5">
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Booking ID</span>
                <p className="text-sm font-mono font-bold text-neutral-900">{confirmedBooking.code}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Date & Time</span>
                <p className="text-xs font-semibold text-neutral-800">
                  {confirmedBooking.date} at {confirmedBooking.slot.start}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-semibold mb-1">Selected Services</p>
              {confirmedBooking.services.map((s) => (
                <div key={s.id} className="flex justify-between text-xs py-1">
                  <span className="text-neutral-700 font-medium">
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(s.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-black/[0.06]">
              <span className="text-neutral-500">Stylist Assigned</span>
              <span className="font-medium text-neutral-800">
                {confirmedBooking.staff?.full_name || "Any Master Stylist"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-black/[0.06] text-sm font-bold text-neutral-900">
              <span>Total Bill</span>
              <span>{formatCurrency(confirmedBooking.total)}</span>
            </div>
          </div>

          {/* Slot Locked & Salon Owner Alert Confirmation */}
          <div className="rf-card p-4 mt-4 bg-emerald-50/70 border border-emerald-200 text-left space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-[510] text-emerald-950 font-bold">
                🔒 Slot Locked &amp; Salon Manager Alerted
              </h3>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Your appointment is officially registered on the salon calendar and locked against double-booking. The store owner has been automatically informed at <strong>+91 {STORE_PHONE}</strong>.
            </p>
            {confirmedBooking.ownerWhatsAppUrl && (
              <a
                href={confirmedBooking.ownerWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-[510] shadow-xs transition-all"
              >
                <span>💬</span>
                <span>Send WhatsApp Alert to Salon (+91 {STORE_PHONE})</span>
              </a>
            )}
          </div>

          {/* Indian Payment Option Banner */}
          <div className="rf-card p-4 mt-4 bg-white border-black/[0.08] text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-900">🇮🇳 Pay Online via UPI / Card</span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Fast & Secure
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              Pay ₹200 advance or full bill via Google Pay, PhonePe, Paytm, RuPay/Cards or NetBanking.
            </p>
            <Link href={paymentUrl} className="block w-full">
              <Button variant="default" className="w-full h-11 text-xs">
                Proceed to UPI / Card Payment →
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-6 space-y-2.5">
          <Link href="/" className="block w-full">
            <Button variant="rightfit" className="w-full h-11 text-xs">
              Return to Homepage
            </Button>
          </Link>
          <Link href="/profile" className="block w-full">
            <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-neutral-900">
              View in My Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <div>
        <header className="bg-white dark:bg-[#121214] border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-8 h-8 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-700 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors text-xs font-bold"
              >
                ←
              </button>
            ) : (
              <Link
                href="/"
                className="w-8 h-8 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-700 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors text-xs font-bold"
              >
                ✕
              </Link>
            )}
            <div>
              <h1 className="text-sm font-[510] tracking-tight text-neutral-950 dark:text-white">Book Appointment</h1>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Page 3 Salon</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <ThemeToggle size="sm" />
            {selectedServices.length > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">{formatCurrency(totalPrice)}</span>
                <p className="text-[10px] text-neutral-400">{totalDuration} mins</p>
              </div>
            )}
          </div>
        </header>

        <StepIndicator current={step} total={4} />

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
                {t.stepServices}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t.chooseServicesSubtitle}
              </p>
            </div>

            {/* 1-Click Rebooking Banner for Returning Client */}
            {pastAppointment && (
              <div className="bg-neutral-900 dark:bg-white/[0.08] text-white p-3.5 rounded-2xl mb-4 border border-black/[0.1] dark:border-white/[0.12] flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    ⚡ {t.rebookLastTitle}
                  </span>
                  <div className="text-xs font-bold truncate mt-0.5 text-white">
                    {pastAppointment.services?.map((s) => s.service?.name).join(", ") || "Signature Service"}
                  </div>
                  <div className="text-[10px] text-neutral-300 dark:text-neutral-400">
                    Stylist: {pastAppointment.staff?.full_name || "Any Stylist"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOneClickRebook}
                  className="shrink-0 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  {t.rebookLastBtn}
                </button>
              </div>
            )}

            {/* Promo Banner if applied */}
            {promoApplied && (
              <div className="p-2.5 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center justify-between">
                <span>✨ <strong>FIRST20</strong> Applied: 20% discount on entire bill!</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">-20%</span>
              </div>
            )}

            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "border border-black/[0.08] bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                All Services
              </button>
              {DEMO_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeCategory === c.id
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "border border-black/[0.08] bg-white text-neutral-600 hover:bg-neutral-50"
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
                    className={`rf-card p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected ? "border-black/[0.25] bg-neutral-50/70" : "hover:border-black/[0.12]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 truncate">{service.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-mono">
                          {service.duration_minutes}m
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{service.description}</p>
                      <span className="text-xs font-bold text-neutral-900 mt-1 inline-block">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-neutral-300 text-transparent"
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
              <h2 className="text-base font-[510] tracking-tight text-neutral-950">Select Preferred Stylist</h2>
              <p className="text-xs text-neutral-500">Pick your trusted artist or let us assign the best expert.</p>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => setSelectedStaff(null)}
                className={`rf-card p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
                  selectedStaff === null ? "border-black/[0.25] bg-neutral-50/70" : "hover:border-black/[0.12]"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900">Any Available Stylist</h3>
                  <p className="text-xs text-neutral-500">Quickest slot & maximum flexibility</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedStaff === null
                      ? "bg-neutral-900 border-neutral-900 text-white"
                      : "border-neutral-300 text-transparent"
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
                    className={`rf-card p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
                      isSelected ? "border-black/[0.25] bg-neutral-50/70" : "hover:border-black/[0.12]"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white font-bold text-base flex items-center justify-center">
                      {staff.full_name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900">{staff.full_name}</h3>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 capitalize mt-0.5">
                        {staff.specializations.join(" • ")}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-neutral-300 text-transparent"
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
              <h2 className="text-base font-[510] tracking-tight text-neutral-950">Select Date & Time</h2>
              <p className="text-xs text-neutral-500">Salon hours: 10 AM – 8 PM • Duration: {totalDuration}m</p>
            </div>

            {/* Date Picker Bar */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-neutral-600 mb-2">Available Dates</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`flex flex-col items-center justify-center min-w-[70px] py-3 px-2 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold shadow-sm"
                          : "border-black/[0.08] bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider">{item.dayName}</span>
                      <span className="text-lg font-bold my-0.5">{item.dayNum}</span>
                      <span className="text-[9px] opacity-75">{item.label.split(",")[1] || "Today"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Available Slots</p>
                <span className="text-[10px] text-neutral-400">Double-booking protection active</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot?.start === slot.start;
                  const activeDate = selectedDate || availableDates[0].iso;
                  const booked = isSlotBooked(activeDate, slot.start, selectedStaff?.id);
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      disabled={booked}
                      onClick={() => !booked && setSelectedSlot(slot)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center ${
                        booked
                          ? "bg-neutral-100 dark:bg-white/[0.04] text-neutral-400 dark:text-neutral-500 border-dashed border-black/[0.1] dark:border-white/[0.1] cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>{slot.label}</span>
                      {booked ? (
                        <span className="text-[9px] font-mono font-bold text-red-500 dark:text-red-400 mt-0.5">
                          Booked 🔒
                        </span>
                      ) : (
                        <span className="text-[9px] font-normal opacity-70 mt-0.5">Available</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* STEP 4: CUSTOMER DETAILS & OTP */}
        {step === 4 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            <div className="mb-4">
              <h2 className="text-base font-[510] tracking-tight text-neutral-950">Confirm Details</h2>
              <p className="text-xs text-neutral-500">Enter your details to finalize your appointment.</p>
            </div>

            {/* Existing Customer CRM Memory Banner */}
            {existingCustomer && (
              <div className="mb-4 rf-card p-4 bg-neutral-900 text-white border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-200">
                  <span>👑</span> Welcome Back, {existingCustomer.full_name}!
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  We remembered you! Total visits: <strong className="text-white">{existingCustomer.total_visits}</strong>.
                </p>
                {existingCustomer.notes && (
                  <p className="text-[11px] text-neutral-400 mt-1 italic">
                    Saved preference: &quot;{existingCustomer.notes}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Registration Card */}
            <div className="rf-card p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Mobile Number (Mandatory)
                </label>
                <div className="flex gap-2">
                  <span className="h-10 px-3 bg-neutral-100 border border-black/[0.08] rounded-xl flex items-center text-xs font-mono text-neutral-600">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-10 px-3.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                  {!otpVerified && customerPhone.length === 10 && (
                    <Button
                      variant="rightfit"
                      size="sm"
                      className="h-10 px-3 text-xs"
                      onClick={handleSendOtp}
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </Button>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="p-3 bg-neutral-50 border border-black/[0.08] rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-700">Enter SMS Code:</span>
                    <span className="font-mono text-[10px] text-neutral-500">Demo: 1234</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="flex-1 h-10 px-3 rounded-xl border border-black/[0.08] text-center font-mono text-sm tracking-widest bg-white"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="h-10 px-4 text-xs"
                      onClick={handleVerifyOtp}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              {otpVerified && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <span>✓</span> Phone number verified via OTP
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name (Mandatory)</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Gender (Mandatory)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setCustomerGender(g)}
                      className={`h-9 rounded-xl text-xs font-medium capitalize border transition-all ${
                        customerGender === g
                          ? "bg-neutral-900 text-white border-neutral-900 font-bold"
                          : "border-black/[0.08] bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Styling Notes / Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Low skin fade, beard scissor trim, sensitive scalp"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-black/[0.06] space-y-2 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationConsent}
                    onChange={(e) => setNotificationConsent(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-neutral-700">
                    Receive appointment reminders on WhatsApp & SMS (Essential)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-neutral-500">
                    Receive exclusive loyalty offers, birthday perks & discounts (Optional)
                  </span>
                </label>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="rf-card p-3.5 mt-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">Have a Promo Code?</span>
                <span className="text-[10px] text-amber-500 font-mono font-bold">Use FIRST20</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t.promoPlaceholder}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono uppercase bg-neutral-50/50 dark:bg-[#1b1c20]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 h-9 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl text-xs font-semibold transition-all"
                >
                  {t.applyPromo}
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    promoApplied
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Booking Summary Card */}
            <div className="rf-card p-4 mt-4 space-y-2 text-xs bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Date &amp; Slot</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {selectedDate} at {selectedSlot?.start}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Assigned Stylist</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {selectedStaff?.full_name || "Any Available Master Stylist"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Duration</span>
                <span className="text-neutral-900 dark:text-white font-medium">{totalDuration} minutes</span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(rawTotalPrice)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>First-Time Offer (20% off)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-950 dark:text-white pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <span>{t.totalPrice}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Persistent Bottom Bar with Rightfit Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/[0.06] p-3.5 z-20">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-neutral-950">{formatCurrency(totalPrice)}</div>
            <div className="text-[11px] text-neutral-400">
              {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} • {totalDuration}m
            </div>
          </div>

          {step === 1 && (
            <Button
              disabled={selectedServices.length === 0}
              onClick={() => setStep(2)}
              variant="default"
              size="default"
            >
              Select Stylist →
            </Button>
          )}

          {step === 2 && (
            <Button
              onClick={() => {
                if (!selectedDate) setSelectedDate(availableDates[0].iso);
                setStep(3);
              }}
              variant="default"
              size="default"
            >
              Choose Slot →
            </Button>
          )}

          {step === 3 && (
            <Button
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(4)}
              variant="default"
              size="default"
            >
              Continue to Details →
            </Button>
          )}

          {step === 4 && (
            <Button
              disabled={!customerName || customerPhone.length !== 10}
              onClick={handleFinalBooking}
              variant="default"
              size="default"
            >
              Confirm Appointment ✓
            </Button>
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
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-neutral-800 text-xs">
          Loading booking engine...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
