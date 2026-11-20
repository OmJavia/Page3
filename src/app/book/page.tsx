"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES, DEMO_STAFF } from "@/lib/mock-data";
import { Service, Staff, Customer, Appointment, PaymentMethod } from "@/lib/types";
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
  const steps = [t.stepServices, t.stepStylist, t.stepSlot, t.stepDetails, "Payment"];
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
                className={`text-[9px] sm:text-[10px] mt-1 font-[510] truncate max-w-[54px] sm:max-w-none text-center ${
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

  // Payment Selection State (Step 5)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "counter">("upi");
  const [paymentPlan, setPaymentPlan] = useState<"full" | "advance">("full");
  const [upiSubApp, setUpiSubApp] = useState<"qr" | "gpay" | "phonepe" | "paytm">("qr");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("");

  // Confirmed booking state with merged Payment Receipt & Tax Invoice
  const [confirmedBooking, setConfirmedBooking] = useState<{
    code: string;
    services: Service[];
    staff: Staff | null;
    date: string;
    slot: { start: string; end: string };
    total: number;
    rawTotal: number;
    discountAmount: number;
    customerName: string;
    phone: string;
    ownerWhatsAppUrl?: string;
    status: string;
    paymentMethod: string;
    paidAmount: number;
    balanceDue: number;
    txnId: string;
    paidAt: string;
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
          (a) => a.customer?.phone?.replace(/\D/g, "").slice(-10) === phoneToCheck
        );
        if (past) {
          setPastAppointment(past);
          if (!customerName && past.customer?.full_name) {
            setCustomerName(past.customer.full_name);
          }
        }
      }
    } catch (e) {
      console.error("Error checking past appointments", e);
    }
  }, [customerPhone, customerName]);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) return prev.filter((s) => s.id !== service.id);
      return [...prev, service];
    });
  };

  const rawTotalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);

  // Discount calculation
  const discountAmount = promoApplied ? Math.round(rawTotalPrice * 0.2) : 0;
  const totalPrice = Math.max(0, rawTotalPrice - discountAmount);

  // Advance calculation for payment step
  const tokenAdvanceAmount = Math.min(200, totalPrice);
  const payableAmount =
    paymentMethod === "counter"
      ? 0
      : paymentPlan === "full"
      ? totalPrice
      : tokenAdvanceAmount;
  const balanceDueAtSalon = totalPrice - payableAmount;

  // Filter services by category
  const filteredServices =
    activeCategory === "all"
      ? DEMO_SERVICES
      : DEMO_SERVICES.filter((s) => s.category_id === activeCategory);

  // One-click Rebook handler
  const handleOneClickRebook = () => {
    if (!pastAppointment) return;
    const servicesToBook =
      pastAppointment.services?.map((as) => as.service).filter(Boolean) as Service[] || [];
    if (servicesToBook.length > 0) setSelectedServices(servicesToBook);
    if (pastAppointment.staff) setSelectedStaff(pastAppointment.staff);
    if (pastAppointment.customer?.full_name) setCustomerName(pastAppointment.customer.full_name);
    if (pastAppointment.customer?.phone) setCustomerPhone(pastAppointment.customer.phone);
    setStep(3); // Jump to slot selection
  };

  // Promo code validation with returning client protection
  const handleApplyPromo = () => {
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) {
      setPromoMessage("Please enter a promo code");
      return;
    }

    if (cleanCode === "FIRST20") {
      try {
        const storedCustomers = getStoredCustomers();
        const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
        const existing = storedCustomers.find(
          (c) => c.phone.replace(/\D/g, "").slice(-10) === cleanPhone && c.total_visits > 0
        );

        if (existing) {
          setPromoApplied(false);
          setPromoMessage("FIRST20 is reserved for first-time guests only.");
          return;
        }
      } catch (e) {
        console.error("Error checking promo eligibility", e);
      }

      setPromoApplied(true);
      setPromoMessage("20% First-Time discount applied!");
    } else if (cleanCode === "DEWAS10") {
      setPromoApplied(true);
      setPromoMessage("10% Dewas Local special offer applied!");
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid promo code. Use FIRST20 on first visit.");
    }
  };

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

  // STEP 4 -> 5 TRANSITION (Proceed to Payment & Bill)
  const handleProceedToPayment = () => {
    const activeDate = selectedDate || availableDates[0].iso;

    if (!customerName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (customerPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Check double-booking constraint before entering payment
    if (isSlotBooked(activeDate, selectedSlot!.start, selectedStaff?.id)) {
      alert("This slot was just reserved by another client. Please select another slot.");
      setStep(3);
      return;
    }

    setStep(5);
  };

  // FINAL PAYMENT EXECUTION & APPOINTMENT CONFIRMATION
  const handleFinalBookingWithPayment = () => {
    const activeDate = selectedDate || availableDates[0].iso;

    // Strict double-booking check right before persisting
    if (isSlotBooked(activeDate, selectedSlot!.start, selectedStaff?.id)) {
      alert("This slot was just reserved by another client. Please select another slot.");
      setStep(3);
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStatusText(
      paymentMethod === "counter"
        ? "Confirming slot reservation at salon desk..."
        : "Authorizing payment via RBI/NPCI Banking Gateway..."
    );

    setTimeout(() => {
      setIsProcessingPayment(false);

      const txnId =
        paymentMethod === "counter"
          ? `DESK_PAY_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
          : `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const resolvedMethodName =
        paymentMethod === "counter"
          ? "Pay at Salon Reception"
          : paymentMethod === "card"
          ? "Card Payment (2-Factor Verified)"
          : `UPI (${upiSubApp.toUpperCase()})`;

      const paymentMethodType: PaymentMethod =
        paymentMethod === "counter" ? "cash" : paymentMethod === "card" ? "card" : "upi";

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
        paidAmount: payableAmount,
        paymentMethod: paymentMethodType,
        paymentStatus:
          paymentMethod === "counter"
            ? "pending"
            : payableAmount >= totalPrice
            ? "paid"
            : "partial",
        txnId,
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
        rawTotal: rawTotalPrice,
        discountAmount,
        customerName: customerName.trim(),
        phone: customerPhone,
        ownerWhatsAppUrl,
        status: "confirmed",
        paymentMethod: resolvedMethodName,
        paidAmount: payableAmount,
        balanceDue: balanceDueAtSalon,
        txnId,
        paidAt: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }, 700);
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

  // Handle Tax Invoice Print / PDF Download
  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // STEP 6: MERGED CONFIRMATION & OFFICIAL TAX INVOICE SCREEN
  if (confirmedBooking) {
    const taxableSupply = Math.round(confirmedBooking.total / 1.18);
    const totalGst = confirmedBooking.total - taxableSupply;

    const invoiceWhatsAppText = `*PAGE 3 SALON DEWAS – TAX INVOICE & CONFIRMATION*\n\nBooking Ref: *${
      confirmedBooking.code
    }*\nClient: *${confirmedBooking.customerName || "Client"}* (+91 ${
      confirmedBooking.phone
    })\nDate: *${confirmedBooking.date}* at *${confirmedBooking.slot.start}*\nStylist: *${
      confirmedBooking.staff?.full_name || "Any Stylist"
    }*\n\nServices: ${confirmedBooking.services
      .map((s) => `${s.name} (₹${s.price})`)
      .join(", ")}\n\nTotal Bill: *₹${confirmedBooking.total}*\nPaid: *₹${
      confirmedBooking.paidAmount
    }* (${confirmedBooking.paymentMethod})\nBalance Due: *₹${
      confirmedBooking.balanceDue
    }*\nTransaction Ref: ${confirmedBooking.txnId}\n\nAddress: ${
      SALON_INFO.fullAddress
    }\nDirections: ${SALON_INFO.googleMapsUrl}`;

    const invoiceWhatsAppUrl = `https://wa.me/91${confirmedBooking.phone}?text=${encodeURIComponent(
      invoiceWhatsAppText
    )}`;

    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto transition-colors duration-200">
        <div className="pt-2 text-center no-print">
          {/* Animated Success Checkmark */}
          {confirmedBooking.status === "cancelled" ? (
            <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-3 shadow-sm">
              ✕
            </div>
          ) : (
            <div className="w-16 h-16 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-3 shadow-sm">
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
            {confirmedBooking.status === "cancelled"
              ? "Appointment Cancelled"
              : "Appointment Confirmed & Locked"}
          </span>

          <h1 className="text-2xl font-[510] tracking-tight mt-2 text-neutral-950 dark:text-white">
            {confirmedBooking.status === "cancelled"
              ? "Your slot has been released"
              : "We look forward to styling you!"}
          </h1>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
            {confirmedBooking.status === "cancelled"
              ? "You can book a new slot anytime."
              : `Instant WhatsApp confirmation sent to +91 ${confirmedBooking.phone}. Salon desk alerted.`}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex gap-2 justify-center mt-4">
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 transition-all shadow-xs cursor-pointer"
            >
              <span>🖨️</span>
              <span>Download / Print Bill</span>
            </button>

            <a
              href={invoiceWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#161719] border border-black/[0.1] dark:border-white/[0.12] text-emerald-600 dark:text-emerald-400 hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all shadow-xs"
            >
              <span>💬</span>
              <span>WhatsApp Invoice</span>
            </a>
          </div>
        </div>

        {/* OFFICIAL PRINTABLE TAX INVOICE & APPOINTMENT DOSSIER */}
        <div
          id="printable-invoice"
          className="rf-card p-5 sm:p-6 mt-4 text-left space-y-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl shadow-sm"
        >
          {/* Invoice Top Header */}
          <div className="flex justify-between items-start border-b border-black/[0.08] dark:border-white/[0.08] pb-3.5">
            <div>
              <h2 className="text-base font-bold tracking-tight text-neutral-950 dark:text-white">
                PAGE 3 – THE FAMILY SALON
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {SALON_INFO.fullAddress}
              </p>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                GSTIN: 23AAACP1234F1Z8 • Phone: +91 {STORE_PHONE}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200">
                TAX INVOICE
              </span>
              <p className="text-xs font-mono font-bold mt-1 text-neutral-900 dark:text-white">
                INV-{confirmedBooking.code}
              </p>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                {confirmedBooking.date} • {confirmedBooking.paidAt}
              </p>
            </div>
          </div>

          {/* Client & Stylist Attribution */}
          <div className="grid grid-cols-2 gap-3 py-1 border-b border-black/[0.06] dark:border-white/[0.06] text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">
                Client (Billed To):
              </span>
              <p className="font-bold text-neutral-900 dark:text-white mt-0.5">
                {confirmedBooking.customerName || "Valued Client"}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 font-mono">+91 {confirmedBooking.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">
                Appointment Slot:
              </span>
              <p className="font-bold text-neutral-900 dark:text-white mt-0.5">
                {confirmedBooking.slot.start} (30 mins)
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                Stylist: {confirmedBooking.staff?.full_name || "Any Expert Stylist"}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-1 border-b border-black/[0.06] dark:border-white/[0.06]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06] text-neutral-400 dark:text-neutral-500 text-[10px] uppercase">
                  <th className="text-left py-1.5 font-semibold">Service Description</th>
                  <th className="text-center py-1.5 font-semibold">Duration</th>
                  <th className="text-right py-1.5 font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {confirmedBooking.services.map((svc) => (
                  <tr key={svc.id}>
                    <td className="py-2 font-medium text-neutral-900 dark:text-white">{svc.name}</td>
                    <td className="py-2 text-center text-neutral-500 dark:text-neutral-400">{svc.duration_minutes}m</td>
                    <td className="py-2 text-right font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(svc.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing & GST Breakdown */}
          <div className="space-y-1.5 text-xs border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
              <span>Gross Services Total</span>
              <span>{formatCurrency(confirmedBooking.rawTotal)}</span>
            </div>
            {confirmedBooking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Promotional Discount (FIRST20)</span>
                <span>- {formatCurrency(confirmedBooking.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400 dark:text-neutral-500 text-[11px]">
              <span>Taxable Value of Supply</span>
              <span>{formatCurrency(taxableSupply)}</span>
            </div>
            <div className="flex justify-between text-neutral-400 dark:text-neutral-500 text-[11px]">
              <span>Applicable GST (CGST 9% + SGST 9%)</span>
              <span>{formatCurrency(totalGst)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-950 dark:text-white pt-1.5 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span>Total Bill (Incl. All Taxes)</span>
              <span>{formatCurrency(confirmedBooking.total)}</span>
            </div>
          </div>

          {/* Payment Settlement Information */}
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Payment Tender</span>
              <span className="font-medium text-neutral-900 dark:text-white">{confirmedBooking.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">Payment Reference / UTR</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">{confirmedBooking.txnId}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
              <span>Amount Paid Online</span>
              <span>{formatCurrency(confirmedBooking.paidAmount)}</span>
            </div>
            {confirmedBooking.balanceDue > 0 ? (
              <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                <span>Balance Due at Salon Reception</span>
                <span>{formatCurrency(confirmedBooking.balanceDue)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Payment Status</span>
                <span>Fully Settled (₹0 Balance)</span>
              </div>
            )}
          </div>

          {/* Computer Generated Disclaimer */}
          <div className="pt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500 border-t border-black/[0.04] dark:border-white/[0.04]">
            Official Computer-Generated Tax Invoice • Page 3 – The Family Salon, Dewas
          </div>
        </div>

        {/* Self-Service Controls & Calendar Actions */}
        <div className="space-y-3 mt-4 no-print">
          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] text-left rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Need to Reschedule?</span>
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

          {/* Calendar Sync Links */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] text-center text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all"
            >
              📅 Google Calendar
            </a>
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="py-2.5 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] text-center text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all"
            >
              📥 Apple / iCal (.ics)
            </button>
          </div>

          <Link href="/profile" className="block w-full">
            <Button variant="rightfit" className="w-full h-11 text-xs font-semibold">
              View in My Appointments Portal →
            </Button>
          </Link>

          <Link href="/" className="block w-full">
            <Button variant="ghost" className="w-full h-10 text-xs text-neutral-500">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] transition-colors duration-200">
      {/* Top Hairline Indicator */}
      <div className="h-[2px] bg-neutral-900 dark:bg-white w-full" />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-600 dark:text-neutral-300"
              title="Go back"
            >
              ←
            </button>
          ) : (
            <Link
              href="/"
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-600 dark:text-neutral-300"
              title="Return to Home"
            >
              ✕
            </Link>
          )}
          <div>
            <h1 className="text-sm font-[510] tracking-tight text-neutral-900 dark:text-white">
              {t.brandTitle}
            </h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
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

      <StepIndicator current={step} total={5} />

      {/* STEP 1: SERVICE SELECTION */}
      {step === 1 && (
        <main className="p-4 max-w-lg mx-auto pb-28">
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
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm shadow-xs">
                    {staff.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {staff.full_name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                      {staff.specializations.join(", ")}
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

      {/* STEP 3: DATE & TIME SLOT SELECTION */}
      {step === 3 && (
        <main className="p-4 max-w-lg mx-auto pb-28">
          <div className="mb-4">
            <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
              Choose Date &amp; Slot
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Real-time slot availability for Page 3 Salon, Dewas.
            </p>
          </div>

          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {availableDates.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDate(d.iso)}
                className={`p-3 rounded-2xl flex flex-col items-center min-w-[68px] border transition-all ${
                  selectedDate === d.iso
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                    : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase">{d.dayName}</span>
                <span className="text-base font-bold my-0.5">{d.dayNum}</span>
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Morning &amp; Afternoon Slots
              </span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeSlots.slice(0, 6).map((slot) => {
                  const targetDate = selectedDate || availableDates[0].iso;
                  const booked = isSlotBooked(targetDate, slot.start, selectedStaff?.id);
                  const isSelected = selectedSlot?.start === slot.start;

                  return (
                    <button
                      key={slot.start}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        booked
                          ? "opacity-30 cursor-not-allowed border-dashed bg-neutral-100 dark:bg-white/[0.02] text-neutral-400"
                          : isSelected
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] hover:border-black/[0.2]"
                      }`}
                    >
                      <div>{slot.label}</div>
                      {booked && <span className="text-[9px] block text-rose-500 font-normal">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Evening &amp; Night Slots
              </span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeSlots.slice(6).map((slot) => {
                  const targetDate = selectedDate || availableDates[0].iso;
                  const booked = isSlotBooked(targetDate, slot.start, selectedStaff?.id);
                  const isSelected = selectedSlot?.start === slot.start;

                  return (
                    <button
                      key={slot.start}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        booked
                          ? "opacity-30 cursor-not-allowed border-dashed bg-neutral-100 dark:bg-white/[0.02] text-neutral-400"
                          : isSelected
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                          : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] hover:border-black/[0.2]"
                      }`}
                    >
                      <div>{slot.label}</div>
                      {booked && <span className="text-[9px] block text-rose-500 font-normal">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* STEP 4: CUSTOMER DETAILS & PROMO */}
      {step === 4 && (
        <main className="p-4 max-w-lg mx-auto pb-28">
          <div className="mb-4">
            <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
              Customer Details
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Required for appointment allocation &amp; digital invoice dispatch.
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Mobile Number (10 digits) *
              </label>
              <div className="flex gap-2">
                <div className="h-11 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-100 dark:bg-[#1b1c20] text-xs font-semibold flex items-center">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="flex-1 h-11 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono bg-white dark:bg-[#161719] focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-white dark:bg-[#161719] focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Gender Preference
                </label>
                <select
                  value={customerGender}
                  onChange={(e) => setCustomerGender(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-white dark:bg-[#161719]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">All / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs bg-white dark:bg-[#161719]"
                />
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="rf-card p-3.5 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">Have a Promo Code?</span>
                <span className="text-[10px] text-amber-500 font-mono font-bold">Try FIRST20</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (FIRST20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono uppercase bg-neutral-50/50 dark:bg-[#1b1c20]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 h-9 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl text-xs font-semibold transition-all"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    promoApplied ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {promoMessage}
                </p>
              )}
            </div>
          </div>
        </main>
      )}

      {/* STEP 5: PAYMENT & BILL SETTLEMENT */}
      {step === 5 && (
        <main className="p-4 max-w-lg mx-auto pb-28">
          <div className="mb-4">
            <h2 className="text-base font-[510] tracking-tight text-neutral-950 dark:text-white">
              Payment &amp; Bill Settlement
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select your payment preference before confirming the appointment.
            </p>
          </div>

          {/* Order Summary & Pricing Breakdown */}
          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl space-y-2.5 text-xs mb-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Appointment Booking</span>
                <p className="font-bold text-neutral-900 dark:text-white">{customerName} (+91 {customerPhone})</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Slot</span>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">{selectedDate} • {selectedSlot?.start}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Services</span>
              {selectedServices.map((svc) => (
                <div key={svc.id} className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{svc.name} ({svc.duration_minutes}m)</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(svc.price)}</span>
                </div>
              ))}
            </div>

            {promoApplied && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                <span>First-Visit 20% Discount</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span>Total Bill Due</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white block">
              Choose Payment Method:
            </span>

            {/* Option 1: Instant UPI */}
            <div
              onClick={() => setPaymentMethod("upi")}
              className={`rf-card p-3.5 border rounded-2xl cursor-pointer transition-all ${
                paymentMethod === "upi"
                  ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                  : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Instant UPI (Google Pay, PhonePe, Paytm)
                    </h4>
                    <p className="text-[11px] text-neutral-500">Fast 0% fee payment with verified instant confirmation</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    paymentMethod === "upi"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-bold"
                      : "border-neutral-300"
                  }`}
                >
                  {paymentMethod === "upi" ? "✓" : ""}
                </div>
              </div>

              {paymentMethod === "upi" && (
                <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUpiSubApp("qr")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                        upiSubApp === "qr"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                          : "border-black/[0.08] dark:border-white/[0.08]"
                      }`}
                    >
                      Scan QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubApp("gpay")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                        upiSubApp === "gpay"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                          : "border-black/[0.08] dark:border-white/[0.08]"
                      }`}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiSubApp("phonepe")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                        upiSubApp === "phonepe"
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                          : "border-black/[0.08] dark:border-white/[0.08]"
                      }`}
                    >
                      PhonePe
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-neutral-500">Amount to pay now:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(payableAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Option 2: Debit / Credit Card */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`rf-card p-3.5 border rounded-2xl cursor-pointer transition-all ${
                paymentMethod === "card"
                  ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                  : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    💳
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Debit / Credit Card (RuPay, Visa, Master)
                    </h4>
                    <p className="text-[11px] text-neutral-500">2-Factor authentication with official bank OTP</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    paymentMethod === "card"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-bold"
                      : "border-neutral-300"
                  }`}
                >
                  {paymentMethod === "card" ? "✓" : ""}
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono bg-white dark:bg-[#18191c]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono bg-white dark:bg-[#18191c]"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono bg-white dark:bg-[#18191c]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Option 3: Pay at Salon Front Desk */}
            <div
              onClick={() => setPaymentMethod("counter")}
              className={`rf-card p-3.5 border rounded-2xl cursor-pointer transition-all ${
                paymentMethod === "counter"
                  ? "border-neutral-900 dark:border-white bg-neutral-50/70 dark:bg-white/[0.04]"
                  : "border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                    🏢
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Pay at Salon Reception (Zero Advance)
                    </h4>
                    <p className="text-[11px] text-neutral-500">Pay full bill after service via Cash, UPI, or Card</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    paymentMethod === "counter"
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-bold"
                      : "border-neutral-300"
                  }`}
                >
                  {paymentMethod === "counter" ? "✓" : ""}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
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

          <div className="flex-1 max-w-[240px]">
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
                onClick={handleProceedToPayment}
              >
                Proceed to Payment &amp; Bill →
              </Button>
            )}

            {step === 5 && (
              <Button
                variant="default"
                disabled={isProcessingPayment}
                className="w-full h-11 text-xs font-bold"
                onClick={handleFinalBookingWithPayment}
              >
                {isProcessingPayment
                  ? "Processing..."
                  : paymentMethod === "counter"
                  ? "Confirm (Pay at Salon) →"
                  : `Pay & Confirm (${formatCurrency(payableAmount)}) →`}
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
