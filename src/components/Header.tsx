import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';
import { DashboardPersona } from '../types/index.ts';

interface HeaderProps {
  activeTab: 'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards';
  setActiveTab: (tab: 'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    setIsLoginModalOpen,
    logout,
    activePersona,
    setActivePersona,
    shortlist,
    setIsRegisterModalOpen,
    setRegisterInitialPersona,
    setIsPostBriefModalOpen,
    filters,
    setFilters
  } = useTalentAgency();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showTalentMegaMenu, setShowTalentMegaMenu] = useState(false);
  const [showLocationsMegaMenu, setShowLocationsMegaMenu] = useState(false);

  const handleOpenRegister = (persona: 'talent' | 'agency' | 'property' | 'brand') => {
    setRegisterInitialPersona(persona);
    setIsRegisterModalOpen(true);
    setShowMobileNav(false);
  };

  const handleSelectPersona = (p: DashboardPersona) => {
    setActivePersona(p);
    setActiveTab('dashboards');
    setShowPersonaMenu(false);
    setShowMobileNav(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#111111]/95 backdrop-blur-xl border-b border-[#27272C] shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
      <div className="h-20 max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        
        {/* Brand Lockup */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-none border border-[#D6B779] bg-[#D6B779]/10 flex items-center justify-center text-[#D6B779] font-serif font-bold text-base group-hover:bg-[#D6B779] group-hover:text-[#111111] transition-colors">
              MK
            </div>
            <div>
              <span className="font-headline-sm uppercase tracking-tight text-[#FFFFFF] group-hover:text-[#D6B779] transition-colors block leading-none">
                MODELKART
              </span>
              <span className="text-[9px] font-mono text-[#D6B779] uppercase tracking-[0.2em] block mt-0.5">
                INDIA&apos;S TALENT &amp; LOCATION MARKETPLACE
              </span>
            </div>
          </button>
        </div>

        {/* Center Mega Navigation */}
        <nav className="hidden xl:flex items-center gap-7 h-full text-xs font-mono uppercase tracking-wider">
          
          <button
            onClick={() => setActiveTab('home')}
            className={`h-full inline-flex items-center transition-colors border-b-2 ${
              activeTab === 'home'
                ? 'text-[#D6B779] border-[#D6B779] font-bold'
                : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
            }`}
          >
            Home
          </button>

          {/* Discover Talent with Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setShowTalentMegaMenu(true)}
            onMouseLeave={() => setShowTalentMegaMenu(false)}
          >
            <button
              onClick={() => { setActiveTab('talent'); setFilters({ category: 'all' }); }}
              className={`h-full inline-flex items-center gap-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'talent'
                  ? 'text-[#D6B779] border-[#D6B779] font-bold'
                  : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
              }`}
            >
              Discover Talent
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showTalentMegaMenu && (
              <div className="absolute left-0 top-full w-80 bg-[#111111] border border-[#27272C] p-4 shadow-2xl grid grid-cols-2 gap-2 z-50 normal-case">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D6B779] block mb-2 border-b border-[#27272C] pb-1">Models &amp; Screen</span>
                  {['models-female', 'models-male', 'models-plus-size', 'models-commercial', 'actors', 'influencers'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilters({ category: cat });
                        setActiveTab('talent');
                        setShowTalentMegaMenu(false);
                      }}
                      className="block w-full text-left py-1 text-xs text-[#E7E3DC] hover:text-[#D6B779] transition-colors"
                    >
                      {cat.replace('models-', '').replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D6B779] block mb-2 border-b border-[#27272C] pb-1">Creative Pros</span>
                  {['photographers-fashion', 'makeup-artists', 'hair-stylists', 'fashion-stylists', 'videographers', 'choreographers'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilters({ category: cat });
                        setActiveTab('talent');
                        setShowTalentMegaMenu(false);
                      }}
                      className="block w-full text-left py-1 text-xs text-[#E7E3DC] hover:text-[#D6B779] transition-colors"
                    >
                      {cat.replace('photographers-', '').replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('agencies')}
            className={`h-full inline-flex items-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'agencies'
                ? 'text-[#D6B779] border-[#D6B779] font-bold'
                : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
            }`}
          >
            Agencies
          </button>

          {/* Locations with Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setShowLocationsMegaMenu(true)}
            onMouseLeave={() => setShowLocationsMegaMenu(false)}
          >
            <button
              onClick={() => setActiveTab('locations')}
              className={`h-full inline-flex items-center gap-1 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'locations'
                  ? 'text-[#D6B779] border-[#D6B779] font-bold'
                  : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
              }`}
            >
              Locations
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showLocationsMegaMenu && (
              <div className="absolute left-0 top-full w-64 bg-[#111111] border border-[#27272C] p-4 shadow-2xl space-y-1.5 z-50 normal-case">
                <span className="text-[10px] font-mono uppercase text-[#D6B779] block mb-2 border-b border-[#27272C] pb-1">Production Venues</span>
                {['Luxury Villas', 'Photography Studios', 'Heritage Havelis & Palaces', 'Outdoor Locations', 'Resorts & Hotels', 'Rooftops'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => {
                      setActiveTab('locations');
                      setShowLocationsMegaMenu(false);
                    }}
                    className="block w-full text-left py-1 text-xs text-[#E7E3DC] hover:text-[#D6B779] transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('casting')}
            className={`h-full inline-flex items-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'casting'
                ? 'text-[#D6B779] border-[#D6B779] font-bold'
                : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
            }`}
          >
            Casting Calls
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`h-full inline-flex items-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'brands'
                ? 'text-[#D6B779] border-[#D6B779] font-bold'
                : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
            }`}
          >
            For Brands
          </button>

          <button
            onClick={() => setActiveTab('dashboards')}
            className={`h-full inline-flex items-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'dashboards'
                ? 'text-[#D6B779] border-[#D6B779] font-bold'
                : 'border-transparent text-[#E7E3DC] hover:text-[#FFFFFF]'
            }`}
          >
            Dashboards
          </button>
        </nav>

        {/* Right Actions & Persona Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* Search Quick Action */}
          <button
            onClick={() => { setActiveTab('talent'); }}
            className="p-2 text-[#E7E3DC] hover:text-[#D6B779] transition-colors cursor-pointer"
            title="Search Talent & Locations"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Login / User Session Button */}
          {currentUser ? (
            <button
              onClick={() => handleSelectPersona(currentUser.role)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#27272C] hover:border-[#D6B779] text-[#E7E3DC] text-xs font-mono transition-colors"
              title="Active User Session"
            >
              <span className="w-2 h-2 rounded-full bg-[#287A55]" />
              <span className="truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs font-mono uppercase text-[#E7E3DC] hover:text-[#D6B779] px-2.5 py-1.5 transition-colors cursor-pointer"
            >
              Login
            </button>
          )}

          {/* List Your Talent / Agency */}
          <button
            onClick={() => handleOpenRegister('agency')}
            className="hidden md:inline-flex items-center justify-center border border-[#D6B779]/60 hover:border-[#D6B779] text-[#D6B779] hover:bg-[#D6B779]/10 font-mono text-xs uppercase px-3.5 py-2 transition-colors cursor-pointer"
          >
            + List Talent / Agency
          </button>

          {/* Post a Casting Brief */}
          <button
            onClick={() => setIsPostBriefModalOpen(true)}
            className="hidden sm:inline-flex items-center justify-center bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase px-4 py-2 font-bold tracking-wider transition-colors cursor-pointer"
          >
            Post a Brief
          </button>

          {/* Shortlist Counter */}
          {shortlist.length > 0 && (
            <button
              onClick={() => setActiveTab('talent')}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1E] border border-[#D6B779] text-[#D6B779] font-mono text-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              <span>{shortlist.length}</span>
            </button>
          )}

          {/* Persona & Dashboard Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 p-1.5 bg-[#1A1A1E] border border-[#27272C] hover:border-[#D6B779] transition-colors text-left cursor-pointer"
              aria-label="User Persona Switcher"
            >
              <div className="w-7 h-7 rounded-none bg-[#D6B779]/20 text-[#D6B779] font-mono text-xs flex items-center justify-center font-bold">
                {activePersona === 'talent' ? 'TL' : activePersona === 'agency' ? 'AG' : activePersona === 'property' ? 'PR' : activePersona === 'brand' ? 'BR' : 'AD'}
              </div>
              <div className="hidden lg:flex flex-col pr-1">
                <span className="text-[9px] font-mono text-[#D6B779] uppercase leading-none">
                  Active Persona
                </span>
                <span className="text-xs font-mono text-[#FFFFFF] capitalize leading-tight">
                  {activePersona} Portal
                </span>
              </div>
              <span className="material-symbols-outlined text-[#777777] text-[16px]">
                unfold_more
              </span>
            </button>

            {/* Persona Dropdown */}
            {showPersonaMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#111111] border border-[#27272C] shadow-2xl p-3 space-y-2 z-50">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#777777] border-b border-[#27272C] pb-1">
                  <span>Switch Role &amp; Dashboard</span>
                  {currentUser && (
                    <button onClick={logout} className="text-red-400 hover:underline">
                      Sign Out
                    </button>
                  )}
                </div>

                {[
                  { id: 'brand' as DashboardPersona, title: 'Brand & Production House', desc: 'Hire talent, book shoot locations & post briefs' },
                  { id: 'agency' as DashboardPersona, title: 'Talent Agency Booker', desc: 'Manage model roster, comp-cards & bookings' },
                  { id: 'talent' as DashboardPersona, title: 'Individual Creative Talent', desc: 'Manage portfolio, polaroids, rates & casting' },
                  { id: 'property' as DashboardPersona, title: 'Shoot Location Host', desc: 'Manage villas, studios & rental pricing' },
                  { id: 'admin' as DashboardPersona, title: 'ModelKart Platform Admin', desc: 'Global platform analytics & moderation' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPersona(item.id)}
                    className={`w-full text-left p-2 border transition-colors cursor-pointer ${
                      activePersona === item.id
                        ? 'border-[#D6B779] bg-[#D6B779]/10 text-[#D6B779]'
                        : 'border-[#27272C] hover:border-[#E7E3DC] text-[#E7E3DC]'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{item.title}</div>
                    <div className="text-[10px] text-[#777777] font-sans mt-0.5">{item.desc}</div>
                  </button>
                ))}

                <div className="pt-2 border-t border-[#27272C] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenRegister('talent')}
                    className="w-full text-center py-1.5 text-[10px] font-mono uppercase bg-[#1A1A1E] text-[#E7E3DC] hover:text-[#FFFFFF] border border-[#27272C]"
                  >
                    Join as Talent
                  </button>
                  <button
                    onClick={() => handleOpenRegister('brand')}
                    className="w-full text-center py-1.5 text-[10px] font-mono uppercase bg-[#D6B779] text-[#111111] font-bold"
                  >
                    Join as Brand
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="xl:hidden p-2 text-[#E7E3DC] hover:text-[#D6B779] cursor-pointer"
            aria-label="Toggle mobile navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {showMobileNav ? 'close' : 'menu'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileNav && (
        <div className="xl:hidden bg-[#111111] border-b border-[#27272C] p-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-mono uppercase">
            <button onClick={() => { setActiveTab('home'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              Home
            </button>
            <button onClick={() => { setActiveTab('talent'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              Discover Talent
            </button>
            <button onClick={() => { setActiveTab('agencies'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              Agencies
            </button>
            <button onClick={() => { setActiveTab('locations'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              Shoot Locations
            </button>
            <button onClick={() => { setActiveTab('casting'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              Casting Calls
            </button>
            <button onClick={() => { setActiveTab('brands'); setShowMobileNav(false); }} className="text-left text-[#E7E3DC] hover:text-[#D6B779]">
              For Brands
            </button>
            <button onClick={() => { setActiveTab('dashboards'); setShowMobileNav(false); }} className="text-left text-[#D6B779] font-bold">
              User Dashboards
            </button>
          </div>

          <div className="pt-4 border-t border-[#27272C] grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOpenRegister('agency')}
              className="py-2.5 text-xs font-mono uppercase border border-[#D6B779] text-[#D6B779] text-center"
            >
              List Agency
            </button>
            <button
              onClick={() => { setIsPostBriefModalOpen(true); setShowMobileNav(false); }}
              className="py-2.5 text-xs font-mono uppercase bg-[#D6B779] text-[#111111] font-bold text-center"
            >
              Post a Brief
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
