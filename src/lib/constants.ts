export const SALON_INFO = {
  name: "Page 3 Salon",
  tagline: "Where Style Meets Excellence",
  phone: "[PLACEHOLDER — update from business]",
  whatsapp: "[PLACEHOLDER]",
  email: "[PLACEHOLDER]",
  address: "[PLACEHOLDER — update from Google Maps]",
  city: "[PLACEHOLDER]",
  state: "[PLACEHOLDER]",
  pincode: "[PLACEHOLDER]",
  googleMapsUrl: "https://maps.app.goo.gl/obuRuSkPS6QNN6R8A",
  hours: {
    monday: { open: "10:00", close: "20:00", closed: false },
    tuesday: { open: "10:00", close: "20:00", closed: false },
    wednesday: { open: "10:00", close: "20:00", closed: false },
    thursday: { open: "10:00", close: "20:00", closed: false },
    friday: { open: "10:00", close: "20:00", closed: false },
    saturday: { open: "09:00", close: "21:00", closed: false },
    sunday: { open: "10:00", close: "19:00", closed: false },
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
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  return { start: fmtTime(start), end: fmtTime(end) };
}).filter(Boolean);

export const INVENTORY_UNITS = ["ml", "grams", "pieces", "bottles", "tubes", "packets"] as const;

export const EXPENSE_CATEGORIES = [
  "rent", "electricity", "salary", "inventory", "maintenance", "marketing", "other"
] as const;

export const NOTIFICATION_TYPES = [
  "confirmation", "reminder_24h", "reminder_1h", "cancellation", "rescheduling", "thankyou", "review_request"
] as const;
