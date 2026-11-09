import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Agency, 
  Talent, 
  ShootProperty, 
  CastingBrief, 
  Booking, 
  ParametricFilters, 
  DashboardPersona,
  IndianMetro,
  AuthUser,
  NotificationToast
} from '../types/index.ts';
import { 
  INITIAL_AGENCIES, 
  INITIAL_TALENTS, 
  INITIAL_PROPERTIES, 
  INITIAL_CASTING_BRIEFS, 
  INITIAL_BOOKINGS 
} from '../data/mockData.ts';
import {
  isSupabaseConfigured,
  supabase,
  signInUser,
  signUpUserWithRole,
  signOutUser,
  getActiveSupabaseUser,
  uploadPortfolioFile,
  fetchDbTalents,
  insertDbTalent,
  updateDbTalent,
  deleteDbTalent,
  fetchDbAgencies,
  insertDbAgency,
  updateDbAgency,
  fetchDbProperties,
  insertDbProperty,
  updateDbProperty,
  deleteDbProperty,
  fetchDbBookings,
  insertDbBooking,
  updateDbBookingStatus,
  fetchDbCastingBriefs,
  insertDbCastingBrief,
  submitDbTalentToBrief
} from '../lib/supabase.ts';

interface TalentAgencyContextType {
  agencies: Agency[];
  talents: Talent[];
  properties: ShootProperty[];
  castingBriefs: CastingBrief[];
  bookings: Booking[];
  shortlist: string[];
  
  // Supabase State
  isSupabaseConnected: boolean;

  // Auth & Session
  currentUser: AuthUser | null;
  login: (persona: DashboardPersona, email?: string, password?: string) => Promise<boolean>;
  signUp: (email: string, password: string, role: DashboardPersona, metadata: { fullName: string; city?: IndianMetro; phone?: string; companyName?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Toasts
  toasts: NotificationToast[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Admin Verification
  adminVerifyEntity: (entityType: 'agency' | 'talent' | 'property' | 'booking', entityId: string, verified?: boolean, escrowRelease?: boolean) => Promise<boolean>;

  // Dashboard Persona & Switcher
  activePersona: DashboardPersona;
  setActivePersona: (persona: DashboardPersona) => void;
  selectedAgencyId: string;
  setSelectedAgencyId: (id: string) => void;

  // Selected Entities for Modals & Views
  activeTalentForCompCard: Talent | null;
  setActiveTalentForCompCard: (talent: Talent | null) => void;
  activePropertyForDetails: ShootProperty | null;
  setActivePropertyForDetails: (prop: ShootProperty | null) => void;
  activeTalentForBooking: Talent | null;
  setActiveTalentForBooking: (talent: Talent | null) => void;
  activePropertyForBooking: ShootProperty | null;
  setActivePropertyForBooking: (prop: ShootProperty | null) => void;

  // Editing Entities
  editingTalent: Talent | null;
  setEditingTalent: (talent: Talent | null) => void;
  editingProperty: ShootProperty | null;
  setEditingProperty: (property: ShootProperty | null) => void;
  editingAgency: Agency | null;
  setEditingAgency: (agency: Agency | null) => void;

  // Modal triggers
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  registerInitialPersona: 'talent' | 'agency' | 'property' | 'brand';
  setRegisterInitialPersona: (p: 'talent' | 'agency' | 'property' | 'brand') => void;
  isAddTalentModalOpen: boolean;
  setIsAddTalentModalOpen: (open: boolean) => void;
  isAddPropertyModalOpen: boolean;
  setIsAddPropertyModalOpen: (open: boolean) => void;
  isPostBriefModalOpen: boolean;
  setIsPostBriefModalOpen: (open: boolean) => void;

  // Filters
  filters: ParametricFilters;
  setFilters: (update: Partial<ParametricFilters>) => void;
  resetFilters: () => void;

  // Mutations
  addAgency: (agency: Omit<Agency, 'id'>) => Agency;
  updateAgency: (agency: Agency) => void;
  addTalent: (talent: Omit<Talent, 'id'>) => Talent;
  updateTalent: (talent: Talent) => void;
  deleteTalent: (id: string) => void;
  addProperty: (property: Omit<ShootProperty, 'id' | 'rating' | 'verified'>) => ShootProperty;
  updateProperty: (property: ShootProperty) => void;
  deleteProperty: (id: string) => void;
  toggleShortlist: (id: string) => void;
  clearShortlist: () => void;
  postCastingBrief: (brief: Omit<CastingBrief, 'id' | 'createdAt' | 'submittedTalents'>) => void;
  submitTalentToBrief: (briefId: string, talentId: string, note?: string) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'milestones'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  uploadImageFile: (file: File) => Promise<string>;
  
  // Current active entity helper
  currentAgency: Agency | undefined;
}

const DEFAULT_FILTERS: ParametricFilters = {
  category: 'all',
  city: 'all',
  gender: undefined,
  minHeight: 165,
  maxHeight: 195,
  minRate: 20000,
  maxRate: 500000,
  selectedEyeHues: [],
  selectedHairComplexions: [],
  verifiedOnly: false,
  searchQuery: '',
  sortBy: 'recommended',
  agencyFilter: undefined,
};

const TalentAgencyContext = createContext<TalentAgencyContextType | undefined>(undefined);

export const TalentAgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('modelkart_agencies_in');
    return saved ? JSON.parse(saved) : INITIAL_AGENCIES;
  });

