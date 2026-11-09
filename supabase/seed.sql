-- ====================================================================
-- MODELKART: Seed Data for Haute Couture Agencies, Talents & Properties
-- ====================================================================

-- Agencies
INSERT INTO public.agencies (id, name, tier, city, country, established_year, roster_count, rating, escrow_status, description, booker_name, booker_email, booker_phone, website, logo, verified, specialization, is_custom)
VALUES 
(
  'agency-anima',
  'Anima Creative Management',
  'Accredited Tier 1',
  'Mumbai',
  'India',
  2008,
  48,
  4.98,
  '100% Escrow Protected',
  'India''s premier talent agency representing international models, creative directors, and high-fashion editorial icons.',
  'Mark Luburic & Gunita Stobe',
  'bookings@animacreatives.com',
  '+91 22 6123 4500',
  'https://animacreatives.com',
  'ANIMA',
  true,
  'Haute Couture, Paris & Milan Fashion Week',
  false
),
(
  'agency-inega',
  'Inega Models & Talent',
  'National Major',
  'Mumbai',
  'India',
  1998,
  62,
  4.92,
  '100% Escrow Protected',
  'A trailblazing management atelier representing top runway models, leading actors, celebrity stylists, and HMUAs.',
  'Anuj Saxena',
  'inquiries@inega.in',
  '+91 22 2640 8899',
  'https://inega.in',
  'INEGA',
  true,
  'Runway, Advertising Campaigns & Cinema',
  false
),
(
  'agency-toabh',
  'TOABH Entertainment & Models',
  'Accredited Tier 1',
  'Mumbai',
  'India',
  2008,
  54,
  4.95,
  '100% Escrow Protected',
  'Elite talent management house spearheading international placements in Paris, New York, and London fashion markets.',
  'Sangeeta Bhatia',
  'bookers@toabh.com',
  '+91 22 4004 2200',
  'https://toabh.com',
  'TOABH',
  true,
  'International Editorial & Brand Campaigns',
  false
),
(
  'agency-feat',
  'Feat. Artists',
  'Boutique Luxury',
  'Delhi NCR',
  'India',
  2015,
  35,
  4.89,
  '100% Escrow Protected',
  'Boutique creative agency representing visionary fashion photographers, avant-garde makeup artists, and art directors.',
  'Gaurav Bhatia',
  'curate@featartists.com',
  '+91 11 4100 7820',
  'https://featartists.com',
  'FEAT',
  true,
  'Avant-Garde Beauty, Editorial Photography',
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  verified = EXCLUDED.verified;

-- Talents
INSERT INTO public.talents (
  id, agency_id, agency_name, name, category, category_label, location, city, editorial_headline,
  day_rate_inr, currency, rate_hours, rating, primary_image, lookbook_images, representation,
  specs, capabilities, skills, editorial_credits, languages, bio, availability, verified, instagram_handle
)
VALUES
(
  'talent-aarohi-sen',
  'agency-anima',
  'Anima Creative Management',
  'Aarohi Sen',
  'models-female',
  'HIGH FASHION',
  'Mumbai, India',
  'Mumbai',
  'VOGUE India Cover · Lakmé Absolute Grand Finale Exclusive',
  95000,
  'INR',
  '8h',
  4.98,
  '/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg',
  '["/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg"]'::jsonb,
  'exclusive',
  '{"heightCm": 179, "heightFt": "5''10.5\"", "bustCm": 83, "waistCm": 59, "hipsCm": 88, "shoeEu": 40, "eyeHue": "Deep Brown", "hairComplexion": "Raven Black", "gender": "female", "age": 23}'::jsonb,
  '{"internationalPassport": true, "runwayVerified": true, "sensitivitiesLogged": true}'::jsonb,
  ARRAY['Haute Couture Stride', 'Editorial Silhouette', 'Sabyasachi Heritage Drape', 'Commercial Video'],
  ARRAY['Vogue India (Oct 2024)', 'Harper''s Bazaar Bride', 'Lakmé Fashion Week Finale'],
  ARRAY['English', 'Hindi', 'Bengali'],
  'Aarohi Sen is India''s foremost new-generation runway presence, known for her magnetic editorial eyes and commanding couture presence.',
  'Available',
  true,
  '@aarohi.sen'
),
(
  'talent-kabir-oberoi',
  'agency-inega',
  'Inega Models & Talent',
  'Kabir Oberoi',
  'models-male',
  'MENSWEAR & RUNWAY',
  'Delhi NCR, India',
  'Delhi NCR',
  'GQ Men of the Year · Tarun Tahiliani Menswear Campaign',
  85000,
  'INR',
  '8h',
  4.94,
  '/src/assets/images/model_indian_male_editorial_1794221427349.jpg',
  '["/src/assets/images/model_indian_male_editorial_1794221427349.jpg"]'::jsonb,
  'agency',
  '{"heightCm": 188, "heightFt": "6''2\"", "bustCm": 99, "chestCm": 100, "waistCm": 78, "hipsCm": 94, "shoeEu": 44, "eyeHue": "Obsidian Black", "hairComplexion": "Raven Black", "gender": "male", "age": 26}'::jsonb,
  '{"internationalPassport": true, "runwayVerified": true, "sensitivitiesLogged": true}'::jsonb,
  ARRAY['Tailored Menswear', 'Runway Walk', 'High Performance Fitness', 'Action Stunts'],
  ARRAY['GQ India Editorial', 'FDCI Men''s Fashion Week', 'Raw Mango Autumn Campaign'],
  ARRAY['English', 'Hindi', 'Punjabi'],
  'Kabir Oberoi represents contemporary Indian masculine luxury, featuring sharp sculptural jawline and commanding presence.',
  'Available',
  true,
  '@kabiroberoi'
),
(
  'talent-rohan-mehta-lens',
  'agency-feat',
  'Feat. Artists',
  'Rohan Mehta',
  'photographers-fashion',
  'FASHION PHOTOGRAPHER',
  'Mumbai, India',
  'Mumbai',
  'Elle India Photographer of the Year · Medium Format Analog Specialist',
  140000,
  'INR',
  '10h',
  4.97,
  '/src/assets/images/creative_photographer_indian_studio_1794221427381.jpg',
  '["/src/assets/images/creative_photographer_indian_studio_1794221427381.jpg"]'::jsonb,
  'exclusive',
  '{"heightCm": 182, "heightFt": "6''0\"", "bustCm": 90, "waistCm": 76, "hipsCm": 90, "shoeEu": 42, "eyeHue": "Deep Brown", "hairComplexion": "Raven Black", "gender": "male"}'::jsonb,
  '{"internationalPassport": true, "runwayVerified": false, "sensitivitiesLogged": true}'::jsonb,
  ARRAY['Hasselblad Digital Back', 'Chiaroscuro Cinematic Lighting', 'Location Scout'],
  ARRAY['Vogue India Covers', 'Harper''s Bazaar Editorial', 'Sabyasachi Jewelry Global Campaign'],
  ARRAY['English', 'Hindi'],
  'Specialising in cinematic high-fashion storytelling with mastery over both natural daylight and high-drama strobe work.',
  'Available',
  true,
  '@rohanmehtastudio'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  verified = EXCLUDED.verified;

-- Properties
INSERT INTO public.properties (
  id, name, category, city, location_details, daily_rate_inr, capacity, square_feet,
  hero_image, gallery_images, amenities, description, owner_name, owner_email, owner_phone,
  available_for, rating, verified
)
VALUES
(
  'prop-villa-beleza-goa',
  'Villa Beleza Portuguese Heritage Estate',
  'Luxury Villas',
  'Goa',
  'Assagao, North Goa',
  95000,
  'Up to 35 Crew',
  6500,
  '/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg',
  '["/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg"]'::jsonb,
  ARRAY['Private Reflection Pool', 'Heritage Terracotta Courtyard', 'AC Green Rooms', '100kVA Generator Backup', 'Chef''s Kitchen for Catering'],
  'A 19th-century restored Portuguese mansion surrounded by lush tropical landscaping in Assagao, designed for resort wear shoots.',
  'Carlos De Souza',
  'estates@villabeleza.com',
  '+91 832 245 8890',
  ARRAY['Photoshoots', 'Ad Films', 'Fashion Shows'],
  4.96,
  true
),
(
  'prop-studio-ciel-mumbai',
  'Studio Le Ciel High Daylight Cyclorama',
  'Photography Studios',
  'Mumbai',
  'Lower Parel, Mumbai',
  85000,
  'Up to 50 Crew',
  4200,
  '/src/assets/images/creative_photographer_indian_studio_1794221427381.jpg',
  '["/src/assets/images/creative_photographer_indian_studio_1794221427381.jpg"]'::jsonb,
  ARRAY['Infinity Cyclorama (30ft x 25ft)', '16ft Ceiling Height', 'Profoto Pro-11 Generators & Heads', 'Three Private Hair & Makeup Suites', 'Heavy Cargo Elevator'],
  'Mumbai''s premier high-ceiling daylight atelier in Lower Parel, featuring floor-to-ceiling north-facing windows.',
  'Vikramaditya Shroff',
  'bookings@studiociel.in',
  '+91 22 4900 1122',
  ARRAY['Photoshoots', 'Ad Films', 'Fashion Shows'],
  4.98,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  verified = EXCLUDED.verified;
