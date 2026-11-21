"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

export interface Translations {
  // Navigation & General
  brandTitle: string;
  brandTagline: string;
  openToday: string;
  googleRating: string;
  staffLogin: string;
  bookNow: string;
  exploreServices: string;
  callUs: string;
  whatsapp: string;
  directions: string;
  dewasLocation: string;
  whyChooseUs: string;
  workGallery: string;
  verifiedReviews: string;
  specialOffers: string;

  // Hero & Offer
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  firstTimeOfferBadge: string;
  firstTimeOfferText: string;
  claimOffer: string;

  // Booking Flow
  stepServices: string;
  stepStylist: string;
  stepSlot: string;
  stepDetails: string;
  stepConfirmation: string;
  chooseServicesSubtitle: string;
  allServices: string;
  hairServices: string;
  beardShave: string;
  hairColor: string;
  totalPrice: string;
  selectStylistBtn: string;
  anyStylist: string;
  anyStylistDesc: string;
  availableSlots: string;
  selectSlotBtn: string;
  clientDetails: string;
  fullName: string;
  mobileNumber: string;
  enterOtp: string;
  verifyOtp: string;
  confirmBookingBtn: string;
  rebookLastTitle: string;
  rebookLastBtn: string;
  promoPlaceholder: string;
  applyPromo: string;
  promoApplied: string;
  // Reviews & Portfolio
  reviewsHeading: string;
  reviewsSubtitle: string;
  shareExperience: string;
  viewOnGoogle: string;
  portfolioHeading: string;
  portfolioSubtitle: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: "Page 3 – The Family Salon",
    brandTagline: "Where Style Meets Excellence • Dewas",
    openToday: "Open Today • 10:00 AM – 8:30 PM",
    googleRating: "4.9 ★ Rated on Google",
    staffLogin: "Staff",
    bookNow: "Book Appointment",
    exploreServices: "Explore Services",
    callUs: "Call 9111198911",
    whatsapp: "WhatsApp",
    directions: "Get Directions on Google Maps",
    dewasLocation: "Dewas, Madhya Pradesh",
    whyChooseUs: "Why Choose Page 3?",
    workGallery: "Our Work Gallery",
    verifiedReviews: "Verified Google Reviews",
    specialOffers: "Exclusive Offers",

    reviewsHeading: "Loved by Dewas Clients",
    reviewsSubtitle: "Genuine feedback curated from salon visits and Google Business reviews in Dewas.",
    shareExperience: "Visited Page 3? Share Your Experience",
    viewOnGoogle: "View on Google Maps",
    portfolioHeading: "Page 3 Style Lookbook & Inspirations",
    portfolioSubtitle: "Explore haircut silhouettes, dimensional colouring, and grooming styles offered at Page 3 Dewas.",

    heroTitle: "Your Style. Your Confidence.",
    heroSubtitle: "Your Page 3.",
    heroDescription:
      "Premium grooming, expert styling and personalised care. Your perfect look starts here in Dewas.",
    firstTimeOfferBadge: "FIRST-TIME OFFER",
    firstTimeOfferText: "Enjoy 20% off your first appointment with code FIRST20",
    claimOffer: "Claim 20% Off",

