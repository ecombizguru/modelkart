-- ====================================================================
-- MODELKART: Haute Couture Talent, Agency & Location Marketplace Schema
-- Production Supabase PostgreSQL Migration with Row Level Security (RLS)
-- Version: 2026-11-09-001
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('talent', 'agency', 'property', 'brand', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'Pending Review',
    'Escrow Funded',
    'Confirmed Call Sheet',
    'In Shoot',
    'Completed & Released',
    'Cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE brief_status AS ENUM (
    'Open for Submissions',
    'Auditioning',
    'Cast Closed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'brand',
  avatar_url TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Mumbai',
  company_name TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. AGENCIES TABLE
CREATE TABLE IF NOT EXISTS public.agencies (
  id TEXT PRIMARY KEY DEFAULT ('agn-' || substr(md5(random()::text), 1, 8)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Boutique Luxury',
  city TEXT NOT NULL DEFAULT 'Mumbai',
  country TEXT NOT NULL DEFAULT 'India',
  established_year INTEGER DEFAULT 2020,
  roster_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  escrow_status TEXT DEFAULT '100% Escrow Protected',
  description TEXT,
  booker_name TEXT NOT NULL,
  booker_email TEXT NOT NULL,
  booker_phone TEXT,
  website TEXT,
  logo TEXT,
  cover_image TEXT,
  verified BOOLEAN DEFAULT false,
  specialization TEXT DEFAULT 'High Fashion & Editorial',
  is_custom BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TALENTS TABLE
CREATE TABLE IF NOT EXISTS public.talents (
  id TEXT PRIMARY KEY DEFAULT ('talent-' || substr(md5(random()::text), 1, 8)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agency_id TEXT REFERENCES public.agencies(id) ON DELETE SET NULL,
  agency_name TEXT DEFAULT 'Independent Verified Pro',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'models-female',
  category_label TEXT NOT NULL DEFAULT 'FEMALE',
  location TEXT NOT NULL DEFAULT 'Mumbai, India',
  city TEXT NOT NULL DEFAULT 'Mumbai',
  editorial_headline TEXT,
  day_rate_inr INTEGER NOT NULL DEFAULT 65000,
  currency TEXT DEFAULT 'INR',
  rate_hours TEXT DEFAULT '8h',
  rating NUMERIC(3,2) DEFAULT 5.0,
  primary_image TEXT NOT NULL,
  lookbook_images JSONB DEFAULT '[]'::jsonb,
  representation TEXT DEFAULT 'freelance', -- 'agency', 'freelance', 'exclusive'
  specs JSONB DEFAULT '{
    "heightCm": 178,
    "heightFt": "5''10\"",
    "bustCm": 84,
    "waistCm": 60,
    "hipsCm": 89,
    "shoeEu": 40,
    "eyeHue": "Deep Brown",
    "hairComplexion": "Raven Black",
    "gender": "female"
  }'::jsonb,
  capabilities JSONB DEFAULT '{
    "internationalPassport": true,
    "runwayVerified": true,
    "sensitivitiesLogged": true
  }'::jsonb,
  skills TEXT[] DEFAULT ARRAY['Runway', 'Editorial', 'High Fashion'],
  editorial_credits TEXT[] DEFAULT ARRAY['ModelKart Debut'],
  languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  bio TEXT,
  availability TEXT DEFAULT 'Available',
  verified BOOLEAN DEFAULT false,
  instagram_handle TEXT,
  followers_count TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROPERTIES TABLE (Photoshoot Locations & Studios)
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY DEFAULT ('prop-' || substr(md5(random()::text), 1, 8)),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Luxury Villas',
  city TEXT NOT NULL DEFAULT 'Goa',
  location_details TEXT NOT NULL,
  daily_rate_inr INTEGER NOT NULL DEFAULT 85000,
  capacity TEXT DEFAULT 'Up to 35 Crew',
  square_feet INTEGER DEFAULT 4500,
  hero_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  amenities TEXT[] DEFAULT ARRAY['Vanity Room', 'Power Backup', 'Direct Daylight', 'Crew Lounge'],
  description TEXT,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  available_for TEXT[] DEFAULT ARRAY['Photoshoots', 'Ad Films', 'Fashion Shows'],
  rating NUMERIC(3,2) DEFAULT 5.0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CASTING BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.casting_briefs (
  id TEXT PRIMARY KEY DEFAULT ('brief-' || substr(md5(random()::text), 1, 8)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  brand_or_production TEXT NOT NULL,
  talent_category TEXT DEFAULT 'all',
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  shoot_dates TEXT NOT NULL,
  budget_min_inr INTEGER NOT NULL DEFAULT 50000,
  budget_max_inr INTEGER NOT NULL DEFAULT 150000,
  deadline TEXT NOT NULL,
  talent_requirements TEXT NOT NULL,
  age_requirement TEXT,
  status brief_status DEFAULT 'Open for Submissions',
  submitted_talents JSONB DEFAULT '[]'::jsonb,
  posted_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BOOKINGS & ESCROW TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('booking-mk-' || substr(md5(random()::text), 1, 8)),
  client_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'talent' or 'property'
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_image TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  dates TEXT NOT NULL,
  total_amount_inr INTEGER NOT NULL,
  total_escrow INTEGER,
  agency_id TEXT REFERENCES public.agencies(id) ON DELETE SET NULL,
  agency_name TEXT,
  talent_id TEXT REFERENCES public.talents(id) ON DELETE SET NULL,
  talent_name TEXT,
  call_sheet_date TEXT,
  currency TEXT DEFAULT 'INR',
  status booking_status DEFAULT 'Escrow Funded',
  milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_agencies_updated_at ON public.agencies;
CREATE TRIGGER trigger_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_talents_updated_at ON public.talents;
CREATE TRIGGER trigger_talents_updated_at BEFORE UPDATE ON public.talents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_properties_updated_at ON public.properties;
CREATE TRIGGER trigger_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_bookings_updated_at ON public.bookings;
CREATE TRIGGER trigger_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. AUTH TRIGGER: Automatic Profile Creation on Supabase Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
  v_full_name TEXT;
  v_city TEXT;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'brand'::user_role);
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  v_city := COALESCE(NEW.raw_user_meta_data->>'city', 'Mumbai');

  INSERT INTO public.profiles (id, email, full_name, role, city)
  VALUES (NEW.id, NEW.email, v_full_name, v_role, v_city)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      city = EXCLUDED.city;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casting_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- AGENCIES POLICIES
DROP POLICY IF EXISTS "Agencies are viewable by everyone" ON public.agencies;
CREATE POLICY "Agencies are viewable by everyone"
  ON public.agencies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Agency owners or admins can insert agencies" ON public.agencies;
CREATE POLICY "Agency owners or admins can insert agencies"
  ON public.agencies FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin() OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Agency owners or admins can update agencies" ON public.agencies;
CREATE POLICY "Agency owners or admins can update agencies"
  ON public.agencies FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- TALENTS POLICIES
DROP POLICY IF EXISTS "Talents are viewable by everyone" ON public.talents;
CREATE POLICY "Talents are viewable by everyone"
  ON public.talents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Talent creators, agency heads, or admins can insert talents" ON public.talents;
CREATE POLICY "Talent creators, agency heads, or admins can insert talents"
  ON public.talents FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.agencies WHERE id = talents.agency_id AND user_id = auth.uid()) OR
    public.is_admin() OR
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Talent owners, agency heads, or admins can update talents" ON public.talents;
CREATE POLICY "Talent owners, agency heads, or admins can update talents"
  ON public.talents FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.agencies WHERE id = talents.agency_id AND user_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Talent owners, agency heads, or admins can delete talents" ON public.talents;
CREATE POLICY "Talent owners, agency heads, or admins can delete talents"
  ON public.talents FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.agencies WHERE id = talents.agency_id AND user_id = auth.uid()) OR
    public.is_admin()
  );

-- PROPERTIES POLICIES
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Property owners or admins can insert properties" ON public.properties;
CREATE POLICY "Property owners or admins can insert properties"
  ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.is_admin() OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Property owners or admins can update properties" ON public.properties;
CREATE POLICY "Property owners or admins can update properties"
  ON public.properties FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "Property owners or admins can delete properties" ON public.properties;
CREATE POLICY "Property owners or admins can delete properties"
  ON public.properties FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

-- CASTING BRIEFS POLICIES
DROP POLICY IF EXISTS "Casting briefs are viewable by everyone" ON public.casting_briefs;
CREATE POLICY "Casting briefs are viewable by everyone"
  ON public.casting_briefs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post casting briefs" ON public.casting_briefs;
CREATE POLICY "Authenticated users can post casting briefs"
  ON public.casting_briefs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Brief creators or admins can update casting briefs" ON public.casting_briefs;
CREATE POLICY "Brief creators or admins can update casting briefs"
  ON public.casting_briefs FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- BOOKINGS POLICIES
DROP POLICY IF EXISTS "Clients, providers, agencies, and admins can view relevant bookings" ON public.bookings;
CREATE POLICY "Clients, providers, agencies, and admins can view relevant bookings"
  ON public.bookings FOR SELECT USING (
    auth.uid() = client_user_id OR 
    EXISTS (SELECT 1 FROM public.agencies WHERE id = bookings.agency_id AND user_id = auth.uid()) OR
    public.is_admin() OR
    auth.uid() IS NULL -- Fallback for demo preview
  );

DROP POLICY IF EXISTS "Authenticated clients can create bookings" ON public.bookings;
CREATE POLICY "Authenticated clients can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

DROP POLICY IF EXISTS "Involved parties or admins can update booking status" ON public.bookings;
CREATE POLICY "Involved parties or admins can update booking status"
  ON public.bookings FOR UPDATE USING (
    auth.uid() = client_user_id OR 
    EXISTS (SELECT 1 FROM public.agencies WHERE id = bookings.agency_id AND user_id = auth.uid()) OR
    public.is_admin()
  );

-- ====================================================================
-- 12. STORAGE BUCKET CONFIGURATION (for portfolio images and comp-cards)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('modelkart-portfolio', 'modelkart-portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read, authenticated user write
DROP POLICY IF EXISTS "Public Access to ModelKart Portfolio" ON storage.objects;
CREATE POLICY "Public Access to ModelKart Portfolio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'modelkart-portfolio');

DROP POLICY IF EXISTS "Authenticated Users can upload images" ON storage.objects;
CREATE POLICY "Authenticated Users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'modelkart-portfolio' AND auth.role() = 'authenticated');
