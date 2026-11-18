import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

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
            <Link href="/payment" className="text-xs text-neutral-600 hover:text-neutral-900 font-medium px-2.5 py-1 rounded-xl border border-black/[0.08] bg-neutral-50 hover:bg-neutral-100 transition-colors">
              💳 UPI Pay
            </Link>
            <Link href="/admin">
              <Button variant="rightfit" size="sm" className="text-xs h-8 px-3">
                Owner Portal
              </Button>
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

        {/* Action Buttons using Rightfit.so Button Specs */}
        <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
          {/* Rightfit Primary Dark Button */}
          <Link href="/book" className="w-full">
            <Button variant="default" size="lg" className="w-full h-11 text-sm font-semibold">
              Book Appointment Online →
            </Button>
          </Link>

          {/* Rightfit Light White Button (The exact requested component) */}
          <Link href="/payment" className="w-full">
            <Button variant="rightfit" size="lg" className="w-full h-11 text-sm">
              <span className="text-xs">🇮🇳</span> Quick UPI & Card Payment
            </Button>
          </Link>

          <a href={`tel:${SALON_INFO.phone}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full h-9 text-xs text-neutral-600">
              Call Salon (+91 {SALON_INFO.phone})
            </Button>
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
                  <Button variant="rightfit" size="sm" className="h-8 px-3 text-xs font-semibold">
                    Book
                  </Button>
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
          <Button variant="rightfit" className="w-full h-11 text-xs justify-center gap-2 text-neutral-800">
            <span className="text-base">💬</span> Instant WhatsApp Concierge (+91 {SALON_INFO.phone})
          </Button>
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
          <Button variant="outline" className="w-full h-10 text-xs">
            📍 Open in Google Maps
          </Button>
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
