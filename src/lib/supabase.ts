import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Agency, 
  Talent, 
  ShootProperty, 
  CastingBrief, 
  Booking, 
  DashboardPersona,
  AuthUser 
} from '../types/index.ts';

// Extract Vite client-side environment variables
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Verify valid URL and anon key format
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('http') && 
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_ANON_KEY.length > 20
  );
};

// Singleton Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ====================================================================
// AUTHENTICATION HELPERS
// ====================================================================

export async function signUpUserWithRole(
  email: string,
  password: string,
  role: DashboardPersona,
  metadata: {
    fullName: string;
    city?: string;
    companyName?: string;
    phone?: string;
  }
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured. Falling back to local session.' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: metadata.fullName,
          city: metadata.city || 'Mumbai',
          company_name: metadata.companyName,
          phone: metadata.phone,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const authUser: AuthUser = {
        id: data.user.id,
        name: metadata.fullName,
        email: data.user.email || email,
        role: role,
        token: data.session?.access_token,
      };
      return { user: authUser, error: null };
    }

    return { user: null, error: 'Registration pending verification.' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Unexpected sign up error.' };
  }
}

export async function signInUser(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured. Falling back to local session.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Fetch user profile from public.profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userRole: DashboardPersona = profile?.role || (data.user.user_metadata?.role as DashboardPersona) || 'brand';
      const userName: string = profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];

      const authUser: AuthUser = {
        id: data.user.id,
        name: userName,
        email: data.user.email || email,
        role: userRole,
        avatar: profile?.avatar_url,
        token: data.session?.access_token,
      };

      return { user: authUser, error: null };
    }

    return { user: null, error: 'Invalid authentication credentials.' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Unexpected login error.' };
  }
}

export async function signOutUser(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getActiveSupabaseUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    const userRole: DashboardPersona = profile?.role || (session.user.user_metadata?.role as DashboardPersona) || 'brand';
    const userName: string = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'ModelKart Member';

    return {
      id: session.user.id,
      name: userName,
      email: session.user.email || '',
      role: userRole,
      avatar: profile?.avatar_url,
      token: session.access_token,
    };
  } catch (_) {
    return null;
  }
}

// ====================================================================
// STORAGE: PORTFOLIO & COMP-CARD MEDIA UPLOADS
// ====================================================================

export async function uploadPortfolioFile(file: File): Promise<string> {
  // If Supabase is configured and has storage
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('modelkart-portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('modelkart-portfolio')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (storageErr) {
      console.warn('Supabase storage upload error, falling back to server /api/upload:', storageErr);
    }
  }

  // Graceful fallback to server API endpoint
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          resolve(data.url);
          return;
        }
      } catch (_) {}
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

// ====================================================================
// DATABASE ENTITY QUERIES & MUTATIONS (TALENT, AGENCY, PROPERTY, BOOKING)
// ====================================================================

export async function fetchDbTalents(): Promise<Talent[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('talents')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data) return null;

    return data.map((t: any) => ({
      id: t.id,
      agencyId: t.agency_id || undefined,
      agencyName: t.agency_name || 'Independent Verified Pro',
      name: t.name,
      category: t.category,
      categoryLabel: t.category_label || 'MODEL',
      location: t.location,
      city: t.city,
      editorialHeadline: t.editorial_headline || '',
      dayRateInr: t.day_rate_inr,
      currency: t.currency || 'INR',
      rateHours: t.rate_hours || '8h',
      rating: Number(t.rating) || 5.0,
      primaryImage: t.primary_image,
      lookbookImages: Array.isArray(t.lookbook_images) ? t.lookbook_images : [t.primary_image],
      representation: t.representation || 'agency',
      specs: t.specs || {
        heightCm: 178,
        heightFt: "5'10\"",
        bustCm: 84,
        waistCm: 60,
        hipsCm: 89,
        shoeEu: 40,
        eyeHue: 'Deep Brown',
        hairComplexion: 'Raven Black',
        gender: 'female',
      },
      capabilities: t.capabilities || {
        internationalPassport: true,
        runwayVerified: true,
        sensitivitiesLogged: true,
      },
      skills: t.skills || [],
      editorialCredits: t.editorial_credits || [],
      languages: t.languages || ['English', 'Hindi'],
      bio: t.bio || '',
      availability: t.availability || 'Available',
      verified: Boolean(t.verified),
      instagramHandle: t.instagram_handle,
      followersCount: t.followers_count,
      createdAt: t.created_at,
    }));
  } catch (err) {
    console.warn('Failed to query talents from Supabase:', err);
    return null;
  }
}

