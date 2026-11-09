import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { IndianMetro, TalentMainCategory } from '../types/index.ts';

interface HomePageViewProps {
  onNavigateTab: (tab: 'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards') => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({ onNavigateTab }) => {
  const {
    talents,
    agencies,
    properties,
    castingBriefs,
    setActiveTalentForCompCard,
    setActivePropertyForDetails,
    setIsRegisterModalOpen,
    setRegisterInitialPersona,
    setIsPostBriefModalOpen,
    setFilters
  } = useTalentAgency();

  // Smart Search States
  const [searchLookingFor, setSearchLookingFor] = useState<'talent' | 'agency' | 'location'>('talent');
  const [searchCity, setSearchCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [talentCategoryTab, setTalentCategoryTab] = useState<string>('models-female');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLookingFor === 'talent') {
      setFilters({
        searchQuery,
        city: searchCity
      });
      onNavigateTab('talent');
    } else if (searchLookingFor === 'agency') {
      onNavigateTab('agencies');
    } else {
      onNavigateTab('locations');
    }
  };

  const handleOpenRegister = (persona: 'talent' | 'agency' | 'property' | 'brand') => {
    setRegisterInitialPersona(persona);
    setIsRegisterModalOpen(true);
  };

  const featuredTalents = talents.filter(t => {
    if (talentCategoryTab === 'all') return true;
    return t.category === talentCategoryTab;
  }).slice(0, 6);