  const [talents, setTalents] = useState<Talent[]>(() => {
    const saved = localStorage.getItem('modelkart_talents_in');
    return saved ? JSON.parse(saved) : INITIAL_TALENTS;
  });

  const [properties, setProperties] = useState<ShootProperty[]>(() => {
    const saved = localStorage.getItem('modelkart_properties_in');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [castingBriefs, setCastingBriefs] = useState<CastingBrief[]>(() => {
    const saved = localStorage.getItem('modelkart_briefs_in');
    return saved ? JSON.parse(saved) : INITIAL_CASTING_BRIEFS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('modelkart_bookings_in');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [shortlist, setShortlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('modelkart_shortlist_in');
    return saved ? JSON.parse(saved) : [];
  });

  const isSupabaseConnected = isSupabaseConfigured();

  // Load from Supabase on mount if configured
  useEffect(() => {
    async function syncSupabase() {
      if (isSupabaseConnected && supabase) {
        try {
          const authUser = await getActiveSupabaseUser();
          if (authUser) {
            setCurrentUser(authUser);
            setActivePersonaState(authUser.role);
          }

          const [dbTalents, dbAgencies, dbProperties, dbBookings, dbBriefs] = await Promise.all([
            fetchDbTalents(),
            fetchDbAgencies(),
            fetchDbProperties(),
            fetchDbBookings(),
            fetchDbCastingBriefs(),
          ]);

          if (dbTalents && dbTalents.length > 0) setTalents(dbTalents);
          if (dbAgencies && dbAgencies.length > 0) setAgencies(dbAgencies);
          if (dbProperties && dbProperties.length > 0) setProperties(dbProperties);
          if (dbBookings && dbBookings.length > 0) setBookings(dbBookings);
          if (dbBriefs && dbBriefs.length > 0) setCastingBriefs(dbBriefs);
        } catch (err) {
          console.warn('Error synchronizing with Supabase database:', err);
        }
      }
    }
    syncSupabase();
  }, [isSupabaseConnected]);

  // Auth and Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('modelkart_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      id: 'usr-sabyasachi-dir',
      name: 'Sabyasachi Creative Atelier',
      email: 'casting@sabyasachi.com',
      role: 'brand',
      token: 'mk-auth-active-prod'
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Navigation and Persona
  const [activePersona, setActivePersonaState] = useState<DashboardPersona>(() => {
    return currentUser ? currentUser.role : 'brand';
  });
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('agency-anima');

  // Modals & Selected Entities
  const [activeTalentForCompCard, setActiveTalentForCompCard] = useState<Talent | null>(null);
  const [activePropertyForDetails, setActivePropertyForDetails] = useState<ShootProperty | null>(null);
  const [activeTalentForBooking, setActiveTalentForBooking] = useState<Talent | null>(null);
  const [activePropertyForBooking, setActivePropertyForBooking] = useState<ShootProperty | null>(null);

  // Editing Entities
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [editingProperty, setEditingProperty] = useState<ShootProperty | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerInitialPersona, setRegisterInitialPersona] = useState<'talent' | 'agency' | 'property' | 'brand'>('agency');
  const [isAddTalentModalOpen, setIsAddTalentModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isPostBriefModalOpen, setIsPostBriefModalOpen] = useState(false);

  const [filters, setFiltersState] = useState<ParametricFilters>(DEFAULT_FILTERS);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActivePersona = (p: DashboardPersona) => {
    setActivePersonaState(p);
    if (currentUser) {
      const updatedUser: AuthUser = { ...currentUser, role: p };
      setCurrentUser(updatedUser);
      localStorage.setItem('modelkart_user_session', JSON.stringify(updatedUser));
    }
  };

  const login = async (persona: DashboardPersona, email?: string, password?: string): Promise<boolean> => {
    // 1. If real email and password provided, authenticate against Supabase Auth
    if (password && email && isSupabaseConnected) {
      const { user, error } = await signInUser(email, password);
      if (user && !error) {
        setCurrentUser(user);
        setActivePersonaState(user.role);
        localStorage.setItem('modelkart_user_session', JSON.stringify(user));
        addToast('Supabase Authentication Verified', `Welcome back, ${user.name}`, 'success');
        return true;
      }
      if (error) {
        addToast('Authentication Failed', error, 'error');
        return false;
      }
    }

    // 2. Demo role or API authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, email })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setActivePersonaState(data.user.role);
        localStorage.setItem('modelkart_user_session', JSON.stringify(data.user));
        addToast('Session Established', `Logged in as ${data.user.name}`, 'success');
        return true;
      }
    } catch (_) {}

    // 3. Resilient fallback
    const roleNameMap: Record<string, string> = {
      talent: 'Aarohi Sen (Top Runway Talent)',
      agency: 'Anima Creative Management (Head Booker)',
      property: 'Casa Beleza Host (Goa Luxury Villa)',
      brand: 'Sabyasachi Creative Atelier (Client Director)',
      admin: 'ModelKart Platform Compliance Admin',
    };

    const fallbackUser: AuthUser = {
      id: `usr-${persona}-${Date.now().toString().slice(-4)}`,
      name: roleNameMap[persona] || 'ModelKart User',
      email: email || `${persona}@modelkart.in`,
      role: persona,
      token: `mk-token-${Date.now()}`
    };

    setCurrentUser(fallbackUser);
    setActivePersonaState(persona);
    localStorage.setItem('modelkart_user_session', JSON.stringify(fallbackUser));
    addToast('Verified Portal Session', `Logged in as ${fallbackUser.name}`, 'success');
    return true;
  };

