-- ==============================================================================
-- COMPLETE RELATIONAL DATABASE SCHEMA: PAGE 3 SALON MANAGEMENT SYSTEM
-- Target Database: PostgreSQL 15+ / Supabase
-- Covers 20 Normalized Tables, Constraints, Indexes & Automated Triggers
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS (Authentication & Role Base Access)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('owner', 'manager', 'staff', 'customer')),
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STAFF (Stylists & Specialists)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    specializations TEXT[] DEFAULT '{}',
    working_hours JSONB DEFAULT '{"monday":{"start":"10:00","end":"20:00"},"tuesday":{"start":"10:00","end":"20:00"},"wednesday":{"start":"10:00","end":"20:00"},"thursday":{"start":"10:00","end":"20:00"},"friday":{"start":"10:00","end":"20:00"},"saturday":{"start":"09:00","end":"21:00"},"sunday":{"start":"10:00","end":"19:00"}}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SERVICES
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    gender_applicable TEXT DEFAULT 'all' CHECK (gender_applicable IN ('male', 'female', 'all')),
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMERS (CRM 360 Core)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_code TEXT UNIQUE NOT NULL, -- e.g. CKT-10001
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    email TEXT,
    preferred_stylist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    marketing_consent BOOLEAN DEFAULT FALSE,
    notification_consent BOOLEAN DEFAULT TRUE,
    first_visit_date DATE,
    last_visit_date DATE,
    total_visits INTEGER DEFAULT 0 CHECK (total_visits >= 0),
    total_spent NUMERIC(10,2) DEFAULT 0.00 CHECK (total_spent >= 0),
    last_service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    customer_category TEXT DEFAULT 'new' CHECK (customer_category IN ('new', 'regular', 'loyal', 'at_risk', 'inactive', 'lost')),
    loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES customers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_code TEXT UNIQUE NOT NULL, -- e.g. APT-20241118-001
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')),
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    paid_amount NUMERIC(10,2) DEFAULT 0.00,
    payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'online', NULL)),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
    notes TEXT,
    cancellation_reason TEXT,
    is_walk_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- PREVENT DOUBLE BOOKING FOR ACTIVE APPOINTMENTS
    CONSTRAINT prevent_double_booking UNIQUE (staff_id, appointment_date, start_time)
);

-- 8. APPOINTMENT SERVICES (Multi-service per appointment)
CREATE TABLE IF NOT EXISTS appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVENTORY PRODUCTS
CREATE TABLE IF NOT EXISTS inventory_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT NOT NULL,
    color_shade TEXT,
    unit TEXT NOT NULL CHECK (unit IN ('ml', 'grams', 'pieces', 'bottles', 'tubes', 'packets')),
    package_size NUMERIC(10,2) NOT NULL,
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (current_stock >= 0),
    minimum_stock NUMERIC(10,2) NOT NULL CHECK (minimum_stock >= 0),
    purchase_price NUMERIC(10,2),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    expiry_date DATE,
    batch_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SERVICE RECIPES (Material Consumption formulas)
CREATE TABLE IF NOT EXISTS service_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES inventory_products(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (service_id, product_id)
);

-- 12. INVENTORY TRANSACTIONS (Audit Trail & Stock Ledger)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES inventory_products(id) ON DELETE RESTRICT,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'consumption', 'adjustment', 'wastage')),
    quantity NUMERIC(10,2) NOT NULL, -- negative for deduction, positive for addition
    reference_id UUID, -- links to appointment_id or purchase_id
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PURCHASES (Procurement Orders)
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_code TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    total_cost NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'received' CHECK (status IN ('ordered', 'received', 'cancelled')),
    purchase_date DATE NOT NULL,
    invoice_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card', 'online')),
    payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'refunded', 'failed')),
    transaction_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. EXPENSES (Business Financial Management)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('rent', 'electricity', 'salary', 'inventory', 'maintenance', 'marketing', 'other')),
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    receipt_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CUSTOMER VISIT HISTORY
CREATE TABLE IF NOT EXISTS customer_visit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    services_availed JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10,2) NOT NULL,
    stylist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    notes TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CUSTOMER NOTES (Permanent CRM Knowledge)
CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    note_type TEXT DEFAULT 'preference' CHECK (note_type IN ('preference', 'allergy', 'formula', 'feedback')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. NOTIFICATIONS (WhatsApp, SMS, Automated Timing Logs)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('confirmation', 'reminder_24h', 'reminder_1h', 'cancellation', 'rescheduling', 'thankyou', 'review_request')),
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'voice')),
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    service_ids UUID[] DEFAULT '{}',
    stylist_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. LOYALTY TRANSACTIONS
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'bonus')),
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_category ON customers(customer_category);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_inventory_stock ON inventory_products(current_stock, minimum_stock);

-- ==============================================================================
-- AUTOMATED POSTGRES TRIGGER: DEDUCT INVENTORY ON APPOINTMENT COMPLETION ONLY
-- ==============================================================================
CREATE OR REPLACE FUNCTION fn_deduct_inventory_on_completed_service()
RETURNS TRIGGER AS $$
DECLARE
    service_rec RECORD;
    recipe_rec RECORD;
BEGIN
    -- Trigger ONLY when status transitions to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
        
        -- Loop over all services inside this appointment
        FOR service_rec IN 
            SELECT service_id FROM appointment_services WHERE appointment_id = NEW.id
        LOOP
            -- Loop over ingredients required for this service in service_recipes
            FOR recipe_rec IN
                SELECT product_id, quantity, unit FROM service_recipes WHERE service_id = service_rec.service_id
            LOOP
                -- Deduct inventory stock
                UPDATE inventory_products
                SET current_stock = GREATEST(0, current_stock - recipe_rec.quantity),
                    updated_at = NOW()
                WHERE id = recipe_rec.product_id;

                -- Log in audit trail
                INSERT INTO inventory_transactions (
                    product_id,
                    transaction_type,
                    quantity,
                    reference_id,
                    notes
                ) VALUES (
                    recipe_rec.product_id,
                    'consumption',
                    -recipe_rec.quantity,
                    NEW.id,
                    'Automated deduction on completion of appointment ' || NEW.appointment_code
                );
            END LOOP;
        END LOOP;

        -- Update customer visit metrics
        UPDATE customers
        SET total_visits = total_visits + 1,
            total_spent = total_spent + NEW.total_amount,
            last_visit_date = NEW.appointment_date,
            first_visit_date = COALESCE(first_visit_date, NEW.appointment_date),
            updated_at = NOW()
        WHERE id = NEW.customer_id;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_appointment_completed_inventory ON appointments;
CREATE TRIGGER trg_appointment_completed_inventory
AFTER UPDATE OF status ON appointments
FOR EACH ROW
EXECUTE FUNCTION fn_deduct_inventory_on_completed_service();
