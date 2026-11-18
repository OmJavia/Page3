"use client";

import { useState } from "react";
import { SALON_INFO } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [salonName, setSalonName] = useState(SALON_INFO.name);
  const [phone, setPhone] = useState(SALON_INFO.phone);
  const [address, setAddress] = useState(SALON_INFO.address);
  const [mapsUrl, setMapsUrl] = useState(SALON_INFO.googleMapsUrl);

  // Notification templates
  const [confirmationTpl, setConfirmationTpl] = useState(
    "Hi {name}! Your appointment at Page 3 Salon is confirmed for {date} at {time}. Reference: {code}. See you soon!"
  );
  const [reminder24hTpl, setReminder24hTpl] = useState(
    "Reminder: Hi {name}, your haircut appointment is scheduled for tomorrow at {time} at Page 3 Salon. Need to reschedule? Reply to this message."
  );
  const [reminder1hTpl, setReminder1hTpl] = useState(
    "Hi {name}! Your appointment with {stylist} is in 1 hour at {time}. Here are directions: {maps_url}"
  );
  const [thankyouTpl, setThankyouTpl] = useState(
    "Thank you for visiting Page 3 Salon, {name}! We hope you loved your new style. Rate us and earn 50 loyalty points: {review_url}"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Business settings and notification triggers saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f]">
          Business Settings &amp; Automated Notifications
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure salon identity, operational hours, and automated WhatsApp/SMS notification templates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Identity Section */}
        <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <h2 className="text-sm font-[510] text-neutral-900 flex items-center gap-2">
            <span>📍</span> Salon Business Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-500 mb-1">Business Name</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-500 mb-1">Salon Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-500 mb-1">Google Maps Listing URL</label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono text-[11px] shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Automated WhatsApp / SMS Notification Engine */}
        <div className="rf-card bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_-2px_rgba(0,0,0,0.04)]">
          <div>
            <h2 className="text-sm font-[510] text-neutral-900 flex items-center gap-2">
              <span>💬</span> Automated Notification Templates &amp; Timing
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Dynamic parameters available: <code>{"{name}"}</code>, <code>{"{date}"}</code>, <code>{"{time}"}</code>, <code>{"{stylist}"}</code>, <code>{"{code}"}</code>.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-800 font-semibold mb-1">
                1. Instant Booking Confirmation (WhatsApp &amp; SMS)
              </label>
              <textarea
                rows={2}
                value={confirmationTpl}
                onChange={(e) => setConfirmationTpl(e.target.value)}
                className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-800 font-semibold mb-1">
                2. Reminder 24 Hours Before Appointment
              </label>
              <textarea
                rows={2}
                value={reminder24hTpl}
                onChange={(e) => setReminder24hTpl(e.target.value)}
                className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-800 font-semibold mb-1">
                3. Final Reminder 1 Hour Before Appointment (With Directions)
              </label>
              <textarea
                rows={2}
                value={reminder1hTpl}
                onChange={(e) => setReminder1hTpl(e.target.value)}
                className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono text-xs shadow-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-800 font-semibold mb-1">
                4. Post-Service Thank You &amp; Review Request (After Completed)
              </label>
              <textarea
                rows={2}
                value={thankyouTpl}
                onChange={(e) => setThankyouTpl(e.target.value)}
                className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono text-xs shadow-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-neutral-900 hover:bg-black text-white font-[510] rounded-xl text-sm transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:scale-[1.01]"
        >
          Save All Business Configurations ✓
        </button>
      </form>
    </div>
  );
}