  const signUp = async (
    email: string,
    password: string,
    role: DashboardPersona,
    metadata: { fullName: string; city?: IndianMetro; phone?: string; companyName?: string }
  ): Promise<{ success: boolean; message?: string }> => {
    if (isSupabaseConnected) {
      const { user, error } = await signUpUserWithRole(email, password, role, metadata);
      if (error) {
        return { success: false, message: error };
      }
      if (user) {
        setCurrentUser(user);
        setActivePersonaState(role);
        localStorage.setItem('modelkart_user_session', JSON.stringify(user));
        addToast('Supabase Account Created', `Welcome to ModelKart, ${user.name}`, 'success');
        return { success: true };
      }
    }

    // Offline / Demo account creation
    const newUser: AuthUser = {
      id: `usr-${role}-${Date.now().toString().slice(-6)}`,
      name: metadata.fullName,
      email,
      role,
      token: `mk-sec-token-${Date.now()}`,
    };
    setCurrentUser(newUser);
    setActivePersonaState(role);
    localStorage.setItem('modelkart_user_session', JSON.stringify(newUser));
    addToast('Account Registered', `Welcome to ModelKart, ${newUser.name}`, 'success');
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConnected) {
      signOutUser();
    }
    setCurrentUser(null);
    localStorage.removeItem('modelkart_user_session');
    addToast('Signed Out', 'You have been safely signed out.', 'info');
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    return await uploadPortfolioFile(file);
  };

  // Admin Server-Side Verification Action
  const adminVerifyEntity = async (
    entityType: 'agency' | 'talent' | 'property' | 'booking',
    entityId: string,
    verified?: boolean,
    escrowRelease?: boolean
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType, entityId, verified, escrowRelease }),
      });
      if (res.ok) {
        // Update local state accordingly
        if (entityType === 'agency') {
          setAgencies(prev => prev.map(a => a.id === entityId ? { ...a, verified: Boolean(verified) } : a));
          addToast('Agency Audit Complete', `Agency ${entityId} verification updated.`, 'success');
        } else if (entityType === 'talent') {
          setTalents(prev => prev.map(t => t.id === entityId ? { ...t, verified: Boolean(verified) } : t));
          addToast('Talent KYC Approved', `Talent comp-card verification updated.`, 'success');
        } else if (entityType === 'property') {
          setProperties(prev => prev.map(p => p.id === entityId ? { ...p, verified: Boolean(verified) } : p));
          addToast('Location Verified', `Venue permits approved.`, 'success');
        } else if (entityType === 'booking') {
          if (escrowRelease) {
            updateBookingStatus(entityId, 'Completed & Released');
            addToast('Escrow Funds Released', `₹ Escrow payout released from vault.`, 'success');
          }
        }
        return true;
      }
    } catch (_) {}

    // Fallback update
    if (entityType === 'agency') {
      setAgencies(prev => prev.map(a => a.id === entityId ? { ...a, verified: Boolean(verified) } : a));
    } else if (entityType === 'talent') {
      setTalents(prev => prev.map(t => t.id === entityId ? { ...t, verified: Boolean(verified) } : t));
    } else if (entityType === 'property') {
      setProperties(prev => prev.map(p => p.id === entityId ? { ...p, verified: Boolean(verified) } : p));
    } else if (entityType === 'booking' && escrowRelease) {
      updateBookingStatus(entityId, 'Completed & Released');
    }
    return true;
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('modelkart_agencies_in', JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem('modelkart_talents_in', JSON.stringify(talents));
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('modelkart_properties_in', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('modelkart_briefs_in', JSON.stringify(castingBriefs));
  }, [castingBriefs]);

  useEffect(() => {
    localStorage.setItem('modelkart_bookings_in', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('modelkart_shortlist_in', JSON.stringify(shortlist));
  }, [shortlist]);

  const currentAgency = agencies.find(a => a.id === selectedAgencyId) || agencies[0];

  const addAgency = (agencyData: Omit<Agency, 'id'>): Agency => {
    const newId = `agency-${agencyData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newAgency: Agency = {
      ...agencyData,
      id: newId,
      isCustom: true,
      verified: true,
    };
    setAgencies(prev => [newAgency, ...prev]);
    setSelectedAgencyId(newId);
    setActivePersona('agency');

    if (isSupabaseConnected) {
      insertDbAgency(newAgency, currentUser?.id);
    }
    return newAgency;
  };

  const addTalent = (talentData: Omit<Talent, 'id'>): Talent => {
    const newId = `talent-${talentData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newTalent: Talent = {
      ...talentData,
      id: newId,
      verified: true,
      createdAt: new Date().toISOString()
    };
    setTalents(prev => [newTalent, ...prev]);

    if (talentData.agencyId) {
      setAgencies(prev => prev.map(ag => {
        if (ag.id === talentData.agencyId) {
          return { ...ag, rosterCount: ag.rosterCount + 1 };
        }
        return ag;
      }));
    }

    if (isSupabaseConnected) {
      insertDbTalent(newTalent, currentUser?.id);
    }

    return newTalent;
  };

  const updateTalent = (updatedTalent: Talent) => {
    setTalents(prev => prev.map(t => t.id === updatedTalent.id ? updatedTalent : t));
    if (isSupabaseConnected) {
      updateDbTalent(updatedTalent);
    }
  };

  const deleteTalent = (id: string) => {
    const targetTalent = talents.find(t => t.id === id);
    setTalents(prev => prev.filter(t => t.id !== id));
    setShortlist(prev => prev.filter(sId => sId !== id));
    if (targetTalent && targetTalent.agencyId) {
      setAgencies(prev => prev.map(ag => {
        if (ag.id === targetTalent.agencyId) {
          return { ...ag, rosterCount: Math.max(0, ag.rosterCount - 1) };
        }
        return ag;
      }));
    }
    if (isSupabaseConnected) {
      deleteDbTalent(id);
    }
  };

  const addProperty = (propertyData: Omit<ShootProperty, 'id' | 'rating' | 'verified'>): ShootProperty => {
    const newId = `prop-${propertyData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newProp: ShootProperty = {
      ...propertyData,
      id: newId,
      rating: 5.0,
      verified: true,
    };
    setProperties(prev => [newProp, ...prev]);
    setActivePersona('property');

    if (isSupabaseConnected) {
      insertDbProperty(newProp, currentUser?.id);
    }

    return newProp;
  };

  const updateProperty = (updatedProperty: ShootProperty) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    addToast('Property Updated', `${updatedProperty.name} venue specifications updated.`, 'success');
    if (isSupabaseConnected) {
      updateDbProperty(updatedProperty);
    }
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setShortlist(prev => prev.filter(sId => sId !== id));
    if (isSupabaseConnected) {
      deleteDbProperty(id);
    }
  };

  const toggleShortlist = (id: string) => {
    setShortlist(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const clearShortlist = () => {
    setShortlist([]);
  };

  const postCastingBrief = (briefData: Omit<CastingBrief, 'id' | 'createdAt' | 'submittedTalents'>) => {
    const newBrief: CastingBrief = {
      ...briefData,
      id: `brief-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString().split('T')[0],
      submittedTalents: []
    };
    setCastingBriefs(prev => [newBrief, ...prev]);

    if (isSupabaseConnected) {
      insertDbCastingBrief(newBrief, currentUser?.id);
    }
  };

  const submitTalentToBrief = (briefId: string, talentId: string, note: string = '') => {
    const talent = talents.find(t => t.id === talentId);
    if (!talent) return;

    const newSubmission = {
      talentId,
      agencyId: talent.agencyId,
      submittedAt: new Date().toISOString().split('T')[0],
      note: note || `Submitted from ${talent.agencyName}`
    };

    setCastingBriefs(prev => prev.map(brief => {
      if (brief.id === briefId) {
        const alreadySubmitted = brief.submittedTalents.some(s => s.talentId === talentId);
        if (alreadySubmitted) return brief;
        return {
          ...brief,
          submittedTalents: [...brief.submittedTalents, newSubmission]
        };
      }
      return brief;
    }));

    if (isSupabaseConnected) {
      submitDbTalentToBrief(briefId, newSubmission);
    }
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'milestones'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-mk-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        { step: `Escrow Deposit Funded (₹${bookingData.totalAmountInr.toLocaleString()} locked in ModelKart Vault)`, status: 'completed' },
        { step: 'Digital Call Sheet & Permits Approved by Host / Booker', status: 'current' },
        { step: 'Production Shoot Wrap Sign-off', status: 'pending' },
        { step: 'Escrow Released to Bank Account', status: 'pending' }
      ]
    };
    setBookings(prev => [newBooking, ...prev]);
    setShortlist(prev => prev.filter(id => id !== bookingData.itemId));

    if (isSupabaseConnected) {
      insertDbBooking(newBooking, currentUser?.id);
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    let finalMilestones: any[] = [];
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        let updatedMilestones = [...b.milestones];
        if (status === 'Confirmed Call Sheet') {
          updatedMilestones = [
            { step: updatedMilestones[0].step, status: 'completed' },
            { step: updatedMilestones[1].step, status: 'completed' },
            { step: updatedMilestones[2].step, status: 'current' },
            { step: updatedMilestones[3].step, status: 'pending' },
          ];
        } else if (status === 'In Shoot') {
          updatedMilestones = [
            { step: updatedMilestones[0].step, status: 'completed' },
            { step: updatedMilestones[1].step, status: 'completed' },
            { step: updatedMilestones[2].step, status: 'completed' },
            { step: updatedMilestones[3].step, status: 'current' },
          ];
        } else if (status === 'Completed & Released') {
          updatedMilestones = updatedMilestones.map(m => ({ ...m, status: 'completed' }));
        }
        finalMilestones = updatedMilestones;
        return { ...b, status, milestones: updatedMilestones };
      }
      return b;
    }));

    if (isSupabaseConnected) {
      updateDbBookingStatus(id, status, finalMilestones);
    }
  };

  const updateAgency = (updatedAgency: Agency) => {
    setAgencies(prev => prev.map(a => a.id === updatedAgency.id ? updatedAgency : a));
    addToast('Agency Updated', `${updatedAgency.name} profile successfully updated.`, 'success');
    if (isSupabaseConnected) {
      updateDbAgency(updatedAgency);
    }
  };

  const updateProperty = (updatedProperty: ShootProperty) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    addToast('Property Updated', `${updatedProperty.name} venue specifications updated.`, 'success');
  };

  const setFilters = (update: Partial<ParametricFilters>) => {
    setFiltersState(prev => ({ ...prev, ...update }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  return (
    <TalentAgencyContext.Provider
      value={{
        isSupabaseConnected,
        currentUser,
        login,
        signUp,
        logout,
        adminVerifyEntity,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toasts,
        addToast,
        removeToast,
        agencies,
        talents,
        properties,
        castingBriefs,
        bookings,
        shortlist,
        activePersona,
        setActivePersona,
        selectedAgencyId,
        setSelectedAgencyId,
        activeTalentForCompCard,
        setActiveTalentForCompCard,
        activePropertyForDetails,
        setActivePropertyForDetails,
        activeTalentForBooking,
        setActiveTalentForBooking,
        activePropertyForBooking,
        setActivePropertyForBooking,
        editingTalent,
        setEditingTalent,
        editingProperty,
        setEditingProperty,
        editingAgency,
        setEditingAgency,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        registerInitialPersona,
        setRegisterInitialPersona,
        isAddTalentModalOpen,
        setIsAddTalentModalOpen,
        isAddPropertyModalOpen,
        setIsAddPropertyModalOpen,
        isPostBriefModalOpen,
        setIsPostBriefModalOpen,
        filters,
        setFilters,
        resetFilters,
        addAgency,
        updateAgency,
        addTalent,
        updateTalent,
        deleteTalent,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleShortlist,
        clearShortlist,
        postCastingBrief,
        submitTalentToBrief,
        createBooking,
        updateBookingStatus,
        uploadImageFile,
        currentAgency
      }}
    >
      {children}
    </TalentAgencyContext.Provider>
  );
};

export const useTalentAgency = () => {
  const context = useContext(TalentAgencyContext);
  if (!context) {
    throw new Error('useTalentAgency must be used within a TalentAgencyProvider');
  }
  return context;
};
