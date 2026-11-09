import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: 'home' | 'talent' | 'agencies' | 'locations' | 'casting' | 'brands' | 'dashboards') => void;
  onOpenAgencyRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenAgencyRegister }) => {
  return (
    <footer className="w-full bg-[#0A0A0C] border-t border-[#27272C] pt-16 pb-12 mt-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] font-serif font-bold text-xs">
                MK
              </span>
              <span className="font-headline-sm uppercase tracking-tight text-[#FAF8F5]">
                MODELKART
              </span>
            </div>
            
            <p className="font-body-md text-sm text-[#C8C5BD] max-w-sm">
              India's premier international talent management and creative production marketplace connecting certified modeling agencies, models, HMUAs, photographers, production estates, and luxury brands.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059] bg-[#D4AF37]/10 text-[#D4AF37] font-label-caps text-[10px] uppercase">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Atelier Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#287A55] bg-[#287A55]/20 text-[#4ade80] font-label-caps text-[10px] uppercase">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Escrow Guaranteed
              </span>
            </div>
          </div>

          {/* Marketplace Col */}
          <div>
            <h3 className="font-label-caps text-[11px] uppercase text-[#C8C5BD] tracking-widest mb-4">
              Marketplace
            </h3>
            <ul className="space-y-3 font-body-sm text-xs">
              <li 
                onClick={() => onNavigateTab('talent')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Discover Talent
              </li>
              <li 
                onClick={() => onNavigateTab('agencies')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Agency Rosters &amp; Gateways
              </li>
              <li 
                onClick={() => onNavigateTab('locations')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Production Estates &amp; Studios
              </li>
              <li 
                onClick={() => onNavigateTab('casting')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Casting Calls &amp; Briefs
              </li>
              <li 
                onClick={() => onNavigateTab('brands')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                For Brands &amp; Production Houses
              </li>
            </ul>
          </div>

          {/* Agencies & Trust */}
          <div>
            <h3 className="font-label-caps text-[11px] uppercase text-[#C8C5BD] tracking-widest mb-4">
              Agencies &amp; Portals
            </h3>
            <ul className="space-y-3 font-body-sm text-xs">
              <li 
                onClick={onOpenAgencyRegister}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer font-medium text-[#D4AF37]"
              >
                + Register Agency
              </li>
              <li 
                onClick={() => onNavigateTab('dashboards')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Agency Roster Portal
              </li>
              <li 
                onClick={() => onNavigateTab('dashboards')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Brand Booking Portal
              </li>
              <li 
                onClick={() => onNavigateTab('dashboards')}
                className="text-[#d0c5af] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                Admin Escrow &amp; Audit Desk
              </li>
            </ul>
          </div>

          {/* Inquiries */}
          <div>
            <h3 className="font-label-caps text-[11px] uppercase text-[#C8C5BD] tracking-widest mb-4">
              Editorial Desk
            </h3>
            <p className="font-body-sm text-xs text-[#C8C5BD] mb-4">
              Curated casting representation, VIP runway coordination, and enterprise luxury bookings desk.
            </p>
            <button
              onClick={() => onNavigateTab('dashboards')}
              className="inline-block border border-[#27272C] text-[#FAF8F5] hover:border-[#D4AF37] hover:text-[#D4AF37] font-label-caps text-[10px] uppercase px-4 py-2 transition-colors cursor-pointer"
            >
              Enterprise Portal
            </button>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-[#27272C] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-label-metric text-[11px] text-[#99907c]">
          <div>
            © 2025 MODELKART ATELIER GROUP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 font-mono text-[10px] tracking-widest">
            <span>PARIS</span>
            <span>MILAN</span>
            <span>NEW YORK</span>
            <span>LONDON</span>
            <span>TOKYO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
