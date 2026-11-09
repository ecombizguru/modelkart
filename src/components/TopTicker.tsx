import React from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

export const TopTicker: React.FC = () => {
  const { talents, agencies, bookings } = useTalentAgency();

  const totalEscrow = bookings.reduce((sum, b) => sum + (b.totalAmountInr || b.totalEscrow || 0), 0);

  return (
    <div className="w-full bg-[#0A0A0C] border-b border-[#27272C]/80 py-2.5 px-6 overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between font-label-caps text-[10px] uppercase tracking-[0.2em] text-[#99907c]">
        
        {/* Left Announcements Ticker */}
        <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            PARIS FASHION WEEK FW26 CASTINGS ACTIVE
          </span>
          <span className="text-[#27272C]">•</span>
          <span>
            ESCROW SECURED: €{(totalEscrow + 4200000).toLocaleString()} PROCESSED VIA STRIPE
          </span>
          <span className="text-[#27272C]">•</span>
          <span className="text-[#C8C5BD]">
            {talents.length} VERIFIED HIGH-FASHION TALENTS &amp; {agencies.length} CERTIFIED AGENCIES
          </span>
        </div>

        {/* Right Utility */}
        <div className="hidden md:flex items-center gap-4 text-[#C8C5BD]">
          <span>SETTLEMENT: EUR / USD / GBP</span>
          <span className="text-[#27272C]">|</span>
          <span className="text-[#D4AF37] hover:text-[#E8CF7A] cursor-pointer transition-colors">
            HAUTE CONCIERGE DESK
          </span>
        </div>
      </div>
    </div>
  );
};
