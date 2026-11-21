"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

export interface Translations {
  // Navigation & General Header
  brandTitle: string;
  brandTagline: string;
  familySalonSubtitle: string;
  openToday: string;
  googleRating: string;
  staffLogin: string;
  bookNow: string;
  exploreServices: string;
  exploreServicesAndPricing: string;
  callUs: string;
  whatsapp: string;
  directions: string;
  dewasLocation: string;
  profile: string;
  back: string;
  close: string;
  menu: string;
  fullMenu: string;
  minuteUnit: string;

  // Returning Customer & Offers
  firstTimeOfferBadge: string;
  firstTimeOfferText: string;
  claimOffer: string;
  flat20Off: string;
  welcomeBack: string;
  welcomeBackUser: string;
  lastVisitWas: string;
  readyNextLook: string;
  bookSameService: string;
  exploreMenu: string;
  loyaltyPointsLabel: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  reservedSlotBadge: string;
  sterilizedToolsBadge: string;

  // Value Pillars (3 cards below hero)
  reservedSeatTitle: string;
  reservedSeatDesc: string;
  masterArtistsTitle: string;
  masterArtistsDesc: string;
  styleMemoryTitle: string;
  styleMemoryDesc: string;

  // Why Choose Page 3 (Differentiators)
  thePage3Standard: string;
  whyDewasChooses: string;
  whyDewasSubtitle: string;
  familySalonTitle: string;
  familySalonDesc: string;
  hygieneTitle: string;
  hygieneDesc: string;
  transparentPricingTitle: string;
  transparentPricingDesc: string;
  instantBookingTitle: string;
  instantBookingDesc: string;

  // Gallery & Lookbook
  styleShowcaseBadge: string;
  portfolioHeading: string;
  portfolioSubtitle: string;
  allWorksCat: string;
  mensCutsCat: string;
  womensStylingCat: string;
  beardGroomingCat: string;
  hairColorCat: string;
  treatmentsSpaCat: string;
  styleGuidesCat: string;
  beforeLabel: string;
  afterResultLabel: string;
  tapToViewDetail: string;
  bookServiceAction: string;
  stylistByLabel: string;

  // Reviews Marquee
  reviewsHeading: string;
  reviewsSubtitle: string;
  shareExperience: string;
  viewOnGoogle: string;
  clientReviewBadge: string;
  serviceLabel: string;

  // Menu Highlights on Homepage & Services Page
  menuHighlights: string;
  popularServicesDewas: string;
  servicesMenuTitle: string;
  allGenders: string;
  gents: string;
  ladies: string;
  allServicesTab: string;
  noServicesFound: string;

  // Location & Footer
  findUsDewas: string;
  locationAndHours: string;
  customerParkingNotice: string;
  directPhone: string;
  monToFri: string;
  satToSun: string;
  allRightsReserved: string;
  familyGroomingCare: string;

  // Booking Flow Steps & Elements
  stepServices: string;
  stepStylist: string;
  stepSlot: string;
  stepDetails: string;
  stepPayment: string;
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
  choosePaymentMethod: string;
  payAtCounter: string;
  payAtCounterDesc: string;
  payOnlineUpi: string;
  payOnlineUpiDesc: string;
  cardPayment: string;
  cardPaymentDesc: string;
  confirmAndPay: string;
  appointmentConfirmedTitle: string;
  taxInvoiceTitle: string;
  downloadPrintBill: string;
  rescheduleAction: string;
  cancelAction: string;

