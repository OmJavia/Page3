"use client";

import { DEMO_APPOINTMENTS, DEMO_CUSTOMERS } from "@/lib/mock-data";
import { Appointment, Customer, Service, Staff, AppointmentStatus, PaymentMethod } from "@/lib/types";
import { generateAppointmentCode } from "@/lib/utils";

export interface OwnerNotification {
  id: string;
  title: string;
  message: string;
  appointmentCode: string;
  timestamp: string;
  read: boolean;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  amount: number;
}

const STORAGE_KEY_APPOINTMENTS = "page3_appointments_v1";
const STORAGE_KEY_NOTIFICATIONS = "page3_owner_notifications_v1";
const STORAGE_KEY_CUSTOMERS = "page3_customers_v1";

export const STORE_PHONE = "9111198911";

/**
 * Retrieve all appointments (persisted + seeded with demo appointments)
 */
export function getStoredAppointments(): Appointment[] {
  if (typeof window === "undefined") return DEMO_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(DEMO_APPOINTMENTS));
      return DEMO_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read appointments from localStorage", e);
    return DEMO_APPOINTMENTS;
  }
}

/**
 * Check if a specific date + time slot is already booked for a stylist
 */
export function isSlotBooked(
  date: string,
  startTime: string,
  staffId?: string | null
): boolean {
  if (!date || !startTime) return false;
  const list = getStoredAppointments();
  return list.some((a) => {
    // Exclude cancelled and no-show bookings
    if (a.status === "cancelled" || a.status === "no_show") return false;
    const sameDate = a.appointment_date === date;
    const sameTime = a.start_time === startTime || a.start_time.startsWith(startTime.slice(0, 5));

    if (!sameDate || !sameTime) return false;

    // If a specific staff was picked, check against that staff or unassigned bookings
    if (staffId) {
      return a.staff_id === staffId || !a.staff_id;
    }

    // If "Any Stylist" is picked, slot is full only if all staff are booked, or single slot is locked
    return true;
  });
}

/**
 * Retrieve notifications for salon owner
 */
export function getOwnerNotifications(): OwnerNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(id: string) {
  if (typeof window === "undefined") return;
  const current = getOwnerNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("page3_appointment_update"));
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsRead() {
  if (typeof window === "undefined") return;
  const current = getOwnerNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("page3_appointment_update"));
}

/**
 * Create and persist a new confirmed appointment
 */
