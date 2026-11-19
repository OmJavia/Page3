"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES, DEMO_STAFF } from "@/lib/mock-data";
import { Service, Staff, Customer, Appointment } from "@/lib/types";
import { formatCurrency, formatTime, generateAppointmentCode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";
import {
  isSlotBooked,
  createAndPersistAppointment,
  getStoredAppointments,
  getStoredCustomers,
  rescheduleStoredAppointment,
  cancelStoredAppointment,
  STORE_PHONE,
} from "@/lib/appointments-store";
import { SALON_INFO } from "@/lib/constants";

function StepIndicator({ current, total }: { current: number; total: number }) {
  const { t } = useLanguage();
  const steps = [t.stepServices, t.stepStylist, t.stepSlot, t.stepDetails];
  return (
    <div className="bg-white dark:bg-[#121214] px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="flex items-center justify-between max-w-lg mx-auto">
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

  // Customer form fields (Mandatory & Optional)
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerGender, setCustomerGender] = useState<"male" | "female" | "other">("male");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerDob, setCustomerDob] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [notificationConsent, setNotificationConsent] = useState(true);

  // Existing customer recognition
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    services: Service[];
    staff: Staff | null;
    date: string;
    slot: { start: string; end: string };
    total: number;
    phone: string;
    ownerWhatsAppUrl?: string;
    status: string;
  } | null>(null);

  // Reschedule state on confirmation screen
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState<{ start: string; end: string } | null>(null);
  const [rescheduleFeedback, setRescheduleFeedback] = useState("");

  const [activeCategory, setActiveCategory] = useState("all");

  // Dates for next 14 days
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
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
      const allCustomers = getStoredCustomers();
      const found = allCustomers.find((c) => c.phone.replace(/\D/g, "").slice(-10) === customerPhone);
      if (found) {
        setExistingCustomer(found);
        setCustomerName(found.full_name);
        if (found.gender) setCustomerGender(found.gender as any);
        if (found.email) setCustomerEmail(found.email);
        if (found.notes) setCustomerNotes(found.notes);
      }
    }
  }, [customerPhone]);

  const handleApplyPromo = () => {
    if (promoCode.trim() === "FIRST20") {
      setPromoApplied(true);
      setPromoMessage("20% First-Time discount applied!");
    } else if (promoCode.trim() === "DEWAS10") {
      setPromoApplied(true);
      setPromoMessage("10% Dewas Local discount applied!");
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid promo code. Try FIRST20.");
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
    setStep(3); // Jump straight to date & time selection!
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
    { start: "19:30", end: "20:00", label: "07:30 PM" },
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

    // Strict double-booking check right before persisting
    if (isSlotBooked(activeDate, selectedSlot!.start, selectedStaff?.id)) {
      alert("This slot was just reserved by another client. Please select another slot.");
      setStep(3);
      return;
    }

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
      status: "confirmed",
    });
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return "#";
    const title = `Page 3 Salon Appointment (${confirmedBooking.code})`;
    const serviceNames = confirmedBooking.services.map((s) => s.name).join(", ");
    const details = `Page 3 – The Family Salon, Dewas.\nServices: ${serviceNames}\nStylist: ${
      confirmedBooking.staff?.full_name || "Any Stylist"
    }\nBooking Code: ${confirmedBooking.code}\nAddress: ${SALON_INFO.fullAddress}\nPhone: +91 ${
      SALON_INFO.phone
    }`;
    const dateClean = confirmedBooking.date.replace(/-/g, "");
    const startHourMin = confirmedBooking.slot.start.replace(":", "");
    const endHourMin = confirmedBooking.slot.end.replace(":", "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${dateClean}T${startHourMin}00/${dateClean}T${endHourMin}00&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(SALON_INFO.fullAddress)}`;
  };

  // Apple / Outlook Calendar .ics downloader
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const serviceNames = confirmedBooking.services.map((s) => s.name).join(", ");
    const dateClean = confirmedBooking.date.replace(/-/g, "");
    const startHourMin = confirmedBooking.slot.start.replace(":", "");
    const endHourMin = confirmedBooking.slot.end.replace(":", "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Page 3 Salon//NONSGML v1.0//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${confirmedBooking.code}@page3salon.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${dateClean}T${startHourMin}00`,
      `DTEND:${dateClean}T${endHourMin}00`,
      `SUMMARY:Page 3 Salon - ${serviceNames}`,
      `DESCRIPTION:Appointment at Page 3 – The Family Salon, Dewas. Stylist: ${
        confirmedBooking.staff?.full_name || "Any Stylist"
      }. Booking Code: ${confirmedBooking.code}`,
      `LOCATION:${SALON_INFO.fullAddress}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `page3-appointment-${confirmedBooking.code}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Self-Service Reschedule
  const handlePerformReschedule = () => {
    if (!confirmedBooking || !rescheduleDate || !rescheduleSlot) {
      alert("Please select both a date and time slot.");
      return;
    }
    const result = rescheduleStoredAppointment(confirmedBooking.code, rescheduleDate, rescheduleSlot);
    if (!result.success) {
      setRescheduleFeedback(result.message || "Failed to reschedule.");
    } else {
      setConfirmedBooking({
        ...confirmedBooking,
        date: rescheduleDate,
        slot: rescheduleSlot,
      });
      setIsRescheduling(false);
      setRescheduleFeedback("Appointment successfully moved!");
    }
  };

  // Self-Service Cancellation
  const handlePerformCancel = () => {
    if (!confirmedBooking) return;
    if (confirm("Are you sure you want to cancel this appointment? Your slot will be freed.")) {
      const result = cancelStoredAppointment(confirmedBooking.code, "Customer self-cancelled online");
      if (result.success) {
        setConfirmedBooking({
          ...confirmedBooking,
          status: "cancelled",
        });
        alert("Your appointment has been cancelled. Slot is freed.");
      }
    }
  };

  // STEP 5: CONFIRMATION SCREEN
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto transition-colors duration-200">
        <div className="pt-4 text-center">
          {confirmedBooking.status === "cancelled" ? (
            <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 shadow-sm">
              ✕
            </div>
          ) : (
            <div className="w-16 h-16 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-4 shadow-sm">
              ✓
            </div>
          )}

          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
              confirmedBooking.status === "cancelled"
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
            }`}
          >
            {confirmedBooking.status === "cancelled" ? "Appointment Cancelled" : "Appointment Confirmed & Locked"}
          </span>

          <h1 className="text-2xl font-[510] tracking-tight mt-3 text-neutral-950 dark:text-white">
            {confirmedBooking.status === "cancelled"
              ? "Your slot has been released"
              : "We look forward to styling you!"}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
            {confirmedBooking.status === "cancelled"
              ? "You can book a new slot anytime."
              : `Instant WhatsApp & SMS confirmation scheduled for +91 ${confirmedBooking.phone}.`}
          </p>

          {/* Booking Summary Card */}
          <div className="rf-card p-4 sm:p-5 mt-6 text-left space-y-3.5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
            <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">
                  Booking Reference
                </span>
                <p className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                  {confirmedBooking.code}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">
                  Date &amp; Time
                </span>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {confirmedBooking.date} at {confirmedBooking.slot.start}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold mb-1">
                Selected Services
              </p>
              {confirmedBooking.services.map((s) => (
                <div key={s.id} className="flex justify-between text-xs py-1">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {s.name} ({s.duration_minutes}m)
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(s.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-neutral-500 dark:text-neutral-400">Stylist Assigned</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {confirmedBooking.staff?.full_name || "Any Master Stylist"}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-neutral-500 dark:text-neutral-400">Location</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Page 3 Salon, Dewas, MP
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-sm font-bold text-neutral-900 dark:text-white">
              <span>Total Bill</span>
              <span>{formatCurrency(confirmedBooking.total)}</span>
            </div>
          </div>

          {confirmedBooking.status !== "cancelled" && (
            <>
              {/* Add to Calendar Options */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-left">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-center hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all"
                >
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                    <span>📅</span> Google Calendar
                  </span>
                </a>
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="p-3 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-center hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all"
                >
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
                    <span>🍏</span> Apple / Outlook (.ics)
                  </span>
                </button>
              </div>

              {/* Slot Locked & Salon Owner Alert Confirmation */}
              <div className="rf-card p-4 mt-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-left space-y-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-xs font-[510] text-emerald-950 dark:text-emerald-300 font-bold">
                    🔒 Slot Locked &amp; Salon Manager Alerted
                  </h3>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  Your slot is guaranteed on the salon calendar and locked against double-booking. The store manager in Dewas has been alerted at <strong>+91 {STORE_PHONE}</strong>.
                </p>
                {confirmedBooking.ownerWhatsAppUrl && (
                  <a
                    href={confirmedBooking.ownerWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-[510] shadow-xs transition-all"
                  >
                    <span>💬</span>
                    <span>Send WhatsApp Alert to Salon (+91 {STORE_PHONE})</span>
                  </a>
                )}
              </div>

              {/* Self-Service Reschedule & Cancel Controls */}
              <div className="rf-card p-4 mt-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] text-left rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">Need to Change?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(!isRescheduling)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
                    >
                      {isRescheduling ? "Close" : "Reschedule"}
                    </button>
                    <button
                      type="button"
                      onClick={handlePerformCancel}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Inline Reschedule Form */}
                {isRescheduling && (
                  <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-3">
                    <p className="text-[11px] text-neutral-500">Pick a new date and time slot:</p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {availableDates.slice(0, 7).map((d) => (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setRescheduleDate(d.iso)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border ${
                            rescheduleDate === d.iso
                              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold"
                              : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#18191c]"
                          }`}
                        >
                          {d.dayName} {d.dayNum}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.slice(0, 9).map((slot) => {
                        const targetDate = rescheduleDate || availableDates[0].iso;
                        const booked = isSlotBooked(targetDate, slot.start, confirmedBooking.staff?.id);
                        return (
                          <button
                            key={slot.start}
                            type="button"
                            disabled={booked}
                            onClick={() => !booked && setRescheduleSlot(slot)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] border text-center ${
                              booked
                                ? "opacity-40 cursor-not-allowed border-dashed"
                                : rescheduleSlot?.start === slot.start
                                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold"
                                : "border-black/[0.08] dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.03]"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full text-xs h-9"
                      onClick={handlePerformReschedule}
                    >
                      Confirm New Slot
                    </Button>
                    {rescheduleFeedback && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium">
                        {rescheduleFeedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* UPI / Card Payment Banner */}
              <div className="rf-card p-4 mt-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] text-left rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    🇮🇳 Pay Online via UPI / Card
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    Fast &amp; Secure
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                  Pay ₹200 advance or full bill via Google Pay, PhonePe, Paytm, RuPay/Cards or NetBanking.
                </p>
                <Link href={paymentUrl} className="block w-full">
                  <Button variant="default" className="w-full h-11 text-xs font-bold">
                    Proceed to UPI / Card Payment →
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="pt-6 space-y-2.5">
          <Link href="/" className="block w-full">
            <Button variant="rightfit" className="w-full h-11 text-xs font-semibold">
              Return to Homepage
            </Button>
          </Link>
          <Link href="/profile" className="block w-full">
            <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
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
              <h1 className="text-sm font-[510] tracking-tight text-neutral-950 dark:text-white">
                Book Appointment
              </h1>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                Page 3 – The Family Salon, Dewas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <ThemeToggle size="sm" />
            {selectedServices.length > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(totalPrice)}
                </span>
                <p className="text-[10px] text-neutral-400">{totalDuration} mins</p>
              </div>
            )}
          </div>
        </header>

        <StepIndicator current={step} total={4} />

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <main className="p-4 max-w-lg mx-auto pb-28">
            {/* One-Click Quick Rebooking Card for Returning Clients */}
            {pastAppointment && (
              <div className="mb-4 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-[#18191c] dark:to-[#121214] text-white p-4 rounded-2xl border border-black/[0.1] dark:border-white/[0.12] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md">
                    Returning Client Memory
                  </span>
                  <span className="text-[10px] text-neutral-300">Last visited {pastAppointment.appointment_date}</span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug">
                  {t.rebookLastTitle}
                </h3>
                <p className="text-xs text-neutral-200 mt-0.5">
                  {pastAppointment.services?.map((s) => s.service?.name).join(" + ") || "Previous Styling"} with{" "}
                  {pastAppointment.staff?.full_name || "Assigned Stylist"}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleOneClickRebook}
                    className="flex-1 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-xs"
                  >
                    {t.rebookLastBtn}
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
                Select Services
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t.chooseServicesSubtitle}
              </p>
            </div>

            {/* Categories */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                    : "border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
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
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                      : "border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
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
                    className={`rf-card p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all bg-white dark:bg-[#161719] border ${
                      isSelected
                        ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                        : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.2]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {service.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 font-mono">
                          {service.duration_minutes}m
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {service.description}
                      </p>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white mt-1 inline-block">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-950"
                          : "border-neutral-300 dark:border-white/20 text-transparent"
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
              <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
                Select Preferred Stylist
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pick your trusted artist or let us assign the best expert on duty.
              </p>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => setSelectedStaff(null)}
                className={`rf-card p-4 flex items-center gap-3.5 cursor-pointer transition-all bg-white dark:bg-[#161719] border ${
                  selectedStaff === null
                    ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.2]"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.1] flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {t.anyStylist}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t.anyStylistDesc}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedStaff === null
                      ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-950"
                      : "border-neutral-300 dark:border-white/20 text-transparent"
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
                    className={`rf-card p-4 flex items-center gap-3.5 cursor-pointer transition-all bg-white dark:bg-[#161719] border ${
                      isSelected
                        ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                        : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.2]"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-base flex items-center justify-center shadow-xs">
                      {staff.full_name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {staff.full_name}
                        </h3>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md font-medium">
                          Available Today
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize mt-0.5">
                        {staff.specializations.join(" • ")}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-950"
                          : "border-neutral-300 dark:border-white/20 text-transparent"
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
              <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
                Select Date &amp; Time
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Salon hours: 10:00 AM – 8:30 PM • Total session: {totalDuration}m
              </p>
            </div>

            {/* Date Picker Bar */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                Available Dates (Next 14 Days)
              </p>
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
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white font-bold shadow-sm"
                          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
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
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  Double-booking protection active
                </span>
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
              <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
                Client Information
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Book in seconds without mandatory account creation.
              </p>
            </div>

            {/* Existing Customer CRM Memory Banner */}
            {existingCustomer && (
              <div className="mb-4 rf-card p-4 bg-neutral-900 text-white dark:bg-[#18191c] border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-200">
                  <span>👑</span> Welcome Back, {existingCustomer.full_name}!
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  We remembered you! Total salon visits: <strong className="text-white">{existingCustomer.total_visits}</strong>.
                </p>
                {existingCustomer.notes && (
                  <p className="text-[11px] text-neutral-400 mt-1 italic">
                    Saved preference: &quot;{existingCustomer.notes}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Registration Card */}
            <div className="rf-card p-4 space-y-3.5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Mobile Number (Mandatory) *
                </label>
                <div className="flex gap-2">
                  <span className="h-10 px-3 bg-neutral-100 dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] rounded-xl flex items-center text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 h-10 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-neutral-50/50 dark:bg-[#1b1c20] focus:bg-white dark:focus:bg-[#1b1c20] focus:outline-none focus:ring-2 focus:ring-neutral-400"
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
                <div className="p-3 bg-neutral-50 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-700 dark:text-neutral-300">Enter SMS Code:</span>
                    <span className="font-mono text-[10px] text-neutral-500">Demo Code: 1234</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="flex-1 h-10 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-center font-mono text-sm tracking-widest bg-white dark:bg-[#1b1c20]"
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
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  <span>✓</span> Phone number verified via OTP
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name (Mandatory) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-neutral-50/50 dark:bg-[#1b1c20] focus:bg-white dark:focus:bg-[#1b1c20] focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Gender (Mandatory) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setCustomerGender(g)}
                      className={`h-9 rounded-xl text-xs font-medium capitalize border transition-all ${
                        customerGender === g
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white font-bold"
                          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1b1c20] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Fields: Email & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="For calendar & receipt"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-neutral-50/50 dark:bg-[#1b1c20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Date of Birth (Optional)
                  </label>
                  <input
                    type="date"
                    value={customerDob}
                    onChange={(e) => setCustomerDob(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-neutral-50/50 dark:bg-[#1b1c20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Styling Notes / Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Low skin fade, beard scissor trim, sensitive scalp"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-neutral-50/50 dark:bg-[#1b1c20] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationConsent}
                    onChange={(e) => setNotificationConsent(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Receive appointment reminders on WhatsApp &amp; SMS (Essential)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Receive exclusive loyalty offers, birthday perks &amp; discounts (Optional)
                  </span>
                </label>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="rf-card p-3.5 mt-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
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

            {/* Live Pricing Breakdown */}
            <div className="rf-card p-4 mt-4 space-y-2 text-xs bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Date &amp; Slot</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {selectedDate} at {selectedSlot?.start}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Stylist</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {selectedStaff?.full_name || "Any Available Stylist"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Services ({selectedServices.length})</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {formatCurrency(rawTotalPrice)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>First-Visit Discount (20%)</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-neutral-900 dark:text-white">
                <span>Total Due at Salon</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* STICKY BOTTOM BUTTONS */}
      <footer className="bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] p-4 sticky bottom-0 z-20 transition-colors duration-200">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="leading-tight">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{t.totalPrice}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                {formatCurrency(totalPrice)}
              </span>
              {promoApplied && (
                <span className="text-[10px] line-through text-neutral-400">
                  {formatCurrency(rawTotalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-[220px]">
            {step === 1 && (
              <Button
                variant="default"
                disabled={selectedServices.length === 0}
                className="w-full h-11 text-xs font-bold"
                onClick={() => setStep(2)}
              >
                {t.selectStylistBtn}
              </Button>
            )}

            {step === 2 && (
              <Button
                variant="default"
                className="w-full h-11 text-xs font-bold"
                onClick={() => setStep(3)}
              >
                {t.selectSlotBtn}
              </Button>
            )}

            {step === 3 && (
              <Button
                variant="default"
                disabled={!selectedSlot}
                className="w-full h-11 text-xs font-bold"
                onClick={() => setStep(4)}
              >
                Continue to Details →
              </Button>
            )}

            {step === 4 && (
              <Button
                variant="default"
                disabled={!customerName.trim() || customerPhone.length !== 10}
                className="w-full h-11 text-xs font-bold"
                onClick={handleFinalBooking}
              >
                {t.confirmBookingBtn}
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] flex items-center justify-center p-4">
          <div className="text-xs text-neutral-500 font-mono">Loading booking experience...</div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
