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
    <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Business Settings & Automated Notifications
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure salon identity, operational hours, and automated WhatsApp/SMS notification templates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Identity Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>📍</span> Salon Business Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Business Name</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1">Salon Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1">Google Maps Listing URL</label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Automated WhatsApp / SMS Notification Engine */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>💬</span> Automated Notification Templates & Timing
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dynamic parameters available: <code>{"{name}"}</code>, <code>{"{date}"}</code>, <code>{"{time}"}</code>, <code>{"{stylist}"}</code>, <code>{"{code}"}</code>.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                1. Instant Booking Confirmation (WhatsApp & SMS)
              </label>
              <textarea
                rows={2}
                value={confirmationTpl}
                onChange={(e) => setConfirmationTpl(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                2. Reminder 24 Hours Before Appointment
              </label>
              <textarea
                rows={2}
                value={reminder24hTpl}
                onChange={(e) => setReminder24hTpl(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                3. Final Reminder 1 Hour Before Appointment (With Directions)
              </label>
              <textarea
                rows={2}
                value={reminder1hTpl}
                onChange={(e) => setReminder1hTpl(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                4. Post-Service Thank You & Review Request (After Completed)
              </label>
              <textarea
                rows={2}
                value={thankyouTpl}
                onChange={(e) => setThankyouTpl(e.target.value)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
        >
          Save All Business Configurations ✓
        </button>
      </form>
    </main>
  );
}
