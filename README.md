# Page 3 Luxury Salon — Complete Business Management & Booking Platform

A production-ready, mobile-first Salon Operating System built with **Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL (Supabase)**.

Inspired by premium barbershop experiences and platforms like Setmore, this system unites two interconnected interfaces on a single unified backend:
1. **Customer-Facing Mobile PWA** (Self-service discovery, real-time multi-service booking, client memory dossier, visit history, loyalty program, review collection).
2. **Owner / Manager Admin Control Hub** (Daily operations, live appointment pipeline, walk-in scheduler, customer memory CRM, material recipe deductions, stock reorder alerts, retention dashboard, and profit analytics).

---

## 🚀 Live Demo & Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm or yarn

### 2. Local Installation
```bash
cd page3-salon
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client-facing booking app.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the owner/manager dashboard.

**Admin Credentials (Pre-configured):**
- **Email:** `owner@page3salon.com`
- **Password:** `admin123`

---

## 🌟 Core Modules & Architecture

### 1. Customer-Facing Mobile Web App (PWA)
- **Home & Discover (`/`)**: Luxury hero banner, real-time operating hours, quick WhatsApp chat, Google Maps integration, service spotlights, and client reviews.
- **Service Menu (`/services`)**: Filterable catalogue across Haircuts, Beard & Shave, Hair Colour, Treatments, and Luxury Packages with gender filters.
- **Appointment Booking Engine (`/book`)**:
  - *Step 1*: Multi-service selection with cumulative duration & pricing.
  - *Step 2*: Stylist selection ("Any Stylist" or specific artist).
  - *Step 3*: 14-day date picker with dynamically computed 30-min available time slots.
  - *Step 4*: OTP-verified registration with customer memory recognition, styling notes, and separated marketing vs. notification consent.
  - *Step 5*: Confirmation receipt with unique code (e.g. `APT-20241118-001`) and automated WhatsApp/SMS dispatch.
- **Client Profile & Dossier (`/profile`)**: Lifetime visit metrics, total spending, loyalty points balance, saved preferences, and active bookings.
- **Visit History (`/profile/history`)**: Detailed log of past haircuts, styling recipes, and stylist notes.
- **Feedback & Review Collection (`/reviews`)**: 5-star rating system with bonus loyalty points award.

### 2. Owner & Manager Admin Control Center
- **Executive Operations Dashboard (`/admin/dashboard`)**:
  - Today's sales, customer footfall (new vs. repeat), upcoming appointments, and estimated net profit.
  - Date range filters: *Today, Yesterday, Last 7 Days, This Month, Last Month*.
  - VIP Customer Memory alert banner with conversational conversation guides for stylists.
  - Quick appointment lifecycle buttons: *Call, WhatsApp, Check In, Start Service, Mark Completed*.
- **Appointments Pipeline (`/admin/appointments`)**:
  - State machine: `pending` → `confirmed` → `checked_in` → `in_progress` → `completed` / `cancelled` / `no_show`.
  - Double-booking prevention constraint: `(staff_id, appointment_date, start_time)`.
- **Walk-in & Manual Booking (`/admin/appointments/new`)**: Fast in-salon guest registration.
- **Customer CRM & Memory Dossier (`/admin/customers`)**:
  - 360° customer profile: full name, phone, gender, DOB, total visits, total spend, days elapsed since last visit.
  - Permanent styling notes & stylist suggestions.
- **Inventory & Service Recipes (`/admin/inventory`)**:
  - Material usage tracking for color tubes, developers (ml), shampoos, conditioners, capes, and keratin treatments.
  - **Service Recipes**: Configurable formulas (e.g. Global Color = 50ml Color + 75ml Developer + 15ml Shampoo + 15ml Conditioner).
  - **Automated Deduction Trigger**: Deducts inventory *only* when status is marked `completed`.
  - **Minimum Stock Alerts**: Dedicated Reorder procurement list with suggested purchase quantities and estimated costs.
- **Customer Retention & Inactivity Hub (`/admin/retention`)**:
  - Configurable inactivity thresholds: 30 days (*At Risk*), 60 days (*Inactive*), 90 days (*Lost*).
  - 1-Click WhatsApp outreach with pre-filled personalized reactivation offers.
  - Monthly repeat customer rate tracking (currently 78.4%).
- **Financial & Expense Ledger (`/admin/finance`)**:
  - Revenue breakdown by payment method: UPI (53.1%), Cash (26.6%), Card (16.5%), Online (3.8%).
  - Expense tracking: Commercial rent, AC power/electricity, stylist salaries & commissions, inventory procurement.
  - Real-time Net Profit calculation and downloadable reports.
- **Stylist & Team Roster (`/admin/staff`)**: Commission tracking (30–35%), sales volume, completed jobs, attendance, and working hours.
- **Settings & Notification Templates (`/admin/settings`)**:
  - Configurable WhatsApp & SMS templates for Instant Confirmation, 24h Reminder, 1h Reminder with Maps Link, and Post-service Review requests.

---

## 🗄️ Relational Database Schema (`/supabase/schema.sql`)

Includes 20 normalized relational tables in PostgreSQL:
1. `users` — Role-based accounts (`owner`, `manager`, `staff`, `customer`)
2. `customers` — Customer CRM profiles, visit metrics, categories, consent flags
3. `staff` — Stylists, working schedules, commission rates
4. `service_categories` — Visual category hierarchy
5. `services` — Service items, durations, prices
6. `appointments` — Appointment records with unique double-booking constraint
7. `appointment_services` — Multi-service join table
8. `customer_visit_history` — Historical service records
9. `customer_notes` — Permanent stylist notes & client preferences
10. `suppliers` — Vendor contacts and distributors
11. `inventory_products` — Tubes, bottles, developers, stock levels & minimum thresholds
12. `service_recipes` — Quantity formulas per service
13. `inventory_transactions` — Audit trail for consumption, purchases & wastage
14. `purchases` — Stock purchase orders
15. `payments` — Transaction records (Cash, UPI, Card, Razorpay)
16. `expenses` — Operating cost ledger (rent, electricity, salary, inventory)
17. `notifications` — Scheduled WhatsApp, SMS & voice notification logs
18. `reviews` — Verified customer ratings & feedback
19. `loyalty_transactions` — Points ledger (earned, redeemed, expired)
20. `business_settings` — Salon profile & notification template configuration

### Automated Database Trigger:
```sql
CREATE TRIGGER trg_appointment_completed_inventory
AFTER UPDATE OF status ON appointments
FOR EACH ROW
EXECUTE FUNCTION fn_deduct_inventory_on_completed_service();
```
Automatically deducts recipe ingredients and updates customer visit count / total spent *only* upon transition to `completed`.

---

## 📱 Mobile-First PWA Capabilities
- Responsive across all iOS and Android screen widths.
- PWA manifest configured at `/public/manifest.json`.
- Safe area insets (`env(safe-area-inset-bottom)`) for modern mobile browsers.
