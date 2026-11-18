import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { DEMO_SERVICES } from "@/lib/mock-data";
import { VideoGallery } from "@/components/video-gallery";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] transition-colors duration-200">
      {/* Top Hairline Indicator */}
      <div className="h-[2px] bg-neutral-900 dark:bg-white w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-5 py-3.5 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-[510] tracking-tight text-neutral-900 dark:text-white">{SALON_INFO.name}</h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-medium">
              Luxury Hair &amp; Grooming
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <ThemeToggle size="sm" />

            <a
              href={`tel:${SALON_INFO.phone}`}
              className="text-xs text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white font-semibold px-2.5 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-xs">📞</span>
              <span>{SALON_INFO.phone}</span>
            </a>
            <Link href="/admin">
              <button
                type="button"
                tabIndex={0}
                data-slot="button"
                className="inline-flex shrink-0 transform-gpu items-center justify-center gap-1.5 rounded-xl text-xs font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] dark:[--foreground:#f4f4f5] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-8 px-3"
              >
                <span className="chroma-text-out chroma-text-out-animate">Staff</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Tailored for First-Time Clients */}
      <section className="px-5 pt-8 pb-8 max-w-md mx-auto text-center">
        {/* Open Status & Rating Pill */}
        <div className="inline-flex items-center gap-2 border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] rounded-full px-3.5 py-1 mb-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Open Today • 10 AM – 8 PM</span>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">4.9 ★ Google</span>
        </div>

        <h2 className="text-3xl font-[510] tracking-[-0.025em] text-neutral-950 dark:text-white mb-3 leading-tight">
          Precision styling. <br />
          <span className="text-neutral-500 dark:text-neutral-400">Book your first visit.</span>
        </h2>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
          First time here? Pick your service, choose an expert stylist, and lock in your slot in 60 seconds with zero wait.
        </p>

        {/* PRIMARY CALL-TO-ACTION: Rightfit.so Authentic Chroma Button */}
        <div className="space-y-3 max-w-xs mx-auto">
          <Link href="/book" className="block w-full">
            <button
              type="button"
              tabIndex={0}
              data-slot="button"
              className="inline-flex shrink-0 transform-gpu items-center justify-center gap-2 rounded-2xl text-sm font-[510] tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:ring-neutral-400/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 chroma-text-animate-parent border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] dark:[--foreground:#f4f4f5] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-11 px-6 py-2.5 has-[>svg]:px-4 w-full"
            >
              <span className="chroma-text-out chroma-text-out-animate font-bold">Book Your Appointment</span>
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

          {/* Secondary Quick Contact */}
          <div className="flex gap-2">
            <a
              href={`tel:${SALON_INFO.phone}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
            >
              <span>📞</span>
              <span>Call {SALON_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${SALON_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Value Pillars for New Clients */}
        <div className="grid grid-cols-3 gap-2 mt-7 text-left">
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">⚡</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Zero Waiting</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Guaranteed reserved slot</div>
          </div>
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">✂️</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Master Artists</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">10+ yrs expert styling</div>
          </div>
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">🔖</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">Style Memory</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">We remember your cut</div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE WORK GALLERY WITH CLICK-TO-PLAY VIDEOS */}
      <section className="py-10 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02]">
        <VideoGallery />
      </section>

      {/* SECTION 2: 3-ROW CONTINUOUS MOVING REVIEWS TICKER */}
      <ReviewsMarquee />

      {/* SECTION 3: POPULAR SERVICES QUICK BOOK */}
      <section className="px-5 py-6 max-w-md mx-auto border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Menu Highlights
            </span>
            <h3 className="text-lg font-[510] tracking-tight text-neutral-950 dark:text-white mt-0.5">
              Popular Services
            </h3>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
          >
            Full Menu →
          </Link>
        </div>

        <div className="space-y-2.5">
          {DEMO_SERVICES.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="rf-card p-3.5 flex items-center justify-between bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08]"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-neutral-900 dark:text-white text-xs tracking-tight truncate">
                    {service.name}
                  </h4>
                  <span className="text-[9px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.08] px-1.5 py-0.2 rounded font-mono">
                    {service.duration_minutes}m
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{service.description}</p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-bold text-xs text-neutral-900 dark:text-white">₹{service.price}</span>
                <Link href={`/book?service=${service.id}`}>
                  <button
                    type="button"
                    tabIndex={0}
                    data-slot="button"
                    className="inline-flex shrink-0 transform-gpu items-center justify-center gap-1 rounded-xl text-xs font-semibold transition-all duration-200 outline-none border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-2xs hover:shadow-xs [--foreground:#1c1d1f] dark:[--foreground:#f4f4f5] h-8 px-3"
                  >
                    <span className="chroma-text-out chroma-text-out-animate">Book</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LOCATION & CONTACT WITH PHONE: 9111198911 */}
      <section className="px-5 py-6 max-w-md mx-auto border-t border-black/[0.06] dark:border-white/[0.08]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Find Us
        </span>
        <h3 className="text-lg font-[510] tracking-tight text-neutral-950 dark:text-white mt-0.5 mb-3">
          Salon Location &amp; Hours
        </h3>

        <div className="rf-card p-4 space-y-3 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] text-xs">
          <div>
            <p className="font-bold text-neutral-900 dark:text-white">{SALON_INFO.name}</p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mt-0.5">{SALON_INFO.address}</p>
          </div>

          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Direct Contact:</span>
            <a
              href={`tel:${SALON_INFO.phone}`}
              className="font-bold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
            >
              <span>📞</span> +91 {SALON_INFO.phone}
            </a>
          </div>

          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 space-y-1">
            <div className="flex justify-between">
              <span>Mon – Fri:</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">10:00 AM – 08:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sat – Sun:</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">09:00 AM – 09:00 PM</span>
            </div>
          </div>
        </div>

        <a
          href={SALON_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3"
        >
          <button
            type="button"
            className="w-full h-10 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors shadow-2xs"
          >
            📍 Open Directions in Google Maps
          </button>
        </a>
      </section>

      {/* Bottom Sticky Booking CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] p-3 z-40 transition-colors duration-200">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-white">Ready to transform?</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">Slots open for today</div>
          </div>
          <Link href="/book" className="flex-1 max-w-[200px]">
            <button
              type="button"
              tabIndex={0}
              data-slot="button"
              className="inline-flex shrink-0 transform-gpu items-center justify-center gap-1.5 rounded-2xl text-xs font-bold tracking-[-0.011em] whitespace-nowrap transition-all duration-200 outline-none border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.05)] [--foreground:#1c1d1f] dark:[--foreground:#f4f4f5] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08),0_8px_20px_-4px_rgba(0,0,0,0.08)] h-10 px-4 w-full chroma-text-animate-parent"
            >
              <span className="chroma-text-out chroma-text-out-animate">Book Appointment</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