export async function insertDbTalent(talent: Talent, userId?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('talents').insert({
      id: talent.id,
      user_id: userId || null,
      agency_id: talent.agencyId || null,
      agency_name: talent.agencyName,
      name: talent.name,
      category: talent.category,
      category_label: talent.categoryLabel,
      location: talent.location,
      city: talent.city,
      editorial_headline: talent.editorialHeadline,
      day_rate_inr: talent.dayRateInr,
      currency: talent.currency,
      rate_hours: talent.rateHours,
      rating: talent.rating,
      primary_image: talent.primaryImage,
      lookbook_images: talent.lookbookImages,
      representation: talent.representation,
      specs: talent.specs,
      capabilities: talent.capabilities,
      skills: talent.skills,
      editorial_credits: talent.editorialCredits,
      languages: talent.languages,
      bio: talent.bio,
      availability: talent.availability,
      verified: talent.verified,
      instagram_handle: talent.instagramHandle,
    });
    return !error;
  } catch (_) {
    return false;
  }
}

export async function updateDbTalent(talent: Talent): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('talents')
      .update({
        name: talent.name,
        category: talent.category,
        category_label: talent.categoryLabel,
        city: talent.city,
        editorial_headline: talent.editorialHeadline,
        day_rate_inr: talent.dayRateInr,
        primary_image: talent.primaryImage,
        specs: talent.specs,
        bio: talent.bio,
        availability: talent.availability,
        verified: talent.verified,
      })
      .eq('id', talent.id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function deleteDbTalent(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('talents').delete().eq('id', id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function fetchDbAgencies(): Promise<Agency[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('established_year', { ascending: true });

    if (error || !data) return null;

    return data.map((a: any) => ({
      id: a.id,
      name: a.name,
      tier: a.tier,
      city: a.city,
      country: a.country || 'India',
      establishedYear: a.established_year,
      rosterCount: a.roster_count || 0,
      rating: Number(a.rating) || 5.0,
      escrowStatus: a.escrow_status || '100% Escrow Protected',
      description: a.description || '',
      bookerName: a.booker_name,
      bookerEmail: a.booker_email,
      bookerPhone: a.booker_phone || '',
      website: a.website || '',
      logo: a.logo || 'AG',
      coverImage: a.cover_image,
      verified: Boolean(a.verified),
      specialization: a.specialization || 'High Fashion',
      isCustom: Boolean(a.is_custom),
    }));
  } catch (err) {
    console.warn('Failed to query agencies from Supabase:', err);
    return null;
  }
}

export async function insertDbAgency(agency: Agency, userId?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('agencies').insert({
      id: agency.id,
      user_id: userId || null,
      name: agency.name,
      tier: agency.tier,
      city: agency.city,
      country: agency.country,
      established_year: agency.establishedYear,
      roster_count: agency.rosterCount,
      rating: agency.rating,
      escrow_status: agency.escrowStatus,
      description: agency.description,
      booker_name: agency.bookerName,
      booker_email: agency.bookerEmail,
      booker_phone: agency.bookerPhone,
      website: agency.website,
      logo: agency.logo,
      cover_image: agency.coverImage,
      verified: agency.verified,
      specialization: agency.specialization,
      is_custom: agency.isCustom,
    });
    return !error;
  } catch (_) {
    return false;
  }
}

export async function updateDbAgency(agency: Agency): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('agencies')
      .update({
        name: agency.name,
        tier: agency.tier,
        city: agency.city,
        description: agency.description,
        booker_name: agency.bookerName,
        booker_email: agency.bookerEmail,
        website: agency.website,
        verified: agency.verified,
        specialization: agency.specialization,
      })
      .eq('id', agency.id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function fetchDbProperties(): Promise<ShootProperty[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data) return null;

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      city: p.city,
      locationDetails: p.location_details,
      dailyRateInr: p.daily_rate_inr,
      capacity: p.capacity,
      squareFeet: p.square_feet || 3000,
      heroImage: p.hero_image,
      galleryImages: Array.isArray(p.gallery_images) ? p.gallery_images : [p.hero_image],
      amenities: p.amenities || [],
      description: p.description || '',
      ownerName: p.owner_name,
      ownerEmail: p.owner_email,
      ownerPhone: p.owner_phone || '',
      availableFor: p.available_for || ['Photoshoots', 'Ad Films'],
      rating: Number(p.rating) || 5.0,
      verified: Boolean(p.verified),
    }));
  } catch (err) {
    console.warn('Failed to query properties from Supabase:', err);
    return null;
  }
}

