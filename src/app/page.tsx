import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";
import { Button, ArrowRightIcon } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1c1d1f]">
      {/* Top Hairline Indicator */}
      <div className="h-[2px] bg-neutral-900 w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.06] px-5 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-[510] tracking-tight text-neutral-900">{SALON_INFO.name}</h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
              {SALON_INFO.tagline}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/payment"
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium px-2.5 py-1 rounded-xl border border-black/[0.08] bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              💳 UPI Pay
            </Link>
            <Link href="/admin">
              <button
                type="button"
                tabIndex={0}
                data-slot="button"
                className="inline-flex shrink-0 transform-gpu items-center justify-center gap-1.5 rounded-xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-8 px-3"
              >
                <span className="chroma-text-out chroma-text-out-animate">Owner</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-8 pb-10 max-w-md mx-auto text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 border border-black/[0.08] bg-white rounded-full px-3.5 py-1 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-700">Open Today • 10 AM – 8 PM</span>
        </div>

        <h2 className="text-3xl font-[510] tracking-[-0.025em] text-neutral-950 mb-3 leading-tight">
          Precision styling. <br />
          <span className="text-neutral-500">Effortless care.</span>
        </h2>

        <p className="text-neutral-600 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
          Bespoke hair design, luxury grooming, and automated customer CRM. Experience salon management reimagined.
        </p>

        {/* Action Buttons using the Exact User-Requested Rightfit.so Button Specs */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          {/* 1. Exact User Button: White with Chroma Rainbow Text & Arrow */}
          <Link href="/book" className="w-full">
            <button
              type="button"
              tabIndex={0}
              data-slot="button"
              className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-11 px-6 py-2.5 has-[>svg]:px-4 w-full"
            >
              <span className="chroma-text-out chroma-text-out-animate">Get started</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tabler-icon tabler-icon-arrow-right"
              >
                <path d="M5 12l14 0" />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </svg>
            </button>
          </Link>

          {/* 2. Inverted Black Button with Chroma Text & Arrow */}
          <Link href="/payment" className="w-full">
            <button
              type="button"
              tabIndex={0}
              data-slot="button"
              className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent border border-white/[0.12] bg-black text-white [--foreground:#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.25),0_8px_20px_-4px_rgba(0,0,0,0.35)] hover:border-white/[0.25] h-11 px-6 py-2.5 has-[>svg]:px-4 w-full"
            >
              <span className="chroma-text-out chroma-text-out-animate">Instant UPI & Card Checkout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tabler-icon tabler-icon-arrow-right"
              >
                <path d="M5 12l14 0" />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </svg>
            </button>
          </Link>

          <a href={`tel:${SALON_INFO.phone}`} className="w-full">
            <button
              type="button"
              tabIndex={0}
              data-slot="button"
              className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] bg-transparent text-[#1c1d1f] hover:bg-neutral-100/70 [--foreground:#1c1d1f] h-9 px-4 w-full"
            >
              Call Salon (+91 {SALON_INFO.phone})
            </button>
          </a>
        </div>

        {/* Minimalist Stats Row */}
        <div className="grid grid-cols-3 gap-px bg-neutral-200/80 border border-neutral-200/80 rounded-2xl overflow-hidden mt-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {[
            { value: "500+", label: "Regular Clients" },
            { value: "10+", label: "Years Exp." },
            { value: "4.9★", label: "Google Rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white py-3.5 text-center">
              <div className="text-base font-bold text-neutral-900">{stat.value}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="px-5 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-[510] tracking-tight text-neutral-950">Curated Services</h3>
            <p className="text-xs text-neutral-500">Handcrafted styling by master artists</p>
          </div>
          <Link href="/services" className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
            All Services →
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button className="shrink-0 bg-neutral-900 text-white text-xs font-medium px-3.5 py-1.5 rounded-full shadow-xs">
            All
          </button>
          {DEMO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="shrink-0 border border-black/[0.08] bg-white text-neutral-600 text-xs font-medium px-3.5 py-1.5 rounded-full hover:border-black/[0.2] hover:text-neutral-900 transition-all whitespace-nowrap shadow-2xs"
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Service Cards with Rightfit styling */}
        <div className="grid grid-cols-1 gap-2.5">
          {DEMO_SERVICES.slice(0, 5).map((service) => (
            <div
              key={service.id}
              className="rf-card p-4 flex items-center justify-between group hover:border-black/[0.15] transition-all"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-neutral-900 text-sm tracking-tight">{service.name}</h4>
                  <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md font-mono">
                    {service.duration_minutes}m
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate">{service.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-sm text-neutral-900">₹{service.price}</span>
                <Link href={`/book?service=${service.id}`}>
                  <button
                    type="button"
                    tabIndex={0}
                    data-slot="button"
                    className="inline-flex shrink-0 transform-gpu items-center justify-center gap-1.5 rounded-xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-8 px-3"
                  >
                    <span className="chroma-text-out chroma-text-out-animate">Book</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CRM Customer Memory Section */}
      <section className="px-5 py-4 max-w-md mx-auto">
        <div className="rf-card p-5 bg-[#121212] text-white border-neutral-900">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
              🔖
            </div>
            <div>
              <h4 className="font-[510] text-sm text-white mb-1">Personalized Client Memory</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We remember your previous hair formulas, preferred stylist, visit cadence, and style notes every time you book.
              </p>
              <Link href="/book" className="mt-3 inline-flex items-center text-xs font-semibold text-neutral-200 hover:text-white transition-colors">
                Book with Your Stylist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Concierge */}
      <section className="px-5 py-2 max-w-md mx-auto">
        <a
          href={`https://wa.me/${SALON_INFO.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button
            type="button"
            tabIndex={0}
            data-slot="button"
            className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] bg-white text-[#1c1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-11 px-6 w-full"
          >
            <span className="text-base">💬</span>
            <span className="chroma-text-out chroma-text-out-animate">
              Instant WhatsApp Concierge (+91 {SALON_INFO.phone})
            </span>
          </button>
        </a>
      </section>

      {/* Location & Directions */}
      <section className="px-5 py-6 max-w-md mx-auto border-t border-black/[0.06] mt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Salon Location</h4>
        <div className="space-y-2 text-xs text-neutral-600">
          <p className="font-medium text-neutral-900">{SALON_INFO.name}</p>
          <p className="text-neutral-500 leading-relaxed">{SALON_INFO.address}</p>
          <div className="pt-2 flex gap-4 text-[11px] text-neutral-500">
            <span>Mon–Fri: 10 AM – 8 PM</span>
            <span>Sat–Sun: 9 AM – 9 PM</span>
          </div>
        </div>
        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4"
        >
          <button
            type="button"
            tabIndex={0}
            data-slot="button"
            className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] bg-transparent text-[#1c1d1f] hover:bg-neutral-100/70 [--foreground:#1c1d1f] h-10 px-4 w-full"
          >
            📍 Open in Google Maps
          </button>
        </a>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/[0.06] safe-area pb-safe z-50">
        <div className="max-w-md mx-auto grid grid-cols-4 py-2">
          {[
            { href: "/", label: "Home", icon: "🏠", active: true },
            { href: "/services", label: "Services", icon: "✂️" },
            { href: "/book", label: "Book", icon: "📅", highlight: true },
            { href: "/profile", label: "Profile", icon: "👤" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1 text-center"
            >
              {item.highlight ? (
                <span className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm shadow-[0_2px_8px_rgba(0,0,0,0.2)] -mt-5 border-2 border-white">
                  {item.icon}
                </span>
              ) : (
                <span className="text-base">{item.icon}</span>
              )}
              <span
                className={`text-[10px] font-medium ${
                  item.active ? "text-neutral-950 font-bold" : "text-neutral-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="h-16" />
    </div>
  );
}