export function createAndPersistAppointment(params: {
  customerName: string;
  customerPhone: string;
  customerGender?: "male" | "female" | "other";
  customerNotes?: string;
  services: Service[];
  staff: Staff | null;
  date: string;
  slot: { start: string; end: string };
  totalAmount: number;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: "pending" | "partial" | "paid";
  txnId?: string;
}): { appointment: Appointment; notification: OwnerNotification; ownerWhatsAppUrl: string } {
  const code = generateAppointmentCode();
  const list = getStoredAppointments();

  // Create or resolve customer
  const customerId = `cust-${Date.now()}`;
  const newCustomer: Customer = {
    id: customerId,
    customer_code: `CKT-${Math.floor(10000 + Math.random() * 90000)}`,
    full_name: params.customerName || "Guest Client",
    phone: params.customerPhone,
    gender: params.customerGender || "male",
    marketing_consent: true,
    notification_consent: true,
    first_visit_date: params.date,
    last_visit_date: params.date,
    total_visits: 1,
    total_spent: params.totalAmount,
    customer_category: "new",
    loyalty_points: Math.round(params.totalAmount * 0.05),
    notes: params.customerNotes || "",
    created_at: new Date().toISOString(),
  };

  // Build full Appointment object
  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    appointment_code: code,
    customer_id: customerId,
    customer: newCustomer,
    staff_id: params.staff?.id || undefined,
    staff: params.staff || undefined,
    appointment_date: params.date,
    start_time: params.slot.start,
    end_time: params.slot.end || `${params.slot.start.slice(0, 2)}:45`,
    status: "confirmed",
    total_amount: params.totalAmount,
    paid_amount: params.paidAmount !== undefined ? params.paidAmount : 0,
    payment_method: params.paymentMethod || "upi",
    payment_status: params.paymentStatus || (params.paidAmount && params.paidAmount >= params.totalAmount ? "paid" : params.paidAmount && params.paidAmount > 0 ? "partial" : "pending"),
    notes: params.txnId ? `Transaction: ${params.txnId}` : undefined,
    is_walk_in: false,
    services: params.services.map((svc) => ({
      id: `as-${Date.now()}-${svc.id}`,
      appointment_id: `apt-${Date.now()}`,
      service_id: svc.id,
      service: svc,
      price: svc.price,
      duration_minutes: svc.duration_minutes,
      staff_id: params.staff?.id,
    })),
    created_at: new Date().toISOString(),
  };

  // 1. Save appointment to storage
  const updatedAppointments = [newAppointment, ...list];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updatedAppointments));
  }

  // 2. Save/Update customer in storage
  if (typeof window !== "undefined") {
    try {
      const custRaw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      const custList: Customer[] = custRaw ? JSON.parse(custRaw) : DEMO_CUSTOMERS;
      const existingIdx = custList.findIndex((c) => c.phone.replace(/\D/g, "").slice(-10) === params.customerPhone.replace(/\D/g, "").slice(-10));
      if (existingIdx >= 0) {
        custList[existingIdx].total_visits += 1;
        custList[existingIdx].total_spent += params.totalAmount;
        custList[existingIdx].last_visit_date = params.date;
        custList[existingIdx].loyalty_points += Math.round(params.totalAmount * 0.05);
      } else {
        custList.unshift(newCustomer);
      }
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(custList));
    } catch (e) {
      console.error("Error updating customer list", e);
    }
  }

  // 3. Create Owner Notification
  const serviceNames = params.services.map((s) => s.name).join(", ");
  const stylistName = params.staff?.full_name || "Any Available Stylist";

  const newNotification: OwnerNotification = {
    id: `notif-${Date.now()}`,
    title: "New Online Booking",
    message: `${params.customerName} booked ${serviceNames} with ${stylistName} on ${params.date} at ${params.slot.start}`,
    appointmentCode: code,
    timestamp: new Date().toISOString(),
    read: false,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    serviceName: serviceNames,
    stylistName,
    date: params.date,
    time: params.slot.start,
    amount: params.totalAmount,
  };

  if (typeof window !== "undefined") {
    const notifications = getOwnerNotifications();
    localStorage.setItem(
      STORAGE_KEY_NOTIFICATIONS,
      JSON.stringify([newNotification, ...notifications])
    );

    // Dispatch global event for all listeners
    window.dispatchEvent(new CustomEvent("page3_appointment_update", { detail: newAppointment }));
  }

  // 4. WhatsApp direct alert URL for Store Owner (+91 9111198911)
  const ownerMessage = [
    `🚨 *NEW BOOKING RECEIVED · PAGE 3 SALON* 🚨`,
    ``,
    `📋 *Booking ID:* ${code}`,
    `👤 *Client:* ${params.customerName} (+91 ${params.customerPhone})`,
    `✂️ *Service:* ${serviceNames}`,
    `👨‍💼 *Stylist:* ${stylistName}`,
    `📅 *Date & Time:* ${params.date} at ${params.slot.start}`,
    `💰 *Amount:* ₹${params.totalAmount.toLocaleString("en-IN")}`,
    params.customerNotes ? `💡 *Client Note:* ${params.customerNotes}` : ``,
    ``,
    `🔗 Manage appointment in Admin: https://page3salon.com/admin/appointments`,
  ]
    .filter(Boolean)
    .join("\n");

  const ownerWhatsAppUrl = `https://wa.me/91${STORE_PHONE}?text=${encodeURIComponent(ownerMessage)}`;

  return {
    appointment: newAppointment,
    notification: newNotification,
    ownerWhatsAppUrl,
  };
}

/**
 * Retrieve all customers (persisted + seeded with demo customers)
 */
export function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return DEMO_CUSTOMERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(DEMO_CUSTOMERS));
      return DEMO_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read customers from localStorage", e);
    return DEMO_CUSTOMERS;
  }
}

