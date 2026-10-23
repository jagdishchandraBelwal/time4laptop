-- ==============================================================================
-- time4laptop.com - Production Supabase Database Schema
-- Run this in your Supabase SQL Editor: Dashboard > SQL Editor > New Query
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'admin', 'manager');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'Order Placed', 
    'Order Confirmed', 
    'Packed', 
    'Shipped', 
    'Out for Delivery', 
    'Delivered', 
    'Cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('UPI', 'Card', 'EMI', 'COD', 'NetBanking');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. PROFILES TABLE (Mirrors Supabase Auth Users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Valued Customer',
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to create profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.raw_app_meta_data->>'role' = 'admin' THEN 'admin'::user_role 
      ELSE 'customer'::user_role 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. USER ADDRESSES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  address_type TEXT DEFAULT 'Home' CHECK (address_type IN ('Home', 'Work')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_desc TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT REFERENCES public.categories(slug) ON DELETE RESTRICT NOT NULL,
  sub_category TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(12, 2) NOT NULL CHECK (original_price >= price),
  discount_percent INT GENERATED ALWAYS AS (
    CASE WHEN original_price > 0 THEN ROUND(((original_price - price) / original_price) * 100) ELSE 0 END
  ) STORED,
  rating NUMERIC(2, 1) DEFAULT 4.8 CHECK (rating >= 1.0 AND rating <= 5.0),
  reviews_count INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT NOT NULL DEFAULT 10 CHECK (stock_count >= 0),
  badge TEXT,
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- ==============================================================================
-- 7. COUPONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT CHECK (discount_percent > 0 AND discount_percent <= 100),
  discount_amount NUMERIC(10, 2) CHECK (discount_amount > 0),
  min_order NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  usage_limit INT DEFAULT NULL,
  times_used INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT chk_coupon_discount CHECK (
    (discount_percent IS NOT NULL AND discount_amount IS NULL) OR
    (discount_percent IS NULL AND discount_amount IS NOT NULL)
  )
);

-- ==============================================================================
-- 8. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('T4L-' || upper(substr(md5(random()::text), 1, 6))),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  coupon_code TEXT REFERENCES public.coupons(code) ON DELETE SET NULL,
  payment_method payment_method NOT NULL,
  emi_months INT DEFAULT NULL,
  payment_status payment_status NOT NULL DEFAULT 'Pending',
  shipping_address JSONB NOT NULL,
  status order_status NOT NULL DEFAULT 'Order Placed',
  tracking_number TEXT NOT NULL DEFAULT ('BD' || floor(random() * (999999999 - 100000000) + 100000000)::text || 'IN'),
  courier TEXT NOT NULL DEFAULT 'Blue Dart Express Air',
  estimated_delivery DATE DEFAULT (CURRENT_DATE + INTERVAL '3 days'),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 9. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  selected_color TEXT,
  selected_spec TEXT,
  total_price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- 10. PRODUCT REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. AUTOMATIC STOCK DEDUCTION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    stock_count = GREATEST(0, stock_count - NEW.quantity),
    in_stock = (stock_count - NEW.quantity > 0)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_deduct_stock ON public.order_items;
CREATE TRIGGER trg_deduct_stock
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.deduct_inventory_on_order();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
  ON public.profiles FOR UPDATE USING (public.is_admin());

-- Function to promote a user to admin by email (can be run in SQL Editor: SELECT make_user_admin('your_email@domain.com');)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = user_email;
  IF target_id IS NULL THEN
    RETURN 'User not found in auth.users';
  END IF;

  -- Update public profiles
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_id;

  -- Update auth.users app_metadata
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  WHERE id = target_id;

  RETURN 'User ' || user_email || ' successfully promoted to Admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADDRESSES Policies
CREATE POLICY "Users can manage their own addresses" 
  ON public.addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses" 
  ON public.addresses FOR SELECT USING (public.is_admin());

-- CATEGORIES Policies
CREATE POLICY "Categories are public to read" 
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" 
  ON public.categories FOR ALL USING (public.is_admin());

-- PRODUCTS Policies
CREATE POLICY "Active products viewable by anyone" 
  ON public.products FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert products" 
  ON public.products FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" 
  ON public.products FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" 
  ON public.products FOR DELETE USING (public.is_admin());

-- COUPONS Policies
CREATE POLICY "Active coupons viewable by anyone" 
  ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage coupons" 
  ON public.coupons FOR ALL USING (public.is_admin());

-- ORDERS Policies
CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users or guests can place orders" 
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update orders" 
  ON public.orders FOR UPDATE USING (public.is_admin());

-- ORDER ITEMS Policies
CREATE POLICY "Users can view items in their orders" 
  ON public.order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Anyone can insert order items when creating order" 
  ON public.order_items FOR INSERT WITH CHECK (true);

-- REVIEWS Policies
CREATE POLICY "Reviews viewable by anyone" 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post reviews" 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reviews" 
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- 13. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- To enable product photo uploads directly to Supabase CDN:
-- 1. Create a public storage bucket named 'products' in Supabase Dashboard -> Storage
-- 2. Run the policies below:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Product images are publicly accessible" 
  ON storage.objects FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images" 
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'products' AND public.is_admin()
  );

CREATE POLICY "Admins can delete product images" 
  ON storage.objects FOR DELETE USING (
    bucket_id = 'products' AND public.is_admin()
  );
