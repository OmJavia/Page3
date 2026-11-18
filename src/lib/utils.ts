import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function generateCustomerCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CKT-${num}`;
}

export function generateAppointmentCode(): string {
  const date = typeof window === "undefined" ? new Date("2024-11-18") : new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const num = Math.floor(100 + Math.random() * 900);
  return `APT-${dateStr}-${num}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysSince(date: string | Date): number {
  if (!date) return 0;
  const d = new Date(date);
  const now = typeof window === "undefined" ? new Date("2024-11-18T12:00:00Z") : new Date();
  const diff = now.getTime() - d.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getCustomerCategory(lastVisitDate: string | null, totalVisits: number): string {
  if (!lastVisitDate || totalVisits === 0) return "new";
  const days = getDaysSince(lastVisitDate);
  if (totalVisits >= 10 && days <= 30) return "loyal";
  if (totalVisits >= 3 && days <= 45) return "regular";
  if (days <= 30) return "regular";
  if (days <= 60) return "at_risk";
  if (days <= 90) return "inactive";
  return "lost";
}
