export type AppointmentStatus = "pending" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show";
export type CustomerCategory = "new" | "regular" | "loyal" | "at_risk" | "inactive" | "lost";
export type PaymentMethod = "cash" | "upi" | "card" | "online";
export type UserRole = "owner" | "manager" | "staff" | "customer";
export type InventoryUnit = "ml" | "grams" | "pieces" | "bottles" | "tubes" | "packets";

export interface Customer {
  id: string;
  customer_code: string;
  full_name: string;
  phone: string;
  gender: "male" | "female" | "other";
  date_of_birth?: string;
  email?: string;
  preferred_stylist_id?: string;
  notes?: string;
  marketing_consent: boolean;
  notification_consent: boolean;
  first_visit_date?: string;
  last_visit_date?: string;
  total_visits: number;
  total_spent: number;
  last_service_id?: string;
  customer_category: CustomerCategory;
  loyalty_points: number;
  created_at: string;
}

export interface Staff {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  specializations: string[];
  working_hours: Record<string, { start: string; end: string }>;
  is_active: boolean;
  commission_rate: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  category?: ServiceCategory;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  gender_applicable: "male" | "female" | "all";
  is_active: boolean;
  image_url?: string;
  display_order: number;
}

export interface Appointment {
  id: string;
  appointment_code: string;
  customer_id: string;
  customer?: Customer;
  staff_id?: string;
  staff?: Staff;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total_amount: number;
  paid_amount: number;
  payment_method?: PaymentMethod;
  payment_status: "pending" | "partial" | "paid";
  notes?: string;
  is_walk_in: boolean;
  services?: AppointmentService[];
  created_at: string;
}

export interface AppointmentService {
  id: string;
  appointment_id: string;
  service_id: string;
  service?: Service;
  price: number;
  duration_minutes: number;
  staff_id?: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  brand?: string;
  category: string;
  color_shade?: string;
  unit: InventoryUnit;
  package_size?: number;
  current_stock: number;
  minimum_stock: number;
  purchase_price?: number;
  supplier_id?: string;
  expiry_date?: string;
  batch_number?: string;
  is_active: boolean;
}

export interface DashboardStats {
  today_sales: number;
  today_customers: number;
  new_customers: number;
  repeat_customers: number;
  upcoming_bookings: number;
  completed_today: number;
  cancelled_today: number;
  monthly_revenue: number;
  monthly_expenses: number;
  estimated_profit: number;
}
