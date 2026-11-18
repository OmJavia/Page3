"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_STAFF } from "@/lib/mock-data";
import { generateCustomerCode } from "@/lib/utils";

export default function AdminNewCustomerPage() {
  const router = useRouter();

  // Mandatory fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");

  // Optional fields
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [preferredStylistId, setPreferredStylistId] = useState("");
  const [notes, setNotes] = useState("");

  // Consent separation
  const [notificationConsent, setNotificationConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || phone.length !== 10) {
      alert("Please provide Full Name and a valid 10-digit mobile number.");
      return;
    }

    const code = generateCustomerCode();
    alert(`Customer registered successfully!\nGenerated Customer ID: ${code}\nName: ${fullName}\nPhone: +91 ${phone}`);
    router.push("/admin/customers");
  };

  return (
    <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="text-zinc-400 hover:text-white">
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Register New Customer</h1>
          <p className="text-xs text-zinc-400">
            Creates customer profile, generates unique Customer ID, and records preferences.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5"
      >
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Mandatory Information
          </h2>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Phone Number (Unique Identifier) *
              </label>
              <div className="flex gap-2">
                <span className="h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center text-xs font-mono text-zinc-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Optional Details & Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Preferred Stylist
            </label>
            <select
              value={preferredStylistId}
              onChange={(e) => setPreferredStylistId(e.target.value)}
              className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">No preference / Any stylist</option>
              {DEMO_STAFF.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.specializations.join(", ")})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Customer Styling Preferences / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Prefers low skin fade, allergic to eucalyptus oil, likes ginger tea during service"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Communication Consent Separated */}
        <div className="pt-4 border-t border-zinc-800 space-y-2.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationConsent}
              onChange={(e) => setNotificationConsent(e.target.checked)}
              className="mt-0.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-white">
                Appointment Notifications Consent (WhatsApp & SMS)
              </span>
              <p className="text-[11px] text-zinc-400">
                Booking confirmations, 24-hour and 1-hour reminders, cancellations.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <div>
              <span className="text-xs font-semibold text-white">
                Promotional & Marketing Offers Consent
              </span>
              <p className="text-[11px] text-zinc-400">
                Birthday surprises, seasonal package discounts, and reactivation perks.
              </p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
        >
          Create Customer Profile ✓
        </button>
      </form>
    </main>
  );
}
