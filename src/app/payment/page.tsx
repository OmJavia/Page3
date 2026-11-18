"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme-toggle";

interface OrderData {
  code: string;
  customerName: string;
  customerPhone: string;
  serviceNames: string[];
  stylistName: string;
  date: string;
  time: string;
  subtotal: number;
}

const POPULAR_BANKS = [
  { id: "sbi", name: "State Bank of India", code: "SBI", badge: "Most Popular" },
  { id: "hdfc", name: "HDFC Bank", code: "HDFC", badge: "Instant" },
  { id: "icici", name: "ICICI Bank", code: "ICICI", badge: "Instant" },
  { id: "axis", name: "Axis Bank", code: "AXIS", badge: "Instant" },
  { id: "kotak", name: "Kotak Mahindra Bank", code: "KOTAK", badge: "" },
  { id: "pnb", name: "Punjab National Bank", code: "PNB", badge: "" },
];

const ALL_INDIAN_BANKS = [
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Federal Bank",
  "Yes Bank",
  "Bank of India",
  "Central Bank of India",
  "Indian Bank",
  "RBL Bank",
  "South Indian Bank",
  "Standard Chartered India",
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "GPay", color: "bg-white text-zinc-900 border-zinc-200" },
  { id: "phonepe", name: "PhonePe", icon: "PhonePe", color: "bg-[#5f259f] text-white border-transparent" },
  { id: "paytm", name: "Paytm UPI", icon: "Paytm", color: "bg-[#002e6e] text-white border-transparent" },
  { id: "bhim", name: "BHIM UPI", icon: "BHIM", color: "bg-[#00796b] text-white border-transparent" },
  { id: "cred", name: "CRED UPI", icon: "CRED", color: "bg-black text-white border-zinc-800" },
];

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params or realistic fallback
  const appointmentCode = searchParams.get("code") || "P3-8921";
  const rawSubtotal = Number(searchParams.get("amount")) || 850;
  const customerName = searchParams.get("name") || "Rahul Sharma";
  const customerPhone = searchParams.get("phone") || "9876543210";
  const serviceName = searchParams.get("service") || "Signature Haircut + Beard Grooming";
  const stylistName = searchParams.get("stylist") || "John (Master Stylist)";
  const dateStr = searchParams.get("date") || "Today, 19 Nov";
  const timeSlot = searchParams.get("slot") || "04:30 PM";

  // Financial calculations
  const gstRate = 0.18; // 18% GST for salon services in India
  const subtotal = rawSubtotal;
  const gstAmount = Math.round(subtotal * gstRate);
  const totalAmount = subtotal + gstAmount;
  const tokenAdvanceAmount = Math.min(200, totalAmount);

  // States
  const [paymentType, setPaymentType] = useState<"full" | "token">("full");
  const payableAmount = paymentType === "full" ? totalAmount : tokenAdvanceAmount;
  const balanceDueAtSalon = totalAmount - payableAmount;

  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking" | "wallet" | "counter">("upi");
  const [upiSubTab, setUpiSubTab] = useState<"qr" | "apps" | "vpa">("qr");

  // VPA state
  const [vpaId, setVpaId] = useState("");
  const [vpaValid, setVpaValid] = useState<boolean | null>(null);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(customerName);
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [otherBank, setOtherBank] = useState("");

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState("paytm");

  // Processing & Simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Initializing payment session...");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState<null | {
    txnId: string;
    rrn: string;
    method: string;
    amountPaid: number;
    balanceDue: number;
    timestamp: string;
  }>(null);

  // Timer for QR expiry
  const [qrSecondsLeft, setQrSecondsLeft] = useState(599); // 10 mins

  useEffect(() => {
    if (activeTab === "upi" && upiSubTab === "qr" && qrSecondsLeft > 0) {
      const timer = setInterval(() => setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, upiSubTab, qrSecondsLeft]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Detect card scheme
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, "");
    if (/^(508[5-9]|6521[5-9]|652[2-9]|60)/.test(clean)) return "RuPay";
    if (/^4/.test(clean)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "MasterCard";
    return "Domestic / RuPay";
  };

  // Simulate payment processing
  const initiatePayment = (methodName: string) => {
    if (methodName === "Card") {
      setOtpModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStatus(`Initiating secure payment via ${methodName}...`);

    setTimeout(() => {
      setProcessingStatus("Connecting to NPCI / Indian Banking Gateway...");
    }, 900);

    setTimeout(() => {
      setProcessingStatus("Verifying 2-Factor RBI Authorization...");
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      const txnId = `TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const rrn = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      setPaymentSuccess({
        txnId,
        rrn,
        method: methodName,
        amountPaid: payableAmount,
        balanceDue: balanceDueAtSalon,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    }, 2800);
  };

  const handleVerifyOtp = () => {
    setOtpModalOpen(false);
    setIsProcessing(true);
    setProcessingStatus("Verifying Bank OTP with Issuer...");
    setTimeout(() => {
      setProcessingStatus("Payment Approved! Generating Tax Invoice...");
    }, 1200);
    setTimeout(() => {
      setIsProcessing(false);
      const txnId = `TXN_CARD_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const rrn = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      setPaymentSuccess({
        txnId,
        rrn,
        method: `Card (${getCardBrand()})`,
        amountPaid: payableAmount,
        balanceDue: balanceDueAtSalon,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });
    }, 2200);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-[#1c1d1f] flex flex-col justify-between py-10 px-4 max-w-lg mx-auto">
        <div className="text-center pt-4">
          {/* Animated checkmark */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm mb-4">
            ✓
          </div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Payment Successful
          </span>
          <h1 className="text-2xl font-[510] tracking-tight text-[#1c1d1f] mt-3">
            {formatCurrency(paymentSuccess.amountPaid)} Paid
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Transaction Reference: <span className="font-mono font-medium text-neutral-800">{paymentSuccess.txnId}</span>
          </p>

          {/* Receipt card */}
          <div className="rf-card p-6 mt-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div>
                <span className="text-xs text-neutral-400">Appointment Code</span>
                <p className="text-sm font-mono font-bold text-neutral-900">{appointmentCode}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400">Time & Date</span>
                <p className="text-xs font-medium text-neutral-800">{dateStr} • {timeSlot}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Salon Name</span>
                <span className="font-medium text-neutral-800">Page 3 Salon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Client</span>
                <span className="font-medium text-neutral-800">{customerName} (+91 {customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Service</span>
                <span className="font-medium text-neutral-800">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Stylist</span>
                <span className="font-medium text-neutral-800">{stylistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Mode</span>
                <span className="font-medium text-neutral-800">{paymentSuccess.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Bank RRN / UTR</span>
                <span className="font-mono text-neutral-700">{paymentSuccess.rrn}</span>
              </div>
              {paymentSuccess.balanceDue > 0 && (
                <div className="flex justify-between pt-2 border-t border-neutral-100 text-amber-700 font-medium">
                  <span>Balance Due at Reception</span>
                  <span>{formatCurrency(paymentSuccess.balanceDue)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>Amount Paid Now</span>
              <span>{formatCurrency(paymentSuccess.amountPaid)}</span>
            </div>
          </div>

          {/* Fast actions */}
          <div className="space-y-3 mt-6">
            <Button
              variant="default"
              className="w-full h-11"
              onClick={() => {
                alert(`Official GST Receipt sent to WhatsApp: +91 ${customerPhone}`);
              }}
            >
              Share WhatsApp Receipt
            </Button>

            <Link href="/profile" className="block w-full">
              <Button variant="rightfit" className="w-full h-11">
                View in My Appointments
              </Button>
            </Link>

            <Link href="/" className="block w-full">
              <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-neutral-900">
                Return to Salon Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-neutral-400 pb-2">
          Page 3 Salon • GSTIN: 24AAACP1234F1Z8 • RBI Verified Gateway
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] pb-24 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3.5 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/book" className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors">
            ← Back
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-[510] tracking-tight text-neutral-900 dark:text-white">Secure Payment</h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">Page 3 Salon • Indian Gateway</p>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle size="sm" />
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
              256-bit
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Order Summary Dropdown / Card */}
        <div className="rf-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Booking Reference
              </span>
              <p className="text-sm font-mono font-bold text-neutral-900">{appointmentCode}</p>
              <p className="text-xs text-neutral-600 mt-0.5">{serviceName}</p>
              <p className="text-[11px] text-neutral-400">
                Stylist: <span className="text-neutral-700">{stylistName}</span> • {dateStr}, {timeSlot}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400">Total Bill</span>
              <p className="text-base font-bold text-neutral-900">{formatCurrency(totalAmount)}</p>
              <span className="text-[10px] text-neutral-400">(incl. 18% GST)</span>
            </div>
          </div>

          {/* Payment Type Switcher: Full vs Token Advance */}
          <div className="mt-4 pt-3 border-t border-black/[0.06] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentType("full")}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                paymentType === "full"
                  ? "border-black bg-neutral-900 text-white shadow-sm"
                  : "border-black/[0.08] bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="text-[11px] font-semibold">Pay Full Amount</div>
              <div className={`text-xs font-bold mt-0.5 ${paymentType === "full" ? "text-white" : "text-neutral-900"}`}>
                {formatCurrency(totalAmount)}
              </div>
              <div className={`text-[10px] ${paymentType === "full" ? "text-neutral-300" : "text-neutral-400"}`}>
                Zero due at salon
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType("token")}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                paymentType === "token"
                  ? "border-black bg-neutral-900 text-white shadow-sm"
                  : "border-black/[0.08] bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="text-[11px] font-semibold">Booking Advance</div>
              <div className={`text-xs font-bold mt-0.5 ${paymentType === "token" ? "text-white" : "text-neutral-900"}`}>
                {formatCurrency(tokenAdvanceAmount)}
              </div>
              <div className={`text-[10px] ${paymentType === "token" ? "text-neutral-300" : "text-neutral-400"}`}>
                Rest {formatCurrency(totalAmount - tokenAdvanceAmount)} at counter
              </div>
            </button>
          </div>
        </div>

        {/* Indian Payment Method Tabs */}
        <div className="rf-card p-2 flex gap-1 bg-neutral-100/70 border-black/[0.06]">
          {[
            { id: "upi", label: "UPI", badge: "Fastest" },
            { id: "card", label: "Cards", badge: "RuPay / Visa" },
            { id: "netbanking", label: "NetBanking", badge: "" },
            { id: "wallet", label: "Wallets", badge: "" },
            { id: "counter", label: "At Salon", badge: "₹0 Now" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-[510] transition-all ${
                activeTab === tab.id
                  ? "bg-white text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: UPI */}
        {activeTab === "upi" && (
          <div className="rf-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">UPI Instant Payment</h3>
                <p className="text-[11px] text-neutral-400">Zero surcharge via NPCI UPI network</p>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-100 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-neutral-700">UPI Auto-Confirm</span>
              </div>
            </div>

            {/* Sub-tabs: QR vs Apps vs VPA */}
            <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setUpiSubTab("qr")}
                className={`py-1.5 rounded-lg text-center font-medium transition-all ${
                  upiSubTab === "qr" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Scan QR Code
              </button>
              <button
                type="button"
                onClick={() => setUpiSubTab("apps")}
                className={`py-1.5 rounded-lg text-center font-medium transition-all ${
                  upiSubTab === "apps" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                UPI Apps
              </button>
              <button
                type="button"
                onClick={() => setUpiSubTab("vpa")}
                className={`py-1.5 rounded-lg text-center font-medium transition-all ${
                  upiSubTab === "vpa" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Enter UPI ID
              </button>
            </div>

            {/* QR View */}
            {upiSubTab === "qr" && (
              <div className="text-center py-2 space-y-3">
                <div className="bg-white p-4 border border-black/[0.08] rounded-2xl w-56 h-56 mx-auto flex flex-col items-center justify-center shadow-inner relative group">
                  {/* Visual simulated high-resolution QR */}
                  <svg className="w-44 h-44 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4-2h2v2h-2v-2zm-2 2h2v4h-2v-4zm4 4h4v2h-4v-2zm2-4h2v2h-2v-2zm-6-2h2v2h-2v-2zm8-2h2v2h-2v-2zm-4 4h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z"/>
                  </svg>
                  {/* Central UPI badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-2 py-0.5 rounded border border-neutral-300 shadow-sm text-[10px] font-bold tracking-tight text-neutral-800">
                      UPI • BHIM
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <span>Expires in:</span>
                  <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {formatTimer(qrSecondsLeft)}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  Scan using <strong>Google Pay, PhonePe, Paytm, BHIM</strong> or any banking app to pay{" "}
                  <strong className="text-neutral-900">{formatCurrency(payableAmount)}</strong>
                </p>

                <Button
                  variant="default"
                  className="w-full h-11"
                  onClick={() => initiatePayment("UPI QR Code")}
                >
                  Simulate QR Payment Done ({formatCurrency(payableAmount)})
                </Button>
              </div>
            )}

            {/* UPI Apps View */}
            {upiSubTab === "apps" && (
              <div className="space-y-2.5 py-1">
                <p className="text-xs text-neutral-500">Choose your preferred UPI application:</p>
                <div className="grid grid-cols-1 gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => initiatePayment(app.name)}
                      className="flex items-center justify-between p-3 rounded-xl border border-black/[0.08] hover:border-black/[0.2] bg-white hover:bg-neutral-50 transition-all text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${app.color} shadow-xs`}>
                          {app.icon.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-neutral-900">{app.name}</div>
                          <div className="text-[10px] text-neutral-400">Direct mobile payment</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900">Pay →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enter VPA View */}
            {upiSubTab === "vpa" && (
              <div className="space-y-3 py-1">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Virtual Payment Address (UPI ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 9876543210@paytm or name@okhdfcbank"
                      value={vpaId}
                      onChange={(e) => {
                        setVpaId(e.target.value);
                        setVpaValid(e.target.value.includes("@") && e.target.value.length > 5);
                      }}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                    <Button
                      variant="rightfit"
                      className="h-10 text-xs px-4"
                      onClick={() => {
                        if (vpaId.includes("@")) {
                          setVpaValid(true);
                        } else {
                          alert("Please enter a valid UPI ID (e.g., username@okhdfcbank)");
                        }
                      }}
                    >
                      Verify
                    </Button>
                  </div>
                  {vpaValid && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      ✓ Verified: Account holder linked to UPI ID
                    </p>
                  )}
                </div>

                {/* Quick Handle suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["@okhdfcbank", "@okicici", "@oksbi", "@paytm", "@ybl"].map((suffix) => (
                    <button
                      key={suffix}
                      type="button"
                      onClick={() => setVpaId((prev) => `${prev.split("@")[0] || customerPhone}${suffix}`)}
                      className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-1 rounded-md transition-colors"
                    >
                      {suffix}
                    </button>
                  ))}
                </div>

                <Button
                  variant="default"
                  className="w-full h-11 mt-2"
                  disabled={!vpaId || !vpaId.includes("@")}
                  onClick={() => initiatePayment(`UPI ID (${vpaId})`)}
                >
                  Request {formatCurrency(payableAmount)} via UPI
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CARDS (RuPay / Visa / Master) */}
        {activeTab === "card" && (
          <div className="rf-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Debit or Credit Card</h3>
                <p className="text-[11px] text-neutral-400">All Indian & International cards supported</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                  {getCardBrand()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4532 8901 2345 6789"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-mono bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-neutral-400">
                    {getCardBrand()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-mono bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="3 or 4 digits"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-mono bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span className="text-[11px] text-neutral-500">
                  Save card securely as per RBI tokenization mandates
                </span>
              </label>

              <Button
                variant="default"
                className="w-full h-11 mt-2"
                disabled={cardNumber.length < 15 || cardCvv.length < 3 || cardExpiry.length < 5}
                onClick={() => initiatePayment("Card")}
              >
                Pay {formatCurrency(payableAmount)} Securely
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: NETBANKING */}
        {activeTab === "netbanking" && (
          <div className="rf-card p-5 space-y-4">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Indian NetBanking</h3>
              <p className="text-[11px] text-neutral-400">Direct netbanking via 50+ RBI authorized banks</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {POPULAR_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedBank === bank.id
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-black/[0.08] bg-white hover:bg-neutral-50 text-neutral-800"
                  }`}
                >
                  <div className="text-xs font-bold">{bank.code}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${selectedBank === bank.id ? "text-neutral-300" : "text-neutral-400"}`}>
                    {bank.name.split(" ")[0]}
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Or Select From All Other Indian Banks
              </label>
              <select
                value={otherBank}
                onChange={(e) => {
                  setOtherBank(e.target.value);
                  setSelectedBank("other");
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                <option value="">-- Choose your bank --</option>
                {ALL_INDIAN_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="default"
              className="w-full h-11 mt-2"
              onClick={() => {
                const bankName =
                  selectedBank === "other"
                    ? otherBank || "Bank NetBanking"
                    : POPULAR_BANKS.find((b) => b.id === selectedBank)?.name || "NetBanking";
                initiatePayment(`NetBanking (${bankName})`);
              }}
            >
              Proceed to Bank Portal ({formatCurrency(payableAmount)})
            </Button>
          </div>
        )}

        {/* TAB 4: WALLETS */}
        {activeTab === "wallet" && (
          <div className="rf-card p-5 space-y-4">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Digital Wallets</h3>
              <p className="text-[11px] text-neutral-400">Instant debit from linked wallet balances</p>
            </div>

            <div className="space-y-2">
              {[
                { id: "paytm", name: "Paytm Wallet", desc: "Fast 1-click checkout" },
                { id: "phonepe", name: "PhonePe Wallet", desc: "Direct balance debit" },
                { id: "amazon", name: "Amazon Pay", desc: "Use Amazon gift & wallet balance" },
                { id: "mobikwik", name: "MobiKwik", desc: "ZIP Pay Later & Wallet" },
              ].map((w) => (
                <label
                  key={w.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedWallet === w.id
                      ? "border-neutral-900 bg-neutral-50 shadow-xs"
                      : "border-black/[0.08] bg-white hover:bg-neutral-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="wallet"
                      checked={selectedWallet === w.id}
                      onChange={() => setSelectedWallet(w.id)}
                      className="text-neutral-900 focus:ring-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{w.name}</div>
                      <div className="text-[10px] text-neutral-400">{w.desc}</div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400">Link →</span>
                </label>
              ))}
            </div>

            <Button
              variant="default"
              className="w-full h-11 mt-2"
              onClick={() => initiatePayment(`Wallet (${selectedWallet.toUpperCase()})`)}
            >
              Pay via {selectedWallet.toUpperCase()} ({formatCurrency(payableAmount)})
            </Button>
          </div>
        )}

        {/* TAB 5: PAY AT SALON (RECEPTION) */}
        {activeTab === "counter" && (
          <div className="rf-card p-5 space-y-4">
            <div className="border-b border-black/[0.06] pb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Pay at Salon Reception</h3>
              <p className="text-[11px] text-neutral-400">Zero advance required today</p>
            </div>

            <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 space-y-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2 font-medium text-neutral-900">
                <span>📍</span>
                <span>Page 3 Salon Front Desk</span>
              </div>
              <p>
                You can pay the full amount of <strong>{formatCurrency(totalAmount)}</strong> after your styling service is completed.
              </p>
              <div className="pt-2 text-[11px] text-neutral-500">
                Accepted methods at reception:
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>UPI (QR code at desk)</li>
                  <li>Debit / Credit Cards (POS machine)</li>
                  <li>Cash</li>
                </ul>
              </div>
            </div>

            <Button
              variant="default"
              className="w-full h-11 mt-2"
              onClick={() => {
                const txnId = `WALKIN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                setPaymentSuccess({
                  txnId,
                  rrn: "RECEPTION_PAYMENT",
                  method: "Pay at Salon Counter",
                  amountPaid: 0,
                  balanceDue: totalAmount,
                  timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                });
              }}
            >
              Confirm Appointment (Pay at Desk)
            </Button>
          </div>
        )}

        {/* Rightfit-style Demo Button Test Showcase (Requested by User) */}
        <div className="rf-card p-5 space-y-3 mt-6 border-dashed border-neutral-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Rightfit.so Button Showcase
            </span>
            <span className="text-[10px] text-neutral-400">Monochrome Micro-Interactions</span>
          </div>

          <p className="text-xs text-neutral-600">
            Hover over the buttons below to preview the Rightfit.so tactile micro-shadows, elevation lift, and chromatic text transition:
          </p>

          <div className="space-y-2.5 pt-1">
            {/* The user-requested exact white button */}
            <Button
              variant="rightfit"
              className="w-full"
              onClick={() => alert("Rightfit.so button clicked!")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Log in with google</span>
            </Button>

            {/* The inverted black Rightfit button */}
            <Button
              variant="default"
              className="w-full"
            >
              Continue with Email →
            </Button>

            {/* Ghost / Outline Rightfit button */}
            <Button
              variant="outline"
              className="w-full"
            >
              Explore Salon Services
            </Button>
          </div>
        </div>
      </main>

      {/* RBI 3D Secure OTP Modal Simulation */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">RBI 2-Factor Authentication</h4>
                <p className="text-[10px] text-neutral-400">Verified by RuPay / Visa 3D Secure</p>
              </div>
              <button
                onClick={() => setOtpModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              A high-security OTP has been sent to your registered mobile ending in{" "}
              <strong>***{customerPhone.slice(-4)}</strong> to authenticate payment of{" "}
              <strong>{formatCurrency(payableAmount)}</strong>.
            </p>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center">
              <span className="text-[10px] text-neutral-400">Demo OTP for Testing</span>
              <div className="text-base font-mono font-bold tracking-widest text-neutral-800">7654</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Enter 4-Digit OTP</label>
              <input
                type="text"
                maxLength={4}
                placeholder="• • • •"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <Button
              variant="default"
              className="w-full h-11"
              disabled={enteredOtp.length !== 4}
              onClick={handleVerifyOtp}
            >
              Submit & Complete Payment
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen processing spinner overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4" />
          <h3 className="text-sm font-bold text-neutral-900">{processingStatus}</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            Please do not press back or refresh the page. We are securing your transaction with the bank.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-neutral-900 text-xs">
          Loading secure Indian payment gateway...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
