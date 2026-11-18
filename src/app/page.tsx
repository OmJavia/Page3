import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { DEMO_SERVICES, DEMO_CATEGORIES } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white overflow-hidden">
        {/* Decorative gold accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
        
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">{SALON_INFO.name}</h1>
            <p className="text-xs text-amber-400 font-medium tracking-widest uppercase">{SALON_INFO.tagline}</p>
          </div>
          <Link href="/admin" className="text-xs border border-zinc-600 rounded-lg px-3 py-1.5 text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors">
            Owner Login
          </Link>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 px-5 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-300">Open Today · 10 AM – 8 PM</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-3">
            Look Your <span className="text-amber-400">Best</span>
          </h2>
          <p className="text-zinc-400 text-base mb-8 max-w-xs mx-auto leading-relaxed">
            Professional hair styling, color & grooming services. Book your appointment in 60 seconds.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/book" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 rounded-xl text-base transition-colors shadow-lg shadow-amber-500/25">
              Book Appointment
            </Link>
            <a href={`tel:${SALON_INFO.phone}`} className="w-full border border-zinc-600 text-zinc-300 font-medium py-3 rounded-xl text-sm transition-colors hover:border-amber-500 hover:text-amber-400">
              Call Us
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-3 gap-px bg-zinc-700/50 mx-5 mb-8 rounded-xl overflow-hidden">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "10+", label: "Years Exp." },
            { value: "4.9★", label: "Google Rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-800/80 py-4 text-center">
              <div className="text-xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Our Services</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Expert care for every style</p>
          </div>
          <Link href="/book" className="text-sm font-medium text-amber-600 hover:text-amber-700">
            Book Now →
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">
          <button className="flex-shrink-0 bg-zinc-900 text-white text-xs font-medium px-4 py-2 rounded-full">All</button>
          {DEMO_CATEGORIES.map((cat) => (
            <button key={cat.id} className="flex-shrink-0 border border-zinc-200 text-zinc-600 text-xs font-medium px-4 py-2 rounded-full hover:border-amber-400 hover:text-amber-700 transition-colors whitespace-nowrap">
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-3">
          {DEMO_SERVICES.slice(0, 6).map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:border-amber-200 hover:shadow-sm transition-all bg-white">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-zinc-900 text-sm">{service.name}</h3>
                  <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full border">
                    {service.duration_minutes} min
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{service.description}</p>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span className="font-bold text-zinc-900">₹{service.price}</span>
                <Link
                  href={`/book?service=${service.id}`}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Link href="/services" className="block text-center mt-5 text-sm font-medium text-amber-600 hover:text-amber-700">
          View All Services →
        </Link>
      </section>

      {/* CRM Memory Banner */}
      <section className="mx-5 mb-8 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-5 text-white">
        <div className="flex gap-3">
          <div className="text-3xl">🔖</div>
          <div>
            <h3 className="font-bold mb-1">We Remember You</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We keep track of your preferred stylist, favorite services, and style preferences so every visit feels personal.
            </p>
            <Link href="/book" className="mt-3 inline-flex items-center text-xs font-medium text-amber-400 hover:text-amber-300">
              Book Your Next Visit →
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-5 mb-8">
        <a
          href={`https://wa.me/${SALON_INFO.whatsapp}`}
          className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </section>

      {/* Business Info */}
      <section className="px-5 pb-10 border-t border-zinc-100 pt-8">
        <h3 className="font-bold text-zinc-900 mb-4">Visit Us</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-sm font-medium text-zinc-900">Address</p>
              <p className="text-sm text-zinc-500">{SALON_INFO.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📞</span>
            <div>
              <p className="text-sm font-medium text-zinc-900">Phone</p>
              <a href={`tel:${SALON_INFO.phone}`} className="text-sm text-amber-600">{SALON_INFO.phone}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🕐</span>
            <div>
              <p className="text-sm font-medium text-zinc-900">Hours</p>
              <p className="text-sm text-zinc-500">Mon–Fri: 10 AM – 8 PM</p>
              <p className="text-sm text-zinc-500">Sat: 9 AM – 9 PM · Sun: 10 AM – 7 PM</p>
            </div>
          </div>
        </div>
        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full border border-zinc-200 text-zinc-700 font-medium py-3 rounded-xl text-sm hover:border-amber-400 hover:text-amber-700 transition-colors"
        >
          📌 Get Directions on Google Maps
        </a>
      </section>

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
      <div className="h-20" />
    </div>
  );
}