  // Additional Booking Wizard & Invoice Localizations
  selectServicesTitle: string;
  selectStylistTitle: string;
  selectStylistSubtitle: string;
  chooseDateSlotTitle: string;
  chooseDateSlotSubtitle: string;
  morningAfternoonSlots: string;
  eveningNightSlots: string;
  slotBookedLabel: string;
  customerDetailsTitle: string;
  customerDetailsSubtitle: string;
  mobileNumberLabel: string;
  yourFullNameLabel: string;
  genderPreferenceLabel: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  emailOptionalLabel: string;
  havePromoCode: string;
  tryFirst20: string;
  paymentAndBillTitle: string;
  paymentAndBillSubtitle: string;
  appointmentBookingHeading: string;
  slotLabel: string;
  servicesLabel: string;
  firstVisitDiscount: string;
  totalBillDue: string;
  instantUpiTitle: string;
  instantUpiSubtitle: string;
  scanQrCode: string;
  amountToPayNow: string;
  cardPaymentTitle: string;
  cardPaymentSubtitle: string;
  cardNumberPlaceholder: string;
  payAtCounterTitle: string;
  payAtCounterSubtitle: string;
  continueToDetailsBtn: string;
  proceedToPaymentBtn: string;
  confirmPayAtSalonBtn: string;
  payAndConfirmBtn: string;
  serviceDescription: string;
  durationLabel: string;
  amountInr: string;
  grossServicesTotal: string;
  promotionalDiscount: string;
  taxableValue: string;
  applicableGst: string;
  totalBillWithTax: string;
  paymentTender: string;
  paymentRefUtr: string;
  amountPaidOnline: string;
  balanceDueAtSalon: string;
  paymentStatus: string;
  fullySettled: string;
  computerGeneratedNotice: string;
  needToReschedule: string;
  rescheduleBtn: string;
  cancelBtn: string;
  confirmNewSlot: string;
  viewInAppointmentsPortal: string;
  returnToHomepage: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Navigation & General Header
    brandTitle: "Page 3 – The Family Salon",
    brandTagline: "Where Style Meets Excellence • Dewas",
    familySalonSubtitle: "The Family Salon",
    openToday: "Open Today • 10:00 AM – 8:30 PM",
    googleRating: "4.9 ★ Rated on Google",
    staffLogin: "Staff",
    bookNow: "Book Appointment",
    exploreServices: "Explore Services",
    exploreServicesAndPricing: "Explore Services & Pricing",
    callUs: "Call 9111198911",
    whatsapp: "WhatsApp",
    directions: "Get Directions on Google Maps",
    dewasLocation: "Dewas, Madhya Pradesh",
    profile: "Profile",
    back: "← Back",
    close: "Close",
    menu: "Menu",
    fullMenu: "Full Menu →",
    minuteUnit: "min",

    // Returning Customer & Offers
    firstTimeOfferBadge: "FIRST-TIME OFFER",
    firstTimeOfferText: "Enjoy 20% off your first appointment with code FIRST20",
    claimOffer: "Claim 20% Off",
    flat20Off: "FLAT 20% OFF",
    welcomeBack: "Welcome Back",
    welcomeBackUser: "Welcome back",
    lastVisitWas: "Your last visit was for",
    readyNextLook: "Ready for your next fresh look at Page 3?",
    bookSameService: "⚡ Book Same Service",
    exploreMenu: "Explore Menu",
    loyaltyPointsLabel: "pts",

    // Hero Section
    heroTitle: "Your Style. Your Confidence.",
    heroSubtitle: "Your Page 3.",
    heroDescription:
      "Premium grooming, expert styling and personalised care. Your perfect look starts here in Dewas.",
    reservedSlotBadge: "🔒 Reserved Appointment Slot",
    sterilizedToolsBadge: "Sterilised Tools & Stations",

    // Value Pillars
    reservedSeatTitle: "Reserved Seat",
    reservedSeatDesc: "Pre-allocated time slot",
    masterArtistsTitle: "Master Artists",
    masterArtistsDesc: "10+ yrs expert styling",
    styleMemoryTitle: "Style Memory",
    styleMemoryDesc: "We remember your cut",

    // Why Choose Page 3
    thePage3Standard: "The Page 3 Standard",
    whyDewasChooses: "Why Dewas Chooses Page 3",
    whyDewasSubtitle: "A luxury salon experience built on trust, craft, and care for the whole family.",
    familySalonTitle: "Complete Family Salon",
    familySalonDesc: "Dedicated expert stylists for men, women, and children with private styling stations.",
    hygieneTitle: "High Hygiene Standards",
    hygieneDesc: "Single-use disposable capes, freshly disinfected stations, and sterilized tools for every client.",
    transparentPricingTitle: "Transparent Pricing",
    transparentPricingDesc: "Clear upfront rates with zero surprise charges. What you see is what you pay.",
    instantBookingTitle: "Instant 60s Booking",
    instantBookingDesc: "Book live slots in seconds without forced app downloads or complex passwords.",

