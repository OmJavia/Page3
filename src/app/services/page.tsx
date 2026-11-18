"use client";
import { useState } from "react";
import Link from "next/link";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [gender, setGender] = useState<"all" | "male" | "female">("all");

  const filtered = DEMO_SERVICES.filter((s) => {
    const catMatch = activeCategory === "all" || s.category_id === activeCategory;
    const genderMatch = gender === "all" || s.gender_applicable === "all" || s.gender_applicable === gender;
    return catMatch && genderMatch && s.is_active;
  });

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Header */}
      <div className="bg-zinc-900 text-white px-5 pt-12 pb-6 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-zinc-400 hover:text-white">←</Link>
          <h1 className="text-lg font-bold">Services</h1>
        </div>
        {/* Gender Filter */}
        <div className="flex gap-2 mb-4">
          {(["all", "male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                gender === g ? "bg-amber-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {g === "all" ? "All" : g === "male" ? "👨 Gents" : "👩 Ladies"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              activeCategory === "all" ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-600"
            }`}
          >
            All Services
          </button>
          {DEMO_CATEGORIES.filter((c) => c.is_active).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-600"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filtered.map((service) => (
            <div key={service.id} className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-900">{service.name}</h3>
                    <span className="text-xs text-zinc-400 bg-zinc-50 border px-2 py-0.5 rounded-full whitespace-nowrap">
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">{service.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-zinc-900">₹{service.price}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/book?service=${service.id}`}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-lg text-center transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">✂️</div>
            <p className="text-zinc-500">No services found</p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 safe-area pb-safe z-50">
        <div className="grid grid-cols-4 py-2">
          {[
            { href: "/", label: "Home", icon: "🏠" },
            { href: "/services", label: "Services", icon: "✂️" },
            { href: "/book", label: "Book", icon: "📅", highlight: true },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-2">
              {item.highlight ? (
                <span className="bg-amber-500 text-white text-base w-10 h-10 rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-amber-500/30 border-2 border-white">
                  {item.icon}
                </span>
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}
              <span className={`text-[10px] font-medium ${item.highlight ? "text-amber-600" : "text-zinc-500"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
