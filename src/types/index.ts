export type TalentMainCategory = 
  | 'models-female'
  | 'models-male'
  | 'models-kids'
  | 'models-commercial'
  | 'models-plus-size'
  | 'models-fitness'
  | 'actors'
  | 'influencers'
  | 'photographers-fashion'
  | 'photographers-product'
  | 'videographers'
  | 'makeup-artists'
  | 'hair-stylists'
  | 'fashion-stylists'
  | 'choreographers'
  | 'creative-directors';

export type IndianMetro = 'Mumbai' | 'Delhi NCR' | 'Bangalore' | 'Goa' | 'Jaipur' | 'Udaipur' | 'Hyderabad' | 'Chennai' | 'Kolkata' | 'International';

export type PropertyCategory = 
  | 'Photography Studios'
  | 'Luxury Villas'
  | 'Resorts & Hotels'
  | 'Heritage Havelis & Palaces'
  | 'Outdoor Locations'
  | 'Rooftops'
  | 'Event Venues & Banquet Halls';

export type EyeHue = 'Emerald Green' | 'Ice Blue' | 'Deep Brown' | 'Obsidian Black' | 'Hazel';
export type HairComplexion = 'Platinum' | 'Brunette' | 'Raven Black' | 'Copper / Red' | 'Honey Blonde';

export interface PhysicalSpecs {
  heightCm: number;
  heightFt: string;
  bustCm: number;
  chestCm?: number;
  waistCm: number;
  hipsCm: number;
  shoeEu: number;
  eyeHue: EyeHue;
  hairComplexion: HairComplexion;
  gender: 'female' | 'male' | 'non-binary';
  age?: number;
}

export interface Talent {
  id: string;
  agencyId?: string;
  agencyName: string;
  name: string;
  category: TalentMainCategory;
  categoryLabel: string;
  location: string;
  city: IndianMetro;
  editorialHeadline: string;
  dayRateInr: number;
  currency: 'INR' | 'USD' | 'EUR';
  rateHours: string;
  rating: number;
  primaryImage: string;
  lookbookImages: string[];
  representation: 'agency' | 'freelance' | 'exclusive';
  specs: PhysicalSpecs;
  capabilities: {
    internationalPassport: boolean;
    runwayVerified: boolean;
    sensitivitiesLogged: boolean;
  };
  skills: string[];
  editorialCredits: string[];
  languages: string[];
  bio: string;
  availability: 'Available' | 'Optioned' | 'Booked';
  verified: boolean;
  instagramHandle?: string;
  followersCount?: string;
  createdAt?: string;
}

export interface Agency {
  id: string;
  name: string;
  tier: 'Accredited Tier 1' | 'Boutique Luxury' | 'National Major' | 'Independent Collective';
  city: IndianMetro;
  country: string;
  establishedYear: number;
  rosterCount: number;
  rating: number;
  escrowStatus: string;
  description: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string;
  website: string;
  logo: string;
  coverImage?: string;
  verified: boolean;
  specialization: string;
  isCustom?: boolean;
}

export interface ShootProperty {
  id: string;
  name: string;
  category: PropertyCategory;
  city: IndianMetro;
  locationDetails: string;
  dailyRateInr: number;
  capacity: string;
  squareFeet: number;
  heroImage: string;
  galleryImages: string[];
  amenities: string[];
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availableFor: ('Photoshoots' | 'Ad Films' | 'Fashion Shows' | 'Events')[];
  rating: number;
  verified: boolean;
}

export interface CastingSubmission {
  talentId: string;
  agencyId?: string;
  submittedAt: string;
  note: string;
}

export interface CastingBrief {
  id: string;
  title: string;
  brandOrProduction: string;
  talentCategory: TalentMainCategory | 'all';
  location: string;
  city: IndianMetro;
  shootDates: string;
  budgetMinInr: number;
  budgetMaxInr: number;
  deadline: string;
  talentRequirements: string;
  ageRequirement?: string;
  status: 'Open for Submissions' | 'Auditioning' | 'Cast Closed';
  submittedTalents: CastingSubmission[];
  postedBy: string;
  createdAt: string;
}

export type CreativeSpecialty = TalentMainCategory;
export type MetroMarket = IndianMetro | 'paris' | 'milan' | 'nyc' | 'london';

export interface Booking {
  id: string;
  type: 'talent' | 'property';
  itemId: string;
  itemName: string;
  itemImage: string;
  providerName: string;
  clientName: string;
  projectTitle: string;
  dates: string;
  totalAmountInr: number;
  totalEscrow?: number;
  agencyId?: string;
  agencyName?: string;
  talentId?: string;
  talentName?: string;
  callSheetDate?: string;
  currency?: string;
  status: 'Escrow Funded' | 'Confirmed Call Sheet' | 'In Shoot' | 'Completed & Released' | 'Pending Review';
  milestones: { step: string; status: 'completed' | 'current' | 'pending' }[];
  createdAt: string;
}

export interface ParametricFilters {
  category: string;
  city: string;
  gender?: string;
  minHeight: number;
  maxHeight: number;
  minRate: number;
  maxRate: number;
  selectedEyeHues: EyeHue[];
  selectedHairComplexions: HairComplexion[];
  verifiedOnly: boolean;
  searchQuery: string;
  sortBy: 'recommended' | 'rate-low' | 'rate-high' | 'popular' | 'verified' | 'authority' | 'availability';
  agencyFilter?: string;
  callSheetDate?: string;
  representation?: {
    agency: boolean;
    freelance: boolean;
    union: boolean;
  };
  capabilities?: {
    passport: boolean;
    runwayWalk: boolean;
    sensitivities: boolean;
  };
}

export type DashboardPersona = 'talent' | 'agency' | 'property' | 'brand' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: DashboardPersona;
  avatar?: string;
  token?: string;
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
