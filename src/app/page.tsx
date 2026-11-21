"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SALON_INFO } from "@/lib/constants";
import { DEMO_SERVICES } from "@/lib/mock-data";
import { VideoGallery } from "@/components/video-gallery";
import { ReviewsMarquee } from "@/components/reviews-marquee";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/language-context";
import { getStoredAppointments, getStoredCustomers, STORE_PHONE } from "@/lib/appointments-store";
import { Appointment, Customer } from "@/lib/types";

export default function HomePage() {
  const { t } = useLanguage();

  // Returning customer state
  const [returningCustomer, setReturningCustomer] = useState<Customer | null>(null);
  const [lastAppointment, setLastAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedPhone = localStorage.getItem("p3_client_phone");
      const appointments = getStoredAppointments();
      const customers = getStoredCustomers();

      if (storedPhone) {
        const cleanPhone = storedPhone.replace(/\D/g, "").slice(-10);
        const matchedCust = customers.find(
          (c) => c.phone.replace(/\D/g, "").slice(-10) === cleanPhone
        );
        if (matchedCust) setReturningCustomer(matchedCust);

        const matchedApt = appointments.find(
          (a) => a.customer?.phone?.replace(/\D/g, "").slice(-10) === cleanPhone
        );
        if (matchedApt) setLastAppointment(matchedApt);
      }
    } catch (e) {
      console.error("Error retrieving returning customer", e);
    }
  }, []);

  const whatsappGeneralUrl = `https://wa.me/${SALON_INFO.whatsapp}?text=${encodeURIComponent(
    "Hi Page 3 Salon Dewas, I'd like to book an appointment / ask a question."
  )}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] dark:bg-[#0c0d0e] text-[#1c1d1f] dark:text-[#f4f4f5] transition-colors duration-200 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Top Hairline Indicator */}
      <div className="h-[2px] bg-neutral-900 dark:bg-white w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] px-3.5 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Location badge */}
          <div className="min-w-0">
            <Link href="/" className="group block">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-[510] tracking-tight text-neutral-900 dark:text-white group-hover:opacity-80 transition-opacity truncate">
                  <span className="font-bold">Page 3</span>
                  <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-1 hidden xs:inline sm:inline">{t.familySalonSubtitle}</span>
                </h1>
                <span className="inline-flex text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300">
                  Dewas
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span>📍 {t.dewasLocation}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{t.familySalonSubtitle}</span>
              </p>
            </Link>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Theme Toggle Button */}
            <ThemeToggle size="sm" />

            {/* Client Portal */}
            <Link href="/profile" className="inline-flex">
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl text-xs font-[510] tracking-[-0.011em] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-2xs hover:bg-neutral-50 dark:hover:bg-white/[0.06] h-8 px-2 sm:px-2.5 transition-all"
                title="Client Portal & Appointments"
              >
                <span>👤</span>
                <span className="hidden sm:inline">{t.profile}</span>
              </button>
            </Link>

            {/* Staff / Admin Login (Full button on desktop, hidden on small mobile) */}
            <Link href="/admin" className="hidden sm:inline-flex">
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl text-xs font-[510] tracking-[-0.011em] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-[#1c1d1f] dark:text-[#f4f4f5] shadow-2xs hover:bg-neutral-50 dark:hover:bg-white/[0.06] h-8 px-2.5 transition-all chroma-text-animate-parent"
                title="Management Console"
              >
                <span className="chroma-text-out chroma-text-out-animate">{t.staffLogin}</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* RETURNING CUSTOMER PERSONALIZED MEMORY BANNER */}
      {returningCustomer && (
        <div className="px-4 sm:px-6 pt-3 max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-[#18191c] dark:to-[#121214] text-white p-4 rounded-2xl border border-black/[0.1] dark:border-white/[0.12] shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md inline-block mb-1">
                  {t.welcomeBack}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {t.welcomeBackUser}, {returningCustomer.full_name}!
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {lastAppointment && lastAppointment.services && lastAppointment.services.length > 0
                    ? `${t.lastVisitWas} ${lastAppointment.services[0].service?.name || "Styling"}`
                    : t.readyNextLook}
                </p>
              </div>
              <span className="text-xs bg-amber-400/20 text-amber-300 font-mono font-bold px-2 py-1 rounded-lg">
                ★ {returningCustomer.loyalty_points || 50} {t.loyaltyPointsLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <Link
                href={`/book${
                  lastAppointment && lastAppointment.services && lastAppointment.services[0]
                    ? `?service=${lastAppointment.services[0].service_id}`
                    : ""
                }`}
                className="flex-1 bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs py-2 px-3 rounded-xl text-center transition-all shadow-xs"
              >
                {t.bookSameService}
              </Link>
              <Link
                href="/services"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium text-xs py-2 px-3 rounded-xl text-center border border-white/15 transition-all"
              >
                {t.exploreMenu}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FIRST-TIME CUSTOMER OFFER BANNER - Only shown to new / anonymous guests */}
      {!returningCustomer && (
        <div className="px-4 sm:px-6 pt-3 max-w-lg mx-auto">
          <div className="bg-neutral-900 dark:bg-white/[0.08] text-white p-3.5 rounded-2xl border border-black/[0.1] dark:border-white/[0.12] shadow-sm flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md">
                  {t.firstTimeOfferBadge}
                </span>
                <span className="text-xs font-bold text-amber-300">{t.flat20Off}</span>
              </div>
              <p className="text-xs text-neutral-200 dark:text-neutral-300 font-medium mt-1 leading-snug">
                {t.firstTimeOfferText}
              </p>
            </div>
            <Link
              href="/book?promo=FIRST20"
              className="shrink-0 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              {t.claimOffer} →
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION: World-Class Mobile-First */}
      <section className="px-4 sm:px-6 pt-6 pb-8 max-w-lg mx-auto text-center">
        {/* Open Status & Dewas Location Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161719] rounded-full px-4 py-1.5 mb-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            {t.openToday}
          </span>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">
            {t.googleRating}
          </span>
        </div>

        {/* Master Headline: Your Style. Your Confidence. Your Page 3. */}
        <h2 className="text-3xl sm:text-4xl font-[510] tracking-[-0.03em] text-neutral-950 dark:text-white mb-3 leading-[1.15]">
          {t.heroTitle} <br />
          <span className="text-neutral-500 dark:text-neutral-400">{t.heroSubtitle}</span>
        </h2>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
          {t.heroDescription}
        </p>

        {/* PRIMARY CALL-TO-ACTIONS WITH RIGHTFIT.SO CHROMA PRISM HOVER */}
        <div className="space-y-3 max-w-xs mx-auto">
          <Link href="/book" className="block w-full">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl text-sm font-bold tracking-[-0.011em] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.15)] h-12 px-6 py-2.5 w-full transition-all cursor-pointer chroma-text-animate-parent"
            >
              <span className="chroma-text-out chroma-text-out-animate">
                {t.bookNow}
              </span>
              <span className="text-sm tabler-icon-arrow-right transition-transform">→</span>
            </button>
          </Link>

          <Link href="/services" className="block w-full">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl text-xs font-semibold border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/[0.06] h-10 px-4 w-full transition-colors shadow-2xs cursor-pointer chroma-text-animate-parent"
            >
              <span className="chroma-text-out chroma-text-out-animate">{t.exploreServicesAndPricing}</span>
            </button>
          </Link>

          {/* Direct Quick Contact Buttons */}
          <div className="flex gap-2 pt-1">
            <a
              href={`tel:${SALON_INFO.phone}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
            >
              <span>📞</span>
              <span>{t.callUs}</span>
            </a>

            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs"
            >
              <span>💬</span>
              <span>{t.whatsapp}</span>
            </a>
          </div>
        </div>

        {/* Short Trust Statement */}
        <div className="mt-5 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-center gap-1.5">
          <span>{t.reservedSlotBadge}</span>
          <span>•</span>
          <span>{t.sterilizedToolsBadge}</span>
          <span>•</span>
          <span>{t.dewasLocation}</span>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-6 text-left">
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">⚡</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">{t.reservedSeatTitle}</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{t.reservedSeatDesc}</div>
          </div>
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">✂️</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">{t.masterArtistsTitle}</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{t.masterArtistsDesc}</div>
          </div>
          <div className="bg-white dark:bg-[#161719] p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
            <span className="text-base">🔖</span>
            <div className="text-xs font-bold text-neutral-900 dark:text-white mt-1">{t.styleMemoryTitle}</div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{t.styleMemoryDesc}</div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE PAGE 3? (Master Differentiators Section) */}
      <section className="px-4 sm:px-6 py-8 max-w-lg mx-auto border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] px-3 py-1 rounded-full shadow-2xs">
            {t.thePage3Standard}
          </span>
          <h3 className="text-xl font-[510] tracking-tight text-neutral-950 dark:text-white mt-2">
            {t.whyDewasChooses}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t.whyDewasSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/[0.08] flex items-center justify-center text-sm mb-2.5">
              👨‍👩‍👧‍👦
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.familySalonTitle}</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {t.familySalonDesc}
            </p>
          </div>

          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/[0.08] flex items-center justify-center text-sm mb-2.5">
              🧴
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.hygieneTitle}</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {t.hygieneDesc}
            </p>
          </div>

          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/[0.08] flex items-center justify-center text-sm mb-2.5">
              💎
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.transparentPricingTitle}</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {t.transparentPricingDesc}
            </p>
          </div>

          <div className="rf-card p-4 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-white/[0.08] flex items-center justify-center text-sm mb-2.5">
              📱
            </div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{t.instantBookingTitle}</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {t.instantBookingDesc}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE WORK GALLERY WITH CLICK-TO-PLAY VIDEOS */}
      <section className="py-10 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02]">
        <VideoGallery />
      </section>

      {/* SECTION 2: VERIFIED REVIEWS SHOWCASE (Mobile Swipeable Carousel & Grid) */}
      <section className="border-t border-black/[0.06] dark:border-white/[0.08]">
        <ReviewsMarquee />
      </section>

      {/* SECTION 3: POPULAR SERVICES QUICK BOOK */}
      <section className="px-4 sm:px-6 py-8 max-w-lg mx-auto border-t border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {t.menuHighlights}
            </span>
            <h3 className="text-lg font-[510] tracking-tight text-neutral-950 dark:text-white mt-0.5">
              {t.popularServicesDewas}
            </h3>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
          >
            {t.fullMenu}
          </Link>
        </div>

        <div className="space-y-2.5">
          {DEMO_SERVICES.slice(0, 5).map((service) => (
            <div
              key={service.id}
              className="rf-card p-3.5 flex items-center justify-between bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08]"
            >
              <Link href={`/services/${service.id}`} className="flex-1 min-w-0 pr-3 block group">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-neutral-900 dark:text-white text-xs tracking-tight truncate group-hover:underline">
                    {service.name}
                  </h4>
                  <span className="text-[9px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/[0.08] px-1.5 py-0.2 rounded font-mono">
                    {service.duration_minutes} {t.minuteUnit}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{service.description}</p>
              </Link>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-bold text-xs text-neutral-900 dark:text-white">₹{service.price}</span>
                <Link href={`/book?service=${service.id}`}>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-black dark:hover:bg-neutral-100 shadow-2xs h-8 px-3 transition-all cursor-pointer chroma-text-animate-parent"
                  >
                    <span className="chroma-text-out chroma-text-out-animate">{t.bookNow.split(" ")[0] || "Book"}</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LOCATION & CONTACT IN DEWAS, MP */}
      <section className="px-4 sm:px-6 py-8 max-w-lg mx-auto border-t border-black/[0.06] dark:border-white/[0.08]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {t.findUsDewas}
        </span>
        <h3 className="text-lg font-[510] tracking-tight text-neutral-950 dark:text-white mt-0.5 mb-3">
          {t.locationAndHours}
        </h3>

        <div className="rf-card p-4 space-y-3 bg-white dark:bg-[#161719] border border-black/[0.08] dark:border-white/[0.08] text-xs rounded-2xl">
          <div>
            <p className="font-bold text-neutral-900 dark:text-white text-sm">{SALON_INFO.name}</p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mt-0.5">{SALON_INFO.fullAddress}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <span>🚗</span> {t.customerParkingNotice}
            </p>
          </div>

          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">{t.directPhone}</span>
            <a
              href={`tel:${SALON_INFO.phone}`}
              className="font-bold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
            >
              <span>📞</span> +91 {SALON_INFO.phone}
            </a>
          </div>

          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-neutral-500 dark:text-neutral-400 space-y-1">
            <div className="flex justify-between">
              <span>{t.monToFri}</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">10:00 AM – 08:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>{t.satToSun}</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">09:00 AM – 09:00 PM</span>
            </div>
          </div>
        </div>

        <a
          href={SALON_INFO.googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3"
        >
          <button
            type="button"
            className="w-full h-11 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <span>🗺️</span>
            <span>{t.directions}</span>
          </button>
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] py-8 px-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        <p className="font-semibold text-neutral-700 dark:text-neutral-300">
          {SALON_INFO.name} • {t.dewasLocation}
        </p>
        <p className="mt-1 text-[11px]">
          © {new Date().getFullYear()} {SALON_INFO.name}. {t.allRightsReserved}
        </p>
      </footer>

      {/* BOTTOM STICKY MOBILE ACTION BAR (Book Now + WhatsApp + Call) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-t border-black/[0.06] dark:border-white/[0.08] p-3 z-40 transition-colors duration-200">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
          {/* One-tap Phone Call */}
          <a
            href={`tel:${SALON_INFO.phone}`}
            className="h-11 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-neutral-900 dark:text-white flex items-center justify-center text-sm font-semibold transition-colors shrink-0"
            title="Call Salon"
          >
            <span>📞</span>
          </a>

          {/* One-tap WhatsApp */}
          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#18191c] hover:bg-neutral-50 dark:hover:bg-white/[0.06] text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-semibold transition-colors shrink-0"
            title="Chat on WhatsApp"
          >
            <span>💬</span>
          </a>

          {/* Primary Booking CTA */}
          <Link href="/book" className="flex-1">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl text-xs font-bold tracking-[-0.011em] border border-black/[0.08] dark:border-white/[0.12] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm hover:opacity-95 h-11 px-4 w-full transition-all"
            >
              <span>{t.bookNow}</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Spacing to ensure sticky bar never overlaps content */}
      <div className="h-20" />
    </div>
  );
}
