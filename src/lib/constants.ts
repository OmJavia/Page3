export const SALON_INFO = {
  name: "Page 3 – The Family Salon",
  shortName: "Page 3 Salon",
  tagline: "Your Style. Your Confidence. Your Page 3.",
  heroHeadline: "Your Style. Your Confidence. Your Page 3.",
  heroSubheadline: "Premium grooming, expert styling and personalised care. Your perfect look starts here.",
  phone: "9111198911",
  whatsapp: "919111198911",
  email: "contact@page3salon.com",
  // Address configuration:
  // Primary listed address:
  address: "AB Road, Near Bhopal Chouraha, Dewas",
  fullAddress: "AB Road, Near Bhopal Chouraha, Civil Lines, Dewas, Madhya Pradesh 455001",
  // Note: Public business listing also cites:
  // "LG-7, Monica Complex, AB Road, below Jockey Showroom, Ram Nagar, Dewas, Madhya Pradesh 455001"
  // Flagged for business owner confirmation.
  city: "Dewas",
  state: "Madhya Pradesh",
  pincode: "455001",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Page+3+The+Family+Salon+Dewas+Madhya+Pradesh+455001",
  googleMapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Page+3+The+Family+Salon+Dewas+Madhya+Pradesh+455001",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJPage3SalonDewas",
  websiteUrl: "https://page3-dewas.vercel.app",
  rating: 4.9,
  reviewCount: 214,
  hours: {
    monday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    tuesday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    wednesday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    thursday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    friday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    saturday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
    sunday: { open: "10:00", close: "20:30", closed: false, label: "10:00 AM – 08:30 PM" },
  },
};

export const APPOINTMENT_STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  checked_in: { label: "Checked In", color: "bg-purple-100 text-purple-800" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  no_show: { label: "No Show", color: "bg-gray-100 text-gray-800" },
} as const;

export const CUSTOMER_CATEGORIES = {
  new: { label: "New", color: "bg-blue-100 text-blue-800" },
  regular: { label: "Regular", color: "bg-green-100 text-green-800" },
  loyal: { label: "Loyal", color: "bg-purple-100 text-purple-800" },
  at_risk: { label: "At Risk", color: "bg-yellow-100 text-yellow-800" },
  inactive: { label: "Inactive", color: "bg-orange-100 text-orange-800" },
  lost: { label: "Lost", color: "bg-red-100 text-red-800" },
} as const;

export const PAYMENT_METHODS = ["cash", "upi", "card", "online"] as const;

export const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const start = 10 * 60 + i * 30;
  const end = start + 30;
  if (start >= 20 * 60) return null;
  if (start < 10 * 60) return null;
  const fmtTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
  };
  return {
    start: `${Math.floor(start / 60).toString().padStart(2, "0")}:${(start % 60).toString().padStart(2, "0")}`,
    end: `${Math.floor(end / 60).toString().padStart(2, "0")}:${(end % 60).toString().padStart(2, "0")}`,
    label: `${fmtTime(start)} - ${fmtTime(end)}`,
  };
}).filter(Boolean);
