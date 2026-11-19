"use client";

import { useState } from "react";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";
import { Service } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(DEMO_SERVICES);
  const [showAddModal, setShowAddModal] = useState(false);

  // New service form state
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(DEMO_CATEGORIES[0].id);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "all">("all");

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price);
    const d = parseInt(duration);
    if (!name || isNaN(p) || isNaN(d)) return;

    const newServ: Service = {
      id: `s-${Date.now()}`,
      category_id: categoryId,
      name,
      description,
      price: p,
      duration_minutes: d,
      gender_applicable: gender,
      is_active: true,
      display_order: services.length + 1,
    };

    setServices([newServ, ...services]);
    setShowAddModal(false);
    setName("");
    setPrice("");
    setDescription("");
    alert("New salon service added successfully!");
  };

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              OPERATIONS · MENU &amp; PACKAGES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 font-mono font-semibold">
              {services.length} Services
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-[510] tracking-[-0.015em] text-[#1c1d1f] dark:text-[#f4f4f5] mt-1">
            Services Catalogue &amp; Pricing
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure hair, beard, spa, and beauty packages, session durations, and tier pricing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs transition-all hover:scale-[1.01]"
        >
          <span>+</span>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const cat = DEMO_CATEGORIES.find((c) => c.id === service.category_id);
          return (
            <div
              key={service.id}
              className={`rf-card bg-white dark:bg-[#161719] border rounded-2xl p-5 space-y-3 shadow-xs hover:border-black/[0.14] dark:hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200 ${
                service.is_active
                  ? "border-black/[0.08] dark:border-white/[0.08]"
                  : "border-black/[0.04] dark:border-white/[0.04] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-[510] text-neutral-900 dark:text-white">{service.name}</h3>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded-md font-mono">
                      {service.duration_minutes}m
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase mt-0.5 block">
                    {cat?.icon} {cat?.name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-[510] font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-xs">
                <span className="capitalize text-neutral-500 dark:text-neutral-400">
                  Target: <strong className="text-neutral-900 dark:text-white">{service.gender_applicable}</strong>
                </span>

                <button
                  onClick={() => toggleStatus(service.id)}
                  className={`px-3 py-1 rounded-lg font-[510] text-[11px] transition-all shadow-xs ${
                    service.is_active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold"
                      : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/[0.1]"
                  }`}
                >
                  {service.is_active ? "Active" : "Disabled"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
              <h3 className="text-base font-[510] text-neutral-900 dark:text-white">Add New Salon Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balayage Highlights"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Category</label>
                  <select
                    aria-label="Category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                  >
                    {DEMO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Gender Suitability</label>
                  <select
                    aria-label="Gender Suitability"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                  >
                    <option value="all">All / Unisex</option>
                    <option value="male">Gents Only</option>
                    <option value="female">Ladies Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Duration (Mins) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 px-3 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Service description and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-[#18191c] border border-black/[0.08] dark:border-white/[0.1] rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-neutral-100 dark:bg-white/[0.06] hover:bg-neutral-200 dark:hover:bg-white/[0.1] text-neutral-700 dark:text-neutral-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-[510] rounded-xl shadow-xs"
                >
                  Save Service ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
