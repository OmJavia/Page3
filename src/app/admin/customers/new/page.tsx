"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DEMO_STAFF } from "@/lib/mock-data";
import { Customer } from "@/lib/types";
import { generateCustomerCode } from "@/lib/utils";
import { getStoredCustomers, saveStoredCustomers } from "@/lib/appointments-store";

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
    const cleanPhone = phone.replace(/\D/g, "");
    if (!fullName.trim() || cleanPhone.length < 10) {
      alert("Please provide Full Name and a valid 10-digit mobile number.");
      return;
    }

    const code = generateCustomerCode();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      customer_code: code,
      full_name: fullName.trim(),
      phone: cleanPhone.slice(-10),
      gender,
      email: email.trim() || undefined,
      date_of_birth: dob || undefined,
      preferred_stylist_id: preferredStylistId || undefined,
      notification_consent: notificationConsent,
      marketing_consent: marketingConsent,
      notes: notes.trim(),
      first_visit_date: new Date().toISOString().split("T")[0],
      last_visit_date: new Date().toISOString().split("T")[0],
      total_visits: 0,
      total_spent: 0,
      customer_category: "new",
      loyalty_points: 50, // Welcome gift points
      created_at: new Date().toISOString(),
    };

    const currentList = getStoredCustomers();
    saveStoredCustomers([newCust, ...currentList]);

    alert(
      `Customer registered successfully!\nGenerated Customer ID: ${code}\nName: ${newCust.full_name}\nPhone: +91 ${newCust.phone}\nBonus: +50 Welcome Loyalty Points added!`
    );
    router.push("/admin/customers");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#161719] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-xs transition-colors"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5]">
            Register New Customer
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Creates customer profile, generates unique Customer ID, and records styling preferences.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rf-card bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs"
      >
        <div className="space-y-4">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-900 dark:text-white">
            Mandatory Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Mobile Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-black/[0.08] dark:border-white/[0.1] bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 text-xs font-bold font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-r-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Gender *
            </label>
            <div className="flex gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-xs font-[510] capitalize transition-all ${
                    gender === g
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs"
                      : "bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300 hover:border-black/[0.14] dark:hover:border-white/[0.14]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Section */}
        <div className="space-y-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Preferences &amp; Details (Optional)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Preferred Stylist
            </label>
            <select
              aria-label="Preferred Stylist"
              value={preferredStylistId}
              onChange={(e) => setPreferredStylistId(e.target.value)}
              className="w-full h-11 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
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
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Styling Notes / Preferences (Memory System)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Sensitive scalp, uses No. 2 clipper guard on sides, loves hot towel after shave..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
            />
          </div>
        </div>

        {/* Consent Section */}
        <div className="space-y-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
          <h2 className="text-xs font-[510] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Communication Consents
          </h2>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationConsent}
              onChange={(e) => setNotificationConsent(e.target.checked)}
              className="mt-1 rounded accent-neutral-900 dark:accent-white"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Transactional WhatsApp Reminders
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Booking confirmations, queue updates &amp; appointment reminders.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-1 rounded accent-neutral-900 dark:accent-white"
            />
            <div>
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                Promotional &amp; Birthday Offers
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Festival perks, birthday discounts &amp; reactivation vouchers.
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] rounded-xl text-sm transition-all shadow-xs hover:scale-[1.01]"
          >
            Register &amp; Save Profile ✓
          </button>
        </div>
      </form>
    </div>
  );
}
