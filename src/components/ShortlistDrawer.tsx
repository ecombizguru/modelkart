import React, { useState } from 'react';
import { useTalentAgency } from '../context/TalentAgencyContext.tsx';

interface ShortlistDrawerProps {
  onOpenBookingModalForFirst?: () => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  onOpenBookingModalForFirst
}) => {
  const {
    shortlist,
    talents,
    clearShortlist,
    toggleShortlist,
    setActiveTalentForCompCard,
    setIsPostBriefModalOpen
  } = useTalentAgency();

  const [isOpen, setIsOpen] = useState(true);

  if (shortlist.length === 0 || !isOpen) {
    return null;
  }

  const shortlistedTalents = talents.filter(t => shortlist.includes(t.id));
  const totalDayRate = shortlistedTalents.reduce((sum, t) => sum + t.dayRateInr, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-[#121214]/95 backdrop-blur-md border border-[#D4AF37]/50 p-4 shadow-2xl transition-all duration-300 max-w-sm w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-3 border-b border-[#27272C] pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#D4AF37] text-[18px]">
            bookmark_added
          </span>
          <span className="font-label-caps text-xs uppercase text-[#FAF8F5] font-semibold">
            Casting Shortlist ({shortlist.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearShortlist}
            className="text-[10px] text-[#99907c] hover:text-[#FAF8F5] font-mono uppercase"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#99907c] hover:text-[#FAF8F5] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      <p className="font-body-sm text-[11px] text-[#C8C5BD] mb-3">
        {shortlist.length} talent{shortlist.length > 1 ? 's' : ''} staged for casting call package submission.
      </p>

      {/* Thumbnails Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-[#27272C]">
        {shortlistedTalents.map((talent) => (
          <div key={talent.id} className="relative flex-shrink-0 group">
            <img
              src={talent.primaryImage}
              alt={talent.name}
              referrerPolicy="no-referrer"
              className="w-10 h-12 object-cover border border-[#27272C] bg-[#0A0A0C] cursor-pointer"
              onClick={() => setActiveTalentForCompCard(talent)}
            />
            <button
              onClick={() => toggleShortlist(talent.id)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A0A0C] border border-red-500 text-red-400 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between font-mono text-xs mb-3 text-[#FAF8F5]">
        <span className="text-[#99907c]">Combined Day Rates:</span>
        <span className="text-[#D4AF37] font-bold tabular-nums">€{totalDayRate.toLocaleString()}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsPostBriefModalOpen(true)}
          className="w-full bg-[#D4AF37] hover:bg-[#E8CF7A] text-[#0A0A0C] font-label-caps text-[11px] uppercase py-2 font-bold transition-colors cursor-pointer"
        >
          Create Shoot Brief for Shortlist
        </button>
        {onOpenBookingModalForFirst && shortlistedTalents.length > 0 && (
          <button
            type="button"
            onClick={onOpenBookingModalForFirst}
            className="w-full bg-[#1A1A1E] hover:bg-[#27272C] text-[#FAF8F5] border border-[#27272C] font-label-caps text-[11px] uppercase py-1.5 transition-colors cursor-pointer"
          >
            Direct Book First Staged Model
          </button>
        )}
      </div>

    </div>
  );
};