/**
 * Save customers list
 */
export function saveStoredCustomers(customers: Customer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  window.dispatchEvent(new CustomEvent("page3_appointment_update"));
}

/**
 * Update an existing appointment's status and sync storage
 */
export function updateStoredAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
): Appointment[] {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("page3_appointment_update"));
  }
  return updated;
}

/**
 * Reschedule an existing appointment to a new date and time
 */
export function rescheduleStoredAppointment(
  codeOrId: string,
  newDate: string,
  newSlot: { start: string; end: string }
): { success: boolean; appointment?: Appointment; message?: string } {
  const current = getStoredAppointments();
  const targetIdx = current.findIndex(
    (a) => a.id === codeOrId || a.appointment_code === codeOrId
  );

  if (targetIdx === -1) {
    return { success: false, message: "Appointment not found." };
  }

  const existing = current[targetIdx];

  // Revalidate slot availability before rescheduling
  if (isSlotBooked(newDate, newSlot.start, existing.staff_id)) {
    return { success: false, message: "Selected time slot is already booked. Please choose another slot." };
  }

  const updatedAppointment: Appointment = {
    ...existing,
    appointment_date: newDate,
    start_time: newSlot.start,
    end_time: newSlot.end || `${newSlot.start.slice(0, 2)}:45`,
    status: "confirmed",
  };

  current[targetIdx] = updatedAppointment;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(current));

    // Add owner alert
    const notifs = getOwnerNotifications();
    const rescheduleNotif: OwnerNotification = {
      id: `notif-${Date.now()}`,
      title: "Appointment Rescheduled",
      message: `${existing.customer?.full_name || "Client"} rescheduled ${existing.appointment_code} to ${newDate} at ${newSlot.start}`,
      appointmentCode: existing.appointment_code,
      timestamp: new Date().toISOString(),
      read: false,
      customerName: existing.customer?.full_name || "Client",
      customerPhone: existing.customer?.phone || "",
      serviceName: existing.services?.map((s) => s.service?.name).join(", ") || "Service",
      stylistName: existing.staff?.full_name || "Any Stylist",
      date: newDate,
      time: newSlot.start,
      amount: existing.total_amount,
    };
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify([rescheduleNotif, ...notifs]));
    window.dispatchEvent(new CustomEvent("page3_appointment_update", { detail: updatedAppointment }));
  }

  return { success: true, appointment: updatedAppointment };
}

/**
 * Cancel an appointment and free up the slot
 */
export function cancelStoredAppointment(
  codeOrId: string,
  reason?: string
): { success: boolean; appointment?: Appointment; message?: string } {
  const current = getStoredAppointments();
  const targetIdx = current.findIndex(
    (a) => a.id === codeOrId || a.appointment_code === codeOrId
  );

  if (targetIdx === -1) {
    return { success: false, message: "Appointment not found." };
  }

  const existing = current[targetIdx];
  const cancelledAppointment: Appointment = {
    ...existing,
    status: "cancelled",
    notes: reason ? `${existing.notes || ""} [Cancelled: ${reason}]`.trim() : existing.notes,
  };

  current[targetIdx] = cancelledAppointment;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(current));

    // Add owner alert
    const notifs = getOwnerNotifications();
    const cancelNotif: OwnerNotification = {
      id: `notif-${Date.now()}`,
      title: "Appointment Cancelled",
      message: `${existing.customer?.full_name || "Client"} cancelled appointment ${existing.appointment_code}`,
      appointmentCode: existing.appointment_code,
      timestamp: new Date().toISOString(),
      read: false,
      customerName: existing.customer?.full_name || "Client",
      customerPhone: existing.customer?.phone || "",
      serviceName: existing.services?.map((s) => s.service?.name).join(", ") || "Service",
      stylistName: existing.staff?.full_name || "Any Stylist",
      date: existing.appointment_date,
      time: existing.start_time,
      amount: existing.total_amount,
    };
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify([cancelNotif, ...notifs]));
    window.dispatchEvent(new CustomEvent("page3_appointment_update", { detail: cancelledAppointment }));
  }

  return { success: true, appointment: cancelledAppointment };
}

