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
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="p-2 rounded-xl border border-black/[0.08] bg-white text-neutral-600 hover:text-neutral-900 shadow-xs transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
            Register New Customer
          </h1>
          <p className="text-xs text-neutral-500">
            Creates customer profile, generates unique Customer ID, and records preferences.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]"
      >
        <div className="space-y-4">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-900">
            Mandatory Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">
                Mobile Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-black/[0.08] bg-neutral-100 text-neutral-600 text-xs font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-r-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Gender *</label>
            <div className="flex gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-xs font-[510] capitalize transition-all ${
                    gender === g
                      ? "bg-neutral-900 text-white font-semibold shadow-xs"
                      : "bg-white border border-black/[0.08] text-neutral-600 hover:border-black/[0.14]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Section */}
        <div className="space-y-4 pt-3 border-t border-black/[0.06]">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-500">
            Preferences &amp; Details (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Email</label>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Preferred Stylist</label>
            <select
              value={preferredStylistId}
              onChange={(e) => setPreferredStylistId(e.target.value)}
              className="w-full h-11 px-3 bg-white border border-black/[0.08] rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            >
              <option value="">No preference / Any Stylist</option>
              {DEMO_STAFF.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Styling Notes / Preferences (Memory System)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Sensitive scalp, uses No. 2 clipper guard on sides, loves hot towel after shave..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
            />
          </div>
        </div>

        {/* Consent Section */}
        <div className="space-y-3 pt-3 border-t border-black/[0.06]">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-500">
            Communication Consents
          </h2>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationConsent}
              onChange={(e) => setNotificationConsent(e.target.checked)}
              className="mt-1 rounded accent-neutral-900"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900">
                Transactional WhatsApp Reminders
              </span>
              <p className="text-[11px] text-neutral-500">
                Booking confirmations, queue updates &amp; appointment reminders.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-1 rounded accent-neutral-900"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900">
                Promotional &amp; Birthday Offers
              </span>
              <p className="text-[11px] text-neutral-500">
                Festival perks, birthday discounts &amp; reactivation vouchers.
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-neutral-900 hover:bg-black text-white font-[510] rounded-xl text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
          >
            Register &amp; Save Profile ✓
          </button>
        </div>
      </form>
    </div>
  );
}
