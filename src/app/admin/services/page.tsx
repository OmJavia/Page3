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
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Services Catalogue Management</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure hair, beard, spa, and beauty packages, durations, and pricing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-amber-500/20"
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
              className={`bg-zinc-900 border rounded-2xl p-5 space-y-3 transition-all ${
                service.is_active ? "border-zinc-800" : "border-zinc-800/40 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{service.name}</h3>
                    <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md font-mono">
                      {service.duration_minutes}m
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold uppercase mt-0.5 block">
                    {cat?.icon} {cat?.name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-white">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                <span className="capitalize text-zinc-400">
                  Target: <strong className="text-zinc-200">{service.gender_applicable}</strong>
                </span>

                <button
                  onClick={() => toggleStatus(service.id)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    service.is_active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Salon Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balayage Highlights"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    {DEMO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Gender Suitability</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All / Unisex</option>
                    <option value="male">Gents Only</option>
                    <option value="female">Ladies Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the service steps and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl shadow-md"
                >
                  Save Service ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