    // Gallery & Lookbook
    styleShowcaseBadge: "Style Showcase & Lookbook",
    portfolioHeading: "Page 3 Style Lookbook & Inspirations",
    portfolioSubtitle: "Explore haircut silhouettes, dimensional colouring, and grooming styles offered at Page 3 Dewas.",
    allWorksCat: "All Works",
    mensCutsCat: "Men's Cuts",
    womensStylingCat: "Women's Styling",
    beardGroomingCat: "Beard Grooming",
    hairColorCat: "Hair Colouring",
    treatmentsSpaCat: "Treatments & Spa",
    styleGuidesCat: "Style Guides",
    beforeLabel: "Before",
    afterResultLabel: "After Result",
    tapToViewDetail: "Tap to view detail 🔍",
    bookServiceAction: "Book Service →",
    stylistByLabel: "Stylist:",

    // Reviews Marquee
    reviewsHeading: "Loved by Dewas Clients",
    reviewsSubtitle: "Genuine feedback curated from salon visits and Google Business reviews in Dewas.",
    shareExperience: "Visited Page 3? Share Your Experience",
    viewOnGoogle: "View on Google Maps",
    clientReviewBadge: "Client Review",
    serviceLabel: "Service:",

    // Menu Highlights & Services Page
    menuHighlights: "Menu Highlights",
    popularServicesDewas: "Popular Services in Dewas",
    servicesMenuTitle: "Services Menu",
    allGenders: "All Genders",
    gents: "👨 Gents",
    ladies: "👩 Ladies",
    allServicesTab: "All Services",
    noServicesFound: "No services found matching your criteria.",

    // Location & Footer
    findUsDewas: "Find Us in Dewas",
    locationAndHours: "Salon Location & Hours",
    customerParkingNotice: "Dedicated customer parking available in front of salon",
    directPhone: "Direct Phone:",
    monToFri: "Monday – Friday:",
    satToSun: "Saturday – Sunday:",
    allRightsReserved: "All rights reserved. • Dedicated Family Grooming Care",
    familyGroomingCare: "Dedicated Family Grooming Care",

    // Booking Flow
    stepServices: "Services",
    stepStylist: "Stylist",
    stepSlot: "Date & Slot",
    stepDetails: "Details",
    stepPayment: "Payment",
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
    choosePaymentMethod: "Choose Payment Method",
    payAtCounter: "Pay at Salon Reception",
    payAtCounterDesc: "Pay via Cash, Card, or UPI directly at the reception desk after your service.",
    payOnlineUpi: "Instant Online UPI",
    payOnlineUpiDesc: "Zero transaction fee via Google Pay, PhonePe, or Paytm.",
    cardPayment: "Credit / Debit Card",
    cardPaymentDesc: "Visa, Mastercard, RuPay & American Express accepted.",
    confirmAndPay: "Confirm & Reserve Slot →",
    appointmentConfirmedTitle: "Appointment Confirmed!",
    taxInvoiceTitle: "OFFICIAL TAX INVOICE",
    downloadPrintBill: "Download / Print Bill",
    rescheduleAction: "Reschedule Slot",
    cancelAction: "Cancel Appointment",