export async function insertDbProperty(property: ShootProperty, userId?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('properties').insert({
      id: property.id,
      owner_id: userId || null,
      name: property.name,
      category: property.category,
      city: property.city,
      location_details: property.locationDetails,
      daily_rate_inr: property.dailyRateInr,
      capacity: property.capacity,
      square_feet: property.squareFeet,
      hero_image: property.heroImage,
      gallery_images: property.galleryImages,
      amenities: property.amenities,
      description: property.description,
      owner_name: property.ownerName,
      owner_email: property.ownerEmail,
      owner_phone: property.ownerPhone,
      available_for: property.availableFor,
      rating: property.rating,
      verified: property.verified,
    });
    return !error;
  } catch (_) {
    return false;
  }
}

export async function updateDbProperty(property: ShootProperty): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('properties')
      .update({
        name: property.name,
        category: property.category,
        city: property.city,
        daily_rate_inr: property.dailyRateInr,
        capacity: property.capacity,
        hero_image: property.heroImage,
        description: property.description,
        amenities: property.amenities,
        verified: property.verified,
      })
      .eq('id', property.id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function deleteDbProperty(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function fetchDbBookings(): Promise<Booking[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((b: any) => ({
      id: b.id,
      type: b.type,
      itemId: b.item_id,
      itemName: b.item_name,
      itemImage: b.item_image,
      providerName: b.provider_name,
      clientName: b.client_name,
      projectTitle: b.project_title,
      dates: b.dates,
      totalAmountInr: b.total_amount_inr,
      totalEscrow: b.total_escrow,
      agencyId: b.agency_id || undefined,
      agencyName: b.agency_name,
      talentId: b.talent_id || undefined,
      talentName: b.talent_name,
      status: b.status,
      milestones: b.milestones || [],
      createdAt: b.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.warn('Failed to query bookings from Supabase:', err);
    return null;
  }
}

export async function insertDbBooking(booking: Booking, userId?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('bookings').insert({
      id: booking.id,
      client_user_id: userId || null,
      type: booking.type,
      item_id: booking.itemId,
      item_name: booking.itemName,
      item_image: booking.itemImage,
      provider_name: booking.providerName,
      client_name: booking.clientName,
      project_title: booking.projectTitle,
      dates: booking.dates,
      total_amount_inr: booking.totalAmountInr,
      total_escrow: booking.totalEscrow,
      agency_id: booking.agencyId || null,
      agency_name: booking.agencyName,
      talent_id: booking.talentId || null,
      talent_name: booking.talentName,
      status: booking.status,
      milestones: booking.milestones,
    });
    return !error;
  } catch (_) {
    return false;
  }
}

export async function updateDbBookingStatus(id: string, status: Booking['status'], milestones: any[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status, milestones })
      .eq('id', id);
    return !error;
  } catch (_) {
    return false;
  }
}

export async function fetchDbCastingBriefs(): Promise<CastingBrief[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('casting_briefs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((cb: any) => ({
      id: cb.id,
      title: cb.title,
      brandOrProduction: cb.brand_or_production,
      talentCategory: cb.talent_category || 'all',
      location: cb.location,
      city: cb.city,
      shootDates: cb.shoot_dates,
      budgetMinInr: cb.budget_min_inr,
      budgetMaxInr: cb.budget_max_inr,
      deadline: cb.deadline,
      talentRequirements: cb.talent_requirements,
      ageRequirement: cb.age_requirement,
      status: cb.status || 'Open for Submissions',
      submittedTalents: cb.submitted_talents || [],
      postedBy: cb.posted_by,
      createdAt: cb.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    }));
  } catch (err) {
    console.warn('Failed to query briefs from Supabase:', err);
    return null;
  }
}

export async function insertDbCastingBrief(brief: CastingBrief, userId?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('casting_briefs').insert({
      id: brief.id,
      user_id: userId || null,
      title: brief.title,
      brand_or_production: brief.brandOrProduction,
      talent_category: brief.talentCategory,
      location: brief.location,
      city: brief.city,
      shoot_dates: brief.shootDates,
      budget_min_inr: brief.budgetMinInr,
      budget_max_inr: brief.budgetMaxInr,
      deadline: brief.deadline,
      talent_requirements: brief.talentRequirements,
      status: brief.status,
      submitted_talents: brief.submittedTalents,
      posted_by: brief.postedBy,
    });
    return !error;
  } catch (_) {
    return false;
  }
}

export async function submitDbTalentToBrief(briefId: string, submission: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data: brief } = await supabase
      .from('casting_briefs')
      .select('submitted_talents')
      .eq('id', briefId)
      .single();

    const existing = brief?.submitted_talents || [];
    const updated = [...existing, submission];

    const { error } = await supabase
      .from('casting_briefs')
      .update({ submitted_talents: updated })
      .eq('id', briefId);

    return !error;
  } catch (_) {
    return false;
  }
}