  return (
    <div className="w-full flex flex-col bg-[#111111] text-[#FFFFFF]">
      
      {/* ============================================================ */}
      {/* SECTION 1: HERO EDITORIAL CAMPAIGN BANNER                    */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#27272C]">
        {/* Full-bleed Editorial Campaign Image */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_indian_fashion_editorial_1794221426650.jpg"
            alt="ModelKart Haute Couture Indian Fashion Editorial Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-black/30" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 py-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D6B779]/40 bg-[#111111]/80 backdrop-blur-md text-[#D6B779] font-mono text-xs uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D6B779] animate-pulse" />
            INDIA&apos;S TALENT &amp; CREATIVE PRODUCTION MARKETPLACE
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[72px] lg:leading-[78px] text-[#FFFFFF] font-light max-w-5xl tracking-tight text-balance">
            Discover Talent. <br />
            <span className="italic font-normal text-[#D6B779]">Create Experiences.</span> <br />
            Bring Brands to Life.
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-[#E7E3DC] max-w-2xl mt-6 font-light leading-relaxed">
            India’s complete marketplace connecting models, creative professionals, accredited talent agencies and luxury production shoot locations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigateTab('talent')}
              className="px-8 py-3.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-[#D6B779]/20"
            >
              Explore Talent
            </button>
            <button
              onClick={() => handleOpenRegister('talent')}
              className="px-8 py-3.5 bg-[#111111]/80 hover:bg-[#111111] border border-[#D6B779]/60 hover:border-[#D6B779] text-[#FFFFFF] font-mono text-xs uppercase font-medium tracking-widest transition-colors cursor-pointer backdrop-blur-md"
            >
              Join ModelKart
            </button>
          </div>

          {/* Smart Search Interface Box */}
          <div className="w-full max-w-4xl mt-12 bg-[#111111]/95 backdrop-blur-xl border border-[#27272C] p-4 lg:p-5 shadow-2xl">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-left">
              
              {/* Type Switcher */}
              <div className="md:col-span-3 bg-[#1A1A1E] border border-[#27272C] p-2.5">
                <label className="text-[9px] font-mono text-[#D6B779] uppercase block mb-1">
                  What are you looking for?
                </label>
                <select
                  value={searchLookingFor}
                  onChange={(e) => setSearchLookingFor(e.target.value as any)}
                  className="w-full bg-transparent text-xs text-[#FFFFFF] font-mono focus:outline-none cursor-pointer"
                >
                  <option value="talent" className="bg-[#111111]">Creative Talent / Model</option>
                  <option value="agency" className="bg-[#111111]">Talent Agency Roster</option>
                  <option value="location" className="bg-[#111111]">Shoot Location / Studio</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="md:col-span-3 bg-[#1A1A1E] border border-[#27272C] p-2.5">
                <label className="text-[9px] font-mono text-[#D6B779] uppercase block mb-1">
                  Location / Metro
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#FFFFFF] font-mono focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#111111]">All Major Indian Metros</option>
                  <option value="Mumbai" className="bg-[#111111]">Mumbai (Bandra, Juhu, Colaba)</option>
                  <option value="Delhi NCR" className="bg-[#111111]">Delhi NCR (Mehrauli, Gurgaon)</option>
                  <option value="Goa" className="bg-[#111111]">Goa (Assagao, Morjim)</option>
                  <option value="Jaipur" className="bg-[#111111]">Jaipur / Rajasthan</option>
                  <option value="Bangalore" className="bg-[#111111]">Bangalore (Indiranagar)</option>
                </select>
              </div>

              {/* Search Keyword */}
              <div className="md:col-span-4 bg-[#1A1A1E] border border-[#27272C] p-2.5">
                <label className="text-[9px] font-mono text-[#D6B779] uppercase block mb-1">
                  Specialty / Keyword
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sabyasachi, Runway, Pool Villa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#FFFFFF] font-sans placeholder:text-[#777777] focus:outline-none"
                />
              </div>

              {/* Action */}
              <div className="md:col-span-2 flex">
                <button
                  type="submit"
                  className="w-full bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search</span>
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: EXPLORE MARKETPLACE (4 PILLARS)                   */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
              The Four Verticals
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
              Explore the ModelKart Ecosystem
            </h2>
          </div>
          <p className="text-sm text-[#E7E3DC] max-w-md font-light">
            An integrated creative infrastructure empowering talent, representing agencies, location hosts and enterprise brands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Individual Talent */}
          <div 
            onClick={() => onNavigateTab('talent')}
            className="group relative h-96 overflow-hidden border border-[#27272C] cursor-pointer"
          >
            <img
              src="/src/assets/images/model_indian_high_fashion_female_1794221427331.jpg"
              alt="Individual Creative Talent"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] font-mono uppercase text-[#D6B779] tracking-wider mb-1">Pillar 01</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                Individual Talent
              </h3>
              <p className="text-xs text-[#E7E3DC] mt-1 font-light line-clamp-2">
                Models, actors, celebrity photographers, stylists, HMUA visionaries and creators.
              </p>
              <span className="text-xs font-mono text-[#D6B779] mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse 9,400+ Talents →
              </span>
            </div>
          </div>

          {/* Pillar 2: Talent Agencies */}
          <div 
            onClick={() => onNavigateTab('agencies')}
            className="group relative h-96 overflow-hidden border border-[#27272C] cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA74LbFTLrh9rPneTxcL0Yp15x9zrigJWbsE7qREjA2_PDPFZC0-xzHjQg6JYPnyTyroATSrafCAcY9IjdEGojve-h7bPI54UVvRwfkxVoeIa2UV7Io8InPYZ69yhAdrAriJ6OpbDxEOrM5RUFtb7y47YFk5x7ibgN8IDE49NLNFyahVIrasucpcDYvyBYyugtVcsMOu036jAj5Vw4haDL_12MGjWCWtPjMaP0Bf54t1XGGB-NctyfhTQ"
              alt="Talent Agencies"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] font-mono uppercase text-[#D6B779] tracking-wider mb-1">Pillar 02</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                Talent Agencies
              </h3>
              <p className="text-xs text-[#E7E3DC] mt-1 font-light line-clamp-2">
                Accredited agency boards managing vetted rosters with unified booking contracts.
              </p>
              <span className="text-xs font-mono text-[#D6B779] mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Agencies ({agencies.length}) →
              </span>
            </div>
          </div>

          {/* Pillar 3: Shoot Locations */}
          <div 
            onClick={() => onNavigateTab('locations')}
            className="group relative h-96 overflow-hidden border border-[#27272C] cursor-pointer"
          >
            <img
              src="/src/assets/images/shoot_location_luxury_goa_villa_1794221427365.jpg"
              alt="Shoot Locations"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] font-mono uppercase text-[#D6B779] tracking-wider mb-1">Pillar 03</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                Shoot Locations
              </h3>
              <p className="text-xs text-[#E7E3DC] mt-1 font-light line-clamp-2">
                Luxury villas in Goa, royal havelis in Rajasthan, infinity studios in Mumbai and Delhi.
              </p>
              <span className="text-xs font-mono text-[#D6B779] mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Find Venues ({properties.length}) →
              </span>
            </div>
          </div>

          {/* Pillar 4: Brands & Production */}
          <div 
            onClick={() => onNavigateTab('brands')}
            className="group relative h-96 overflow-hidden border border-[#27272C] cursor-pointer"
          >
            <img
              src="/src/assets/images/hero_indian_fashion_editorial_1794221426650.jpg"
              alt="Brands and Production"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
              <span className="text-[10px] font-mono uppercase text-[#D6B779] tracking-wider mb-1">Pillar 04</span>
              <h3 className="font-serif text-2xl text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                Brands &amp; Production
              </h3>
              <p className="text-xs text-[#E7E3DC] mt-1 font-light line-clamp-2">
                Broadcast casting briefs, lock escrow milestones and orchestrate campaign shoots.
              </p>
              <span className="text-xs font-mono text-[#D6B779] mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Enterprise Solutions →
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: DISCOVER TALENT (8 SUBCATEGORIES)                 */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
              Curated Talent Gallery
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
              Discover Extraordinary Faces
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('talent')}
            className="text-xs font-mono uppercase text-[#D6B779] hover:text-[#FFFFFF] transition-colors flex items-center gap-1"
          >
            View Complete Talent Directory ({talents.length}) →
          </button>
        </div>

        {/* 8 Categories Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none font-mono text-xs uppercase">
          {[
            { id: 'models-female', label: 'Female Models' },
            { id: 'models-male', label: 'Male Models' },
            { id: 'models-plus-size', label: 'Plus Size / Curve' },
            { id: 'models-commercial', label: 'Commercial Models' },
            { id: 'actors', label: 'Actors & Screen' },
            { id: 'influencers', label: 'Digital Influencers' },
            { id: 'all', label: 'All Disciplines' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTalentCategoryTab(tab.id)}
              className={`px-4 py-2 whitespace-nowrap transition-colors cursor-pointer border ${
                talentCategoryTab === tab.id
                  ? 'border-[#D6B779] bg-[#D6B779]/15 text-[#D6B779] font-bold'
                  : 'border-[#27272C] bg-[#1A1A1E] text-[#E7E3DC] hover:text-[#FFFFFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Talent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredTalents.map((talent) => (
            <div
              key={talent.id}
              className="group bg-[#1A1A1E] border border-[#27272C] hover:border-[#D6B779] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111111]">
                <img
                  src={talent.primaryImage}
                  alt={talent.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#111111]/85 border border-[#287A55] text-[#287A55] text-[10px] font-mono uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    {talent.agencyName.slice(0, 15)}
                  </span>
                  <span className="px-2 py-0.5 bg-[#111111]/85 text-[#D6B779] text-xs font-mono tabular-nums">
                    ★ {talent.rating.toFixed(2)}
                  </span>
                </div>

                {/* Specs drawer on hover */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#111111] via-[#111111]/90 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="grid grid-cols-3 text-center text-[10px] font-mono text-[#E7E3DC]">
                    <div><span className="text-[#777777] block text-[9px]">HT</span>{talent.specs.heightCm}cm</div>
                    <div><span className="text-[#777777] block text-[9px]">BUST</span>{talent.specs.bustCm}cm</div>
                    <div><span className="text-[#777777] block text-[9px]">WAIST</span>{talent.specs.waistCm}cm</div>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 
                      onClick={() => setActiveTalentForCompCard(talent)}
                      className="font-serif text-lg text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors cursor-pointer"
                    >
                      {talent.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#777777]">{talent.location}</span>
                  </div>
                  <p className="text-xs text-[#E7E3DC] mt-1 line-clamp-1 font-light">
                    {talent.editorialHeadline}
                  </p>
                  <div className="mt-2 text-xs font-mono text-[#D6B779]">
                    ₹{talent.dayRateInr.toLocaleString()} <span className="text-[#777777] text-[10px]">/ day</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#27272C] flex gap-2">
                  <button
                    onClick={() => setActiveTalentForCompCard(talent)}
                    className="w-full py-1.5 bg-[#111111] hover:bg-[#D6B779] hover:text-[#111111] border border-[#27272C] text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    View Comp-Card
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: CREATIVE PROFESSIONALS (HMUA, PHOTOGRAPHERS, ETC.)*/}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
              Production Visionaries
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
              Master Creative Professionals
            </h2>
          </div>
          <p className="text-sm text-[#E7E3DC] max-w-md font-light">
            Celebrated fashion photographers, master bridal HMUAs, and wardrobe directors behind India’s leading campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {talents.filter(t => ['photographers-fashion', 'makeup-artists', 'actors'].includes(t.category)).slice(0, 3).map((pro) => (
            <div 
              key={pro.id}
              className="bg-[#1A1A1E] border border-[#27272C] p-6 hover:border-[#D6B779] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={pro.primaryImage}
                    alt={pro.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#D6B779]"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-[#D6B779] uppercase block">{pro.categoryLabel}</span>
                    <h3 className="font-serif text-xl text-[#FFFFFF]">{pro.name}</h3>
                    <span className="text-xs text-[#777777] font-mono">{pro.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#E7E3DC] font-light leading-relaxed mb-4">
                  {pro.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {pro.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#111111] border border-[#27272C] text-[10px] font-mono text-[#E7E3DC]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#27272C] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#777777] uppercase block">Day Rate</span>
                  <span className="text-sm font-mono text-[#FFFFFF] font-bold">₹{pro.dayRateInr.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setActiveTalentForCompCard(pro)}
                  className="px-4 py-2 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
                >
                  Book Artist
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5: PARTNER TALENT AGENCIES                           */}
      {/* ============================================================ */}
      <section className="w-full bg-[#1A1A1E] border-b border-[#27272C] py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
                Accredited Agency Gateways
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
                Partner Talent Agencies
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('agencies')}
              className="text-xs font-mono uppercase text-[#D6B779] hover:text-[#FFFFFF] transition-colors"
            >
              Browse All Agencies ({agencies.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencies.map((agency) => (
              <div
                key={agency.id}
                className="bg-[#111111] border border-[#27272C] p-6 hover:border-[#D6B779]/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 border border-[#287A55]/40 bg-[#287A55]/10 text-[#287A55] font-mono text-[9px] uppercase">
                      {agency.tier}
                    </span>
                    <span className="text-xs font-mono text-[#777777]">{agency.city}</span>
                  </div>

                  <h3 className="font-serif text-xl text-[#FFFFFF]">{agency.name}</h3>
                  <div className="text-[11px] font-mono text-[#D6B779] mt-1">{agency.specialization}</div>
                  <p className="text-xs text-[#E7E3DC] font-light mt-2 line-clamp-2">
                    {agency.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#27272C] font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-[#777777] block uppercase">Represented</span>
                      <span className="text-[#FFFFFF] font-bold">{agency.rosterCount} Talents</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#777777] block uppercase">Rating</span>
                      <span className="text-[#D6B779] font-bold">★ {agency.rating.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#27272C]">
                  <button
                    onClick={() => {
                      setFilters({ agencyFilter: agency.name });
                      onNavigateTab('talent');
                    }}
                    className="w-full py-2 bg-[#1A1A1E] hover:bg-[#D6B779] hover:text-[#111111] border border-[#27272C] text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    View Agency Roster
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: EXPLORE SHOOT LOCATIONS                           */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
              Production Properties
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
              Explore Shoot Locations
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('locations')}
            className="text-xs font-mono uppercase text-[#D6B779] hover:text-[#FFFFFF] transition-colors"
          >
            Explore All Properties ({properties.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => setActivePropertyForDetails(prop)}
              className="group bg-[#1A1A1E] border border-[#27272C] hover:border-[#D6B779] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#111111]">
                <img
                  src={prop.heroImage}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#111111]/85 border border-[#27272C] px-2 py-0.5 text-[10px] font-mono text-[#D6B779] uppercase">
                  {prop.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors">
                      {prop.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#777777]">{prop.city}</span>
                  </div>
                  <div className="text-xs text-[#777777] font-mono mt-1">
                    {prop.capacity} · {prop.squareFeet.toLocaleString()} sq.ft.
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[#27272C] flex items-center justify-between">
                  <span className="text-sm font-mono text-[#D6B779] font-bold">
                    ₹{prop.dailyRateInr.toLocaleString()} <span className="text-[#777777] text-xs font-normal">/ day</span>
                  </span>
                  <button className="text-xs font-mono uppercase text-[#E7E3DC] group-hover:text-[#D6B779]">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: CASTING CALLS & AUDITIONS                         */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
              Audition Board
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
              Current Casting Calls &amp; Briefs
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('casting')}
            className="text-xs font-mono uppercase text-[#D6B779] hover:text-[#FFFFFF] transition-colors"
          >
            View All Casting Opportunities ({castingBriefs.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {castingBriefs.map((brief) => (
            <div
              key={brief.id}
              className="bg-[#1A1A1E] border border-[#27272C] p-6 hover:border-[#D6B779] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#777777] mb-2">
                  <span className="text-[#D6B779] uppercase">{brief.brandOrProduction}</span>
                  <span>Deadline: {brief.deadline}</span>
                </div>

                <h3 className="font-serif text-xl text-[#FFFFFF]">{brief.title}</h3>
                
                <p className="text-xs text-[#E7E3DC] font-light mt-2 line-clamp-2">
                  {brief.talentRequirements}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#27272C] font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-[#777777] block uppercase">Location</span>
                    <span className="text-[#FFFFFF]">{brief.city}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#777777] block uppercase">Shoot Dates</span>
                    <span className="text-[#FFFFFF]">{brief.shootDates}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#777777] block uppercase">Budget Range</span>
                    <span className="text-[#D6B779] font-bold">₹{brief.budgetMinInr.toLocaleString()} - ₹{brief.budgetMaxInr.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-[#27272C] flex justify-end">
                <button
                  onClick={() => onNavigateTab('casting')}
                  className="px-6 py-2 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold transition-colors cursor-pointer"
                >
                  Apply / Pitch Talent
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 8: FOR BRANDS (MIDNIGHT BLACK SHOWCASE)              */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0A0A0C] border-b border-[#27272C] py-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-4">
            Enterprise Production Suite
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] font-light">
            Your Next Campaign Starts Here.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#E7E3DC] max-w-2xl mt-6 font-light leading-relaxed">
            From discovering the perfect face to finding the perfect location, ModelKart brings your entire creative production ecosystem together under escrow-guaranteed protection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigateTab('talent')}
              className="px-8 py-3.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
            >
              Hire Talent
            </button>
            <button
              onClick={() => onNavigateTab('locations')}
              className="px-8 py-3.5 bg-transparent hover:bg-[#FFFFFF]/10 border border-[#FFFFFF] text-[#FFFFFF] font-mono text-xs uppercase font-medium tracking-widest transition-colors cursor-pointer"
            >
              Find Locations
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 9: HOW MODELKART WORKS (3 STEPS)                     */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
            The Process
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
            How ModelKart Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="font-serif text-4xl text-[#D6B779]">01</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Discover</h3>
            <p className="text-sm text-[#E7E3DC] font-light leading-relaxed">
              Find individual models, creative professionals, accredited agency rosters and photoshoot properties using verified parametric search.
            </p>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="font-serif text-4xl text-[#D6B779]">02</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Connect</h3>
            <p className="text-sm text-[#E7E3DC] font-light leading-relaxed">
              Submit shoot inquiries, review comp-cards, broadcast casting briefs, and receive validated quotes directly from head bookers.
            </p>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="font-serif text-4xl text-[#D6B779]">03</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Create</h3>
            <p className="text-sm text-[#E7E3DC] font-light leading-relaxed">
              Lock milestone escrow, generate digital call sheets, wrap production seamlessly and disburse payments with total trust.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10: JOIN MODELKART (4 REGISTRATION CARDS)            */}
      {/* ============================================================ */}
      <section className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-2">
            Onboarding Gateway
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#FFFFFF]">
            Join India&apos;s Creative Elite
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#1A1A1E] border border-[#27272C] p-6 flex flex-col justify-between space-y-6 hover:border-[#D6B779] transition-colors">
            <div>
              <span className="material-symbols-outlined text-[#D6B779] text-3xl">person</span>
              <h3 className="font-serif text-xl text-[#FFFFFF] mt-3">Register as Talent</h3>
              <p className="text-xs text-[#E7E3DC] font-light mt-2">
                Models, actors, photographers, HMUAs, stylists and screen talent.
              </p>
            </div>
            <button
              onClick={() => handleOpenRegister('talent')}
              className="w-full py-2.5 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
            >
              Get Discovered
            </button>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-6 flex flex-col justify-between space-y-6 hover:border-[#D6B779] transition-colors">
            <div>
              <span className="material-symbols-outlined text-[#D6B779] text-3xl">domain</span>
              <h3 className="font-serif text-xl text-[#FFFFFF] mt-3">Register as Agency</h3>
              <p className="text-xs text-[#E7E3DC] font-light mt-2">
                Modeling and talent agencies looking to manage and monetize rosters.
              </p>
            </div>
            <button
              onClick={() => handleOpenRegister('agency')}
              className="w-full py-2.5 bg-[#111111] border border-[#D6B779] text-[#D6B779] font-mono text-xs uppercase font-bold hover:bg-[#D6B779] hover:text-[#111111] transition-colors cursor-pointer"
            >
              Onboard Agency
            </button>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-6 flex flex-col justify-between space-y-6 hover:border-[#D6B779] transition-colors">
            <div>
              <span className="material-symbols-outlined text-[#D6B779] text-3xl">villa</span>
              <h3 className="font-serif text-xl text-[#FFFFFF] mt-3">List Your Property</h3>
              <p className="text-xs text-[#E7E3DC] font-light mt-2">
                Owners of studios, villas, resorts, havelis, and event venues.
              </p>
            </div>
            <button
              onClick={() => handleOpenRegister('property')}
              className="w-full py-2.5 bg-[#111111] border border-[#D6B779] text-[#D6B779] font-mono text-xs uppercase font-bold hover:bg-[#D6B779] hover:text-[#111111] transition-colors cursor-pointer"
            >
              List Location
            </button>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-6 flex flex-col justify-between space-y-6 hover:border-[#D6B779] transition-colors">
            <div>
              <span className="material-symbols-outlined text-[#D6B779] text-3xl">storefront</span>
              <h3 className="font-serif text-xl text-[#FFFFFF] mt-3">Register as Brand</h3>
              <p className="text-xs text-[#E7E3DC] font-light mt-2">
                Fashion labels, ad agencies, production houses and FMCG companies.
              </p>
            </div>
            <button
              onClick={() => handleOpenRegister('brand')}
              className="w-full py-2.5 bg-[#D6B779] text-[#111111] font-mono text-xs uppercase font-bold hover:bg-[#E8CF7A] transition-colors cursor-pointer"
            >
              Hire &amp; Produce
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