    stepServices: "Services",
    stepStylist: "Stylist",
    stepSlot: "Date & Slot",
    stepDetails: "Details",
    stepConfirmation: "Confirmed",
    chooseServicesSubtitle: "Choose one or multiple services for your styling session.",
    allServices: "All Services",
    hairServices: "Hair Services",
    beardShave: "Beard & Shave",
    hairColor: "Hair Color",
    totalPrice: "Total",
    selectStylistBtn: "Select Stylist →",
    anyStylist: "Any Available Stylist",
    anyStylistDesc: "Fastest appointment time with any master on duty",
    availableSlots: "Select Appointment Time",
    selectSlotBtn: "Select Date & Time →",
    clientDetails: "Client Details",
    fullName: "Full Name",
    mobileNumber: "10-Digit Mobile Number",
    enterOtp: "Enter 4-Digit Verification Code",
    verifyOtp: "Verify Code",
    confirmBookingBtn: "Confirm & Lock Appointment →",
    rebookLastTitle: "Welcome back! Rebook your previous service in 1 click:",
    rebookLastBtn: "⚡ Rebook in 1 Click",
    promoPlaceholder: "Enter promo code (e.g. FIRST20)",
    applyPromo: "Apply",
    promoApplied: "20% First-Time Discount Applied!",
  },
  hi: {
    brandTitle: "पेज 3 – द फैमिली सैलून",
    brandTagline: "स्टाइल और उत्कृष्टता का संगम • देवास",
    openToday: "आज खुला है • सुबह 10:00 से रात 8:30",
    googleRating: "4.9 ★ गूगल पर रेटेड",
    staffLogin: "स्टाफ लॉगिन",
    bookNow: "अपॉइंटमेंट बुक करें",
    exploreServices: "सेवाएं देखें",
    callUs: "कॉल करें 9111198911",
    whatsapp: "व्हाट्सएप",
    directions: "गूगल मैप्स पर रास्ता देखें",
    dewasLocation: "देवास, मध्य प्रदेश",
    whyChooseUs: "पेज 3 क्यों चुनें?",
    workGallery: "हमारा वर्क गैलरी",
    verifiedReviews: "सत्यापित गूगल समीक्षाएं",
    specialOffers: "विशेष ऑफर्स",

    reviewsHeading: "देवास के ग्राहकों का भरोसा",
    reviewsSubtitle: "देवास में सैलून विज़िट और गूगल बिजनेस समीक्षाओं से एकत्रित वास्तविक प्रतिक्रिया।",
    shareExperience: "पेज 3 पर आए थे? अपना अनुभव साझा करें",
    viewOnGoogle: "गूगल मैप्स पर देखें",
    portfolioHeading: "पेज 3 स्टाइल लुकबुक और शैलियां",
    portfolioSubtitle: "पेज 3 देवास में उपलब्ध हेयरकट, कलरिंग और ग्रूमिंग शैलियों की झलक देखें।",

    heroTitle: "आपका स्टाइल। आपका आत्मविश्वास।",
    heroSubtitle: "आपका पेज 3।",
    heroDescription:
      "प्रीमियम ग्रूमिंग, एक्सपर्ट स्टाइलिंग और पर्सनलाइज्ड केयर। आपका परफेक्ट लुक यहीं से देवास में शुरू होता है।",
    firstTimeOfferBadge: "पहली विज़िट ऑफर",
    firstTimeOfferText: "कोड FIRST20 के साथ अपनी पहली सर्विस पर फ्लैट 20% की छूट पाएं",
    claimOffer: "20% छूट पाएं",

    stepServices: "सेवाएं",
    stepStylist: "स्टाइलिस्ट",
    stepSlot: "तारीख और समय",
    stepDetails: "विवरण",
    stepConfirmation: "पुष्टि",
    chooseServicesSubtitle: "अपने स्टाइलिंग सेशन के लिए एक या अधिक सेवाएं चुनें।",
    allServices: "सभी सेवाएं",
    hairServices: "हेयर कट व केयर",
    beardShave: "दाढ़ी और शेव",
    hairColor: "हेयर कलर",
    totalPrice: "कुल राशि",
    selectStylistBtn: "स्टाइलिस्ट चुनें →",
    anyStylist: "कोई भी उपलब्ध स्टाइलिस्ट",
    anyStylistDesc: "ड्यूटी पर मौजूद किसी भी मास्टर स्टाइलिस्ट के साथ सबसे तेज़ समय",
    availableSlots: "अपॉइंटमेंट का समय चुनें",
    selectSlotBtn: "तारीख और समय चुनें →",
    clientDetails: "ग्राहक का विवरण",
    fullName: "पूरा नाम",
    mobileNumber: "10 अंकों का मोबाइल नंबर",
    enterOtp: "4 अंकों का वेरिफिकेशन कोड दर्ज करें",
    verifyOtp: "कोड सत्यापित करें",
    confirmBookingBtn: "अपॉइंटमेंट सुरक्षित और लॉक करें →",
    rebookLastTitle: "वापसी पर स्वागत है! अपनी पिछली सेवा 1-क्लिक में दोबारा बुक करें:",
    rebookLastBtn: "⚡ 1-क्लिक में रीबुक करें",
    promoPlaceholder: "प्रोमो कोड दर्ज करें (उदा. FIRST20)",
    applyPromo: "लागू करें",
    promoApplied: "20% प्रथम विज़िट छूट लागू!",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: TRANSLATIONS.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramLang = urlParams.get("lang") as Language | null;
      if (paramLang === "en" || paramLang === "hi") {
        setLanguageState(paramLang);
        localStorage.setItem("p3_language", paramLang);
        return;
      }
      const stored = localStorage.getItem("p3_language") as Language | null;
      if (stored === "en" || stored === "hi") {
        setLanguageState(stored);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("p3_language", lang);
    } catch {}
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