    // Additional Booking Wizard & Invoice Localizations
    selectServicesTitle: "Select Services",
    selectStylistTitle: "Select Preferred Stylist",
    selectStylistSubtitle: "Pick your trusted artist or let us assign the best expert on duty.",
    chooseDateSlotTitle: "Choose Date & Slot",
    chooseDateSlotSubtitle: "Real-time slot availability for Page 3 Salon, Dewas.",
    morningAfternoonSlots: "Morning & Afternoon Slots",
    eveningNightSlots: "Evening & Night Slots",
    slotBookedLabel: "Booked",
    customerDetailsTitle: "Customer Details",
    customerDetailsSubtitle: "Required for appointment allocation & digital invoice dispatch.",
    mobileNumberLabel: "Mobile Number (10 digits) *",
    yourFullNameLabel: "Your Full Name *",
    genderPreferenceLabel: "Gender Preference",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "All / Other",
    emailOptionalLabel: "Email (Optional)",
    havePromoCode: "Have a Promo Code?",
    tryFirst20: "Try FIRST20",
    paymentAndBillTitle: "Payment & Bill Settlement",
    paymentAndBillSubtitle: "Select your payment preference before confirming the appointment.",
    appointmentBookingHeading: "Appointment Booking",
    slotLabel: "Slot",
    servicesLabel: "Services",
    firstVisitDiscount: "First-Visit 20% Discount",
    totalBillDue: "Total Bill Due",
    instantUpiTitle: "Instant UPI (Google Pay, PhonePe, Paytm)",
    instantUpiSubtitle: "Fast 0% fee payment with verified instant confirmation",
    scanQrCode: "Scan QR Code",
    amountToPayNow: "Amount to pay now:",
    cardPaymentTitle: "Debit / Credit Card (RuPay, Visa, Master)",
    cardPaymentSubtitle: "2-Factor authentication with official bank OTP",
    cardNumberPlaceholder: "Card Number (XXXX XXXX XXXX XXXX)",
    payAtCounterTitle: "Pay at Salon Reception (Zero Advance)",
    payAtCounterSubtitle: "Pay full bill after service via Cash, UPI, or Card",
    continueToDetailsBtn: "Continue to Details →",
    proceedToPaymentBtn: "Proceed to Payment & Bill →",
    confirmPayAtSalonBtn: "Confirm (Pay at Salon) →",
    payAndConfirmBtn: "Pay & Confirm",
    serviceDescription: "Service Description",
    durationLabel: "Duration",
    amountInr: "Amount (₹)",
    grossServicesTotal: "Gross Services Total",
    promotionalDiscount: "Promotional Discount (FIRST20)",
    taxableValue: "Taxable Value of Supply",
    applicableGst: "Applicable GST (CGST 9% + SGST 9%)",
    totalBillWithTax: "Total Bill (Incl. All Taxes)",
    paymentTender: "Payment Tender",
    paymentRefUtr: "Payment Reference / UTR",
    amountPaidOnline: "Amount Paid Online",
    balanceDueAtSalon: "Balance Due at Salon Reception",
    paymentStatus: "Payment Status",
    fullySettled: "Fully Settled (₹0 Balance)",
    computerGeneratedNotice: "Official Computer-Generated Tax Invoice • Page 3 – The Family Salon, Dewas",
    needToReschedule: "Need to Reschedule?",
    rescheduleBtn: "Reschedule",
    cancelBtn: "Cancel",
    confirmNewSlot: "Confirm New Slot",
    viewInAppointmentsPortal: "View in My Appointments Portal →",
    returnToHomepage: "Return to Homepage",
  },
  hi: {
    // Navigation & General Header
    brandTitle: "पेज 3 – द फैमिली सैलून",
    brandTagline: "स्टाइल और उत्कृष्टता का संगम • देवास",
    familySalonSubtitle: "द फैमिली सैलून",
    openToday: "आज खुला है • सुबह 10:00 से रात 8:30",
    googleRating: "4.9 ★ गूगल पर रेटेड",
    staffLogin: "स्टाफ लॉगिन",
    bookNow: "अपॉइंटमेंट बुक करें",
    exploreServices: "सेवाएं देखें",
    exploreServicesAndPricing: "सेवाएं और मूल्य सूची देखें",
    callUs: "कॉल करें 9111198911",
    whatsapp: "व्हाट्सएप",
    directions: "गूगल मैप्स पर रास्ता देखें",
    dewasLocation: "देवास, मध्य प्रदेश",
    profile: "प्रोफ़ाइल",
    back: "← वापस",
    close: "बंद करें",
    menu: "मेन्यू",
    fullMenu: "पूरी सूची देखें →",
    minuteUnit: "मिनट",

    // Returning Customer & Offers
    firstTimeOfferBadge: "पहली विज़िट ऑफर",
    firstTimeOfferText: "कोड FIRST20 के साथ अपनी पहली सर्विस पर फ्लैट 20% की छूट पाएं",
    claimOffer: "20% छूट पाएं",
    flat20Off: "फ्लैट 20% की छूट",
    welcomeBack: "वापसी पर स्वागत है",
    welcomeBackUser: "वापसी पर स्वागत है",
    lastVisitWas: "आपकी पिछली विज़िट थी",
    readyNextLook: "पेज 3 पर अपने नए लुक के लिए तैयार हैं?",
    bookSameService: "⚡ वही सेवा दोबारा बुक करें",
    exploreMenu: "मेन्यू देखें",
    loyaltyPointsLabel: "अंक",

    // Hero Section
    heroTitle: "आपका स्टाइल। आपका आत्मविश्वास।",
    heroSubtitle: "आपका पेज 3।",
    heroDescription:
      "प्रीमियम ग्रूमिंग, एक्सपर्ट स्टाइलिंग और पर्सनलाइज्ड केयर। आपका परफेक्ट लुक यहीं देवास में शुरू होता है।",
    reservedSlotBadge: "🔒 आरक्षित अपॉइंटमेंट समय",
    sterilizedToolsBadge: "सैनिटाइज्ड उपकरण व स्टेशन्स",

    // Value Pillars
    reservedSeatTitle: "आरक्षित सीट",
    reservedSeatDesc: "पूर्व-निर्धारित समय स्लॉट",
    masterArtistsTitle: "मास्टर स्टाइलिस्ट",
    masterArtistsDesc: "10+ वर्षों का स्टाइलिंग अनुभव",
    styleMemoryTitle: "स्टाइल मेमोरी",
    styleMemoryDesc: "हम आपके हेयरकट को याद रखते हैं",

    // Why Choose Page 3
    thePage3Standard: "पेज 3 मानक",
    whyDewasChooses: "देवास पेज 3 को क्यों चुनता है",
    whyDewasSubtitle: "पूरे परिवार के लिए विश्वास, कला और देखभाल पर आधारित एक प्रीमियम सैलून अनुभव।",
    familySalonTitle: "संपूर्ण फैमिली सैलून",
    familySalonDesc: "पुरुषों, महिलाओं और बच्चों के लिए समर्पित एक्सपर्ट स्टाइलिस्ट और निजी स्टाइलिंग स्टेशन्स।",
    hygieneTitle: "उच्च स्वच्छता मानक",
    hygieneDesc: "प्रत्येक ग्राहक के लिए सिंगल-यूज़ डिस्पोजेबल केप, डिसइन्फेक्टेड स्टेशन और स्टेरलाइज्ड उपकरण।",
    transparentPricingTitle: "पारदर्शी कीमतें",
    transparentPricingDesc: "शुरुआत से स्पष्ट दरें, कोई छुपा हुआ शुल्क नहीं। जो दिखता है वही आपको देना है।",
    instantBookingTitle: "तुरंत 60 सेकंड में बुकिंग",
    instantBookingDesc: "बिना किसी ऐप डाउनलोड या कठिन पासवर्ड के कुछ ही सेकंड में लाइव स्लॉट बुक करें।",

    // Gallery & Lookbook
    styleShowcaseBadge: "स्टाइल शोकेस और लुकबुक",
    portfolioHeading: "पेज 3 स्टाइल लुकबुक और शैलियां",
    portfolioSubtitle: "पेज 3 देवास में उपलब्ध हेयरकट, कलरिंग और ग्रूमिंग शैलियों की झलक देखें।",
    allWorksCat: "सभी शैलियां",
    mensCutsCat: "पुरुषों के कट्स",
    womensStylingCat: "महिला स्टाइलिंग",
    beardGroomingCat: "दाढ़ी ग्रूमिंग",
    hairColorCat: "हेयर कलरिंग",
    treatmentsSpaCat: "ट्रीटमेंट और स्पा",
    styleGuidesCat: "स्टाइल गाइड्स",
    beforeLabel: "पहले",
    afterResultLabel: "नतीजा (बाद में)",
    tapToViewDetail: "विवरण देखने के लिए टैप करें 🔍",
    bookServiceAction: "सेवा बुक करें →",
    stylistByLabel: "स्टाइलिस्ट:",

    // Reviews Marquee
    reviewsHeading: "देवास के ग्राहकों का भरोसा",
    reviewsSubtitle: "देवास में सैलून विज़िट और गूगल बिजनेस समीक्षाओं से एकत्रित वास्तविक प्रतिक्रिया।",
    shareExperience: "पेज 3 पर आए थे? अपना अनुभव साझा करें",
    viewOnGoogle: "गूगल मैप्स पर देखें",
    clientReviewBadge: "ग्राहक समीक्षा",
    serviceLabel: "सेवा:",

    // Menu Highlights & Services Page
    menuHighlights: "प्रमुख सेवाएं",
    popularServicesDewas: "देवास में लोकप्रिय सेवाएं",
    servicesMenuTitle: "सेवाएं मेन्यू",
    allGenders: "सभी के लिए",
    gents: "👨 पुरुष",
    ladies: "👩 महिलाएं",
    allServicesTab: "सभी सेवाएं",
    noServicesFound: "इस श्रेणी में कोई सेवा नहीं मिली।",

    // Location & Footer
    findUsDewas: "देवास में हमें खोजें",
    locationAndHours: "सैलून का पता और समय",
    customerParkingNotice: "सैलून के सामने समर्पित ग्राहक पार्किंग उपलब्ध है",
    directPhone: "सीधा फोन नंबर:",
    monToFri: "सोमवार – शुक्रवार:",
    satToSun: "शनिवार – रविवार:",
    allRightsReserved: "सर्वाधिकार सुरक्षित। • समर्पित पारिवारिक ग्रूमिंग सेवा",
    familyGroomingCare: "समर्पित पारिवारिक ग्रूमिंग सेवा",

    // Booking Flow
    stepServices: "सेवाएं",
    stepStylist: "स्टाइलिस्ट",
    stepSlot: "तारीख और समय",
    stepDetails: "विवरण",
    stepPayment: "भुगतान",
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
    choosePaymentMethod: "भुगतान का तरीका चुनें",
    payAtCounter: "सैलून रिसेप्शन पर भुगतान करें",
    payAtCounterDesc: "सेवा के बाद सीधे रिसेप्शन काउंटर पर नकद, कार्ड या यूपीआई से भुगतान करें।",
    payOnlineUpi: "तुरंत ऑनलाइन यूपीआई",
    payOnlineUpiDesc: "Google Pay, PhonePe, या Paytm के माध्यम से बिना किसी अतिरिक्त शुल्क के।",
    cardPayment: "क्रेडिट / डेबिट कार्ड",
    cardPaymentDesc: "वीज़ा, मास्टरकार्ड, रुपे और अमेरिकन एक्सप्रेस स्वीकार्य।",
    confirmAndPay: "पुष्टि करें और स्लॉट बुक करें →",
    appointmentConfirmedTitle: "अपॉइंटमेंट की पुष्टि हो गई!",
    taxInvoiceTitle: "आधिकारिक टैक्स इनवॉइस",
    downloadPrintBill: "बिल डाउनलोड / प्रिंट करें",
    rescheduleAction: "समय बदलें",
    cancelAction: "अपॉइंटमेंट रद्द करें",

    // Additional Booking Wizard & Invoice Localizations
    selectServicesTitle: "सेवाएं चुनें",
    selectStylistTitle: "पसंदीदा स्टाइलिस्ट चुनें",
    selectStylistSubtitle: "अपने भरोसेमंद विशेषज्ञ को चुनें या ड्यूटी पर मौजूद सर्वश्रेष्ठ मास्टर स्टाइलिस्ट को सौंपें।",
    chooseDateSlotTitle: "तारीख और समय चुनें",
    chooseDateSlotSubtitle: "पेज 3 सैलून देवास के लिए लाइव स्लॉट उपलब्धता।",
    morningAfternoonSlots: "सुबह और दोपहर के स्लॉट",
    eveningNightSlots: "शाम और रात के स्लॉट",
    slotBookedLabel: "बुक हो चुका",
    customerDetailsTitle: "ग्राहक का विवरण",
    customerDetailsSubtitle: "अपॉइंटमेंट आवंटन और डिजिटल इनवॉइस भेजने के लिए आवश्यक।",
    mobileNumberLabel: "मोबाइल नंबर (10 अंक) *",
    yourFullNameLabel: "आपका पूरा नाम *",
    genderPreferenceLabel: "जेंडर प्राथमिकता",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य / सभी",
    emailOptionalLabel: "ईमेल (वैकल्पिक)",
    havePromoCode: "क्या आपके पास प्रोमो कोड है?",
    tryFirst20: "FIRST20 आज़माएं",
    paymentAndBillTitle: "भुगतान और बिल निपटान",
    paymentAndBillSubtitle: "अपॉइंटमेंट की पुष्टि करने से पहले अपनी भुगतान प्राथमिकता चुनें।",
    appointmentBookingHeading: "अपॉइंटमेंट बुकिंग",
    slotLabel: "समय स्लॉट",
    servicesLabel: "सेवाएं",
    firstVisitDiscount: "पहली विज़िट 20% छूट",
    totalBillDue: "कुल देय बिल",
    instantUpiTitle: "तुरंत यूपीआई (Google Pay, PhonePe, Paytm)",
    instantUpiSubtitle: "बिना किसी अतिरिक्त शुल्क के तुरंत सुरक्षित भुगतान",
    scanQrCode: "QR कोड स्कैन करें",
    amountToPayNow: "अभी भुगतान करने योग्य राशि:",
    cardPaymentTitle: "डेबिट / क्रेडिट कार्ड (RuPay, Visa, Master)",
    cardPaymentSubtitle: "बैंक ओटीपी के साथ सुरक्षित टू-फैक्टर प्रमाणीकरण",
    cardNumberPlaceholder: "कार्ड नंबर (XXXX XXXX XXXX XXXX)",
    payAtCounterTitle: "सैलून रिसेप्शन पर भुगतान (शून्य अग्रिम)",
    payAtCounterSubtitle: "सेवा पूर्ण होने के बाद नकद, यूपीआई या कार्ड से भुगतान करें",
    continueToDetailsBtn: "विवरण पर जाएं →",
    proceedToPaymentBtn: "भुगतान और बिल पर जाएं →",
    confirmPayAtSalonBtn: "पुष्टि करें (सैलून पर भुगतान) →",
    payAndConfirmBtn: "भुगतान करें और पुष्टि करें",
    serviceDescription: "सेवा विवरण",
    durationLabel: "अवधि",
    amountInr: "राशि (₹)",
    grossServicesTotal: "सकल सेवा राशि",
    promotionalDiscount: "प्रोमोशनल छूट (FIRST20)",
    taxableValue: "कर योग्य मूल्य",
    applicableGst: "लागू जीएसटी (CGST 9% + SGST 9%)",
    totalBillWithTax: "कुल बिल (सभी कर सहित)",
    paymentTender: "भुगतान का प्रकार",
    paymentRefUtr: "भुगतान संदर्भ / UTR",
    amountPaidOnline: "ऑनलाइन भुगतान की गई राशि",
    balanceDueAtSalon: "रिसेप्शन पर शेष देय राशि",
    paymentStatus: "भुगतान स्थिति",
    fullySettled: "पूर्ण भुगतान (₹0 शेष)",
    computerGeneratedNotice: "आधिकारिक कंप्यूटर-जनरेटेड टैक्स इनवॉइस • पेज 3 – द फैमिली सैलून, देवास",
    needToReschedule: "क्या समय बदलना चाहते हैं?",
    rescheduleBtn: "समय बदलें",
    cancelBtn: "रद्द करें",
    confirmNewSlot: "नया स्लॉट पक्का करें",
    viewInAppointmentsPortal: "मेरे अपॉइंटमेंट्स में देखें →",
    returnToHomepage: "होमपेज पर वापस जाएं",
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
