import React from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface BrandsViewProps {
  onNavigateTab: (tab: 'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards') => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({ onNavigateTab }) => {
  const { setIsPostBriefModalOpen, setRegisterInitialPersona, setIsRegisterModalOpen } = useTalentAgency();

  return (
    <div className="w-full bg-[#111111] text-[#FFFFFF]">
      
      {/* Hero */}
      <section className="relative w-full py-24 border-b border-[#27272C] bg-[#0A0A0C]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
          <span className="font-mono text-xs uppercase text-[#D6B779] tracking-widest block mb-4">
            Enterprise Creative Solutions
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#FFFFFF] font-light max-w-4xl tracking-tight">
            Your Next Campaign <br />
            <span className="italic font-normal text-[#D6B779]">Starts Here.</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#E7E3DC] max-w-2xl mt-6 font-light leading-relaxed">
            From discovering the perfect face to finding the perfect location, ModelKart brings your entire creative production ecosystem together with institutional escrow protection.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigateTab('talent')}
              className="px-8 py-3.5 bg-[#D6B779] hover:bg-[#E8CF7A] text-[#111111] font-mono text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-lg"
            >
              Hire Talent
            </button>
            <button
              onClick={() => onNavigateTab('locations')}
              className="px-8 py-3.5 bg-transparent hover:bg-[#FFFFFF]/10 border border-[#FFFFFF] text-[#FFFFFF] font-mono text-xs uppercase font-medium tracking-widest transition-colors cursor-pointer"
            >
              Find Locations
            </button>
            <button
              onClick={() => setIsPostBriefModalOpen(true)}
              className="px-8 py-3.5 bg-[#1A1A1E] hover:bg-[#27272C] border border-[#D6B779]/40 text-[#D6B779] font-mono text-xs uppercase font-medium tracking-widest transition-colors cursor-pointer"
            >
              Post a Casting Brief
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 border-b border-[#27272C]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="material-symbols-outlined text-[#D6B779] text-3xl">verified_user</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Stripe Escrow Milestone Vault</h3>
            <p className="text-xs text-[#E7E3DC] font-light leading-relaxed">
              Your production funds are pre-authorized and locked safely in ModelKart escrow. Zero advance disbursement occurs until the client and booker digitally sign off the wrap call sheet.
            </p>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="material-symbols-outlined text-[#D6B779] text-3xl">auto_stories</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Unified Multi-Talent Booking</h3>
            <p className="text-xs text-[#E7E3DC] font-light leading-relaxed">
              Book runway models from Anima, photographers from Master Lens, and HMUAs from Inega on one centralized milestone invoice with legally vetted standard production riders.
            </p>
          </div>

          <div className="bg-[#1A1A1E] border border-[#27272C] p-8 space-y-4">
            <span className="material-symbols-outlined text-[#D6B779] text-3xl">villa</span>
            <h3 className="font-serif text-2xl text-[#FFFFFF]">Turnkey Shoot Venues</h3>
            <p className="text-xs text-[#E7E3DC] font-light leading-relaxed">
              Direct access to luxury villas in Goa, royal palaces in Rajasthan, and daylight cyclorama studios in Mumbai with power, generator backups, and basecamp permits included.
            </p>
          </div>

        </div>
      </section>

      {/* Brand Partners Showcase */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20 text-center">
        <span className="font-mono text-xs uppercase text-[#777777] tracking-widest block mb-6">
          Trusted by India&apos;s Foremost Luxury Houses &amp; Platforms
        </span>
        <div className="flex flex-wrap items-center justify-center gap-12 text-sm font-serif tracking-widest text-[#E7E3DC] opacity-80">
          <span>SABYASACHI</span>
          <span>·</span>
          <span>TARUN TAHILIANI</span>
          <span>·</span>
          <span>VOGUE INDIA</span>
          <span>·</span>
          <span>LAKMÉ FASHION WEEK</span>
          <span>·</span>
          <span>NETFLIX</span>
          <span>·</span>
          <span>NYKAA LUXE</span>
        </div>
      </section>

    </div>
  );
};
